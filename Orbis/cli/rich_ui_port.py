# cli/rich_ui_port.py
"""
RichUIPort — implémentation console du contrat core.ui_port.UIPort.

Seul endroit du projet (avec cli/presentation.py) où `rich` est importé
pour les besoins des services layer5. Remplace le mélange saisie/affichage
qui existait dans cli/layer5/etapes.py.
"""
from __future__ import annotations

from typing import Any, Sequence

from rich.console import Console
from rich.prompt import Confirm, IntPrompt, Prompt
from rich.table import Table

_LEVEL_STYLE = {
    "info": "dim",
    "warn": "yellow",
    "error": "red",
    "success": "green",
}


class RichUIPort:
    def __init__(self, console: Console | None = None):
        self.console = console or Console()

    # ── Saisie ──────────────────────────────────────────────────────
    def ask_text(self, label: str, default: str = "") -> str:
        return Prompt.ask(label, default=default)

    def ask_int(self, label: str, default: int) -> int:
        return IntPrompt.ask(label, default=default)

    def ask_choice(
        self,
        label: str,
        choices: Sequence[str],
        default: str | None = None,
    ) -> str:
        return Prompt.ask(label, choices=list(choices), default=default)

    def ask_confirm(self, label: str, default: bool = False) -> bool:
        return Confirm.ask(label, default=default)

    # ── Sortie ──────────────────────────────────────────────────────
    def notify(self, message: str, level: str = "info") -> None:
        style = _LEVEL_STYLE.get(level, "dim")
        self.console.print(f"[{style}]{message}[/]")

    def show_table(
        self,
        title: str,
        columns: Sequence[str],
        rows: Sequence[dict],
    ) -> None:
        table = Table(title=title, show_lines=True)
        for col in columns:
            table.add_column(col)
        for row in rows:
            values = []
            for col in columns:
                v = row.get(col, "")
                values.append("" if v is None else str(v))
            table.add_row(*values)
        self.console.print(table)

    def show_detail(self, data: Any) -> None:
        from cli.presentation import json_tree

        self.console.print(json_tree(data))

    def progress(self, message: str) -> None:
        self.console.print(f"[dim]{message}[/]")
