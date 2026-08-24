"""
features/api_tests/renderer.py
Affichage Rich pour les résultats de test et la liste des samples.
"""
from rich.console import Console
from rich.table   import Table
from rich.panel   import Panel
from rich.json    import JSON

console = Console()


def init_api_tests_renderer(bus) -> None:

    def on_loading(payload):
        source = payload.get("source", "?")
        q      = payload.get("q", "")
        console.print(f"[dim]⏳ Requête {source} — {q!r}...[/]")

    def on_saved(payload):
        source   = payload.get("source",   "?")
        endpoint = payload.get("endpoint", "?")
        filename = payload.get("filename", "?")
        data     = payload.get("data")

        console.print(Panel(
            f"[green]✓ Sauvegardé[/]  [dim]{filename}[/]",
            title=f"[bold]{source} / {endpoint}[/]",
            border_style="green",
        ))

        # Aperçu JSON tronqué
        if data:
            console.print(JSON.from_data(data))

    def on_samples_loaded(samples):
        if not samples:
            console.print(Panel("Aucun sample sauvegardé.", style="yellow"))
            return

        table = Table(title="Samples sauvegardés", show_lines=True)
        table.add_column("N°",       style="cyan",  width=4)
        table.add_column("Source",   style="green", width=12)
        table.add_column("Endpoint", width=12)
        table.add_column("Params",   style="dim",   width=30)
        table.add_column("Date",     width=19)
        table.add_column("Fichier",  style="dim",   width=35)

        for i, s in enumerate(samples, 1):
            params_str = ", ".join(f"{k}={v}" for k, v in s.get("params", {}).items())
            table.add_row(
                str(i),
                s.get("source",   "?"),
                s.get("endpoint", "?"),
                params_str,
                s.get("saved_at", "?"),
                s.get("filename", "?"),
            )
        console.print(table)

    def on_error(payload):
        source = payload.get("source", "?")
        error  = payload.get("error",  "?")
        console.print(f"[red]{source} erreur : {error}[/]")

    bus.subscribe("api_tests:loading",        on_loading)
    bus.subscribe("api_tests:saved",          on_saved)
    bus.subscribe("api_tests:samples_loaded", on_samples_loaded)
    bus.subscribe("api_tests:error",          on_error)