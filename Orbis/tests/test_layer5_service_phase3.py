# tests/test_layer5_service_phase3.py
"""
Phase 3 — search_and_score().

Même approche que Phase 2 : une référence legacy fidèle à
cli/layer5/etapes.py::_run_etape2 (purgée de Rich), comparée au service.
Les quirks de comportement préservés à l'identique (voir docstring de
search_and_score) sont explicitement testés, pas juste tolérés.
"""
from __future__ import annotations

import pytest

from acquisition.sources import EntrepriseInsee
from cli.layer5.scoring import score_record
from cli.layer5.text_utils import normalize_insee_denom
from cli.layer5.insee_enrich import enrich_candidates_siege
from cli.layer5.working_memory import WorkingMemory, WMRecord
from core.services.layer5_service import (
    Layer5Service,
    SearchOutcome,
    build_denomination_query,
)


# ═══════════════════════════════════════════════════════════════════
# Doublure INSEE
# ═══════════════════════════════════════════════════════════════════

def _unite(siren, denomination, naf="47.78C", etat="A"):
    return {
        "siren": siren,
        "periodesUniteLegale": [{
            "denominationUniteLegale": denomination,
            "activitePrincipaleUniteLegale": naf,
            "etatAdministratifUniteLegale": etat,
        }],
    }


class FakeInseeClient:
    def __init__(self, responses: dict[str, dict | None] | None = None, raise_on: set[str] | None = None):
        """
        responses : {query: data} — réponse renvoyée pour une query donnée
        raise_on  : ensemble de queries qui lèvent une exception
        """
        self._responses = responses or {}
        self._raise_on = raise_on or set()
        self.calls: list[str] = []

    def search_siren(self, q: str, nombre: int = 20):
        self.calls.append(q)
        if q in self._raise_on:
            raise RuntimeError(f"Timeout INSEE simulé pour {q!r}")
        return self._responses.get(q)

    def search_siret(self, q: str, nombre: int = 20):
        # utilisé par enrich_candidates_siege — pas de siège dans ces tests
        return {"etablissements": []}


# ═══════════════════════════════════════════════════════════════════
# Référence legacy — copie fidèle de _run_etape2 (sans Rich)
# ═══════════════════════════════════════════════════════════════════

def _legacy_run_etape2(
    insee_client,
    max_per_org: int = 5,
    *,
    enrich_siege: bool = True,
    max_enrich: int = 3,
) -> None:
    for rec in WorkingMemory.records:
        nom = (rec.nom or "").strip()
        if not nom:
            rec.insee_candidates = []
            rec.status = "searched"
            score_record(rec)
            continue

        denom = normalize_insee_denom(nom)
        q = build_denomination_query(nom)
        if not q:
            rec.insee_candidates = []
            rec.status = "searched"
            score_record(rec)
            continue

        try:
            data = insee_client.search_siren(q, nombre=max_per_org)
        except Exception:
            data = None
            rec.status = "error"

        candidates: list[EntrepriseInsee] = []
        if data:
            for u in data.get("unitesLegales") or []:
                try:
                    candidates.append(EntrepriseInsee.from_api(u))
                except Exception:
                    pass

        if not candidates and " " in denom:
            tokens_ = [
                t for t in denom.split()
                if len(t) > 2 and t not in {"LE", "LA", "LES", "DE", "DU", "DES"}
            ]
            if tokens_:
                core = " ".join(tokens_)
                q2 = f'periode(denominationUniteLegale:"{core}")'
                data2 = insee_client.search_siren(q2, nombre=max_per_org)
                if data2:
                    for u in data2.get("unitesLegales") or []:
                        try:
                            candidates.append(EntrepriseInsee.from_api(u))
                        except Exception:
                            pass

        if enrich_siege and candidates:
            candidates = enrich_candidates_siege(
                insee_client, candidates, max_enrich=max_enrich, nombre_siret=20,
            )

        rec.insee_candidates = candidates
        rec.status = "searched"
        score_record(rec)


# ═══════════════════════════════════════════════════════════════════
# Fixtures
# ═══════════════════════════════════════════════════════════════════

@pytest.fixture(autouse=True)
def _reset_working_memory():
    WorkingMemory.clear()
    yield
    WorkingMemory.clear()


