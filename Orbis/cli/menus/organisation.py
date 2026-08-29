# cli/menus/organisation.py
"""
Menu Organisation — présentation CLI uniquement.

Client :
    services.api.organisation_client.OrganisationClient

Fonctions exposées :
    - Liste / recherche
    - Détail
    - Autocomplétion
    - Organisations orphelines
    - Création
    - Modification
    - Suppression

La pagination interactive sera ajoutée ultérieurement.
"""

from __future__ import annotations

from rich.console import Console
from rich.prompt import Prompt, IntPrompt
from rich.table import Table

from services.auth import CredentialsStore
from services.api.organisation_client import OrganisationClient

from cli.menu import menu, get_auth
from cli.presentation import sauvegarder, voir_detail


console = Console()


def menu_organisation() -> None:
    
    store = CredentialsStore()
    auth  = get_auth(store, "zealot")
    store.close()
    if not auth:
        return

    client = OrganisationClient(auth)

    while True:
        choix = menu(
            "Zealot — Organisations",
            [
                "Lister / rechercher",
                "Fiche organisation",
                "Autocomplétion",
                "Organisations orphelines",
                "Créer une organisation",
                "Modifier une organisation",
                "Supprimer une organisation",
            ],
        )

        if choix == "0":
            break

        # --------------------------------------------------------------
        # 1 — LISTE / RECHERCHE
        # --------------------------------------------------------------

        elif choix == "1":
            q = Prompt.ask(
                "Recherche (nom ou SIREN)",
                default="",
            )

            type_id = Prompt.ask(
                "Type organisation [vide = tous]",
                default="",
            )

            try:
                type_id_value = int(type_id) if type_id.strip() else None
            except ValueError:
                console.print("[red]Type organisation invalide.[/]")
                continue

            data = client.list(
                q=q or None,
                type_id=type_id_value,
                page=1,
                per_page=20,
            )

            sauvegarder(
                data,
                "zealot_org",
                "list",
                {
                    "q": q,
                    "type_id": type_id_value,
                    "page": 1,
                    "per_page": 20,
                },
            )

            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue

            items = data.get("data", [])
            pager = data.get("pager", {})

            if not items:
                console.print("[yellow]Aucune organisation trouvée.[/]")
                continue

            table = Table(
                title=(
                    "Zealot — Organisations "
                    f"(page {pager.get('currentPage', 1)})"
                ),
                show_lines=True,
            )

            table.add_column("ID", style="cyan", width=8)
            table.add_column("Nom", style="white", width=40)
            table.add_column("SIREN", width=12)
            table.add_column("Type", width=10)
            table.add_column("Slug", style="dim", width=30)

            for org in items:
                table.add_row(
                    str(org.get("id") or ""),
                    str(org.get("nom") or ""),
                    str(org.get("siren") or ""),
                    str(org.get("organisation_type_id") or ""),
                    str(org.get("slug") or ""),
                )

            console.print(table)

            console.print(
                f"[dim]Total : {pager.get('total', '?')}[/]"
            )

            voir_detail(data)

        # --------------------------------------------------------------
        # 2 — FICHE
        # --------------------------------------------------------------

        elif choix == "2":
            id_ = IntPrompt.ask("ID organisation")

            data = client.get_by_id(id_)

            sauvegarder(
                data,
                "zealot_org",
                "get_by_id",
                {"id": id_},
            )

            if data:
                voir_detail(data)
            else:
                console.print(
                    "[yellow]Organisation introuvable.[/]"
                )

        # --------------------------------------------------------------
        # 3 — AUTOCOMPLÉTION
        # --------------------------------------------------------------

        elif choix == "3":
            q = Prompt.ask("Recherche")

            if len(q.strip()) < 2:
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
                "zealot_org",
                "like",
                {
                    "q": q,
                    "len": len_,
                },
            )

            if not results:
                console.print("[yellow]Aucun résultat.[/]")
                continue

            table = Table(
                title="Zealot — Autocomplétion organisations",
                show_lines=True,
            )

            table.add_column("ID", style="cyan", width=8)
            table.add_column("Nom", width=45)
            table.add_column("SIREN", width=12)

            for org in results:
                table.add_row(
                    str(org.get("id") or ""),
                    str(org.get("nom") or ""),
                    str(org.get("siren") or ""),
                )

            console.print(table)

        # --------------------------------------------------------------
        # 4 — ORPHELINES
        # --------------------------------------------------------------

        elif choix == "4":
            max_results = IntPrompt.ask(
                "Nombre maximum",
                default=100,
            )

            console.print(
                "[dim]Recherche des organisations sans SIREN...[/]"
            )

            results = client.list_orphans(
                max_results=max_results,
            )

            sauvegarder(
                {"data": results},
                "zealot_org",
                "list_orphans",
                {"max_results": max_results},
            )

            if not results:
                console.print(
                    "[yellow]Aucune organisation orpheline trouvée.[/]"
                )
                continue

            table = Table(
                title=f"Zealot — Organisations orphelines ({len(results)})",
                show_lines=True,
            )

            table.add_column("ID", style="cyan", width=8)
            table.add_column("Nom", width=45)
            table.add_column("Slug", style="dim", width=30)

            for org in results:
                table.add_row(
                    str(org.get("id") or ""),
                    str(org.get("nom") or ""),
                    str(org.get("slug") or ""),
                )

            console.print(table)

        # --------------------------------------------------------------
        # 5 — CRÉER
        # --------------------------------------------------------------

        elif choix == "5":
            nom = Prompt.ask("Nom")

            if not nom.strip():
                console.print("[red]Le nom est obligatoire.[/]")
                continue

            siren = Prompt.ask(
                "SIREN",
                default="",
            )

            organisation_type_id = IntPrompt.ask(
                "Type organisation",
                default=1,
            )

            site_web = Prompt.ask(
                "Site web",
                default="",
            )

            email = Prompt.ask(
                "Email",
                default="",
            )

            telephone = Prompt.ask(
                "Téléphone",
                default="",
            )

            payload = {}

            if site_web:
                payload["site_web"] = site_web
            if email:
                payload["email"] = email
            if telephone:
                payload["telephone"] = telephone

            data = client.create(
                nom=nom,
                siren=siren or None,
                organisation_type_id=organisation_type_id,
                **payload,
            )

            sauvegarder(
                data,
                "zealot_org",
                "create",
                {
                    "nom": nom,
                    "siren": siren,
                    "organisation_type_id": organisation_type_id,
                },
            )

            if data:
                console.print(
                    "[green]Organisation créée.[/]"
                )
                voir_detail(data)
            else:
                console.print(
                    "[red]Échec de création.[/]"
                )

        # --------------------------------------------------------------
        # 6 — MODIFIER
        # --------------------------------------------------------------

        elif choix == "6":
            id_ = IntPrompt.ask("ID organisation")

            console.print(
                "[dim]Laisser vide pour ne pas modifier le champ.[/]"
            )

            kwargs = {}

            nom = Prompt.ask("Nom", default="")
            siren = Prompt.ask("SIREN", default="")
            date_creation = Prompt.ask(
                "Date création (YYYY-MM-DD)",
                default="",
            )
            site_web = Prompt.ask(
                "Site web",
                default="",
            )
            email = Prompt.ask(
                "Email",
                default="",
            )
            telephone = Prompt.ask(
                "Téléphone",
                default="",
            )

            if nom:
                kwargs["nom"] = nom
            if siren:
                kwargs["siren"] = siren
            if date_creation:
                kwargs["date_creation"] = date_creation
            if site_web:
                kwargs["site_web"] = site_web
            if email:
                kwargs["email"] = email
            if telephone:
                kwargs["telephone"] = telephone

            if not kwargs:
                console.print(
                    "[yellow]Aucune modification demandée.[/]"
                )
                continue

            data = client.update(
                id_,
                **kwargs,
            )

            sauvegarder(
                data,
                "zealot_org",
                "update",
                {
                    "id": id_,
                    **kwargs,
                },
            )

            if data:
                console.print(
                    "[green]Organisation mise à jour.[/]"
                )
                voir_detail(data)
            else:
                console.print(
                    "[red]Échec de mise à jour.[/]"
                )

        # --------------------------------------------------------------
        # 7 — SUPPRIMER
        # --------------------------------------------------------------

        elif choix == "7":
            id_ = IntPrompt.ask("ID organisation")

            confirmation = Prompt.ask(
                f"Confirmer la suppression de l'organisation {id_} ?",
                choices=["o", "n"],
                default="n",
            )

            if confirmation != "o":
                console.print("[dim]Annulé.[/]")
                continue

            success = client.delete(id_)

            sauvegarder(
                {"success": success},
                "zealot_org",
                "delete",
                {"id": id_},
            )

            if success:
                console.print(
                    "[green]Organisation supprimée (soft delete).[/]"
                )
            else:
                console.print(
                    "[red]Échec de suppression.[/]"
                )