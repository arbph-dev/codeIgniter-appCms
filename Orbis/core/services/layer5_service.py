# core/services/layer5_service.py
"""
Layer5Service — extraction progressive de cli/layer5/etapes.py.

État de la migration (voir roadmap) :
    Phase 2 — scan_orphans()        : FAIT
    Phase 3 — search_and_score()    : FAIT
    Phase 4 — resolve_candidate() / persist_record() : FAIT
    Phase 5 — push_to_zealot()      : FAIT
    Phase 6 — WorkingMemory en instance (au lieu de singleton) : à venir

Règle absolue : aucune ligne de ce module n'importe `rich`, ne fait de
`print`, ni de `Prompt.ask`. Toute interaction utilisateur reste du côté
du présentateur (cli/menus/layer5.py + core/ui_port.UIPort).
"""
from __future__ import annotations

import re
from contextlib import contextmanager
from dataclasses import dataclass
from typing import Callable, Optional

from acquisition.sources import OrganisationZealot, EntrepriseInsee
from cli.layer5.working_memory import WorkingMemory, WMRecord
from cli.layer5.scoring import score_record
from cli.layer5.text_utils import normalize_insee_denom
from cli.layer5.insee_enrich import enrich_candidates_siege
from persistence.siren_guard import ConflictError
from transformation.mapper import EntrepriseMapper

# Types d'organisation nécessitant une extension "entreprise".
# Déplacé depuis cli/layer5/etapes.py — source de vérité unique désormais.
TYPES_REQUIRING_ENTREPRISE = {1}  # 1 = Entreprise

# Colonnes patchées quand un SIREN existe déjà en local (etape3_qualify_and_save).
_PATCHABLE_COLUMNS = (
    "denomination", "sigle", "naf", "naf_naf25", "categorie",
    "etat", "forme_juridique", "nic_siege", "siret_siege",
    "tranche_effectif", "date_creation", "statut_diffusion",
)



