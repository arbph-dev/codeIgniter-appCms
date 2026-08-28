# cli/menus/inpi.py
"""Menu INPI RNE — présentation CLI uniquement."""
from __future__ import annotations

from rich.console import Console
from rich.prompt  import Prompt
from rich.table   import Table

from services.auth import CredentialsStore
from services.api.inpi_client import InpiClient
from cli.menu         import menu, get_auth
from cli.presentation import sauvegarder, voir_detail

console = Console()


def menu_inpi() -> None:
    store = CredentialsStore()
    auth  = get_auth(store, "inpi")
    store.close()
    if not auth:
        return

    client = InpiClient(auth=auth)

    while True:
        choix = menu("INPI RNE", [
            "Recherche fulltext",
            "Fiche par SIREN",
            "Dirigeants par SIREN",
        ])
        if choix == "0":
            break

        elif choix == "1":
            q    = Prompt.ask("Recherche")
            data = client.search(q, per_page=10)
            sauvegarder(data, "inpi", "search", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(
                title=f"INPI — {q!r}  (total {data.get('total', '?')})",
                show_lines=True,
            )
            t.add_column("SIREN",        style="cyan", width=12)
            t.add_column("Dénomination", style="white", width=50)
            for c in data.get("companies", []):
                t.add_row(c.get("siren") or "", c.get("denomination") or "")
            console.print(t)
            voir_detail(data)

        elif choix == "2":
            siren = Prompt.ask("SIREN")
            data  = client.get_by_siren(siren)
            sauvegarder(data, "inpi", "get_by_siren", {"siren": siren})
            if data:
                voir_detail(data)

        elif choix == "3":
            siren      = Prompt.ask("SIREN")
            dirigeants = client.get_dirigeants(siren)
            sauvegarder(
                {"dirigeants": dirigeants},
                "inpi",
                "dirigeants",
                {"siren": siren},
            )
            if dirigeants:
                t = Table(title=f"Dirigeants — {siren}", show_lines=True)
                t.add_column("Nom",     style="white", width=25)
                t.add_column("Prénoms", style="white", width=25)
                for d in dirigeants:
                    desc = d.get("descriptionPersonne", d)
                    t.add_row(
                        desc.get("nom") or "",
                        desc.get("prenoms") or "",
                    )
                console.print(t)