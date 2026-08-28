# cli/menus/credentials.py
"""Menu Credentials CRUD — présentation CLI uniquement."""
from __future__ import annotations

from rich.console import Console
from rich.prompt  import Prompt, Confirm
from rich.table   import Table

from services.auth import CredentialsStore
from cli.menu      import menu

console = Console()


def menu_credentials() -> None:
    store = CredentialsStore()

    while True:
        console.print()
        services = store.list_services()
        if services:
            t = Table(
                "Service", "Login", "API Key", "Modifié le",
                title="Credentials enregistrés",
            )
            for svc in services:
                c = store.get(svc)
                t.add_row(
                    svc,
                    c.get("login") or "—",
                    ("***" + c["api_key"][-4:]) if c.get("api_key") else "—",
                    (c.get("updated_at") or "")[:16],
                )
            console.print(t)
        else:
            console.print("[dim]Aucun credential enregistré.[/]")

        choix = menu("Credentials", ["Ajouter", "Supprimer"])
        if choix == "0":
            break

        elif choix == "1":
            svc  = Prompt.ask(
                "Service  (insee · inpi · zealot · omdb · openlibrary)"
            )
            kind = Prompt.ask(
                "Type",
                choices=["1", "2"],
                prompt="[1] Bearer login/password  [2] API Key",
            )
            if kind == "1":
                login    = Prompt.ask("Login / email")
                password = Prompt.ask("Mot de passe", password=True)
                store.set(svc, login=login, password=password)
            else:
                api_key = Prompt.ask("API Key")
                store.set(svc, api_key=api_key)
            console.print(f"[green]✓ '{svc}' enregistré.[/]")

        elif choix == "2":
            svc = Prompt.ask("Service à supprimer")
            if Confirm.ask(f"Supprimer '{svc}' ?"):
                store.delete(svc)
                console.print(f"[yellow]'{svc}' supprimé.[/]")

    store.close()