# tests/test_layer5_service_phase4.py
"""
Phase 4 — resolve_candidate() + persist_record().

Contrairement aux phases précédentes, ces tests utilisent une VRAIE base
SQLite en mémoire (pas un mock de repository) : c'est la seule façon de
valider honnêtement SirenGuard/ConflictError, qui dépendent d'un vrai
comportement transactionnel (commit, contrainte UNIQUE sur siren).
"""
from __future__ import annotations

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from acquisition.sources import EntrepriseInsee, OrganisationZealot
from cli.layer5.working_memory import WorkingMemory, WMRecord
from core.services.layer5_service import Layer5Service, QualifyOutcome
from persistence.db import Base
from persistence.repository import EntrepriseRepository


# ═══════════════════════════════════════════════════════════════════
# Fixtures DB — SQLite en mémoire, une par test
# ═══════════════════════════════════════════════════════════════════

@pytest.fixture()
def session_factory():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine)
    yield factory
    engine.dispose()


@pytest.fixture(autouse=True)
def _reset_working_memory():
    WorkingMemory.clear()
    yield
    WorkingMemory.clear()


def _insee(siren, denomination, naf="47.78C", etat="A"):
    return EntrepriseInsee(
        siren=siren, denomination=denomination, sigle=None, naf=naf,
        naf_naf25=None, categorie=None, etat=etat, forme_juridique="5710",
        date_creation="2020-01-01", tranche_effectif=None, nic_siege="00019",
        siret_siege=siren + "00019", economie_sociale=None, statut_diffusion="O",
    )


def _rec(organisation_id, nom, siren=None, zealot=None):
    return WMRecord(
        organisation_id=organisation_id, nom=nom, siren=siren,
        type_id=1, type_label="Entreprise", status="searched", zealot=zealot,
    )


USER = {"user": "layer5-test", "role": "user"}


# ═══════════════════════════════════════════════════════════════════
# resolve_candidate()
# ═══════════════════════════════════════════════════════════════════

class FakeInseeClient:
    def __init__(self, siren_responses: dict[str, dict | None] | None = None):
        self._responses = siren_responses or {}

    def get_siren(self, siren: str):
        return self._responses.get(siren)


def test_resolve_candidate_skip_returns_none():
    service = Layer5Service(org_client=None, ent_client=None, insee_client=FakeInseeClient())
    rec = _rec(1, "Boulangerie Martin")
    for choice in ("s", "skip", "", "  "):
        assert service.resolve_candidate(rec, choice) is None


def test_resolve_candidate_picks_indexed_scored_candidate():
    from cli.layer5.working_memory import CandidateScore

    rec = _rec(1, "Boulangerie Martin")
    cand1 = _insee("111111111", "BOULANGERIE MARTIN")
    cand2 = _insee("222222222", "BOULANGERIE MARTIN 2")
    rec.scored = [
        CandidateScore(insee=cand1, score_pct=90),
        CandidateScore(insee=cand2, score_pct=40),
    ]
    service = Layer5Service(org_client=None, ent_client=None, insee_client=FakeInseeClient())

    result = service.resolve_candidate(rec, "2")

    assert result is cand2
    assert rec.chosen.insee is cand2  # effet de bord préservé (comme l'original)


def test_resolve_candidate_out_of_range_index_falls_back_to_siren_parsing():
    """'5' n'est pas un index valide (aucun candidat) -> traité comme un
    SIREN de 5 chiffres -> ni 9 ni 14 -> entrée invalide -> None."""
    rec = _rec(1, "Boulangerie Martin")
    service = Layer5Service(org_client=None, ent_client=None, insee_client=FakeInseeClient())

    messages = []
    result = service.resolve_candidate(rec, "5", on_progress=messages.append)

    assert result is None
    assert any("invalide" in m.lower() for m in messages)


def test_resolve_candidate_raw_siren_fetches_from_insee():
    data = {"uniteLegale": {
        "siren": "333333333",
        "periodesUniteLegale": [{"denominationUniteLegale": "GARAGE DUPONT"}],
    }}
    insee_client = FakeInseeClient(siren_responses={"333333333": data})
    rec = _rec(1, "Garage Dupont")
    service = Layer5Service(org_client=None, ent_client=None, insee_client=insee_client)

    result = service.resolve_candidate(rec, "333333333")

    assert result is not None
    assert result.siren == "333333333"
    assert result.denomination == "GARAGE DUPONT"


