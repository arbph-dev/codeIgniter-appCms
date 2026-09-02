# cli/menus/adresse.py

"""
Menu Adresse Zealot.

Clients :
    services.api.adresse_client.AdresseClient
    services.api.typevoie_client.TypeVoieClient
    services.api.codepostal_client.CodePostalClient

BAN n'est volontairement pas utilisé ici.


sauvegarder JSON : 
_menu_adresses
- LISTE     
- FICHE
- AUTOCOMPLÉTION
- CREATE    
- UPDATE    


"""

from __future__ import annotations

from rich.console import Console
from rich.prompt import Confirm, IntPrompt, Prompt
from rich.table import Table

from services.auth import CredentialsStore

from services.api.adresse_client import AdresseClient
from services.api.typevoie_client import TypeVoieClient
from services.api.codepostal_client import CodePostalClient

# BAN volontairement branché ici pour « Créer depuis BAN » uniquement
from services.api.BanClient import BanClient  # adapte le chemin si besoin
from acquisition.sources import AdresseBan
from services.api.adresse_from_ban import create_adresse_from_ban

from cli.menu import menu, get_auth
from cli.presentation import sauvegarder, voir_detail


console = Console()


# ============================================================================
# Adresse
# ============================================================================

def _menu_adresses(client: AdresseClient) -> None:

    while True:

        choix = menu(
            "Zealot — Adresses",
            [
                "Lister / rechercher",
                "Fiche adresse",
                "Autocomplétion",
                "Créer une adresse",
                "Créer depuis BAN",
                "Modifier une adresse",
                "Supprimer une adresse",
            ],
        )

        if choix == "0":
            return

        # ------------------------------------------------------------------
        # 1 — LISTE
        # ------------------------------------------------------------------

        if choix == "1":

            q = Prompt.ask(
                "Recherche",
                default="",
            ).strip()

            data = client.list(
                q=q or None,
                page=1,
                per_page=20,
            )
            # Sauvegarde après un appel API. Retourne le nom du fichier.
            sauvegarder(
                data,
                "zealot_adresse",
                "list",
                {
                    "q": q,
                    "page": 1,
                    "per_page": 20,
                },
            )

            if not data:
                console.print(
                    "[yellow]Aucun résultat.[/]"
                )
                continue

            items = data.get("data", [])
            pager = data.get("pager", {})

            if not items:
                console.print(
                    "[yellow]Aucune adresse trouvée.[/]"
                )
                continue

            table = Table(
                title="Zealot — Adresses",
                show_lines=True,
            )

            table.add_column(
                "ID",
                style="cyan",
                width=8,
            )
            table.add_column(
                "Adresse",
                width=50,
            )
            table.add_column(
                "CP",
                width=8,
            )
            table.add_column(
                "Commune",
                width=25,
            )

            for item in items:

                numero = item.get("voienumero") or ""
                type_voie = item.get("voietype_nom") or ""
                nom = item.get("voienom") or ""
                complement = item.get("complement") or ""

                adresse = " ".join(
                    part
                    for part in [
                        numero,
                        type_voie,
                        nom,
                    ]
                    if part
                )

                if complement:
                    adresse += f" {complement}"

                table.add_row(
                    str(item.get("id") or ""),
                    adresse,
                    str(item.get("cp_codepostal") or ""),
                    str(item.get("cp_commune") or ""),
                )

            console.print(table)

            console.print(
                f"[dim]Total : {pager.get('total', '?')}[/]"
            )

        # ------------------------------------------------------------------
        # 2 — FICHE
        # ------------------------------------------------------------------

        elif choix == "2":

            id_ = IntPrompt.ask("ID adresse")

            data = client.get_by_id(id_)

            sauvegarder(
                data,
                "zealot_adresse",
                "get_by_id",
                {"id": id_},
            )

            if data:
                voir_detail(data)
            else:
                console.print(
                    "[yellow]Adresse introuvable.[/]"
                )

        # ------------------------------------------------------------------
        # 3 — AUTOCOMPLÉTION
        # ------------------------------------------------------------------

        elif choix == "3":

            q = Prompt.ask("Recherche").strip()

            if len(q) < 2:
                console.print(
                    "[yellow]Saisir au moins 2 caractères.[/]"
                )
                continue

            len_ = IntPrompt.ask(
                "Nombre de résultats",
                default=10,
            )

            results = client.like(
                q,
                len_=len_,
            )

            sauvegarder(
                {"data": results},
                "zealot_adresse",
                "like",
                {
                    "q": q,
                    "len": len_,
                },
            )

            if not results:
                console.print(
                    "[yellow]Aucun résultat.[/]"
                )
                continue

            table = Table(
                title=f"Autocomplete Adresse — {q!r}",
                show_lines=True,
            )

            table.add_column(
                "ID",
                style="cyan",
            )
            table.add_column(
                "Adresse",
            )

            for item in results:

                table.add_row(
                    str(item.get("id") or ""),
                    str(
                        item.get("label")
                        or item.get("nom")
                        or item.get("voienom")
                        or item
                    ),
                )

            console.print(table)

        # ------------------------------------------------------------------
        # 4 — CREATE
        # ------------------------------------------------------------------

        elif choix == "4":

            voienom = Prompt.ask("Nom de voie")
            codepostal_id = IntPrompt.ask("ID code postal")

            voietype_id_raw = Prompt.ask(
                "ID type de voie",
                default="",
            )

            voietype_id = (
                int(voietype_id_raw)
                if voietype_id_raw.strip()
                else None
            )

            voienumero = Prompt.ask(
                "Numéro",
                default="",
            )

            voierpt = Prompt.ask(
                "Indice répétition [B/T/Q/C]",
                default="",
            )

            complement = Prompt.ask(
                "Complément",
                default="",
            )

            payload = {
                "voienom": voienom,
                "codepostal_id": codepostal_id,
                "voietype_id": voietype_id,
                "voienumero": voienumero or None,
                "voierpt": voierpt or None,
                "complement": complement or None,
            }

            data = client.create(**payload)

            sauvegarder(
                data,
                "zealot_adresse",
                "create",
                payload,
            )

            if data:
                console.print(
                    "[green]✓ Adresse créée.[/]"
                )
                voir_detail(data)
            else:
                console.print(
                    "[red]Échec de création.[/]"
                )
        # ------------------------------------------------------------------
        # 5 — CREATE DEPUIS BAN
        # ------------------------------------------------------------------
        elif choix == "5":
            _create_from_ban(client)
        
        # ------------------------------------------------------------------
        # 6 — UPDATE
        # ------------------------------------------------------------------

        elif choix == "6":

            id_ = IntPrompt.ask("ID adresse")

            data = client.get_by_id(id_)

            if not data:
                console.print(
                    "[yellow]Adresse introuvable.[/]"
                )
                continue

            console.print(
                "[dim]Laisser vide pour ne pas modifier le champ.[/]"
            )

            updates = {}

            voienom = Prompt.ask(
                "Nom de voie",
                default=str(
                    data.get("voienom") or ""
                ),
            )

            if voienom:
                updates["voienom"] = voienom

            numero = Prompt.ask(
                "Numéro",
                default=str(
                    data.get("voienumero") or ""
                ),
            )

            if numero:
                updates["voienumero"] = numero

            complement = Prompt.ask(
                "Complément",
                default=str(
                    data.get("complement") or ""
                ),
            )

            if complement:
                updates["complement"] = complement

            data = client.update(
                id_,
                **updates,
            )

            sauvegarder(
                data,
                "zealot_adresse",
                "update",
                {"id": id_, **updates},
            )

            if data:
                console.print( "[green]✓ Adresse modifiée.[/]")
                voir_detail(data)
            else:
                console.print( "[red]Échec de modification.[/]" )

        # ------------------------------------------------------------------
        # 7 — DELETE
        # ------------------------------------------------------------------

        elif choix == "7":

            id_ = IntPrompt.ask("ID adresse")

            if not Confirm.ask(
                f"Supprimer l'adresse #{id_} ?"
            ):
                continue

            success = client.delete(id_)

            if success:
                console.print(
                    "[green]✓ Adresse supprimée.[/]"
                )
            else:
                console.print(
                    "[red]Échec de suppression.[/]"
                )


