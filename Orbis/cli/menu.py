# cli/menu.py
"""Helpers de menu et auth pour l'IHM console."""
from __future__ import annotations

from rich.console import Console
from rich.prompt  import Prompt

from services.auth import CredentialsStore, AuthProvider

console = Console()


def menu(titre: str, items: list[str]) -> str:
    """Affiche un menu numéroté et retourne le choix (str)."""
    console.print(f"\n[bold cyan]{titre}[/]")
    for i, label in enumerate(items, 1):
        console.print(f"  [cyan]{i}[/]  {label}")
    console.print(f"  [cyan]0[/]  Retour")
    return Prompt.ask(
        "Choix",
        choices=["0"] + [str(i) for i in range(1, len(items) + 1)],
    )


def get_auth(store: CredentialsStore, service: str) -> AuthProvider | None:
    """Récupère et connecte les credentials d'un service."""
    creds = store.get(service)
    if not creds:
        console.print(
            f"[yellow]Credentials '{service}' non configurés "
            f"(menu Credentials)[/]"
        )
        return None
    auth = store.build_and_login(service)
    if not auth:
        console.print(f"[red]Échec connexion '{service}'[/]")
        return None
    return auth