def test_resolve_candidate_raw_siret_is_truncated_to_siren():
    data = {"uniteLegale": {
        "siren": "333333333",
        "periodesUniteLegale": [{"denominationUniteLegale": "GARAGE DUPONT"}],
    }}
    insee_client = FakeInseeClient(siren_responses={"333333333": data})
    rec = _rec(1, "Garage Dupont")
    service = Layer5Service(org_client=None, ent_client=None, insee_client=insee_client)

    result = service.resolve_candidate(rec, "33333333300019")  # SIRET 14 chiffres

    assert result is not None
    assert result.siren == "333333333"


def test_resolve_candidate_siren_introuvable_returns_none():
    insee_client = FakeInseeClient(siren_responses={})  # get_siren renvoie toujours None
    rec = _rec(1, "Garage Dupont")
    service = Layer5Service(org_client=None, ent_client=None, insee_client=insee_client)

    messages = []
    result = service.resolve_candidate(rec, "999999999", on_progress=messages.append)

    assert result is None
    assert any("introuvable" in m.lower() for m in messages)


# ═══════════════════════════════════════════════════════════════════
# persist_record() — création
# ═══════════════════════════════════════════════════════════════════

def test_persist_record_creates_new_entreprise(session_factory):
    service = Layer5Service(org_client=None, ent_client=None, session_factory=session_factory)
    rec = _rec(1, "Boulangerie Martin")
    insee = _insee("111111111", "BOULANGERIE MARTIN")

    with service.repository() as repo:
        outcome = service.persist_record(rec, insee, USER, repo)

    assert outcome.status == "saved"
    assert outcome.siren == "111111111"
    assert rec.status == "saved"
    assert rec.local_id == outcome.local_id

    # Vérification directe en base — la persistance a bien eu lieu
    with service.repository() as repo:
        saved = repo.get_by_siren("111111111")
        assert saved is not None
        assert saved.denomination == "BOULANGERIE MARTIN"
        assert saved.source == "insee+zealot"
        assert saved.id_zealot == 1  # rec.organisation_id, via org.id


