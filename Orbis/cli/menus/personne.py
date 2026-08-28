# cli/menus/personne.py
"""Menu Personnes zealot.fr — présentation CLI uniquement."""
from __future__ import annotations

from rich.console import Console
from rich.prompt  import Prompt
from rich.table   import Table
from rich.panel   import Panel

from services.auth import CredentialsStore
from services.api.personne_client import PersonneClient
from cli.menu         import menu, get_auth
from cli.presentation import sauvegarder, voir_detail

console = Console()


def menu_personne() -> None:
    store = CredentialsStore()
    auth  = get_auth(store, "zealot")
    store.close()
    if not auth:
        return

    client = PersonneClient(auth=auth)

    while True:
        choix = menu("Personnes — zealot.fr", ["Recherche", "Fiche par ID"])
        if choix == "0":
            break

        elif choix == "1":
            q    = Prompt.ask("Nom")
            data = client.search(q)
            sauvegarder(data, "zealot", "search_personne", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"Personnes — {q!r}", show_lines=True)
            t.add_column("ID",          style="cyan", width=6)
            t.add_column("Nom complet", style="white", width=40)
            for p in (data.get("data") or []):
                t.add_row(str(p.get("id") or ""), p.get("nom_complet") or "")
            console.print(t)
            voir_detail(data)

        elif choix == "2":
            pid   = Prompt.ask("ID personne")
            fiche = client.get_by_id(int(pid))
            sauvegarder(fiche, "zealot", "get_personne", {"id": pid})
            if fiche:
                p = fiche.get("personne") or fiche
                console.print(Panel(
                    f"[white]{p.get('nom_complet')}[/]\n"
                    f"Aliases  : {len(fiche.get('aliases',  []))}\n"
                    f"Parcours : {len(fiche.get('parcours', []))}\n"
                    f"Relations: {len(fiche.get('relations',[]))}",
                    title=f"Personne #{pid}",
                ))
                voir_detail(fiche)