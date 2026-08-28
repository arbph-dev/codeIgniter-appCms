# cli/menus/insee.py
"""Menu INSEE Sirene — présentation CLI uniquement."""
from __future__ import annotations

from rich.console import Console
from rich.prompt  import Prompt
from rich.table   import Table

from services.auth import CredentialsStore
from services.api.insee_client import InseeClient, extract_unite_legale
from cli.menu         import menu, get_auth
from cli.presentation import sauvegarder, voir_detail

console = Console()


def menu_insee() -> None:
    store = CredentialsStore()
    auth  = get_auth(store, "insee")
    store.close()
    if not auth:
        return

    client = InseeClient(auth=auth)

    while True:
        choix = menu("INSEE Sirene", ["Recherche SIREN", "Recherche SIRET"])
        if choix == "0":
            break

        elif choix == "1":
            q    = Prompt.ask("Requête Lucene")
            data = client.search_siren(q, nombre=10)
            sauvegarder(data, "insee", "search_siren", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            total = data.get("header", {}).get("total", 0)
            t = Table(title=f"SIREN — {q!r}  (total {total})", show_lines=True)
            t.add_column("SIREN",        style="cyan",  width=12)
            t.add_column("Dénomination", style="white", width=45)
            t.add_column("NAF",                         width=8)
            t.add_column("Catégorie",                   width=8)
            for u in data.get("unitesLegales", []):
                r = extract_unite_legale(u)
                t.add_row(
                    r["siren"] or "",
                    r["denomination"] or "",
                    r["naf"] or "",
                    r["categorie"] or "",
                )
            console.print(t)
            voir_detail(data)

        elif choix == "2":
            q    = Prompt.ask("Requête Lucene")
            data = client.search_siret(q, nombre=10)
            sauvegarder(data, "insee", "search_siret", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"SIRET — {q!r}", show_lines=True)
            t.add_column("SIRET",        style="cyan", width=14)
            t.add_column("Dénomination", style="white", width=45)
            for et in data.get("etablissements", []):
                t.add_row(
                    et.get("siret") or "",
                    et.get("denominationUniteLegale") or "",
                )
            console.print(t)
            voir_detail(data)