def _rec(organisation_id, nom, siren=None):
    return WMRecord(
        organisation_id=organisation_id, nom=nom, siren=siren,
        type_id=1, type_label="Entreprise", status="orphan",
    )


# ═══════════════════════════════════════════════════════════════════
# Test 1 — équivalence stricte service vs legacy
# ═══════════════════════════════════════════════════════════════════

def test_search_and_score_equivalent_to_legacy():
    q_boulangerie = build_denomination_query("Boulangerie Martin")
    q_garage = build_denomination_query("Garage Dupont")

    insee_client = FakeInseeClient(responses={
        q_boulangerie: {"unitesLegales": [_unite("111111111", "BOULANGERIE MARTIN")]},
        q_garage: {"unitesLegales": []},  # aucun candidat exact
    })

    records = [_rec(1, "Boulangerie Martin"), _rec(2, "Garage Dupont")]
    WorkingMemory.set_scan(records, scanned=2, page=1, per_page=20)

    service = Layer5Service(org_client=None, ent_client=None, insee_client=insee_client)
    outcomes = service.search_and_score(max_per_org=5, enrich_siege=False)

    legacy_records = [_rec(1, "Boulangerie Martin"), _rec(2, "Garage Dupont")]
    WorkingMemory.set_scan(legacy_records, scanned=2, page=1, per_page=20)
    legacy_insee = FakeInseeClient(responses={
        q_boulangerie: {"unitesLegales": [_unite("111111111", "BOULANGERIE MARTIN")]},
        q_garage: {"unitesLegales": []},
    })
    _legacy_run_etape2(legacy_insee, max_per_org=5, enrich_siege=False)

    assert [o.organisation_id for o in outcomes] == [r.organisation_id for r in legacy_records]
    assert [o.n_candidates for o in outcomes] == [len(r.scored) for r in legacy_records]
    assert [o.match_pct for o in outcomes] == [r.match_pct for r in legacy_records]
    assert [o.global_pct for o in outcomes] == [r.global_pct for r in legacy_records]
    # Garage Dupont : aucun candidat -> status quand même "searched" (pas "error")
    assert all(r.status == "searched" for r in legacy_records)


# ═══════════════════════════════════════════════════════════════════
# Test 2 — nom vide : skip propre, outcome quand même produit
# ═══════════════════════════════════════════════════════════════════

def test_search_and_score_empty_nom_is_skipped_but_produces_outcome():
    WorkingMemory.set_scan([_rec(1, "")], scanned=1, page=1, per_page=20)
    service = Layer5Service(org_client=None, ent_client=None, insee_client=FakeInseeClient())

    progress_messages = []
    outcomes = service.search_and_score(on_progress=progress_messages.append)

    assert len(outcomes) == 1
    assert outcomes[0].n_candidates == 0
    assert "nom vide" in progress_messages[0]
    assert WorkingMemory.records[0].status == "searched"


# ═══════════════════════════════════════════════════════════════════
# Test 3 — quirk préservé : exception INSEE -> status reste "searched"
# ═══════════════════════════════════════════════════════════════════

def test_search_and_score_preserves_legacy_error_status_quirk():
    """
    Bug préexistant reproduit à l'identique : rec.status passe à "error"
    dans le except, puis est immédiatement écrasé par "searched" trois
    lignes plus bas (comme dans l'original). Le message d'erreur reste
    néanmoins récupérable via SearchOutcome.error — amélioration sans
    changer le comportement observable de WorkingMemory.

    Nom choisi avec un stop-word ("De") de sorte que la requête de
    fallback (tokens filtrés) diffère de la requête initiale — sinon
    la 2e tentative (non protégée par try/except, ici comme dans
    l'original) relance la même exception et fait planter le test
    pour une tout autre raison que celle qu'on veut isoler.
    """
    nom = "Le Garage De Bretagne"
    q = build_denomination_query(nom)  # requête complète -> échoue
    insee_client = FakeInseeClient(raise_on={q})
    WorkingMemory.set_scan([_rec(1, nom)], scanned=1, page=1, per_page=20)

    service = Layer5Service(org_client=None, ent_client=None, insee_client=insee_client)
    outcomes = service.search_and_score(enrich_siege=False)

    assert WorkingMemory.records[0].status == "searched"  # pas "error" — quirk préservé
    assert outcomes[0].error is not None
    assert "Timeout INSEE simulé" in outcomes[0].error
    # la requête de fallback (sans LE/DE) a bien été tentée, distincte de la 1ère
    assert len(insee_client.calls) == 2
    assert insee_client.calls[0] != insee_client.calls[1]


