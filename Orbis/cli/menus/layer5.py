# cli/menus/layer5.py
"""
Couche 5 — menu de présentation.

État de migration : les 4 étapes sont désormais des présentateurs purs
au-dessus de Layer5Service. cli/layer5/etapes.py n'est plus utilisé par
ce menu (suppression prévue en Phase 7, une fois la non-régression
confirmée en conditions réelles sur toutes les étapes).
"""
from __future__ import annotations

from rich.console import Console

from services.auth import CredentialsStore
from services.api.organisation_client import OrganisationClient
from services.api.entreprise_client import EntrepriseClient
from services.api.insee_client import InseeClient
from persistence.db import get_engine, init_db, get_session
from cli.menu import menu, get_auth
from cli.rich_ui_port import RichUIPort
from core.services.layer5_service import Layer5Service

# Legacy — plus rien à importer : les 4 étapes sont migrées.
from cli.layer5 import WorkingMemory, show_wm

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


def _do_etape2(service: Layer5Service, ui: RichUIPort) -> None:
    """Présentateur pur — reprend les mêmes prompts que l'ancien etape2_insee()."""
    if not WorkingMemory.records:
        ui.notify("WorkingMemory vide — lancer l'étape 1 d'abord.", level="warn")
        return

    # Auth INSEE demandée en lazy, uniquement quand l'étape 2 est réellement
    # utilisée — comme le faisait l'ancien etape2_insee().
    if service.insee_client is None:
        store = CredentialsStore()
        auth = get_auth(store, "insee")
        store.close()
        if not auth:
            return
        service.insee_client = InseeClient(auth=auth)

    max_per_org = ui.ask_int("Max candidats INSEE par org", default=5)
    enrich_siege = ui.ask_confirm(
        "Enrichir candidats via SIRET siège (CP/commune, +appels INSEE) ?",
        default=True,
    )
    max_enrich = min(3, max_per_org)
    if enrich_siege:
        max_enrich = ui.ask_int("Max enrichissements SIRET par org", default=max_enrich)

    loc_hint = ui.ask_text(
        "Filtre loc org (CP 5 chiffres ou dép. 2 chiffres, vide = aucun)",
        default="",
    ).strip()

    outcomes = service.search_and_score(
        max_per_org=max_per_org,
        enrich_siege=enrich_siege,
        max_enrich=max_enrich,
        loc_hint=loc_hint,
        on_progress=ui.progress,
    )

    if not outcomes:
        ui.notify("Aucun résultat à afficher pour cette recherche.", level="warn")
        return

    ui.show_table(
        title="INSEE — candidats scorés",
        columns=["organisation_id", "nom", "n", "M/V/G", "Top"],
        rows=[
            {
                "organisation_id": o.organisation_id,
                "nom": (o.nom or "")[:28],
                "n": o.n_candidates,
                "M/V/G": f"M{o.match_pct} V{o.veracity_pct} G{o.global_pct}",
                "Top": o.top_candidate_summary
                or (f"erreur: {o.error}" if o.error else ""),
            }
            for o in outcomes
        ],
    )
    ui.notify(
        "Étape 2 OK. Ensuite : étape 3 — qualification (choix / saisie SIREN).",
        level="info",
    )


def _do_etape3(service: Layer5Service, ui: RichUIPort) -> None:
    """
    Présentateur — boucle interactive.

    Contrairement aux étapes 1/2/5, la boucle reste ici côté présentateur
    (pas dans le service) : chaque itération nécessite une vraie décision
    utilisateur (choisir un candidat ou saisir un SIREN), ce n'est pas de
    la simple progression — voir roadmap Phase 4.
    """
    if not WorkingMemory.records:
        ui.notify("WorkingMemory vide.", level="warn")
        return

    if service.insee_client is None:
        store = CredentialsStore()
        auth = get_auth(store, "insee")
        store.close()
        if not auth:
            return
        service.insee_client = InseeClient(auth=auth)

    if service.session_factory is None:
        engine = get_engine()
        init_db(engine)
        service.session_factory = lambda: get_session(engine)

    user = {"user": "layer5", "role": "user"}

    with service.repository() as repo:
        for rec in WorkingMemory.records:
            if rec.status not in ("searched", "orphan"):
                continue

            ui.notify(
                f"org#{rec.organisation_id}  {rec.nom!r}  "
                f"M{rec.match_pct}%  V{rec.veracity_pct}%  G{rec.global_pct}%"
            )

            if rec.scored:
                ui.show_table(
                    title="Candidats",
                    columns=["#", "%", "SIREN", "Dénomination", "NAF", "État", "Localisation"],
                    rows=[
                        {
                            "#": i,
                            "%": s.score_pct,
                            "SIREN": s.insee.siren or "",
                            "Dénomination": (s.insee.denomination or "")[:36],
                            "NAF": s.insee.naf or "",
                            "État": s.insee.etat or "",
                            "Localisation": getattr(s.insee, "localisation", None) or "—",
                        }
                        for i, s in enumerate(rec.scored, 1)
                    ],
                )
                choice = ui.ask_text(
                    "N° candidat, SIREN/SIRET, ou [s]kip",
                    default="1",
                )
            else:
                ui.notify("Aucun candidat — saisie SIREN/SIRET requise.", level="warn")
                choice = ui.ask_text("SIREN (9) ou SIRET (14), ou [s]kip", default="s")

            insee = service.resolve_candidate(rec, choice, on_progress=ui.progress)
            if insee is None:
                rec.status = "skipped"
                continue

            outcome = service.persist_record(rec, insee, user, repo, on_progress=ui.progress)

            level = {
                "saved": "success",
                "conflict": "warn",
                "error": "error",
                "skipped": "warn",
            }.get(outcome.status, "info")
            ui.notify(
                f"org#{outcome.organisation_id} → {outcome.status}"
                + (f" ({outcome.detail})" if outcome.detail else ""),
                level=level,
            )

    ui.notify("Étape 3 terminée. Push Zealot (attach) = étape 4.", level="info")


def _do_etape4(service: Layer5Service, ui: RichUIPort) -> None:
    """Présentateur pur — pas de saisie, juste déclenchement + affichage."""
    if service.session_factory is None:
        engine = get_engine()
        init_db(engine)
        service.session_factory = lambda: get_session(engine)

    outcomes = service.push_to_zealot(on_progress=ui.progress)

    if not outcomes:
        ui.notify("Aucun record saved à pousser.", level="warn")
        return

    n_ok = sum(1 for o in outcomes if o.status == "pushed")
    ui.notify(f"Étape 4 terminée — {n_ok} attach réussi(s).", level="info")


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
            _do_etape2(service, ui)
        elif choix == "3":
            _do_etape3(service, ui)
        elif choix == "4":
            _do_etape4(service, ui)
        elif choix == "5":
            show_wm()
        elif choix == "6":
            WorkingMemory.clear()
            console.print("[dim]WorkingMemory vidée.[/]")
