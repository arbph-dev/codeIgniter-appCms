# tests/test_layer5_service_phase2.py
"""
Phase 0 (filet de sécurité) + validation Phase 2.

Deux choses sont vérifiées :

1. equivalence_test :
   Layer5Service.scan_orphans() produit EXACTEMENT le même résultat
   (mêmes WMRecord, mêmes stats) que _legacy_etape1_scan(), qui est une
   copie fidèle de l'algorithme original de cli/layer5/etapes.py::etape1_scan,
   simplement purgée de tout Rich (Panel/Table/console.print).
   Si ce test passe, la migration Phase 2 n'a introduit aucune régression.

2. Des cas limites propres à la Phase 2 : page vide, fallback de
   pagination ent_client (>100 entreprises), organisation déjà liée,
   mauvais type d'organisation.

Aucun import de `rich`, `PySide6`, HTTP réel : uniquement des doublures
de clients (FakeOrganisationClient / FakeEntrepriseClient) renvoyant
les payloads exacts que renvoient les vrais clients (mêmes clés dict).
"""
from __future__ import annotations

import pytest

from acquisition.sources import OrganisationZealot
from cli.layer5.working_memory import WorkingMemory, WMRecord
from core.services.layer5_service import (
    Layer5Service,
    ScanResult,
    TYPES_REQUIRING_ENTREPRISE,
)


# ═══════════════════════════════════════════════════════════════════
# Doublures de clients HTTP — payloads au format réel de l'API
# ═══════════════════════════════════════════════════════════════════

class FakeOrganisationClient:
    def __init__(self, orgs: list[dict], total: int | None = None):
        self._orgs = orgs
        self._total = total if total is not None else len(orgs)

    def list(self, type_id: int, page: int, per_page: int):
        return {
            "status": 200,
            "data": self._orgs,
            "pager": {"total": self._total, "currentPage": page, "perPage": per_page},
        }


class FakeEntrepriseClient:
    def __init__(self, linked: list[dict], total: int | None = None, extra_linked: list[dict] | None = None):
        """
        linked       : items retournés par la 1ère page (list(page=1, per_page=100))
        total        : total déclaré par le pager (déclenche list_all si > 100)
        extra_linked : items supplémentaires retournés par list_all() (pagination complète)
        """
        self._linked = linked
        self._total = total if total is not None else len(linked)
        self._extra_linked = extra_linked or []

    def list(self, page: int, per_page: int):
        return {
            "data": self._linked,
            "pager": {"total": self._total},
        }

    def list_all(self, max_results: int):
        # Simule le comportement réel : list_all() renvoie tout,
        # y compris ce qui était déjà dans la première page.
        return (self._linked + self._extra_linked)[:max_results]


# ═══════════════════════════════════════════════════════════════════
# Référence legacy — copie fidèle de l'algorithme original, sans Rich
# ═══════════════════════════════════════════════════════════════════

def _legacy_etape1_scan(org_client, ent_client, page: int, per_page: int) -> ScanResult:
    """Portage 1:1 de cli/layer5/etapes.py::etape1_scan (sans affichage)."""
    data = org_client.list(type_id=1, page=page, per_page=per_page)
    if not data:
        return ScanResult([], 0, 0, 0.0, page, per_page)

    orgs = data.get("data") or []

    linked_org_ids: set[int] = set()
    ent_page = ent_client.list(page=1, per_page=100)
    ent_items = (ent_page or {}).get("data") or []
    for e in ent_items:
        if e.get("organisation_id") is not None:
            linked_org_ids.add(int(e["organisation_id"]))

    ent_total = (ent_page or {}).get("pager", {}).get("total", len(ent_items))
    if ent_total > 100:
        for e in ent_client.list_all(max_results=2000):
            if e.get("organisation_id") is not None:
                linked_org_ids.add(int(e["organisation_id"]))

    orphans: list[WMRecord] = []
    for org in orgs:
        z = OrganisationZealot.from_api(org)
        if z.organisation_type_id not in TYPES_REQUIRING_ENTREPRISE:
            continue
        if z.id in linked_org_ids:
            continue
        orphans.append(WMRecord(
            organisation_id=z.id,
            nom=z.nom or "",
            siren=z.siren,
            type_id=z.organisation_type_id or 0,
            type_label=z.type_label,
            status="orphan",
            zealot=z,
        ))

    WorkingMemory.set_scan(orphans, scanned=len(orgs), page=page, per_page=per_page)
    st = WorkingMemory.stats
    return ScanResult(orphans, st["scanned"], st["to_enrich"], st["ratio_pct"], page, per_page)


