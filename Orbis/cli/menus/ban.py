# cli/menus/ban.py
"""Menu Adresses BAN — présentation CLI uniquement."""
from __future__ import annotations

from rich.console import Console
from rich.prompt  import Prompt
from rich.table   import Table
from rich.panel   import Panel

from services.api.BanClient import (
    BanClient,
    extract_type_from_street,
    normalize_type_label,
)
from cli.menu         import menu
from cli.presentation import sauvegarder, voir_detail

console = Console()


def menu_ban() -> None:
    client = BanClient()   # API publique, pas d'auth

    while True:
        choix = menu("Adresses BAN", [
            "Géocodage adresse libre",
            "Géocodage inverse (lat / lon)",
            "Extraction type de voie  [local]",
        ])
        if choix == "0":
            break

        elif choix == "1":
            q       = Prompt.ask("Adresse")
            results = client.search(q, limit=5)
            # client.search retourne déjà des dicts normalisés
            # on sauvegarde la liste normalisée pour le sample
            sauvegarder(results, "ban", "search", {"q": q})
            if not results:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"BAN — {q!r}", show_lines=True)
            t.add_column("Score",     style="cyan", width=6)
            t.add_column("Label",     style="white", width=45)
            t.add_column("Type voie",              width=12)
            t.add_column("CP",                      width=6)
            t.add_column("Ville",                   width=18)
            for r in results:
                t.add_row(
                    f"{r['score']:.2f}",
                    r["label"],
                    r["type_voie"],
                    r["postcode"],
                    r["city"],
                )
            console.print(t)

        elif choix == "2":
            lat    = float(Prompt.ask("Latitude  (ex: 47.9959)"))
            lon    = float(Prompt.ask("Longitude (ex: -4.0956)"))
            result = client.reverse(lat, lon)
            sauvegarder(result, "ban", "reverse", {"lat": lat, "lon": lon})
            if result:
                console.print(Panel(
                    f"[white]{result['label']}[/]\n"
                    f"type_voie=[cyan]{result['type_voie']}[/]  "
                    f"citycode=[cyan]{result['citycode']}[/]  "
                    f"score=[cyan]{result['score']:.2f}[/]",
                    title="BAN reverse",
                ))

        elif choix == "3":
            raw = Prompt.ask("Voie brute (ex: av. Jean Jaurès)")
            type_v, nom_v = extract_type_from_street(raw)
            console.print(
                f"  type extrait : [cyan]{type_v!r}[/]\n"
                f"  nom voie     : [white]{nom_v!r}[/]\n"
                f"  normalisé    : [green]{normalize_type_label(type_v)!r}[/]"
            )