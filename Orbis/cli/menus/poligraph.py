# cli/menus/poligraph.py
"""Menu Poligraph — présentation CLI uniquement."""

from __future__ import annotations

from rich.console import Console
from rich.prompt import Prompt
from rich.table import Table

from services.api.poligraph_client import PoligraphClient

from cli.menu import menu
from cli.presentation import sauvegarder, voir_detail


console = Console()


def menu_poligraph() -> None:
    """
    Menu principal Poligraph.

    Poligraph est une API publique :
    aucune authentification n'est nécessaire.
    """

    client = PoligraphClient()

    while True:
        choix = menu("Poligraph", [
            "Recherche / liste politiques",
            "Fiche politique",
            "Affaires judiciaires",
            "Partis politiques",
            "Élections",
            "Résolution poligraphId",
        ])

        if choix == "0":
            break

        # --------------------------------------------------------------
        # 1 — POLITIQUES
        # --------------------------------------------------------------

        elif choix == "1":
            q = Prompt.ask(
                "Recherche",
                default="",
            )

            # Pour l'instant on transmet q comme filtre.
            # Le nom exact du paramètre devra être confirmé sur
            # l'endpoint réel Poligraph.
            data = client.list_politiques(
                page=1,
                limit=20,
                q=q or None,
            )

            sauvegarder(
                data,
                "poligraph",
                "list_politiques",
                {"q": q},
            )

            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue

            items = data.get("data", [])

            if items:
                t = Table(
                    title=f"Poligraph — politiques ({len(items)})",
                    show_lines=True,
                )

                t.add_column(
                    "poligraphId",
                    style="cyan",
                    width=16,
                )
                t.add_column(
                    "Nom",
                    style="white",
                    width=35,
                )
                t.add_column(
                    "Slug",
                    style="dim",
                    width=35,
                )

                for p in items:
                    t.add_row(
                        str(p.get("poligraphId") or ""),
                        (
                            p.get("name")
                            or p.get("nom")
                            or p.get("fullName")
                            or ""
                        ),
                        str(p.get("slug") or ""),
                    )

                console.print(t)

            voir_detail(data)

        # --------------------------------------------------------------
        # 2 — FICHE POLITIQUE
        # --------------------------------------------------------------

        elif choix == "2":
            slug = Prompt.ask("Slug politique")

            data = client.get_politique(slug)

            sauvegarder(
                data,
                "poligraph",
                "get_politique",
                {"slug": slug},
            )

            if data:
                voir_detail(data)
            else:
                console.print(
                    "[yellow]Politique introuvable.[/]"
                )

        # --------------------------------------------------------------
        # 3 — AFFAIRES
        # --------------------------------------------------------------

        elif choix == "3":
            console.print(
                "[dim]Filtres optionnels — laisser vide pour ignorer.[/]"
            )

            status = Prompt.ask(
                "statusCode",
                default="",
            )

            category = Prompt.ask(
                "categoryCode",
                default="",
            )

            involvement = Prompt.ask(
                "involvement",
                default="",
            )

            data = client.list_affaires(
                page=1,
                limit=20,
                statusCode=status or None,
                categoryCode=category or None,
                involvement=involvement or None,
            )

            sauvegarder(
                data,
                "poligraph",
                "list_affaires",
                {
                    "statusCode": status,
                    "categoryCode": category,
                    "involvement": involvement,
                },
            )

            if not data:
                console.print(
                    "[yellow]Aucune affaire.[/]"
                )
                continue

            items = data.get("data", [])

            if items:
                t = Table(
                    title=f"Poligraph — affaires ({len(items)})",
                    show_lines=True,
                )

                t.add_column(
                    "poligraphId",
                    style="cyan",
                    width=16,
                )
                t.add_column(
                    "Titre",
                    style="white",
                    width=50,
                )

                for affaire in items:
                    t.add_row(
                        str(
                            affaire.get("poligraphId")
                            or ""
                        ),
                        (
                            affaire.get("title")
                            or affaire.get("titre")
                            or affaire.get("name")
                            or ""
                        ),
                    )

                console.print(t)

            voir_detail(data)

        # --------------------------------------------------------------
        # 4 — PARTIS
        # --------------------------------------------------------------

        elif choix == "4":
            data = client.list_partis(
                page=1,
                limit=20,
            )

            sauvegarder(
                data,
                "poligraph",
                "list_partis",
                {},
            )

            if not data:
                console.print(
                    "[yellow]Aucun parti.[/]"
                )
                continue

            items = data.get("data", [])

            if items:
                t = Table(
                    title="Poligraph — partis",
                    show_lines=True,
                )

                t.add_column(
                    "poligraphId",
                    style="cyan",
                    width=16,
                )
                t.add_column(
                    "Nom",
                    style="white",
                    width=45,
                )
                t.add_column(
                    "Slug",
                    style="dim",
                    width=35,
                )

                for parti in items:
                    t.add_row(
                        str(
                            parti.get("poligraphId")
                            or ""
                        ),
                        (
                            parti.get("name")
                            or parti.get("nom")
                            or ""
                        ),
                        str(
                            parti.get("slug")
                            or ""
                        ),
                    )

                console.print(t)

            voir_detail(data)

        # --------------------------------------------------------------
        # 5 — ÉLECTIONS
        # --------------------------------------------------------------

        elif choix == "5":
            data = client.list_elections(
                page=1,
                limit=20,
            )

            sauvegarder(
                data,
                "poligraph",
                "list_elections",
                {},
            )

            if not data:
                console.print(
                    "[yellow]Aucune élection.[/]"
                )
                continue

            items = data.get("data", [])

            if items:
                t = Table(
                    title="Poligraph — élections",
                    show_lines=True,
                )

                t.add_column(
                    "poligraphId",
                    style="cyan",
                    width=16,
                )
                t.add_column(
                    "Nom",
                    style="white",
                    width=50,
                )
                t.add_column(
                    "Slug",
                    style="dim",
                    width=35,
                )

                for election in items:
                    t.add_row(
                        str(
                            election.get("poligraphId")
                            or ""
                        ),
                        (
                            election.get("name")
                            or election.get("nom")
                            or election.get("title")
                            or ""
                        ),
                        str(
                            election.get("slug")
                            or ""
                        ),
                    )

                console.print(t)

            voir_detail(data)

        # --------------------------------------------------------------
        # 6 — POLIGRAPH ID
        # --------------------------------------------------------------

        elif choix == "6":
            poligraph_id = Prompt.ask(
                "poligraphId",
            )

            data = client.get_poligraph_id(
                poligraph_id,
            )

            sauvegarder(
                data,
                "poligraph",
                "get_poligraph_id",
                {
                    "poligraphId": poligraph_id,
                },
            )

            if data:
                voir_detail(data)
            else:
                console.print(
                    "[yellow]Identifiant Poligraph introuvable "
                    "ou non résolu.[/]"
                )