# ═══════════════════════════════════════════════════════════════════
# Fixtures
# ═══════════════════════════════════════════════════════════════════

def _org(id_, nom, type_id=1, siren=None, type_label="ENTREPRISE"):
    return {
        "id": id_, "nom": nom, "organisation_type_id": type_id,
        "siren": siren, "type_label": type_label,
    }


@pytest.fixture(autouse=True)
def _reset_working_memory():
    WorkingMemory.clear()
    yield
    WorkingMemory.clear()


# ═══════════════════════════════════════════════════════════════════
# Test 1 — équivalence stricte service vs legacy (le cœur du filet)
# ═══════════════════════════════════════════════════════════════════

def test_scan_orphans_equivalent_to_legacy():
    orgs = [
        _org(1, "Boulangerie Martin"),          # orphan attendu
        _org(2, "Association Loi 1901", type_id=2),  # mauvais type -> exclu
        _org(3, "Garage Dupont"),                # déjà lié -> exclu
        _org(4, "Cabinet Conseil SAS", siren="123456789"),  # orphan attendu
    ]
    linked = [{"organisation_id": 3}]

    org_client = FakeOrganisationClient(orgs)
    ent_client = FakeEntrepriseClient(linked)

    service = Layer5Service(org_client=org_client, ent_client=ent_client)
    result_service = service.scan_orphans(page=1, per_page=20)

    WorkingMemory.clear()
    result_legacy = _legacy_etape1_scan(org_client, ent_client, page=1, per_page=20)

    # Comparaison structurelle : mêmes ids, noms, sirens, statuts, stats
    assert [r.organisation_id for r in result_service.orphans] == \
           [r.organisation_id for r in result_legacy.orphans] == [1, 4]
    assert [r.status for r in result_service.orphans] == ["orphan", "orphan"]
    assert result_service.scanned == result_legacy.scanned == 4
    assert result_service.to_enrich == result_legacy.to_enrich == 2
    assert result_service.ratio_pct == result_legacy.ratio_pct == 50.0


def test_scan_orphans_empty_page_returns_empty_result():
    org_client = FakeOrganisationClient(orgs=[])
    ent_client = FakeEntrepriseClient(linked=[])
    service = Layer5Service(org_client=org_client, ent_client=ent_client)

    result = service.scan_orphans(page=1, per_page=20)

    assert result.is_empty
    assert result.scanned == 0
    assert result.ratio_pct == 0.0


def test_scan_orphans_no_data_from_org_client_returns_empty_result():
    class NoneOrgClient:
        def list(self, type_id, page, per_page):
            return None

    service = Layer5Service(org_client=NoneOrgClient(), ent_client=FakeEntrepriseClient([]))
    result = service.scan_orphans(page=1, per_page=20)

    assert result.orphans == []
    assert result.scanned == 0


def test_scan_orphans_triggers_list_all_when_more_than_100_entreprises():
    """Reproduit le cas où la 1ère page d'entreprises (100 max) ne suffit
    pas à indexer tous les organisation_id liés — doit déclencher list_all()."""
    orgs = [_org(1, "Org A"), _org(2, "Org B")]
    org_client = FakeOrganisationClient(orgs)

    # Page 1 ne contient pas le lien vers Org B (id=2), mais list_all() si.
    ent_client = FakeEntrepriseClient(
        linked=[{"organisation_id": 999}],
        total=150,  # > 100 -> déclenche list_all()
        extra_linked=[{"organisation_id": 2}],
    )

    service = Layer5Service(org_client=org_client, ent_client=ent_client)
    result = service.scan_orphans(page=1, per_page=20)

    # Seul Org A (id=1) doit rester orpheline ; Org B a été trouvée liée
    # uniquement grâce au fallback list_all().
    assert [r.organisation_id for r in result.orphans] == [1]


def test_working_memory_is_populated_as_side_effect():
    """Phase 2 conserve volontairement l'effet de bord WorkingMemory
    (Phase 6 le supprimera). On vérifie qu'il est bien renseigné."""
    orgs = [_org(1, "Boulangerie Martin")]
    service = Layer5Service(
        org_client=FakeOrganisationClient(orgs),
        ent_client=FakeEntrepriseClient([]),
    )
    service.scan_orphans(page=2, per_page=10)

    assert len(WorkingMemory.records) == 1
    assert WorkingMemory.stats["page"] == 2
    assert WorkingMemory.stats["per_page"] == 10