# ============================================================================
# TypeVoie
# ============================================================================

def _menu_typevoie(client: TypeVoieClient) -> None:

    while True:

        choix = menu(
            "Zealot — Types de voie",
            [
                "Lister / rechercher",
                "Fiche type de voie",
                "Autocomplétion",
                "Créer",
                "Modifier",
                "Supprimer",
            ],
        )

        if choix == "0":
            return

        elif choix == "1":

            q = Prompt.ask(
                "Recherche",
                default="",
            ).strip()

            data = client.list(
                q=q or None,
                page=1,
                per_page=50,
            )

            if not data:
                console.print(
                    "[yellow]Aucun résultat.[/]"
                )
                continue

            items = data.get("data", [])

            table = Table(
                title="Zealot — Types de voie",
                show_lines=True,
            )

            table.add_column(
                "ID",
                style="cyan",
            )
            table.add_column("Nom")
            table.add_column("Status")

            for item in items:
                table.add_row(
                    str(item.get("id") or ""),
                    str(item.get("nom") or ""),
                    str(item.get("status") or ""),
                )

            console.print(table)

        elif choix == "2":

            id_ = IntPrompt.ask("ID type de voie")

            data = client.get_by_id(id_)

            if data:
                voir_detail(data)
            else:
                console.print(
                    "[yellow]Type de voie introuvable.[/]"
                )

        elif choix == "3":

            q = Prompt.ask("Recherche").strip()

            if len(q) < 2:
                console.print(
                    "[yellow]Saisir au moins 2 caractères.[/]"
                )
                continue

            results = client.like(q)

            if not results:
                console.print(
                    "[yellow]Aucun résultat.[/]"
                )
                continue

            table = Table(
                title=f"Types de voie — {q!r}",
            )

            table.add_column("ID")
            table.add_column("Nom")

            for item in results:
                table.add_row(
                    str(item.get("id") or ""),
                    str(item.get("nom") or ""),
                )

            console.print(table)

        elif choix == "4":

            id_ = IntPrompt.ask(
                "ID type de voie"
            )

            nom = Prompt.ask("Nom")

            data = client.create(
                id_=id_,
                nom=nom,
            )

            if data:
                console.print(
                    "[green]✓ Type de voie créé.[/]"
                )
                voir_detail(data)
            else:
                console.print(
                    "[red]Échec de création.[/]"
                )

        elif choix == "5":

            id_ = IntPrompt.ask(
                "ID type de voie"
            )

            nom = Prompt.ask("Nouveau nom")

            data = client.update(
                id_=id_,
                nom=nom,
            )

            if data:
                console.print(
                    "[green]✓ Type de voie modifié.[/]"
                )
                voir_detail(data)
            else:
                console.print(
                    "[red]Échec de modification.[/]"
                )

        elif choix == "6":

            id_ = IntPrompt.ask(
                "ID type de voie"
            )

            if not Confirm.ask(
                f"Supprimer le type de voie #{id_} ?"
            ):
                continue

            if client.delete(id_):
                console.print(
                    "[green]✓ Type de voie supprimé.[/]"
                )
            else:
                console.print(
                    "[red]Échec de suppression.[/]"
                )