# ═══════════════════════════════════════════════════════════════════
# Test 4 — fallback tokens quand la requête exacte ne remonte rien
# ═══════════════════════════════════════════════════════════════════

def test_search_and_score_falls_back_to_tokens_query():
    exact_q = build_denomination_query("Aise Breizh Conseil")
    # Le fallback reconstruit une requête à partir des tokens > 2 caractères
    fallback_q = 'periode(denominationUniteLegale:"AISE BREIZH CONSEIL")'

    insee_client = FakeInseeClient(responses={
        exact_q: {"unitesLegales": []},                        # échec exact
        fallback_q: {"unitesLegales": [_unite("222222222", "AISE BREIZH")]},
    })
    WorkingMemory.set_scan([_rec(1, "Aise Breizh Conseil")], scanned=1, page=1, per_page=20)

    service = Layer5Service(org_client=None, ent_client=None, insee_client=insee_client)
    outcomes = service.search_and_score(enrich_siege=False)

    assert outcomes[0].n_candidates == 1
    assert fallback_q in insee_client.calls  # le fallback a bien été appelé


# ═══════════════════════════════════════════════════════════════════
# Test 5 — loc_hint : département à 2 chiffres converti en plage CP
# ═══════════════════════════════════════════════════════════════════

def test_apply_loc_hint_converts_department_code_to_cp_range():
    rec = _rec(1, "Boulangerie Martin")
    WorkingMemory.set_scan([rec], scanned=1, page=1, per_page=20)

    service = Layer5Service(org_client=None, ent_client=None, insee_client=FakeInseeClient())
    service._apply_loc_hint("29")

    assert WorkingMemory.records[0].localisation == "29000-29999"


def test_apply_loc_hint_does_not_override_existing_localisation():
    rec = _rec(1, "Boulangerie Martin")
    rec.localisation = "29000 Quimper"
    WorkingMemory.set_scan([rec], scanned=1, page=1, per_page=20)

    service = Layer5Service(org_client=None, ent_client=None, insee_client=FakeInseeClient())
    service._apply_loc_hint("75")

    assert WorkingMemory.records[0].localisation == "29000 Quimper"


# ═══════════════════════════════════════════════════════════════════
# Test 6 — garde-fou : insee_client manquant
# ═══════════════════════════════════════════════════════════════════

def test_search_and_score_requires_insee_client():
    service = Layer5Service(org_client=None, ent_client=None)  # pas d'insee_client
    with pytest.raises(RuntimeError, match="insee_client requis"):
        service.search_and_score()


# ═══════════════════════════════════════════════════════════════════
# Test 7 — quirk préservé : query vide -> aucun SearchOutcome produit
# ═══════════════════════════════════════════════════════════════════

def test_search_and_score_no_outcome_when_query_is_empty():
    """
    build_denomination_query() ne renvoie une chaîne vide que si
    normalize_insee_denom(nom) est vide après normalisation. En pratique
    ça n'arrive que pour un nom composé uniquement de caractères
    combinants Unicode (aucune lettre/chiffre/ponctuation) : une simple
    ponctuation comme "---" survit à norm_upper() et n'est PAS vide.
    On utilise ici deux accents combinants isolés (U+0301) comme cas
    limite réel, distinct du cas "nom vide" (déjà couvert plus haut).
    """
    nom_diacritiques_seuls = "\u0301\u0301"
    assert nom_diacritiques_seuls.strip() != ""          # passe le filtre "nom vide"
    assert build_denomination_query(nom_diacritiques_seuls) == ""  # mais denom vide

    WorkingMemory.set_scan(
        [_rec(1, nom_diacritiques_seuls)], scanned=1, page=1, per_page=20,
    )
    service = Layer5Service(org_client=None, ent_client=None, insee_client=FakeInseeClient())

    outcomes = service.search_and_score()

    assert outcomes == []  # pas d'outcome, comme l'ancien code (pas de ligne de résumé)
    assert WorkingMemory.records[0].status == "searched"  # le record est quand même scoré