def build_denomination_query(nom: str) -> str:
    """
    Requête Lucene Sirene conforme :
        periode(denominationUniteLegale:"AISE BREIZH")
        periode(denominationUniteLegale:GAZ)

    Déplacé depuis cli/layer5/etapes.py — pure, aucune dépendance UI.
    """
    denom = normalize_insee_denom(nom)
    if not denom:
        return ""
    if " " in denom:
        safe = denom.replace('"', " ")
        return f'periode(denominationUniteLegale:"{safe}")'
    return f"periode(denominationUniteLegale:{denom})"


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
        self.session_factory = session_factory

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

    # ── Phase 3 : recherche INSEE + scoring ──────────────────────────

    def search_and_score(
        self,
        max_per_org: int = 5,
        *,
        enrich_siege: bool = True,
        max_enrich: int = 3,
        loc_hint: str = "",
        on_progress: Callable[[str], None] | None = None,
    ) -> list[SearchOutcome]:
        """
        Équivalent fonctionnel de l'ancien etape2_insee()/_run_etape2().

        Parcourt WorkingMemory.records, interroge INSEE (avec fallback
        tokens si la requête exacte échoue), enrichit optionnellement via
        le SIRET siège, score chaque record (score_record — déjà pur,
        inchangé), et retourne un SearchOutcome par record traité.

        on_progress remplace tous les anciens console.print("[dim]...")
        intercalés dans la boucle — c'est le seul point de contact avec
        l'extérieur, et il reste volontairement neutre (une str, pas du
        Rich).

        NOTE — comportement préservé à l'identique de l'original :
        si insee.search_siren() lève une exception, rec.status est mis à
        "error" PUIS écrasé par "searched" trois lignes plus bas dans le
        code legacy (bug préexistant, reproduit ici tel quel pour la
        Phase 0). Le message d'erreur reste néanmoins accessible via
        SearchOutcome.error, ce qui n'existait pas avant (le print était
        perdu une fois affiché). À corriger dans un ticket séparé, pas
        dans ce refactor.

        NOTE 2 — autre quirk préservé : si build_denomination_query(nom)
        renvoie une chaîne vide (dénomination non exploitable après
        normalisation), le record est scoré à vide mais AUCUN
        SearchOutcome n'est produit pour lui (comme l'ancien code ne
        l'ajoutait pas à la table récapitulative). Le record reste
        néanmoins visible dans WorkingMemory.records.
        """
        if self.insee_client is None:
            raise RuntimeError(
                "insee_client requis pour search_and_score() — "
                "instancier Layer5Service avec insee_client=... ou "
                "l'assigner avant l'appel."
            )

        self._apply_loc_hint(loc_hint)

        outcomes: list[SearchOutcome] = []

        for rec in WorkingMemory.records:
            nom = (rec.nom or "").strip()

            if not nom:
                if on_progress:
                    on_progress(f"org#{rec.organisation_id} — nom vide, skip")
                rec.insee_candidates = []
                rec.status = "searched"
                score_record(rec)
                outcomes.append(self._outcome_from_record(rec))
                continue

            denom = normalize_insee_denom(nom)
            q = build_denomination_query(nom)
            if not q:
                rec.insee_candidates = []
                rec.status = "searched"
                score_record(rec)
                continue  # pas de SearchOutcome — quirk préservé (NOTE 2)

            if on_progress:
                on_progress(f"org#{rec.organisation_id}  q={q!r}")

            error: Optional[str] = None
            data = None
            try:
                data = self.insee_client.search_siren(q, nombre=max_per_org)
            except Exception as e:
                error = str(e)
                rec.status = "error"  # écrasé plus bas — voir NOTE

            candidates: list[EntrepriseInsee] = []
            if data:
                for u in data.get("unitesLegales") or []:
                    try:
                        candidates.append(EntrepriseInsee.from_api(u))
                    except Exception:
                        pass  # parse skip silencieux, comme l'original

            if not candidates and " " in denom:
                tokens = [
                    t for t in denom.split()
                    if len(t) > 2 and t not in {"LE", "LA", "LES", "DE", "DU", "DES"}
                ]
                if tokens:
                    core = " ".join(tokens)
                    q2 = f'periode(denominationUniteLegale:"{core}")'
                    if on_progress:
                        on_progress(f"org#{rec.organisation_id}  fallback q={q2!r}")
                    data2 = self.insee_client.search_siren(q2, nombre=max_per_org)
                    if data2:
                        for u in data2.get("unitesLegales") or []:
                            try:
                                candidates.append(EntrepriseInsee.from_api(u))
                            except Exception:
                                pass

            if enrich_siege and candidates:
                if on_progress:
                    on_progress(
                        f"org#{rec.organisation_id}  enrich SIRET siège "
                        f"(max {max_enrich})"
                    )
                candidates = enrich_candidates_siege(
                    self.insee_client,
                    candidates,
                    max_enrich=max_enrich,
                    nombre_siret=20,
                )

            rec.insee_candidates = candidates
            rec.status = "searched"  # écrase "error" — comportement legacy préservé
            score_record(rec)

            outcomes.append(self._outcome_from_record(rec, error=error))

        return outcomes

    def _apply_loc_hint(self, loc_hint: str) -> None:
        """
        Filtre de localisation optionnel, appliqué aux records qui n'ont
        pas déjà de localisation renseignée. Un code à 2 chiffres est
        traité comme un département (converti en plage de CP) ; sinon la
        valeur est utilisée telle quelle. Portage de la logique qui
        vivait dans etape2_insee() (menu), déplacée ici car elle ne
        dépend d'aucune saisie utilisateur directe.
        """
        loc_hint = (loc_hint or "").strip()
        if not loc_hint:
            return
        if loc_hint.isdigit() and len(loc_hint) == 2:
            loc_hint = f"{loc_hint}000-{loc_hint}999"
        for rec in WorkingMemory.records:
            if not rec.localisation:
                rec.localisation = loc_hint

    def _outcome_from_record(
        self, rec: WMRecord, error: Optional[str] = None
    ) -> SearchOutcome:
        top_summary = None
        if rec.scored:
            s0 = rec.scored[0]
            loc = getattr(s0.insee, "localisation", None) or ""
            top_summary = (
                f"{s0.score_pct}% {s0.insee.siren} "
                f"{(s0.insee.denomination or '')[:22]}"
            )
            if loc:
                top_summary += f" [{loc[:12]}]"
        return SearchOutcome(
            organisation_id=rec.organisation_id,
            nom=rec.nom,
            n_candidates=len(rec.scored),
            match_pct=rec.match_pct,
            veracity_pct=rec.veracity_pct,
            global_pct=rec.global_pct,
            top_candidate_summary=top_summary,
            error=error,
        )

    # ── Phase 4 : qualification + persistance ────────────────────────

    def resolve_candidate(
        self,
        rec: WMRecord,
        choice: str,
        *,
        on_progress: Callable[[str], None] | None = None,
    ) -> Optional[EntrepriseInsee]:
        """
        Équivalent fonctionnel de l'ancien _prompt_choose_or_fetch(), sans
        la saisie (le présentateur a déjà obtenu `choice` via ui.ask_text).

        choice :
            - "s" / "skip" / ""      -> None (aucune saisie exploitable)
            - un nombre "1".."N"     -> rec.scored[N-1].insee (et rec.chosen
                                        est renseigné, comme dans l'original)
            - un SIREN (9) ou SIRET (14 -> tronqué à 9) -> GET /siren/{siren}
            - toute autre entrée     -> None (invalide)

        on_progress reçoit les mêmes messages informatifs que les anciens
        console.print (recherche en cours, SIREN introuvable, entrée
        invalide, erreur de parsing) — sans jamais lever d'exception pour
        ces cas attendus.
        """
        choice = (choice or "").strip()
        if choice.lower() in ("s", "skip", ""):
            return None

        if choice.isdigit() and rec.scored and 1 <= int(choice) <= len(rec.scored):
            cs = rec.scored[int(choice) - 1]
            rec.chosen = cs
            return cs.insee

        digits = re.sub(r"\D", "", choice)
        if len(digits) == 14:
            siren = digits[:9]
        elif len(digits) == 9:
            siren = digits
        else:
            if on_progress:
                on_progress("Entrée invalide.")
            return None

        if on_progress:
            on_progress(f"→ GET /siren/{siren}")
        data = self.insee_client.get_siren(siren)
        if not data:
            if on_progress:
                on_progress("INSEE: SIREN introuvable.")
            return None

        unite = data.get("uniteLegale") or data
        try:
            return EntrepriseInsee.from_api(unite)
        except Exception as e:
            if on_progress:
                on_progress(f"Parse INSEE: {e}")
            return None

    def persist_record(
        self,
        rec: WMRecord,
        insee: EntrepriseInsee,
        user: dict,
        repo,
        *,
        on_progress: Callable[[str], None] | None = None,
    ) -> QualifyOutcome:
        """
        Équivalent fonctionnel du corps de boucle de l'ancien
        etape3_qualify_and_save() (hors saisie).

        repo : une EntrepriseRepository déjà ouverte — voir
        Layer5Service.repository() pour l'obtenir via context manager.
        """
        org = rec.zealot
        if org is None:
            org = OrganisationZealot(
                id=rec.organisation_id,
                nom=rec.nom,
                siren=rec.siren,
                organisation_type_id=rec.type_id,
                type_label=rec.type_label,
            )

        try:
            model = EntrepriseMapper.reconcileZealot(org, insee)
        except ValueError as e:
            rec.status = "skipped"
            return QualifyOutcome(
                organisation_id=rec.organisation_id,
                status="skipped",
                detail=f"Mapper: {e}",
            )

        try:
            existing = repo.get_by_siren(model.siren) if model.siren else None
            if existing is None:
                saved = repo.create(model, user=user, source=model.source or "insee+zealot")
            else:
                patch = {}
                for col in _PATCHABLE_COLUMNS:
                    if getattr(existing, col) is None and getattr(model, col) is not None:
                        patch[col] = getattr(model, col)
                if model.id_zealot and not existing.id_zealot:
                    patch["id_zealot"] = model.id_zealot
                if patch:
                    saved = repo.update(model.siren, patch, user=user) or existing
                else:
                    saved = existing
                if on_progress:
                    on_progress(f"SIREN {model.siren} déjà local — patch {list(patch.keys())}")

            rec.local_id = saved.id
            rec.siren = model.siren
            rec.status = "saved"
            if on_progress:
                on_progress(
                    f"✓ org#{rec.organisation_id} → local_id={saved.id} "
                    f"siren={saved.siren} {saved.denomination!r}"
                )
            return QualifyOutcome(
                organisation_id=rec.organisation_id,
                status="saved",
                local_id=saved.id,
                siren=saved.siren,
            )
        except ConflictError as e:
            rec.status = "conflict"
            return QualifyOutcome(
                organisation_id=rec.organisation_id, status="conflict", detail=str(e),
            )
        except Exception as e:
            rec.status = "error"
            return QualifyOutcome(
                organisation_id=rec.organisation_id, status="error", detail=str(e),
            )

    @contextmanager
    def repository(self):
        """
        Context manager fournissant une EntrepriseRepository adossée à
        une session ouverte via session_factory, fermée automatiquement.

        Usage côté présentateur :
            with service.repository() as repo:
                for rec in ...:
                    outcome = service.persist_record(rec, insee, user, repo)
        """
        if self.session_factory is None:
            raise RuntimeError(
                "session_factory requis pour repository()/persist_record() — "
                "instancier Layer5Service avec "
                "session_factory=lambda: persistence.db.get_session(engine)."
            )
        from persistence.repository import EntrepriseRepository

        session = self.session_factory()
        try:
            yield EntrepriseRepository(session)
        finally:
            session.close()

    # ── Phase 5 : push Zealot ─────────────────────────────────────────

    def push_to_zealot(
        self, on_progress: Callable[[str], None] | None = None
    ) -> list[PushOutcome]:
        """
        Équivalent fonctionnel de l'ancien etape4_push_zealot().

        Payload aligné sur EntrepriseService::attachToOrganisation :
            - siren                          -> organisations.siren
            - siret (= model.siret_siege)    -> etablissements (siège),
              UNIQUEMENT si renseigné. C'est ce champ qui détermine,
              côté serveur, si un établissement (siège) est créé en même
              temps que l'entreprise — voir tests dédiés
              (test_layer5_service_phase5.py) qui vérifient explicitement
              cette règle plutôt que de la modifier.
            - codenaf_id / forme_juridique_id / capital -> entreprises

        NOTE — TODO produit (hors périmètre de cette migration, comportement
        NON modifié ici) : actuellement, si le candidat qualifié à l'étape 3
        n'a pas de siret_siege connu, AUCUN établissement n'est créé lors du
        push, pas même un établissement non-siège. Plus tard, on ajoutera le
        siège systématiquement à la création d'une entreprise, même si
        l'établissement utilisé pour le matching (étape 2/3) n'était pas le
        siège lui-même.

        NOTE — quirk préservé à l'identique de l'original : si
        repo.get_by_id(rec.local_id) ne trouve rien, le record est
        silencieusement ignoré (pas de PushOutcome, pas de changement de
        rec.status — il reste "saved").
        """
        to_push = [
            r for r in WorkingMemory.records
            if r.status == "saved" and r.local_id and r.siren
        ]
        if not to_push:
            return []

        outcomes: list[PushOutcome] = []

        with self.repository() as repo:
            for rec in to_push:
                model = repo.get_by_id(rec.local_id)
                if not model:
                    if on_progress:
                        on_progress(
                            f"org#{rec.organisation_id} — local_id={rec.local_id} "
                            f"introuvable, skip"
                        )
                    continue  # pas de changement de statut — quirk préservé

                body = {
                    "siren": model.siren,
                    "codenaf_id": model.naf,
                    "forme_juridique_id": model.forme_juridique,
                }
                if model.siret_siege:
                    body["siret"] = model.siret_siege
                if model.capital is not None:
                    body["capital"] = model.capital

                if on_progress:
                    on_progress(
                        f"→ POST /organisation/{rec.organisation_id}/entreprise  "
                        f"siren={model.siren}  siret={model.siret_siege or '—'}"
                    )

                try:
                    result = self.ent_client.attach_to_organisation(
                        rec.organisation_id,
                        **{k: v for k, v in body.items() if v is not None},
                    )
                    rec.status = "pushed"
                    detail = (result or {}).get("id") if isinstance(result, dict) else None
                    if on_progress:
                        on_progress(
                            f"✓ org#{rec.organisation_id} poussé ({detail or 'ok'})"
                        )
                    outcomes.append(PushOutcome(
                        organisation_id=rec.organisation_id,
                        status="pushed",
                        detail=str(detail) if detail else "ok",
                    ))
                except Exception as e:
                    rec.status = "push_error"
                    outcomes.append(PushOutcome(
                        organisation_id=rec.organisation_id,
                        status="push_error",
                        detail=str(e),
                    ))

        return outcomes
