# cli/menus/layer5.py
"""
Couche 5 — menu de présentation.

État de migration :
    Étape 1 (scan)           -> Layer5Service.scan_orphans()  [présentateur pur]
    Étapes 2, 3, 4            -> encore déléguées à cli.layer5.etapes (legacy)

À chaque phase suivante de la roadmap, un bloc "legacy" ci-dessous est
remplacé par un appel service + présentateur, jusqu'à suppression totale
de cli/layer5/etapes.py (Phase 7).
"""
from __future__ import annotations

from rich.console import Console

from services.auth import CredentialsStore
from services.api.organisation_client import OrganisationClient
from services.api.entreprise_client import EntrepriseClient
from cli.menu import menu, get_auth
from cli.rich_ui_port import RichUIPort
from core.services.layer5_service import Layer5Service

# Legacy — étapes 2, 3, 4 pas encore migrées (roadmap Phase 3-5)
from cli.layer5 import (
    WorkingMemory,
    etape2_insee,
    etape3_qualify_and_save,
    etape4_push_zealot,
    show_wm,
)

console = Console()


def _do_etape1(service: Layer5Service, ui: RichUIPort) -> None:
    """Présentateur pur — aucune logique métier, uniquement saisie + affichage."""
    page = ui.ask_int("Page", default=1)
    per_page = ui.ask_int("Taille page", default=20)

    result = service.scan_orphans(page, per_page)

    ui.notify(
        f"Page {result.page} — {result.scanned} org(s) scannée(s) — "
        f"{result.to_enrich} à enrichir ({result.ratio_pct} %)"
    )

    if result.is_empty:
        ui.notify("Aucune orpheline sur cette page.", level="success")
        return

    ui.show_table(
        title="Orphelines (type Entreprise sans extension)",
        columns=["organisation_id", "nom", "siren", "type_label"],
        rows=[
            {
                "organisation_id": r.organisation_id,
                "nom": r.nom,
                "siren": r.siren or "—",
                "type_label": r.type_label or str(r.type_id),
            }
            for r in result.orphans
        ],
    )
    ui.notify(
        "Étape 1 OK. Ensuite : étape 2 — INSEE + scoring M/V/G.",
        level="info",
    )


def menu_layer5() -> None:
    store = CredentialsStore()
    auth = get_auth(store, "zealot")
    store.close()
    if not auth:
        return

    org_client = OrganisationClient(auth=auth)
    ent_client = EntrepriseClient(auth=auth)

    service = Layer5Service(org_client=org_client, ent_client=ent_client)
    ui = RichUIPort(console=console)

    while True:
        choix = menu("Couche 5", [
            "Étape 1 — Scan orphelines + WorkingMemory",
            "Étape 2 — Recherche INSEE + scoring M/V/G",
            "Étape 3 — Qualifier + intégrer SIRENE (local)",
            "Étape 4 — Push Zealot (attach)",
            "Afficher WorkingMemory",
            "Vider WorkingMemory",
        ])
        if choix == "0":
            break
        elif choix == "1":
            _do_etape1(service, ui)
        elif choix == "2":
            etape2_insee()  # legacy — Phase 3
        elif choix == "3":
            etape3_qualify_and_save()  # legacy — Phase 4
        elif choix == "4":
            etape4_push_zealot(ent_client)  # legacy — Phase 5
        elif choix == "5":
            show_wm()
        elif choix == "6":
            WorkingMemory.clear()
            console.print("[dim]WorkingMemory vidée.[/]")