# ============================================================================
# CodePostal
# ============================================================================

def _menu_codepostal(client: CodePostalClient) -> None:

    while True:

        choix = menu(
            "Zealot — Codes postaux",
            [
                "Rechercher",
                "Fiche par ID",
                "Autocomplétion",
                "Recherche par code postal",
                "Recherche par code INSEE",
            ],
        )

        if choix == "0":
            return

        elif choix == "1":

            q = Prompt.ask(
                "Code postal ou commune"
            ).strip()

            data = client.list(
                q=q,
                page=1,
                per_page=20,
            )

            if not data:
                console.print(
                    "[yellow]Aucun résultat.[/]"
                )
                continue

            items = data.get("data", [])

            table = Table(
                title=f"Codes postaux — {q!r}",
                show_lines=True,
            )

            table.add_column("ID")
            table.add_column("Code postal")
            table.add_column("Commune")
            table.add_column("INSEE")

            for item in items:
                table.add_row(
                    str(item.get("id") or ""),
                    str(item.get("codepostal") or ""),
                    str(item.get("commune") or ""),
                    str(item.get("codeinsee") or ""),
                )

            console.print(table)

        elif choix == "2":

            id_ = IntPrompt.ask(
                "ID code postal"
            )

            data = client.get_by_id(id_)

            if data:
                voir_detail(data)
            else:
                console.print(
                    "[yellow]Code postal introuvable.[/]"
                )

        elif choix == "3":

            q = Prompt.ask(
                "Recherche"
            ).strip()

            if len(q) < 2:
                console.print(
                    "[yellow]Saisir au moins 2 caractères.[/]"
                )
                continue

            results = client.like(q)

            if not results:
                console.print(
                    "[yellow]Aucun résultat.[/]"
                )
                continue

            table = Table(
                title=f"Autocomplete CodePostal — {q!r}",
            )

            table.add_column("ID")
            table.add_column("Code postal")
            table.add_column("Commune")

            for item in results:

                table.add_row(
                    str(item.get("id") or ""),
                    str(item.get("codepostal") or ""),
                    str(item.get("commune") or ""),
                )

            console.print(table)

        elif choix == "4":

            cp = Prompt.ask(
                "Code postal"
            ).strip()

            data = client.find_by_codepostal(cp)

            if not data:
                console.print(
                    "[yellow]Aucun résultat.[/]"
                )
                continue

            voir_detail(data)

        elif choix == "5":

            codeinsee = Prompt.ask(
                "Code INSEE"
            ).strip()

            data = client.find_by_codeinsee(
                codeinsee
            )

            if not data:
                console.print(
                    "[yellow]Aucun résultat.[/]"
                )
                continue

            voir_detail(data)


