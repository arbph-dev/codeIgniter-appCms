# core/ui_port.py
"""
Contrat UIPort — Phase 1 de l'extraction Layer5Service.

Tout module de présentation (CLI Rich aujourd'hui, Qt demain via wui.py)
implémente ce Protocol. Aucun service métier ne doit importer `rich` ni
`PySide6` directement : il communique uniquement via ce port.

RichUIPort (cli/rich_ui_port.py) est l'implémentation actuelle.
QtUIPort sera l'implémentation future, à écrire une fois les services
extraits (voir roadmap Phase 8).
"""
from __future__ import annotations

from typing import Any, Protocol, Sequence


class UIPort(Protocol):
    # ── Saisie ──────────────────────────────────────────────────────
    def ask_text(self, label: str, default: str = "") -> str: ...

    def ask_int(self, label: str, default: int) -> int: ...

    def ask_choice(
        self,
        label: str,
        choices: Sequence[str],
        default: str | None = None,
    ) -> str: ...

    def ask_confirm(self, label: str, default: bool = False) -> bool: ...

    # ── Sortie ──────────────────────────────────────────────────────
    def notify(self, message: str, level: str = "info") -> None:
        """level : info / warn / error / success"""
        ...

    def show_table(
        self,
        title: str,
        columns: Sequence[str],
        rows: Sequence[dict],
    ) -> None: ...

    def show_detail(self, data: Any) -> None: ...

    # ── Progression (étapes longues type layer5) ─────────────────────
    def progress(self, message: str) -> None:
        """Simple ligne de progression textuelle, pas de barre requise."""
        ...
