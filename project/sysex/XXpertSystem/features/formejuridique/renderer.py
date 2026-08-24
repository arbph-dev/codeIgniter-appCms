"""
features/formejuridique/renderer.py
Affichage Rich — couvre lecture, écriture et retours pipeline.
"""
from rich.console import Console
from rich.table   import Table
from rich.panel   import Panel
from rich.json    import JSON

console = Console()


def init_fj_renderer(bus) -> None:

    def on_loading(loading):
        if loading:
            console.print("[dim]⏳ FormeJuridique...[/]")

    def on_loaded(store):
        items = store.get("data", [])
        if not items:
            console.print(Panel("Aucun résultat.", style="yellow"))
            return
        table = Table(title=f"Formes juridiques — {store.get('q','')}", show_lines=True)
        table.add_column("Code",    style="cyan",  width=8)
        table.add_column("Libellé", style="white", width=60)
        for it in items:
            table.add_row(it.get("id",""), it.get("description",""))
        console.print(table)

    def on_detail_loaded(item):
        console.print(Panel(
            f"[cyan]{item.get('id','')}[/]  {item.get('description','')}",
            title="[bold]Forme juridique[/]",
            border_style="cyan",
        ))

    def on_like_loaded(items):
        if not items:
            console.print("[yellow]Aucune suggestion.[/]")
            return
        table = Table(title="Suggestions")
        table.add_column("Code",    style="cyan",  width=8)
        table.add_column("Libellé", style="white", width=60)
        for it in items:
            table.add_row(it.get("id",""), it.get("description",""))
        console.print(table)

    def on_created(item):
        console.print(Panel(
            f"[green]✓ Créé[/]  [cyan]{item.get('id','')}[/]  {item.get('description','')}",
            border_style="green",
        ))

    def on_updated(item):
        console.print(Panel(
            f"[green]✓ Mis à jour[/]  [cyan]{item.get('id','')}[/]  {item.get('description','')}",
            border_style="green",
        ))

    def on_deleted(code):
        console.print(Panel(f"[green]✓ Supprimé[/]  code [cyan]{code}[/]", border_style="green"))

    def on_resolved(payload):
        code  = payload.get("code",  "?")
        label = payload.get("label", "introuvable")
        console.print(f"[dim]fj:resolve[/]  [cyan]{code}[/] → [white]{label}[/]")

    def on_ensured(item):
        if item:
            console.print(f"[dim]fj:ensure[/]  [cyan]{item.get('id','')}[/] OK")

    def on_error(msg):
        console.print(f"[red]FormeJuridique erreur : {msg}[/]")

    bus.subscribe("fj:loading",       on_loading)
    bus.subscribe("fj:loaded",        on_loaded)
    bus.subscribe("fj:detail:loaded", on_detail_loaded)
    bus.subscribe("fj:like:loaded",   on_like_loaded)
    bus.subscribe("fj:created",       on_created)
    bus.subscribe("fj:updated",       on_updated)
    bus.subscribe("fj:deleted",       on_deleted)
    bus.subscribe("fj:resolved",      on_resolved)
    bus.subscribe("fj:ensured",       on_ensured)
    bus.subscribe("fj:error",         on_error)
