# persistence/models.py
"""
EntrepriseModel — ORM SQLAlchemy (couche 4)

Remplace le dataclass provisoire : mêmes noms de champs,
le mapper (couche 3) n'a pas à changer.

Table : entreprises
Clé métier : siren (UNIQUE, INDEX)
"""
from __future__ import annotations

from datetime import datetime
from typing   import Optional

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from persistence.db import Base


class EntrepriseModel(Base):
    __tablename__ = "entreprises"

    # ── Clé technique ───────────────────────────────────────────────
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # ── Clé métier ──────────────────────────────────────────────────
    siren: Mapped[str] = mapped_column(String(9), unique=True, nullable=False, index=True)

    # ── Identification ──────────────────────────────────────────────
    denomination:     Mapped[Optional[str]] = mapped_column(String(255))
    sigle:            Mapped[Optional[str]] = mapped_column(String(50))

    # ── Activité ────────────────────────────────────────────────────
    naf:              Mapped[Optional[str]] = mapped_column(String(10))   # "47.78C"
    naf_naf25:        Mapped[Optional[str]] = mapped_column(String(10))   # "47.63Y"
    categorie:        Mapped[Optional[str]] = mapped_column(String(10))   # PME/ETI/GE
    etat:             Mapped[Optional[str]] = mapped_column(String(1))    # A / C

    # ── Juridique ───────────────────────────────────────────────────
    forme_juridique:  Mapped[Optional[str]] = mapped_column(String(10))   # "5499"

    # ── Établissement siège ─────────────────────────────────────────
    nic_siege:        Mapped[Optional[str]] = mapped_column(String(5))
    siret_siege:      Mapped[Optional[str]] = mapped_column(String(14))

    # ── Financier ───────────────────────────────────────────────────
    capital:          Mapped[Optional[float]] = mapped_column(Float)

    # ── RH ──────────────────────────────────────────────────────────
    tranche_effectif: Mapped[Optional[str]] = mapped_column(String(5))
    economie_sociale: Mapped[Optional[bool]] = mapped_column(Boolean)

    # ── Dates ───────────────────────────────────────────────────────
    date_creation:    Mapped[Optional[str]] = mapped_column(String(10))   # "YYYY-MM-DD"

    # ── Flags INSEE ─────────────────────────────────────────────────
    statut_diffusion: Mapped[Optional[str]] = mapped_column(String(1))    # O / P / N

    # ── Zealot ──────────────────────────────────────────────────────
    id_zealot:        Mapped[Optional[int]] = mapped_column(Integer)

    # ── Blobs INPI ──────────────────────────────────────────────────
    representants_json:  Mapped[Optional[str]] = mapped_column(Text)
    beneficiaires_json:  Mapped[Optional[str]] = mapped_column(Text)

    # ── UI ──────────────────────────────────────────────────────────
    commentaire:      Mapped[Optional[str]] = mapped_column(Text)

    # ── Provenance ──────────────────────────────────────────────────
    source:           Mapped[str] = mapped_column(String(50), default="ui")

    # ── Méta ────────────────────────────────────────────────────────
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, default=datetime.utcnow
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # ── Helpers ─────────────────────────────────────────────────────

    @property
    def est_active(self) -> bool:
        return self.etat == "A"

    @property
    def label(self) -> str:
        return self.denomination or self.siren

    def to_dict(self) -> dict:
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self) -> str:
        return (
            f"EntrepriseModel(siren={self.siren!r}, "
            f"denomination={self.denomination!r}, "
            f"naf={self.naf!r}, source={self.source!r})"
        )
