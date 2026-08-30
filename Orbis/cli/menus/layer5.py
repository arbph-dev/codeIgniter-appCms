# cli/menus/layer5.py
"""
Couche 5 — qualification / enrichissement.

Méthode :
    pour chaque étape → lister les opérations en console
    → implémenter → commenter les lignes « plan » → visualiser → valider → suite

Étape 1 : scan organisations type Entreprise sans extension entreprise
          + WorkingMemory (liste à enrichir + stats)
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from rich.console import Console
from rich.prompt import Prompt
from rich.table import Table
from rich.panel import Panel

from services.auth import CredentialsStore
from services.api.organisation_client import OrganisationClient
from services.api.entreprise_client import EntrepriseClient
from cli.menu import menu, get_auth

console = Console()

# organisation_type_id qui exigent une ligne entreprises
TYPES_REQUIRING_ENTREPRISE = {1}  # 1 = Entreprise


# ── WorkingMemory (session CLI) ─────────────────────────────────────

@dataclass
class WMRecord:
    organisation_id: int
    nom: str
    siren: Optional[str]
    type_id: int
    type_label: Optional[str] = None
    status: str = "orphan"  # orphan | matched | saved | pushed


class WorkingMemory:
    records: list[WMRecord] = []
    stats: dict = {}

    @classmethod
    def clear(cls) -> None:
        cls.records = []
        cls.stats = {}

    @classmethod
    def set_scan(
        cls,
        records: list[WMRecord],
        scanned: int,
        page: int,
        per_page: int,
    ) -> None:
        cls.records = records
        cls.stats = {
            "scanned": scanned,
            "to_enrich": len(records),
            "page": page,
            "per_page": per_page,
            "ratio_pct": round(100.0 * len(records) / scanned, 1) if scanned else 0.0,
        }


# ── Menu ────────────────────────────────────────────────────────────

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
            "Afficher WorkingMemory",
            "Vider WorkingMemory",
        ])
        if choix == "0":
            break
        elif choix == "1":
            _etape1_scan(org_client, ent_client)
        elif choix == "2":
            _show_wm()
        elif choix == "3":
            WorkingMemory.clear()
            console.print("[dim]WorkingMemory vidée.[/]")


# ── Étape 1 ─────────────────────────────────────────────────────────

def _etape1_scan(
    org_client: OrganisationClient,
    ent_client: EntrepriseClient,
) -> None:
    """
    Opérations étape 1 (cocher mentalement / commenter après validation) :

    [1] Demander page + per_page
    [2] GET organisations filtrées type_id=1 (page courante)
    [3] Construire l'ensemble des organisation_id déjà liés à une entreprise
    [4] Filtrer : type exige entreprise ET org_id absent de l'ensemble
    [5] Remplir WorkingMemory + stats (n scannés, m à enrichir, %)
    [6] Afficher tableau + panel résumé
    """
    console.print(Panel(
        "[bold]Étape 1 — opérations[/]\n"
        "  1. Saisie page / per_page\n"
        "  2. Liste orgs type Entreprise (page)\n"
        "  3. Index organisation_id déjà en table entreprises\n"
        "  4. Orphelines = type requis sans extension\n"
        "  5. WorkingMemory + stats\n"
        "  6. Affichage",
        title="Plan",
        style="dim",
    ))

    # [1]
    page = int(Prompt.ask("Page", default="1"))
    per_page = int(Prompt.ask("Taille page", default="20"))

    # [2]
    console.print("[dim]→ GET /organisation?type=1&page=…[/]")
    data = org_client.list(type_id=1, page=page, per_page=per_page)
    if not data:
        console.print("[yellow]Aucune réponse organisation.[/]")
        return

    orgs = data.get("data") or []
    pager = data.get("pager") or {}
    total_server = pager.get("total", len(orgs))
    console.print(f"[dim]  {len(orgs)} org(s) sur cette page (total serveur ≈ {total_server})[/]")

    # [3]
    console.print("[dim]→ index entreprises (organisation_id)[/]")
    linked_org_ids: set[int] = set()
    ent_page = ent_client.list(page=1, per_page=100)
    ent_items = (ent_page or {}).get("data") or []
    for e in ent_items:
        if e.get("organisation_id") is not None:
            linked_org_ids.add(int(e["organisation_id"]))

    ent_total = (ent_page or {}).get("pager", {}).get("total", len(ent_items))
    if ent_total > 100:
        for e in ent_client.list_all(max_results=2000):
            if e.get("organisation_id") is not None:
                linked_org_ids.add(int(e["organisation_id"]))

    console.print(f"[dim]  {len(linked_org_ids)} organisation_id déjà liés[/]")

    # [4]
    orphans: list[WMRecord] = []
    for org in orgs:
        oid = int(org["id"])
        type_id = int(org.get("organisation_type_id") or 0)
        if type_id not in TYPES_REQUIRING_ENTREPRISE:
            continue
        if oid in linked_org_ids:
            continue
        orphans.append(WMRecord(
            organisation_id=oid,
            nom=org.get("nom") or "",
            siren=org.get("siren") or None,
            type_id=type_id,
            type_label=org.get("type_label"),
            status="orphan",
        ))

    # [5]
    WorkingMemory.set_scan(
        orphans,
        scanned=len(orgs),
        page=page,
        per_page=per_page,
    )
    st = WorkingMemory.stats

    # [6]
    console.print(Panel(
        f"[bold]Page {page}[/] — {st['scanned']} org(s) scannée(s)\n"
        f"[cyan]{st['to_enrich']}[/] à enrichir  "
        f"([yellow]{st['ratio_pct']} %[/] de la page)",
        title="WorkingMemory — résumé",
    ))

    if not orphans:
        console.print("[green]Aucune orpheline sur cette page.[/]")
        return

    t = Table(title="Orphelines (type Entreprise sans extension)", show_lines=True)
    t.add_column("#", style="dim", width=4)
    t.add_column("org_id", style="cyan", width=8)
    t.add_column("Nom", width=40)
    t.add_column("SIREN", width=12)
    t.add_column("Type", width=14)
    for i, r in enumerate(orphans, 1):
        t.add_row(
            str(i),
            str(r.organisation_id),
            r.nom,
            r.siren or "—",
            r.type_label or str(r.type_id),
        )
    console.print(t)
    console.print(
        "[dim]Étape 1 OK si le tableau et le % te conviennent. "
        "Ensuite : match INSEE / mapper / repository.[/]"
    )


def _show_wm() -> None:
    if not WorkingMemory.records:
        console.print("[dim]WorkingMemory vide.[/]")
        return
    st = WorkingMemory.stats
    console.print(
        f"scanned={st.get('scanned')}  to_enrich={st.get('to_enrich')}  "
        f"ratio={st.get('ratio_pct')} %  page={st.get('page')}"
    )
    for r in WorkingMemory.records:
        console.print(
            f"  org#{r.organisation_id}  {r.nom!r}  "
            f"siren={r.siren or '—'}  status={r.status}"
        )