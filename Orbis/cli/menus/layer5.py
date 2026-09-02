# cli/menus/layer5.py
"""Couche 5 — menu uniquement."""
from __future__ import annotations

from rich.console import Console

from services.auth import CredentialsStore
from services.api.organisation_client import OrganisationClient
from services.api.entreprise_client import EntrepriseClient
from cli.menu import menu, get_auth

"""
from cli.layer5 import WorkingMemory, etape1_scan, etape2_insee, etape3_qualify_and_save, show_wm
from cli.layer5.etapes import show_wm

from cli.layer5.working_memory import WorkingMemory, WMRecord, CandidateScore
from cli.layer5.scoring import score_record, SCORE_MAX

from cli.layer5.etapes import etape1_scan, etape2_insee, etape3_qualify_and_save , show_wm
"""
# 2026-08-31-005
from cli.layer5 import (
    WorkingMemory,
    etape1_scan,
    etape2_insee,
    etape3_qualify_and_save,
    etape4_push_zealot,
    show_wm,
)

console = Console()


def menu_layer5() -> None:
    store = CredentialsStore()
    auth = get_auth(store, "zealot")
    store.close()
    if not auth:
        return

    org_client = OrganisationClient(auth=auth)
    ent_client = EntrepriseClient(auth=auth)

    while True:
        choix = menu("Couche 5", [
            "Étape 1 — Scan orphelines + WorkingMemory",
            "Étape 2 — Recherche INSEE + scoring M/V/G",
            "Étape 3 — Qualifier + intégrer SIRENE (local)", # 2026-08-31-004
            "Étape 4 — Push Zealot (attach)",# 2026-08-31-005
            "Afficher WorkingMemory",
            "Vider WorkingMemory",
        ])
        if choix == "0":
            break
        elif choix == "1":
            etape1_scan(org_client, ent_client)
        elif choix == "2":
            etape2_insee()
        elif choix == "3":
            etape3_qualify_and_save() # 2026-08-31-004 
        elif choix == "4":
            etape4_push_zealot(ent_client) # 2026-08-31-005        
        elif choix == "5":
            show_wm()
        elif choix == "6":            
            WorkingMemory.clear()
            console.print("[dim]WorkingMemory vidée.[/]")
