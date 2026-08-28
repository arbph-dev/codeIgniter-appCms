# persistence/conflict_log.py
"""
ConflictLog — journal des conflits SIREN (couche 4)

Chaque tentative d'INSERT sur un SIREN existant est enregistrée ici.
Le payload JSON stocke le contexte complet : qui / quoi / où / comment / quand.

Table : conflict_log

Usage :
    from persistence.conflict_log import ConflictLog, build_payload

    log = ConflictLog(payload=build_payload(
        user      = {"user": "admin@orbis", "role": "admin"},
        attempted = model,
        existing  = existing_model,
        source    = "insee",
        force     = True,
    ))
    session.add(log)
    session.commit()
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing   import Optional

from sqlalchemy import JSON, Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from persistence.db import Base


class ConflictLog(Base):
    __tablename__ = "conflict_log"

    id:         Mapped[int]           = mapped_column(Integer, primary_key=True, autoincrement=True)
    timestamp:  Mapped[datetime]      = mapped_column(DateTime, default=datetime.utcnow, index=True)
    resolved:   Mapped[bool]          = mapped_column(Boolean, default=False)
    forced_by:  Mapped[Optional[str]] = mapped_column(String(100))   # username admin si force
    payload:    Mapped[Optional[dict]] = mapped_column(JSON)          # structure complète ci-dessous

    def __repr__(self) -> str:
        siren = (self.payload or {}).get("what", {}).get("siren", "?")
        return f"ConflictLog(id={self.id}, siren={siren!r}, forced_by={self.forced_by!r})"


# ── Constructeur de payload ─────────────────────────────────────────────────

def build_payload(
    user:      dict,               # {"user": "login", "role": "user|admin"}
    attempted,                     # EntrepriseModel tenté
    existing,                      # EntrepriseModel existant en base
    source:    str,
    force:     bool = False,
    client:    str  = "desktop",
    operation: str  = "INSERT",
) -> dict:
    """
    Construit le payload JSON structuré du ConflictLog.

    Structure :
        who    → acteur (utilisateur, rôle, service source)
        what   → ce qui a été tenté vs ce qui existe
        where  → provenance technique (source, client)
        how    → type d'opération, force ou non
        when   → timestamps
    """
    now = datetime.now(timezone.utc).isoformat()

    # Snapshot minimaliste de l'enregistrement tenté
    attempted_snap = {
        "siren":       attempted.siren,
        "denomination":attempted.denomination,
        "naf":         attempted.naf,
        "source":      attempted.source,
    }

    return {
        "who": {
            "user":    user.get("user", "inconnu"),
            "role":    user.get("role", "user"),
            "service": source,
        },
        "what": {
            "siren":          attempted.siren,
            "existing_id":    existing.id if hasattr(existing, "id") else None,
            "existing_denom": existing.denomination,
            "attempted_data": attempted_snap,
        },
        "where": {
            "source": source,
            "client": client,
        },
        "how": {
            "operation": operation,
            "force":     force,
        },
        "when": {
            "requested_at": now,
        },
    }
