# cli/menus/image.py
"""
Menu CLI Image — Zealot.

Périmètre actuel :
    - liste paginée
    - recherche
    - recherche rapide
    - fiche
    - fiche avec mots
    - visualisation navigateur
    - modification alt/status
    - suppression

Upload volontairement absent.
"""

from __future__ import annotations

from rich.console import Console
from rich.prompt import Confirm, IntPrompt, Prompt
from rich.table import Table

from cli.menu import get_auth, menu
from services.api.image_client import ImageClient
from services.auth import CredentialsStore
from cli.presentation import sauvegarder, voir_detail

console = Console()


# ---------------------------------------------------------------------------
# Affichage
# ---------------------------------------------------------------------------

def _print_image_table(images: list[dict]) -> None:
    """Affiche une liste d'images dans un tableau Rich."""

    if not images:
        console.print("[yellow]Aucune image.[/]")
        return

    table = Table(title="Images")

    table.add_column("ID", justify="right", style="cyan")
    table.add_column("Filename")
    table.add_column("Alt")
    table.add_column("Status")
    table.add_column("Dimensions", justify="right")
    table.add_column("Taille Ko", justify="right")

    for image in images:
        width = image.get("width")
        height = image.get("height")

        dimensions = (
            f"{width} × {height}"
            if width is not None and height is not None
            else ""
        )

        size_ko = image.get("size_ko")
        size = str(size_ko) if size_ko is not None else ""

        table.add_row(
            str(image.get("id", "")),
            str(image.get("filename", "")),
            str(image.get("alt") or ""),
            str(image.get("status") or ""),
            dimensions,
            size,
        )

    console.print(table)


def _print_image_detail(image: dict) -> None:
    """Affiche le détail d'une image."""

    if not image:
        console.print("[yellow]Image introuvable.[/]")
        return

    table = Table(title=f"Image #{image.get('id', '')}")

    table.add_column("Champ", style="cyan")
    table.add_column("Valeur")

    fields = (
        "id",
        "user_id",
        "filename",
        "alt",
        "status",
        "width",
        "height",
        "ratio",
        "extension",
        "size_ko",
        "path",
        "created_at",
        "updated_at",
    )

    for field in fields:
        if field not in image:
            continue

        value = image.get(field)

        if isinstance(value, (dict, list)):
            value = str(value)

        table.add_row(
            field,
            "" if value is None else str(value),
        )

    console.print(table)


# ---------------------------------------------------------------------------
# Actions
# ---------------------------------------------------------------------------

def _liste_images(client: ImageClient) -> None:
    q = Prompt.ask(
        "Recherche q",
        default="",
    ).strip()

    status = Prompt.ask(
        "Status",
        choices=["", "pending", "validated", "rejected"],
        default="",
        show_choices=True,
    )

    page = IntPrompt.ask(
        "Page",
        default=1,
    )

    per_page = IntPrompt.ask(
        "Images par page",
        default=10,
    )

    response = client.list(
        q=q or None,
        status=status or None,
        page=page,
        per_page=per_page,
    )

    if not response:
        console.print("[red]Erreur API.[/]")
        return

    sauvegarder(
        response,
        "zealot_image",
        "list",
        {
            "q": q or None,
            "status": status or None,
            "page": page,
            "per_page": per_page,
        },
    )

    images = response.get("data") or []

    _print_image_table(images)

    pager = response.get("pager")

    if pager:
        console.print(
            f"[dim]Pagination : {pager}[/]"
        )








def _recherche_images(client: ImageClient) -> None:
    q = Prompt.ask("Recherche")

    if len(q.strip()) < 2:
        console.print(
            "[yellow]La recherche nécessite au moins 2 caractères.[/]"
        )
        return

    limit = IntPrompt.ask(
        "Nombre maximum de résultats",
        default=10,
    )

    images = client.like(
        q.strip(),
        len_=limit,
    )

    _print_image_table(images)


def _fiche_image(client: ImageClient) -> None:
    id_ = IntPrompt.ask("ID de l'image")

    image = client.get_by_id(id_)

    if not image:
        console.print(
            f"[yellow]Image #{id_} introuvable.[/]"
        )
        return

    sauvegarder(
        image,
        "zealot_image",
        "get_by_id",
        {
            "id": id_,
        },
    )

    _print_image_detail(image)


