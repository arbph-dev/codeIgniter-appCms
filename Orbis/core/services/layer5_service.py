# core/services/layer5_service.py
"""
Layer5Service — extraction progressive de cli/layer5/etapes.py.

État de la migration (voir roadmap) :
    Phase 2 — scan_orphans()        : FAIT
    Phase 3 — search_and_score()    : à venir
    Phase 4 — resolve_candidate() / persist_record() : à venir
    Phase 5 — push_to_zealot()      : à venir
    Phase 6 — WorkingMemory en instance (au lieu de singleton) : à venir

Règle absolue : aucune ligne de ce module n'importe `rich`, ne fait de
`print`, ni de `Prompt.ask`. Toute interaction utilisateur reste du côté
du présentateur (cli/menus/layer5.py + core/ui_port.UIPort).
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Optional

from acquisition.sources import OrganisationZealot, EntrepriseInsee
from cli.layer5.working_memory import WorkingMemory, WMRecord

# Types d'organisation nécessitant une extension "entreprise".
# Déplacé depuis cli/layer5/etapes.py — source de vérité unique désormais.
TYPES_REQUIRING_ENTREPRISE = {1}  # 1 = Entreprise


# ═══════════════════════════════════════════════════════════════════
# DTOs — sortie des services, jamais de Rich/Table dedans
# ═══════════════════════════════════════════════════════════════════

@dataclass
class ScanResult:
    orphans: list[WMRecord]
    scanned: int
    to_enrich: int
    ratio_pct: float
    page: int
    per_page: int

    @property
    def is_empty(self) -> bool:
        return not self.orphans


@dataclass
class SearchOutcome:
    """Un record après recherche INSEE + scoring (Phase 3)."""
    organisation_id: int
    nom: str
    n_candidates: int
    match_pct: int
    veracity_pct: int
    global_pct: int
    top_candidate_summary: Optional[str] = None
    error: Optional[str] = None


@dataclass
class QualifyOutcome:
    """Résultat de la persistance d'un record qualifié (Phase 4)."""
    organisation_id: int
    status: str  # saved / conflict / error / skipped
    local_id: Optional[int] = None
    siren: Optional[str] = None
    detail: Optional[str] = None


@dataclass
class PushOutcome:
    """Résultat du push Zealot (Phase 5)."""
    organisation_id: int
    status: str  # pushed / push_error
    detail: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════
# Service
# ═══════════════════════════════════════════════════════════════════

class Layer5Service:
    """
    Façade métier couche 5 (rapprochement orgs zealot ↔ SIRENE).

    org_client / ent_client / insee_client : clients HTTP existants,
    injectés (pas de construction interne — testable avec des doublures).
    session_factory : callable() -> Session SQLAlchemy, utilisé à partir
        de la Phase 4 (persist_record). Optionnel tant que ces méthodes
        ne sont pas implémentées.
    """

    def __init__(
        self,
        org_client,
        ent_client,
        insee_client=None,
        session_factory: Callable[[], object] | None = None,
    ):
        self.org_client = org_client
        self.ent_client = ent_client
        self.insee_client = insee_client
        self._session_factory = session_factory

    # ── Phase 2 : scan des organisations orphelines ──────────────────

    def scan_orphans(self, page: int, per_page: int) -> ScanResult:
        """
        Équivalent fonctionnel de l'ancien etape1_scan(), sans aucun
        affichage. Remplit WorkingMemory (toujours singleton à ce stade,
        voir Phase 6) et retourne un DTO exploitable par n'importe quel
        présentateur.
        """
        data = self.org_client.list(type_id=1, page=page, per_page=per_page)
        if not data:
            return ScanResult(
                orphans=[], scanned=0, to_enrich=0, ratio_pct=0.0,
                page=page, per_page=per_page,
            )

        orgs = data.get("data") or []

        linked_org_ids = self._index_linked_org_ids()

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

        WorkingMemory.set_scan(
            orphans,
            scanned=len(orgs),
            page=page,
            per_page=per_page,
        )
        st = WorkingMemory.stats

        return ScanResult(
            orphans=orphans,
            scanned=st["scanned"],
            to_enrich=st["to_enrich"],
            ratio_pct=st["ratio_pct"],
            page=page,
            per_page=per_page,
        )

    def _index_linked_org_ids(self) -> set[int]:
        """GET /entreprise paginé -> set des organisation_id déjà liés."""
        linked_org_ids: set[int] = set()

        ent_page = self.ent_client.list(page=1, per_page=100)
        ent_items = (ent_page or {}).get("data") or []
        for e in ent_items:
            if e.get("organisation_id") is not None:
                linked_org_ids.add(int(e["organisation_id"]))

        ent_total = (ent_page or {}).get("pager", {}).get("total", len(ent_items))
        if ent_total > 100:
            for e in self.ent_client.list_all(max_results=2000):
                if e.get("organisation_id") is not None:
                    linked_org_ids.add(int(e["organisation_id"]))

        return linked_org_ids

    # ── Phase 3 : recherche INSEE + scoring (pas encore migré) ───────

    def search_and_score(
        self,
        max_per_org: int = 5,
        *,
        enrich_siege: bool = True,
        max_enrich: int = 3,
        loc_hint: str = "",
        on_progress: Callable[[str], None] | None = None,
    ) -> list[SearchOutcome]:
        raise NotImplementedError(
            "Phase 3 non migrée — logique encore dans "
            "cli/layer5/etapes.py::_run_etape2"
        )

    # ── Phase 4 : qualification + persistance (pas encore migré) ────

    def resolve_candidate(
        self, rec: WMRecord, choice: str
    ) -> Optional["EntrepriseInsee"]:
        raise NotImplementedError(
            "Phase 4 non migrée — logique encore dans "
            "cli/layer5/etapes.py::_prompt_choose_or_fetch"
        )

    def persist_record(
        self, rec: WMRecord, insee: "EntrepriseInsee", user: dict
    ) -> QualifyOutcome:
        raise NotImplementedError(
            "Phase 4 non migrée — logique encore dans "
            "cli/layer5/etapes.py::etape3_qualify_and_save"
        )

    # ── Phase 5 : push Zealot (pas encore migré) ─────────────────────

    def push_to_zealot(
        self, on_progress: Callable[[str], None] | None = None
    ) -> list[PushOutcome]:
        raise NotImplementedError(
            "Phase 5 non migrée — logique encore dans "
            "cli/layer5/etapes.py::etape4_push_zealot"
        )