# ============================================================================
# _create_from_ban
# ============================================================================


def _create_from_ban(adresse_client: AdresseClient) -> None:
    """
    1. Auth BAN + Zealot déjà ok côté menu parent
    2. BanClient.search → choix user
    3. resolve CP / type voie → POST /adresse
    """
    store = CredentialsStore()
    # auth_ban = get_auth(store, "ban")  # ou la clé réelle CredentialsStore
    auth_z = get_auth(store, "zealot")
    store.close()
    #if not auth_ban or not auth_z:
    if not auth_z:
        return

    # Adapte la construction BanClient à ton projet
    # ban_client = BanClient(auth=auth_ban)  # ou BanClient() si sans auth
    ban_client = BanClient()   # API publique, pas d'auth
    cp_client = CodePostalClient(auth=auth_z)
    tv_client = TypeVoieClient(auth=auth_z)

    q = Prompt.ask("Adresse BAN (texte libre)").strip()
    if len(q) < 3:
        console.print("[yellow]Requête trop courte.[/]")
        return

    # Adapte selon BanClient.search : list[dict] ou list[AdresseBan]
    raw_results = ban_client.search(q, limit=8)
    if not raw_results:
        console.print("[yellow]Aucun résultat BAN.[/]")
        return

    bans: list[AdresseBan] = []
    for r in raw_results:
        if isinstance(r, AdresseBan):
            bans.append(r)
        else:
            bans.append(AdresseBan.from_parsed(r))

    table = Table(title=f"BAN — {q!r}", show_lines=True)
    table.add_column("#", style="dim", width=4)
    table.add_column("Score", width=6)
    table.add_column("Label", width=55)
    table.add_column("ban_id", width=20)
    for i, b in enumerate(bans, 1):
        table.add_row(
            str(i),
            f"{b.score:.2f}" if b.score is not None else "",
            b.label or "",
            b.ban_id or "",
        )
    console.print(table)

    choix = Prompt.ask("N° à importer", default="1")
    if not choix.isdigit() or not (1 <= int(choix) <= len(bans)):
        console.print("[yellow]Annulé.[/]")
        return

    ban = bans[int(choix) - 1]
    dry = Confirm.ask("Dry-run (afficher payload sans POST) ?", default=False)

    try:
        result = create_adresse_from_ban(
            ban,
            adresse_client,
            cp_client,
            tv_client,
            dry_run=dry,
        )
        
        console.print("[bold]payload[/]")
        for k, v in result["payload"].items():
            console.print(f"  {k}: {v!r}")

    except ValueError as e:
        console.print(f"[red]{e}[/]")
        return
    except Exception as e:
        console.print(f"[red]Erreur: {e}[/]")
        return

    console.print("[dim]payload:[/]")
    voir_detail(result["payload"])

    if dry:
        console.print("[yellow]Dry-run — rien créé.[/]")
        return

    created = result.get("created")
    sauvegarder(created, "zealot_adresse", "create_from_ban", result["payload"])
    if created:
        console.print(
            f"[green]✓ Adresse créée id={created.get('id')} "
            f"ban_id={result['payload'].get('ban_id')}[/]"
        )
        voir_detail(created)
    else:
        console.print("[red]Échec POST /adresse.[/]")







# ============================================================================
# Menu principal Adresse
# ============================================================================

def menu_adresse() -> None:
    """
    Point d'entrée appelé par main.py.
    """

    store = CredentialsStore()

    auth = get_auth(
        store,
        "zealot",
    )

    store.close()

    if not auth:
        return

    adresse_client = AdresseClient(auth)
    typevoie_client = TypeVoieClient(auth)
    codepostal_client = CodePostalClient(auth)

    while True:

        choix = menu(
            "Zealot — Adresses",
            [
                "Adresses",
                "Types de voie",
                "Codes postaux",
            ],
        )

        if choix == "0":
            break

        elif choix == "1":
            _menu_adresses(adresse_client)

        elif choix == "2":
            _menu_typevoie(typevoie_client)

        elif choix == "3":
            _menu_codepostal(codepostal_client)
