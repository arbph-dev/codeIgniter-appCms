"""
ORBIS — main.py  V0.8
Entrée CLI mince. Les menus métier sont dans cli/menus/.
"""
import sys
from rich.console import Console
from rich.panel   import Panel

from cli.menu          import menu

from cli.menus.insee   import menu_insee
from cli.menus.inpi  import menu_inpi
from cli.menus.personne import menu_personne
from cli.menus.omdb import menu_omdb
from cli.menus.openlibrary import menu_openlibrary
from cli.menus.poligraph import menu_poligraph
from cli.menus.ban import menu_ban
from cli.menus.credentials import menu_credentials

console = Console()

MENU_PRINCIPAL = [
    "INSEE Sirene",
    "INPI RNE",
    "Personnes (zealot)",
    "OMDB Films",
    "OpenLibrary Livres",
    "Poligraph",
    "Adresses BAN",
    "Credentials",
]

HANDLERS = {
    "1": menu_insee,
    "2": menu_inpi,
    "3": menu_personne,
    "4": menu_omdb,
    "5": menu_openlibrary,
    "6": menu_poligraph,
    "7": menu_ban,
    "8": menu_credentials,
}


def main():
    if "--init-creds" in sys.argv:
        menu_credentials()
        return

    console.print(Panel.fit(
        "[bold blue]ORBIS — V0.8[/bold blue]\n[dim]VersatileKnowledgeBase[/dim]",
        style="bold blue",
    ))

    while True:
        choix = menu("Menu principal", MENU_PRINCIPAL)
        if choix == "0":
            break
        handler = HANDLERS.get(choix)
        if handler:
            try:
                handler()
            except KeyboardInterrupt:
                console.print("\n[dim]Interruption — retour au menu.[/]")
            except Exception as e:
                console.print(f"[red]Erreur inattendue : {e}[/]")


if __name__ == "__main__":
    main()