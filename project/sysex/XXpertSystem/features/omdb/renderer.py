"""
features/omdb/renderer.py
Affichage Rich — s'abonne aux événements omdb:loaded / omdb:movie:loaded.
Équivalent de codenaf.renderer.js mais en console.
"""
from rich.console import Console
from rich.table   import Table
from rich.panel   import Panel
from rich.json    import JSON
from rich.prompt  import Prompt

console = Console()


def init_omdb_renderer(bus) -> None:

    def on_loading(loading):
        if loading:
            console.print("[dim]⏳ Chargement OMDB...[/]")

    def on_loaded(store):
        movies = store.get("data", [])
        if not movies:
            console.print("[yellow]Aucun résultat.[/]")
            return
        table = Table(title=f"OMDB — {store.get('q','')}", show_lines=True)
        table.add_column("N°",     style="cyan",  width=4)
        table.add_column("Titre",  style="white", width=38)
        table.add_column("Année",  width=6)
        table.add_column("Type",   width=10)
        table.add_column("IMDb",   style="dim",   width=12)
        for i, m in enumerate(movies, 1):
            table.add_row(str(i), m.get("Title",""), m.get("Year",""),
                          m.get("Type",""), m.get("imdbID",""))
        console.print(table)

        # Sélection interactive inline
        ch = Prompt.ask("Numéro pour la fiche (0 = annuler)", default="0")
        if ch.isdigit() and 1 <= int(ch) <= len(movies):
            bus.publish("omdb:movie", {"id": movies[int(ch)-1]["imdbID"]})

    def on_movie_loaded(movie):
        console.print(Panel(JSON.from_data(movie),
                            title=f"[bold]{movie.get('Title', 'Film')}[/]"))

    def on_error(msg):
        console.print(f"[red]OMDB erreur : {msg}[/]")

    bus.subscribe("omdb:loading",      on_loading)
    bus.subscribe("omdb:loaded",       on_loaded)
    bus.subscribe("omdb:movie:loaded", on_movie_loaded)
    bus.subscribe("omdb:error",        on_error)
