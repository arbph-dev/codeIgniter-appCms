# cli/menus/entreprise.py
"""
Menu Entreprise — présentation CLI uniquement.

Client :
    services.api.entreprise_client.EntrepriseClient

Fonctions exposées :
    - Liste / recherche
    - Fiche entreprise
    - Recherche par SIREN
    - Autocomplétion
    - Création
    - Modification
    - Suppression

ATTENTION :
    POST /entreprise crée toujours une nouvelle organisation mère.

    Le menu ne propose donc PAS de fonction de rattachement à une
    organisation existante. Cette fonction sera ajoutée lorsque
    l'API exposera :

        POST /organisation/:id/entreprise

La pagination interactive sera ajoutée ultérieurement.
"""

from __future__ import annotations

from rich.console import Console
from rich.prompt import Prompt, IntPrompt
from rich.table import Table

from services.auth import CredentialsStore
from services.api.entreprise_client import EntrepriseClient

from cli.menu import menu, get_auth
from cli.presentation import sauvegarder, voir_detail


console = Console()


def menu_entreprise() -> None:

    store = CredentialsStore()
    auth  = get_auth(store, "zealot")
    store.close()
    if not auth:
        return

    client = EntrepriseClient(auth)

    while True:
        choix = menu(
            "Zealot — Entreprises",
            [
                "Lister / rechercher",
                "Fiche entreprise",
                "Rechercher par SIREN",
                "Autocomplétion",
                "Créer une entreprise",
                "Modifier une entreprise",
                "Supprimer une entreprise",
            ],
        )

        if choix == "0":
            break

        # --------------------------------------------------------------
        # 1 — LISTE / RECHERCHE
        # --------------------------------------------------------------

        elif choix == "1":
            q = Prompt.ask(
                "Recherche (nom, SIRET ou SIREN)",
                default="",
            )

            data = client.list(
                q=q or None,
                page=1,
                per_page=20,
            )

            sauvegarder(
                data,
                "zealot_ent",
                "list",
                {
                    "q": q,
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
                console.print(
                    "[yellow]Aucune entreprise trouvée.[/]"
                )
                continue

            table = Table(
                title=(
                    "Zealot — Entreprises "
                    f"(page {pager.get('currentPage', 1)})"
                ),
                show_lines=True,
            )

            table.add_column("ID", style="cyan", width=8)
            table.add_column("Nom", width=35)
            table.add_column("SIREN", width=12)
            table.add_column("SIRET", width=16)
            table.add_column("NAF", width=10)
            table.add_column("Forme", width=15)

            for ent in items:
                table.add_row(
                    str(ent.get("id") or ""),
                    str(ent.get("nom") or ""),
                    str(ent.get("siren") or ""),
                    str(ent.get("siret") or ""),
                    str(ent.get("codenaf_id") or ""),
                    str(ent.get("forme_juridique_id") or ""),
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
            id_ = IntPrompt.ask("ID entreprise")

            data = client.get_by_id(id_)

            sauvegarder(
                data,
                "zealot_ent",
                "get_by_id",
                {"id": id_},
            )

            if data:
                voir_detail(data)
            else:
                console.print(
                    "[yellow]Entreprise introuvable.[/]"
                )

        # --------------------------------------------------------------
        # 3 — SIREN
        # --------------------------------------------------------------

        elif choix == "3":
            siren = Prompt.ask("SIREN").strip()

            if not siren:
                console.print(
                    "[yellow]Saisir un SIREN.[/]"
                )
                continue

            data = client.find_by_siren(siren)

            sauvegarder(
                data,
                "zealot_ent",
                "find_by_siren",
                {"siren": siren},
            )

            if data:
                voir_detail(data)
            else:
                console.print(
                    "[yellow]Aucune entreprise trouvée pour ce SIREN.[/]"
                )

        # --------------------------------------------------------------
        # 4 — AUTOCOMPLÉTION
        # --------------------------------------------------------------

        elif choix == "4":
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
                "zealot_ent",
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
                title="Zealot — Autocomplétion entreprises",
                show_lines=True,
            )

            table.add_column("ID", style="cyan", width=8)
            table.add_column("Nom", width=50)

            for ent in results:
                table.add_row(
                    str(ent.get("id") or ""),
                    str(ent.get("nom") or ""),
                )

            console.print(table)

        # --------------------------------------------------------------
        # 5 — CRÉER
        # --------------------------------------------------------------

        elif choix == "5":
            console.print(
                "[yellow]ATTENTION :[/] "
                "cette opération crée une nouvelle organisation mère."
            )

            confirmation = Prompt.ask(
                "Continuer ?",
                choices=["o", "n"],
                default="n",
            )

            if confirmation != "o":
                console.print("[dim]Annulé.[/]")
                continue

            nom = Prompt.ask("Nom")

            if not nom.strip():
                console.print(
                    "[red]Le nom est obligatoire.[/]"
                )
                continue

            siren = Prompt.ask(
                "SIREN",
                default="",
            )

            siret = Prompt.ask(
                "SIRET",
                default="",
            )

            codenaf_id = Prompt.ask(
                "Code NAF",
                default="",
            )

            forme_juridique_id = Prompt.ask(
                "Forme juridique",
                default="",
            )

            capital_raw = Prompt.ask(
                "Capital",
                default="",
            )

            effectif_min_raw = Prompt.ask(
                "Effectif minimum",
                default="",
            )

            effectif_max_raw = Prompt.ask(
                "Effectif maximum",
                default="",
            )

            organisation_type_id = IntPrompt.ask(
                "Type organisation",
                default=1,
            )

            kwargs = {}

            if capital_raw:
                try:
                    kwargs["capital"] = float(capital_raw)
                except ValueError:
                    console.print(
                        "[red]Capital invalide.[/]"
                    )
                    continue

            if effectif_min_raw:
                try:
                    kwargs["effectif_min"] = int(effectif_min_raw)
                except ValueError:
                    console.print(
                        "[red]Effectif minimum invalide.[/]"
                    )
                    continue

            if effectif_max_raw:
                try:
                    kwargs["effectif_max"] = int(effectif_max_raw)
                except ValueError:
                    console.print(
                        "[red]Effectif maximum invalide.[/]"
                    )
                    continue

            data = client.create(
                nom=nom,
                siren=siren or None,
                siret=siret or None,
                codenaf_id=codenaf_id or None,
                forme_juridique_id=(
                    forme_juridique_id or None
                ),
                organisation_type_id=organisation_type_id,
                **kwargs,
            )

            sauvegarder(
                data,
                "zealot_ent",
                "create",
                {
                    "nom": nom,
                    "siren": siren,
                    "siret": siret,
                    "codenaf_id": codenaf_id,
                    "forme_juridique_id": forme_juridique_id,
                },
            )

            if data:
                console.print(
                    "[green]Entreprise créée.[]"
                )
                voir_detail(data)
            else:
                console.print(
                    "[red]Échec de création.[]"
                )

        # --------------------------------------------------------------
        # 6 — MODIFIER
        # --------------------------------------------------------------

        elif choix == "6":
            id_ = IntPrompt.ask("ID entreprise")

            console.print(
                "[dim]Laisser vide pour ne pas modifier.[/]"
            )

            kwargs = {}

            nom = Prompt.ask(
                "Nom",
                default="",
            )
            siren = Prompt.ask(
                "SIREN",
                default="",
            )
            siret = Prompt.ask(
                "SIRET",
                default="",
            )
            codenaf_id = Prompt.ask(
                "Code NAF",
                default="",
            )
            forme_juridique_id = Prompt.ask(
                "Forme juridique",
                default="",
            )
            capital = Prompt.ask(
                "Capital",
                default="",
            )
            effectif_min = Prompt.ask(
                "Effectif minimum",
                default="",
            )
            effectif_max = Prompt.ask(
                "Effectif maximum",
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
            if siret:
                kwargs["siret"] = siret
            if codenaf_id:
                kwargs["codenaf_id"] = codenaf_id
            if forme_juridique_id:
                kwargs["forme_juridique_id"] = (
                    forme_juridique_id
                )
            if capital:
                try:
                    kwargs["capital"] = float(capital)
                except ValueError:
                    console.print(
                        "[red]Capital invalide.[/]"
                    )
                    continue

            if effectif_min:
                try:
                    kwargs["effectif_min"] = int(effectif_min)
                except ValueError:
                    console.print(
                        "[red]Effectif minimum invalide.[/]"
                    )
                    continue

            if effectif_max:
                try:
                    kwargs["effectif_max"] = int(effectif_max)
                except ValueError:
                    console.print(
                        "[red]Effectif maximum invalide.[/]"
                    )
                    continue

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
                "zealot_ent",
                "update",
                {
                    "id": id_,
                    **kwargs,
                },
            )

            if data:
                console.print(
                    "[green]Entreprise mise à jour.[]"
                )
                voir_detail(data)
            else:
                console.print(
                    "[red]Échec de mise à jour.[]"
                )

        # --------------------------------------------------------------
        # 7 — SUPPRIMER
        # --------------------------------------------------------------

        elif choix == "7":
            id_ = IntPrompt.ask("ID entreprise")

            confirmation = Prompt.ask(
                f"Confirmer la suppression de l'entreprise {id_} ?",
                choices=["o", "n"],
                default="n",
            )

            if confirmation != "o":
                console.print("[dim]Annulé.[/]")
                continue

            success = client.delete(id_)

            sauvegarder(
                {"success": success},
                "zealot_ent",
                "delete",
                {"id": id_},
            )

            if success:
                console.print(
                    "[green]Entreprise supprimée "
                    "(soft delete).[/]"
                )
            else:
                console.print(
                    "[red]Échec de suppression.[/]"
                )