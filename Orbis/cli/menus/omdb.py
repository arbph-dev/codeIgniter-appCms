# cli/menus/omdb.py
"""Menu OMDB Films — présentation CLI uniquement."""
from __future__ import annotations

from rich.console import Console
from rich.prompt  import Prompt
from rich.table   import Table
from rich.panel   import Panel

from services.auth import CredentialsStore
from services.api.OmdbClient import OmdbClient
from cli.menu         import menu
from cli.presentation import sauvegarder, voir_detail

console = Console()


def menu_omdb() -> None:
    store = CredentialsStore()
    creds = store.get("omdb")
    if not creds or not creds.get("api_key"):
        key = Prompt.ask("[yellow]Clé OMDB absente — entrez-la maintenant[/]")
        store.set("omdb", api_key=key)
    auth = store.build_auth("omdb")   # ApiKeyAuth — pas de login réseau
    store.close()

    client = OmdbClient(auth=auth)

    while True:
        choix = menu("OMDB Films", ["Recherche par titre", "Fiche par IMDb ID"])
        if choix == "0":
            break

        elif choix == "1":
            titre   = Prompt.ask("Titre")
            results = client.search(titre)
            sauvegarder(results, "omdb", "search", {"title": titre})
            movies  = (results or {}).get("Search", [])
            if not movies:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"OMDB — {titre!r}", show_lines=True)
            t.add_column("N°",      style="cyan", width=4)
            t.add_column("Titre",   style="white", width=40)
            t.add_column("Année",               width=6)
            t.add_column("Type",                width=10)
            t.add_column("IMDb ID", style="dim", width=12)
            for i, m in enumerate(movies, 1):
                t.add_row(
                    str(i),
                    m.get("Title", ""),
                    m.get("Year", ""),
                    m.get("Type", ""),
                    m.get("imdbID", ""),
                )
            console.print(t)

            n = Prompt.ask("N° pour la fiche complète (0 = annuler)", default="0")
            if n.isdigit() and 1 <= int(n) <= len(movies):
                imdb_id = movies[int(n) - 1]["imdbID"]
                movie   = client.get_movie(imdb_id)
                sauvegarder(movie, "omdb", "get_movie", {"imdb_id": imdb_id})
                if movie:
                    console.print(Panel(
                        f"[white]{movie.get('Title')}[/] ({movie.get('Year')})\n"
                        f"Réalisateur : {movie.get('Director')}\n"
                        f"Acteurs     : {movie.get('Actors')}\n"
                        f"IMDb        : {movie.get('imdbRating')} ★",
                        title=imdb_id,
                    ))
                    voir_detail(movie)

        elif choix == "2":
            imdb_id = Prompt.ask("IMDb ID (ex: tt1375666)")
            movie   = client.get_movie(imdb_id)
            sauvegarder(movie, "omdb", "get_movie", {"imdb_id": imdb_id})
            if movie:
                console.print(Panel(
                    f"[white]{movie.get('Title')}[/] ({movie.get('Year')})\n"
                    f"Réalisateur : {movie.get('Director')}\n"
                    f"IMDb        : {movie.get('imdbRating')} ★",
                    title=imdb_id,
                ))
                voir_detail(movie)