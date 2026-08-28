# cli/menus/openlibrary.py
"""Menu OpenLibrary — présentation CLI uniquement."""
from __future__ import annotations

from rich.console import Console
from rich.prompt  import Prompt
from rich.table   import Table

from services.api.OpenLibraryClient import OpenLibraryClient
from cli.menu         import menu
from cli.presentation import sauvegarder, voir_detail

console = Console()


def menu_openlibrary() -> None:
    client = OpenLibraryClient()   # API publique, pas d'auth

    while True:
        choix = menu("OpenLibrary", ["Titre", "Auteur", "Sujet", "ISBN"])
        if choix == "0":
            break

        mode_map = {
            "1": ("search_title",  "title"),
            "2": ("search_author", "author"),
            "3": ("search_subject","subject"),
        }

        if choix in mode_map:
            method_name, param_key = mode_map[choix]
            q    = Prompt.ask(param_key.capitalize())
            data = getattr(client, method_name)(q)
            sauvegarder(data, "openlibrary", method_name, {param_key: q})
            docs = (data or {}).get("docs", [])
            if not docs:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(
                title=f"OpenLibrary — {q!r}  ({len(docs)} résultats)",
                show_lines=True,
            )
            t.add_column("Titre",  style="white", width=45)
            t.add_column("Auteur", style="cyan",  width=25)
            t.add_column("Année",               width=6)
            t.add_column("ISBN",   style="dim", width=14)
            for doc in docs[:10]:
                b = OpenLibraryClient.extract_book(doc)
                t.add_row(
                    b["title"] or "",
                    b["author"] or "",
                    str(b["year"] or ""),
                    b["isbn"] or "",
                )
            console.print(t)
            voir_detail(data)

        elif choix == "4":
            isbn = Prompt.ask("ISBN")
            data = client.by_isbn(isbn)
            sauvegarder(data, "openlibrary", "by_isbn", {"isbn": isbn})
            if data:
                voir_detail(data)