# persistence/siren_guard.py
"""
SirenGuard — protection anti-doublon SIREN (couche 4)

Intercepte tout INSERT avant qu'il n'atteigne la base.
En cas de doublon :
    • journalise dans ConflictLog (toujours)
    • lève ConflictError  (utilisateur standard)
    • met à jour et log forced_by (admin avec force=True)

Usage :
    guard  = SirenGuard(session, current_user={"user": "u@mail.fr", "role": "user"})
    saved  = guard.check_and_save(model, source="insee")

    # Force admin
    admin  = {"user": "admin@mail.fr", "role": "admin"}
    guard2 = SirenGuard(session, current_user=admin)
    saved  = guard2.check_and_save(model, source="insee", force=True)
"""
from __future__ import annotations

from datetime import datetime

from sqlalchemy.orm import Session

from persistence.models      import EntrepriseModel
from persistence.conflict_log import ConflictLog, build_payload


class ConflictError(Exception):
    """Levée quand un SIREN existe déjà et que force=False ou rôle ≠ admin."""
    pass


class SirenGuard:

    def __init__(self, session: Session, current_user: dict):
        """
        session      : Session SQLAlchemy active
        current_user : {"user": "login", "role": "user|admin"}
        """
        self.session      = session
        self.current_user = current_user

    # ── API publique ────────────────────────────────────────────────

    def check_and_save(
        self,
        model:  EntrepriseModel,
        source: str,
        force:  bool = False,
    ) -> EntrepriseModel:
        """
        Vérifie l'unicité du SIREN puis persiste.

        • Pas de doublon          → INSERT, retourne l'entité.
        • Doublon + force=False   → journalise, lève ConflictError.
        • Doublon + force=True    → vérifie le rôle admin,
                                    journalise (forced_by renseigné),
                                    met à jour et retourne l'entité.
        """
        existing = (
            self.session.query(EntrepriseModel)
            .filter_by(siren=model.siren)
            .first()
        )

        if existing is None:
            self.session.add(model)
            self.session.commit()
            return model

        # ── Doublon détecté ─────────────────────────────────────────
        self._log(model, existing, source, force)

        if force and self.current_user.get("role") == "admin":
            return self._force_update(model, existing)

        raise ConflictError(
            f"SIREN {model.siren!r} déjà présent (id={existing.id}). "
            f"Opération annulée et journalisée. "
            f"Utilisez force=True avec un compte admin pour écraser."
        )

    # ── Privé ────────────────────────────────────────────────────────

    def _force_update(
        self,
        attempted: EntrepriseModel,
        existing:  EntrepriseModel,
    ) -> EntrepriseModel:
        """Met à jour tous les champs (sauf id et siren) depuis attempted."""
        skip = {"id", "siren", "created_at"}
        for col in EntrepriseModel.__table__.columns:
            if col.name in skip:
                continue
            setattr(existing, col.name, getattr(attempted, col.name))
        existing.updated_at = datetime.utcnow()
        self.session.commit()
        return existing

    def _log(
        self,
        attempted: EntrepriseModel,
        existing:  EntrepriseModel,
        source:    str,
        force:     bool,
    ) -> None:
        payload = build_payload(
            user      = self.current_user,
            attempted = attempted,
            existing  = existing,
            source    = source,
            force     = force,
        )
        log = ConflictLog(payload=payload)
        if force and self.current_user.get("role") == "admin":
            log.forced_by = self.current_user.get("user")
        self.session.add(log)
        self.session.commit()
