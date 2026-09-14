# tests/test_rich_ui_port.py
"""
Non-régression : RichUIPort.show_table ne doit jamais confondre une
valeur "falsy" légitime (0, False) avec une valeur absente (None).

Bug réel observé en test manuel Phase 3 : la colonne "n" (n_candidates)
s'affichait vide au lieu de "0" pour les organisations sans candidat
INSEE, à cause d'un `row.get(col, "") or ""` qui écrasait 0 en "".
"""
from __future__ import annotations

from rich.console import Console

from cli.rich_ui_port import RichUIPort


def _render(rows, columns=("n",)):
    console = Console(record=True, width=120)
    ui = RichUIPort(console=console)
    ui.show_table("t", list(columns), rows)
    return console.export_text()


def test_show_table_renders_zero_not_blank():
    output = _render([{"n": 0}])
    assert "│ 0 " in output or output.count("0") >= 1
    # La regression historique : la cellule devenait "" (deux espaces collés)
    assert "│  │" not in output.replace(" ", " ")  # garde-fou simple


def test_show_table_renders_false_not_blank():
    output = _render([{"n": False}])
    assert "False" in output


def test_show_table_renders_none_as_empty_string():
    output = _render([{"n": None}])
    # None doit bien produire une cellule vide (comportement voulu, pas un bug)
    assert "None" not in output


def test_show_table_renders_missing_key_as_empty_string():
    output = _render([{}])
    assert "None" not in output
