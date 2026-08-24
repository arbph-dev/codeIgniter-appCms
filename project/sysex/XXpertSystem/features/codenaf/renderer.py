"""
features/codenaf/renderer.py
Affichage Rich — s'abonne aux événements naf:*.
"""
from rich.console import Console
from rich.table   import Table
from rich.tree    import Tree

console = Console()


def init_codenaf_renderer(bus) -> None:

    def on_loading(loading):
        if loading:
            console.print("[dim]⏳ Chargement NAF...[/]")

    def on_loaded(store):
        items = store.get("data", [])
        if not items:
            console.print("[yellow]Aucun résultat NAF.[/]")
            return
        table = Table(title=f"CodeNaf — {store.get('q','')}", show_lines=True)
        table.add_column("Code",    style="cyan",  width=12)
        table.add_column("Libellé", style="white", width=52)
        table.add_column("Parent",  style="dim",   width=10)
        for it in items:
            table.add_row(it.get("codenaf",""), it.get("nom",""), it.get("parentcode",""))
        console.print(table)

    def on_hierarchy_loaded(payload):
        code  = payload.get("code", "")
        items = payload.get("items", [])
        tree  = Tree(f"[bold blue]Hiérarchie — {code}[/]")
        for it in items:
            tree.add(f"[cyan]{it.get('codenaf',''):10}[/] {it.get('nom','')}")
        console.print(tree)

    def on_like_loaded(items):
        if not items:
            console.print("[yellow]Aucune suggestion.[/]")
            return
        table = Table(title="Suggestions")
        table.add_column("Code",    style="cyan",  width=12)
        table.add_column("Libellé", style="white", width=52)
        for it in items:
            table.add_row(it.get("codenaf",""), it.get("nom",""))
        console.print(table)

    def on_error(msg):
        console.print(f"[red]NAF erreur : {msg}[/]")

    bus.subscribe("naf:loading",          on_loading)
    bus.subscribe("naf:loaded",           on_loaded)
    bus.subscribe("naf:hierarchy:loaded", on_hierarchy_loaded)
    bus.subscribe("naf:like:loaded",      on_like_loaded)
    bus.subscribe("naf:error",            on_error)