def _fiche_image_avec_mots(client: ImageClient) -> None:
    """
    Teste le support natif de la relation Image -> Mots.

    On ne crée volontairement pas encore ImageMotClient.
    """

    id_ = IntPrompt.ask("ID de l'image")

    image = client.get_by_id(
        id_,
        include="mots",
    )

    if not image:
        console.print(
            f"[yellow]Image #{id_} introuvable.[/]"
        )
        return

    sauvegarder(
        image,
        "zealot_image",
        "get_by_id_include_mots",
        {
            "id": id_,
            "include": "mots",
        },
    )

    _print_image_detail(image)

    mots = image.get("mots")

    console.print()

    if mots is None:
        console.print(
            "[yellow]Aucune propriété 'mots' dans la réponse.[/]"
        )
        return

    if not mots:
        console.print("[dim]Aucun mot associé.[/]")
        return

    table = Table(title="Mots associés")

    table.add_column("ID", justify="right", style="cyan")
    table.add_column("Mot")

    for mot in mots:
        if isinstance(mot, dict):
            table.add_row(
                str(mot.get("mot_id", "")),
                str(mot.get("mot_lbl", "")),
            )
        else:
            table.add_row("", str(mot))

    console.print(table)


def _visualiser_image(client: ImageClient) -> None:
    id_ = IntPrompt.ask("ID de l'image")

    image = client.get_by_id(id_)

    if not image:
        console.print(
            f"[yellow]Image #{id_} introuvable.[/]"
        )
        return

    url = client.get_url(image)

    if not url:
        console.print(
            "[red]Impossible de construire l'URL de l'image.[/]"
        )
        return

    console.print(f"[dim]{url}[/]")

    if client.open_in_browser(image):
        console.print("[green]Image ouverte dans le navigateur.[/]")
    else:
        console.print("[red]Impossible d'ouvrir le navigateur.[/]")


def _modifier_image(client: ImageClient) -> None:
    id_ = IntPrompt.ask("ID de l'image")

    image = client.get_by_id(id_)

    if not image:
        console.print(
            f"[yellow]Image #{id_} introuvable.[/]"
        )
        return

    _print_image_detail(image)

    current_alt = image.get("alt") or ""
    current_status = image.get("status") or "pending"

    alt = Prompt.ask(
        "Alt",
        default=current_alt,
    )

    status = Prompt.ask(
        "Status",
        choices=["pending", "validated", "rejected"],
        default=current_status,
    )

    updated = client.update(
        id_,
        alt=alt,
        status=status,
    )

    if updated:
        console.print(
            f"[green]Image #{id_} mise à jour.[/]"
        )
        _print_image_detail(updated)
    else:
        console.print("[red]Échec de la mise à jour.[/]")


def _supprimer_image(client: ImageClient) -> None:
    id_ = IntPrompt.ask("ID de l'image")

    image = client.get_by_id(id_)

    if not image:
        console.print(
            f"[yellow]Image #{id_} introuvable.[/]"
        )
        return

    _print_image_detail(image)

    console.print(
        "[red]La suppression supprime également le fichier physique.[/]"
    )

    if not Confirm.ask(
        f"Supprimer définitivement l'image #{id_} ?",
        default=False,
    ):
        return

    response = client.delete(id_)

    if response is not None:
        console.print(
            f"[green]Image #{id_} supprimée.[/]"
        )
    else:
        console.print("[red]Échec de la suppression.[/]")


# ---------------------------------------------------------------------------
# Menu principal Image
# ---------------------------------------------------------------------------

#def menu_image(store: CredentialsStore) -> None:
def menu_image() -> None:
    """Point d'entrée du menu Image."""

    store = CredentialsStore()

    auth = get_auth(store, "zealot")

    if not auth:
        return

    client = ImageClient(auth=auth)

    while True:
        choice = menu(
            "Images — Zealot",
            [
                "Lister les images",
                "Rechercher une image",
                "Fiche image",
                "Fiche image + mots",
                "Visualiser l'image",
                "Modifier l'image",
                "Supprimer l'image",
            ],
        )

        if choice == "0":
            return

        if choice == "1":
            _liste_images(client)

        elif choice == "2":
            _recherche_images(client)

        elif choice == "3":
            _fiche_image(client)

        elif choice == "4":
            _fiche_image_avec_mots(client)

        elif choice == "5":
            _visualiser_image(client)

        elif choice == "6":
            _modifier_image(client)

        elif choice == "7":
            _supprimer_image(client)