def test_persist_record_uses_existing_zealot_org_when_present():
    """Si rec.zealot est déjà renseigné (post étape 1), reconcileZealot()
    doit l'utiliser au lieu de reconstruire un OrganisationZealot minimal."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine)

    zealot_org = OrganisationZealot(id=42, nom="Boulangerie Martin SARL", organisation_type_id=1)
    rec = _rec(1, "Boulangerie Martin", zealot=zealot_org)
    insee = _insee("111111111", "BOULANGERIE MARTIN")

    service = Layer5Service(org_client=None, ent_client=None, session_factory=factory)
    with service.repository() as repo:
        outcome = service.persist_record(rec, insee, USER, repo)

    assert outcome.status == "saved"
    with service.repository() as repo:
        saved = repo.get_by_siren("111111111")
        assert saved.id_zealot == 42  # vient de zealot_org.id, pas de rec.organisation_id
    engine.dispose()


# ═══════════════════════════════════════════════════════════════════
# persist_record() — conflit SIREN (le cœur du risque de cette phase)
# ═══════════════════════════════════════════════════════════════════

def test_persist_record_returns_conflict_outcome_on_stale_read_race(session_factory):
    """
    Le chemin normal de persist_record vérifie repo.get_by_siren() AVANT
    repo.create() : SirenGuard (qui lève ConflictError pendant create())
    n'est donc jamais atteint tant que cette lecture voit déjà
    l'existant — c'est un comportement du code original, pas une lacune
    du refactor. Le seul cas réel où ConflictError remonte est une
    lecture obsolète (race condition entre deux processus concurrents) :
    get_by_siren() ne voit pas encore la ligne, mais create() la trouve.

    On simule fidèlement cette race avec un repo dont get_by_siren()
    renvoie toujours None (lecture obsolète), tout en laissant create()
    utiliser le vrai SirenGuard contre la vraie base — donc le conflit
    remonté ici est un VRAI conflit SQLite, pas une exception fabriquée.
    """
    service = Layer5Service(org_client=None, ent_client=None, session_factory=session_factory)

    rec1 = _rec(1, "Boulangerie Martin")
    insee1 = _insee("111111111", "BOULANGERIE MARTIN")
    with service.repository() as repo:
        first = service.persist_record(rec1, insee1, USER, repo)
    assert first.status == "saved"

    class _StaleReadRepo:
        """Enveloppe le vrai repo mais simule une lecture obsolète :
        get_by_siren() ne voit jamais ce qui existe déjà en base."""
        def __init__(self, real_repo):
            self._real = real_repo

        def get_by_siren(self, siren):
            return None

        def create(self, *a, **kw):
            return self._real.create(*a, **kw)  # vrai SirenGuard, vraie base

        def update(self, *a, **kw):
            return self._real.update(*a, **kw)

    rec2 = _rec(2, "Boulangerie Martin Bis")
    insee2 = _insee("111111111", "BOULANGERIE MARTIN (DOUBLON)")
    with service.repository() as repo:
        stale_repo = _StaleReadRepo(repo)
        second = service.persist_record(rec2, insee2, USER, stale_repo)

    assert second.status == "conflict"
    assert rec2.status == "conflict"
    assert "déjà présent" in second.detail

    # La base ne doit contenir que l'original, inchangé
    with service.repository() as repo:
        saved = repo.get_by_siren("111111111")
        assert saved.denomination == "BOULANGERIE MARTIN"  # pas écrasé par le doublon


def test_persist_record_patches_existing_when_siren_already_local(session_factory):
    """
    Cas etape3 spécifique : le SIREN existe déjà en local (ex: créé à la
    main via /entreprise) et certains champs sont NULL -> patch des seuls
    champs manquants, sans écraser ce qui existe déjà (voir _PATCHABLE_COLUMNS).
    """
    service = Layer5Service(org_client=None, ent_client=None, session_factory=session_factory)

    # Pré-remplissage direct en base : SIREN existant, naf manquant, denomination déjà posée
    from persistence.models import EntrepriseModel
    with service.repository() as repo:
        preexisting = EntrepriseModel(
            siren="111111111", denomination="BOULANGERIE MARTIN (SAISIE MANUELLE)",
            naf=None, source="ui",
        )
        repo.session.add(preexisting)
        repo.session.commit()

    rec = _rec(1, "Boulangerie Martin")
    insee = _insee("111111111", "BOULANGERIE MARTIN", naf="47.78C")

    with service.repository() as repo:
        outcome = service.persist_record(rec, insee, USER, repo)

    assert outcome.status == "saved"  # pas "conflict" : le patch réussit sans lever ConflictError
    with service.repository() as repo:
        saved = repo.get_by_siren("111111111")
        assert saved.naf == "47.78C"  # patché (était None)
        assert saved.denomination == "BOULANGERIE MARTIN (SAISIE MANUELLE)"  # PAS écrasé


# ═══════════════════════════════════════════════════════════════════
# persist_record() — SIREN incompatible (ValueError du mapper)
# ═══════════════════════════════════════════════════════════════════

def test_persist_record_skips_on_siren_mismatch(session_factory):
    zealot_org = OrganisationZealot(id=1, nom="Boulangerie Martin", siren="999999999", organisation_type_id=1)
    rec = _rec(1, "Boulangerie Martin", siren="999999999", zealot=zealot_org)
    insee = _insee("111111111", "BOULANGERIE MARTIN")  # SIREN différent

    service = Layer5Service(org_client=None, ent_client=None, session_factory=session_factory)
    with service.repository() as repo:
        outcome = service.persist_record(rec, insee, USER, repo)

    assert outcome.status == "skipped"
    assert rec.status == "skipped"
    assert "Mapper" in outcome.detail


# ═══════════════════════════════════════════════════════════════════
# Garde-fou : session_factory manquant
# ═══════════════════════════════════════════════════════════════════

def test_repository_requires_session_factory():
    service = Layer5Service(org_client=None, ent_client=None)  # pas de session_factory
    with pytest.raises(RuntimeError, match="session_factory requis"):
        with service.repository():
            pass
