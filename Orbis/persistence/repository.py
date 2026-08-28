# persistence/repository.py
"""
EntrepriseRepository — CRUD + import/export CSV (couche 4)

Tous les accès DB passent par ici. Le Repository délègue les INSERTs
à SirenGuard pour garantir l'unicité SIREN.

Usage :
    engine = get_engine()
    init_db(engine)
    session = get_session(engine)

    repo = EntrepriseRepository(session)
    user = {"user": "u@mail.fr", "role": "user"}

    # Création
    saved = repo.create(model, user=user, source="insee")

    # Lecture
    e = repo.get_by_siren("448451484")
    page = repo.list(page=1, per_page=20)

    # Mise à jour
    repo.update("448451484", {"denomination": "Nouveau nom"}, user=user)

    # Suppression
    repo.delete("448451484")

    # Import / Export CSV
    repo.import_csv("entreprises.csv", user=user)
    repo.export_csv("export.csv")

    session.close()
"""
from __future__ import annotations

import csv
from datetime import datetime
from pathlib  import Path
from typing   import Optional

from sqlalchemy.orm import Session

from persistence.models      import EntrepriseModel
from persistence.conflict_log import ConflictLog
from persistence.siren_guard  import SirenGuard, ConflictError


# Colonnes CSV exportées (exclut les clés techniques)
_CSV_FIELDS = [
    "siren", "denomination", "sigle", "naf", "naf_naf25",
    "categorie", "etat", "forme_juridique", "nic_siege", "siret_siege",
    "capital", "tranche_effectif", "economie_sociale", "date_creation",
    "statut_diffusion", "id_zealot", "commentaire", "source",
]


class EntrepriseRepository:

    def __init__(self, session: Session):
        self.session = session

    # ── CREATE ──────────────────────────────────────────────────────

    def create(
        self,
        model:  EntrepriseModel,
        user:   dict,
        source: str,
        force:  bool = False,
    ) -> EntrepriseModel:
        """
        Persiste un EntrepriseModel via SirenGuard.
        Lève ConflictError si SIREN déjà présent (sauf admin + force).
        """
        guard = SirenGuard(self.session, current_user=user)
        return guard.check_and_save(model, source=source, force=force)

    # ── READ ─────────────────────────────────────────────────────────

    def get_by_siren(self, siren: str) -> Optional[EntrepriseModel]:
        return (
            self.session.query(EntrepriseModel)
            .filter_by(siren=siren)
            .first()
        )

    def get_by_id(self, id_: int) -> Optional[EntrepriseModel]:
        return self.session.get(EntrepriseModel, id_)

    def list(
        self,
        page:     int = 1,
        per_page: int = 20,
        source:   Optional[str] = None,
        etat:     Optional[str] = None,
    ) -> dict:
        """
        Liste paginée avec filtres optionnels.
        Retourne {"data": [...], "meta": {"total": n, "page": p, "pages": n}}.
        """
        q = self.session.query(EntrepriseModel)
        if source:
            q = q.filter(EntrepriseModel.source.like(f"%{source}%"))
        if etat:
            q = q.filter_by(etat=etat)

        total  = q.count()
        items  = q.offset((page - 1) * per_page).limit(per_page).all()
        pages  = (total + per_page - 1) // per_page

        return {
            "data": items,
            "meta": {"total": total, "page": page, "per_page": per_page, "pages": pages},
        }

    def search(self, q: str, per_page: int = 20) -> list[EntrepriseModel]:
        """Recherche fulltext sur denomination (LIKE)."""
        pattern = f"%{q}%"
        return (
            self.session.query(EntrepriseModel)
            .filter(EntrepriseModel.denomination.ilike(pattern))
            .limit(per_page)
            .all()
        )

    # ── UPDATE ───────────────────────────────────────────────────────

    def update(
        self,
        siren: str,
        data:  dict,
        user:  dict,
    ) -> Optional[EntrepriseModel]:
        """
        Met à jour les champs fournis dans data.
        Champs protégés : id, siren, created_at.
        Retourne None si SIREN introuvable.
        """
        existing = self.get_by_siren(siren)
        if not existing:
            return None

        protected = {"id", "siren", "created_at"}
        for key, value in data.items():
            if key not in protected and hasattr(existing, key):
                setattr(existing, key, value)

        existing.updated_at = datetime.utcnow()
        self.session.commit()
        return existing

    # ── DELETE ───────────────────────────────────────────────────────

    def delete(self, siren: str) -> bool:
        existing = self.get_by_siren(siren)
        if not existing:
            return False
        self.session.delete(existing)
        self.session.commit()
        return True

    # ── LOGS ─────────────────────────────────────────────────────────

    def list_conflicts(
        self,
        resolved: Optional[bool] = None,
        limit: int = 50,
    ) -> list[ConflictLog]:
        """Liste les conflits SIREN journalisés."""
        q = self.session.query(ConflictLog).order_by(ConflictLog.timestamp.desc())
        if resolved is not None:
            q = q.filter_by(resolved=resolved)
        return q.limit(limit).all()

    def resolve_conflict(self, log_id: int) -> bool:
        log = self.session.get(ConflictLog, log_id)
        if not log:
            return False
        log.resolved = True
        self.session.commit()
        return True

    # ── IMPORT CSV ───────────────────────────────────────────────────

    def import_csv(
        self,
        filepath:       str | Path,
        user:           dict,
        source:         str  = "csv",
        force:          bool = False,
        skip_on_conflict: bool = True,
    ) -> dict:
        """
        Importe un CSV dans la base.
        En-têtes = noms des champs EntrepriseModel (ex: siren, denomination…).
        Retourne {"imported": n, "skipped": n, "errors": [...]}.
        """
        imported = skipped = 0
        errors: list[str] = []

        with open(filepath, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                siren = (row.get("siren") or "").strip()
                if not siren:
                    errors.append(f"Ligne ignorée : SIREN vide ({row})")
                    skipped += 1
                    continue
                try:
                    model = EntrepriseModel(
                        **{k: v or None for k, v in row.items() if hasattr(EntrepriseModel, k)}
                    )
                    model.source = source
                    self.create(model, user=user, source=source, force=force)
                    imported += 1
                except ConflictError as e:
                    if skip_on_conflict:
                        skipped += 1
                    else:
                        errors.append(str(e))
                except Exception as e:
                    errors.append(f"SIREN {siren} — {e}")

        return {"imported": imported, "skipped": skipped, "errors": errors}

    # ── EXPORT CSV ───────────────────────────────────────────────────

    def export_csv(
        self,
        filepath: str | Path,
        source:   Optional[str] = None,
        etat:     Optional[str] = None,
    ) -> int:
        """
        Exporte toutes les entreprises (ou filtrées) en CSV.
        En-têtes = _CSV_FIELDS (clés métier uniquement, sans id/timestamps).
        Retourne le nombre de lignes exportées.
        """
        q = self.session.query(EntrepriseModel)
        if source:
            q = q.filter(EntrepriseModel.source.like(f"%{source}%"))
        if etat:
            q = q.filter_by(etat=etat)

        rows = q.all()
        Path(filepath).parent.mkdir(parents=True, exist_ok=True)

        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=_CSV_FIELDS, extrasaction="ignore")
            writer.writeheader()
            for e in rows:
                writer.writerow({field: getattr(e, field) for field in _CSV_FIELDS})

        return len(rows)
