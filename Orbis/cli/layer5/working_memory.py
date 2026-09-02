# cli/layer5/working_memory.py
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional, Any


@dataclass
class CandidateScore:
    insee: Any
    score_raw: float = 0.0
    score_pct: int = 0
    detail: dict = field(default_factory=dict)


@dataclass
class WMRecord:
    organisation_id: int
    nom: str
    siren: Optional[str]
    type_id: int
    type_label: Optional[str] = None
    status: str = "orphan"

    siret: Optional[str] = None
    localisation: Optional[str] = None
    naf: Optional[str] = None
    forme_juridique: Optional[str] = None

    zealot: Optional[Any] = None
    insee_candidates: list = field(default_factory=list)
    scored: list = field(default_factory=list)
    chosen: Optional[CandidateScore] = None
    Pythonlocal_id: Optional[int] = None                    # 2026-08-31-004 - PK SQLAlchemy    
    
    match_pct: int = 0        # score du TOP candidat
    match_min: int = 0
    match_max: int = 0
    match_moy: int = 0
    
    veracity_pct: int = 0
    global_pct: int = 0
    


class WorkingMemory:
    records: list[WMRecord] = []
    stats: dict = {}

    @classmethod
    def clear(cls) -> None:
        cls.records = []
        cls.stats = {}

    @classmethod
    def set_scan(
        cls,
        records: list[WMRecord],
        scanned: int,
        page: int,
        per_page: int,
    ) -> None:
        cls.records = records
        cls.stats = {
            "scanned": scanned,
            "to_enrich": len(records),
            "page": page,
            "per_page": per_page,
            "ratio_pct": round(100.0 * len(records) / scanned, 1) if scanned else 0.0,
        }
