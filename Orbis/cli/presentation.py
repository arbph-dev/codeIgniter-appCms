# cli/presentation.py
"""Affichage Rich + sauvegarde JSON (présentation pure)."""
from __future__ import annotations

from rich.console import Console
from rich.tree    import Tree

from core.json_store import save_response, extract_schema
from cli.menu        import menu

console = Console()


def json_tree(data, label: str = "Root") -> Tree:
    """Construit un Rich Tree depuis un dict/list JSON."""
    tree = Tree(f"📂 [bold blue]{label}[/bold blue]")

    def _build(node, branch):
        if isinstance(node, dict):
            for k, v in node.items():
                if isinstance(v, (dict, list)):
                    _build(v, branch.add(f"[bold cyan]{k}[/bold cyan]"))
                else:
                    val = (
                        "[italic red]null[/italic red]" if v is None
                        else f"[italic yellow]{v}[/italic yellow]"
                        if isinstance(v, bool)
                        else str(v)
                    )
                    branch.add(f"[bold green]{k}[/bold green]: {val}")
        elif isinstance(node, list):
            for i, item in enumerate(node):
                if isinstance(item, (dict, list)):
                    _build(item, branch.add(f"[bold magenta][{i}][/bold magenta]"))
                else:
                    branch.add(f"[bold magenta][{i}][/bold magenta]: {item}")

    _build(data, tree)
    return tree


def sauvegarder(data, source: str, endpoint: str, params: dict | None = None) -> str | None:
    """Sauvegarde systématique après chaque appel API. Retourne le nom du fichier."""
    if data is None:
        return None
    filename = save_response(data, source=source, endpoint=endpoint, params=params or {})
    console.print(f"[dim]💾 {filename}[/]")
    return filename


def voir_detail(data) -> None:
    """Affichage tree / schéma sur demande (non systématique)."""
    if not data:
        return
    choix = menu("Détail JSON", ["Tree complet", "Schéma de types"])
    if choix == "1":
        console.print(json_tree(data))
    elif choix == "2":
        console.print(extract_schema(data))