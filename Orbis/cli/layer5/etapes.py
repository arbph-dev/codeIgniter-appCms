# cli/layer5/etapes.py
"""
Étapes couche 5 — scan orphelines, recherche INSEE + scoring.
"""
from __future__ import annotations

import re
import unicodedata

from rich.console import Console
from rich.prompt import Prompt
from rich.table import Table
from rich.panel import Panel

from services.auth import CredentialsStore
from services.api.organisation_client import OrganisationClient
from services.api.entreprise_client import EntrepriseClient
from services.api.insee_client import InseeClient
from acquisition.sources import OrganisationZealot, EntrepriseInsee
from cli.menu import get_auth
from cli.layer5.working_memory import WorkingMemory, WMRecord
from cli.layer5.scoring import score_record

# 2026-08-31-004
from transformation.mapper import EntrepriseMapper
from persistence.db import get_engine, init_db, get_session  # adapte si noms différents
from persistence.repository import EntrepriseRepository
from persistence.siren_guard import ConflictError



console = Console()

TYPES_REQUIRING_ENTREPRISE = {1}  # 1 = Entreprise


# ── Helpers requête INSEE ───────────────────────────────────────────

def _normalize_insee_denom(nom: str) -> str:
    """Minuscules → ASCII approx → MAJUSCULES, apostrophes neutralisées."""
    s = (nom or "").strip()
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.upper()
    s = s.replace("'", " ").replace("’", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def build_denomination_query(nom: str) -> str:
    """
    Lucene Sirene conforme :
      periode(denominationUniteLegale:"AISE BREIZH")
      periode(denominationUniteLegale:GAZ)
    """
    denom = _normalize_insee_denom(nom)
    if not denom:
        return ""
    if " " in denom:
        safe = denom.replace('"', " ")
        return f'periode(denominationUniteLegale:"{safe}")'
    return f"periode(denominationUniteLegale:{denom})"


# ── Étape 1 — Scan orphelines ───────────────────────────────────────

def etape1_scan( org_client: OrganisationClient , ent_client: EntrepriseClient ) -> None:
    """
    [1] page / per_page
    [2] GET organisations type=1
    [3] index organisation_id déjà liés
    [4] orphelines
    [5] WorkingMemory + stats
    [6] affichage
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

    page = int(Prompt.ask("Page", default="1"))
    per_page = int(Prompt.ask("Taille page", default="20"))

    console.print("[dim]→ GET /organisation?type=1&page=…[/]")
    data = org_client.list(type_id=1, page=page, per_page=per_page)
    if not data:
        console.print("[yellow]Aucune réponse organisation.[/]")
        return

    orgs = data.get("data") or []
    pager = data.get("pager") or {}
    total_server = pager.get("total", len(orgs))
    console.print(
        f"[dim]  {len(orgs)} org(s) sur cette page "
        f"(total serveur ≈ {total_server})[/]"
    )

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

    orphans: list[WMRecord] = []
    for org in orgs:
        z = OrganisationZealot.from_api(org)
        if z.organisation_type_id not in TYPES_REQUIRING_ENTREPRISE:
            continue
        if z.id in linked_org_ids:
            continue
        orphans.append(WMRecord(
            organisation_id=z.id,
            nom=z.nom or "",
            siren=z.siren,
            type_id=z.organisation_type_id or 0,
            type_label=z.type_label,
            status="orphan",
            zealot=z,
        ))

    WorkingMemory.set_scan(
        orphans,
        scanned=len(orgs),
        page=page,
        per_page=per_page,
    )
    st = WorkingMemory.stats

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
        "[dim]Étape 1 OK. Ensuite : étape 2 — INSEE + scoring M/V/G.[/]"
    )


# ── Étape 2 — INSEE + scoring ───────────────────────────────────────

def etape2_insee() -> None:
    if not WorkingMemory.records:
        console.print("[yellow]WorkingMemory vide — lancer l'étape 1 d'abord.[/]")
        return

    store = CredentialsStore()
    auth = get_auth(store, "insee")
    store.close()
    if not auth:
        return

    insee = InseeClient(auth=auth)
    max_per_org = int(Prompt.ask("Max candidats INSEE par org", default="5"))
    _run_etape2(insee, max_per_org)


def _run_etape2(insee: InseeClient, max_per_org: int = 5) -> None:
    """
    [1] Parcourir WM
    [2] Requête Lucene periode(denominationUniteLegale:…)
    [3] search_siren
    [4] EntrepriseInsee.from_api
    [5] score_record → M/V/G + scored trié
    [6] Affichage
    """
    console.print(Panel(
        "[bold]Étape 2 — opérations[/]\n"
        "  1. Parcourir WorkingMemory\n"
        "  2. Requête Lucene periode(denominationUniteLegale:…)\n"
        "  3. search_siren (nombre limité)\n"
        "  4. EntrepriseInsee.from_api\n"
        "  5. score_record (M/V/G + ranked)\n"
        "  6. Affichage",
        title="Plan",
        style="dim",
    ))

    summary = Table(title="INSEE — candidats scorés", show_lines=True)
    summary.add_column("#", style="dim", width=4)
    summary.add_column("org_id", style="cyan", width=8)
    summary.add_column("Nom Zealot", width=28)
    summary.add_column("n", width=4)
    summary.add_column("M/V/G", width=14)
    summary.add_column("Top", width=42)

    for i, rec in enumerate(WorkingMemory.records, 1):
        nom = (rec.nom or "").strip()
        if not nom:
            console.print(f"[dim]  org#{rec.organisation_id} — nom vide, skip[/]")
            rec.insee_candidates = []
            rec.status = "searched"
            score_record(rec)
            summary.add_row(
                str(i), str(rec.organisation_id), "—", "0",
                f"M{rec.match_pct} V{rec.veracity_pct} G{rec.global_pct}",
                "",
            )
            continue

        denom = _normalize_insee_denom(nom)
        q = build_denomination_query(nom)
        if not q:
            rec.insee_candidates = []
            rec.status = "searched"
            score_record(rec)
            continue

        console.print(f"[dim]→ org#{rec.organisation_id}  q={q!r}[/]")
        data = insee.search_siren(q, nombre=max_per_org)

        candidates: list[EntrepriseInsee] = []
        if data:
            for u in data.get("unitesLegales") or []:
                try:
                    candidates.append(EntrepriseInsee.from_api(u))
                except Exception as e:
                    console.print(f"[yellow]  parse skip: {e}[/]")

        # Fallback : retirer articles / mots trop courts
        if not candidates and " " in denom:
            tokens = [
                t for t in denom.split()
                if len(t) > 2 and t not in {"LE", "LA", "LES", "DE", "DU", "DES"}
            ]
            if tokens:
                core = " ".join(tokens)
                q2 = f'periode(denominationUniteLegale:"{core}")'
                console.print(f"[dim]  fallback q={q2!r}[/]")
                data2 = insee.search_siren(q2, nombre=max_per_org)
                if data2:
                    for u in data2.get("unitesLegales") or []:
                        try:
                            candidates.append(EntrepriseInsee.from_api(u))
                        except Exception:
                            pass

        rec.insee_candidates = candidates
        rec.status = "searched"
        score_record(rec)

        top = ""
        if rec.scored:
            s0 = rec.scored[0]
            top = (
                f"{s0.score_pct}% {s0.insee.siren} "
                f"{(s0.insee.denomination or '')[:28]}"
            )
        summary.add_row(
            str(i),
            str(rec.organisation_id),
            nom[:28],
            str(len(rec.scored)),
            f"M{rec.match_pct} V{rec.veracity_pct} G{rec.global_pct}",
            top,
        )

    console.print(summary)
    console.print(
        "[dim]Étape 2 OK. Ensuite : étape 3 — qualification (choix / saisie SIREN).[/]"
    )

# --- Etape 3 ----------------------------------------

def etape3_qualify_and_save() -> None:
    """
    Opérations étape 3 :
      [1] Pour chaque record status=searched
      [2] Afficher candidats scorés + choix / saisie SIREN|SIRET
      [3] resolve → EntrepriseInsee
      [4] Mapper.reconcileZealot
      [5] Repository.create (ou update si SIREN existe)
      [6] status=saved, local_id
    """
    if not WorkingMemory.records:
        console.print("[yellow]WorkingMemory vide.[/]")
        return

    console.print(Panel(
        "[bold]Étape 3 — Qualification + intégration SIRENE[/]\n"
        "  1. Parcourir les records searched\n"
        "  2. Choix candidat ou saisie SIREN/SIRET\n"
        "  3. Résoudre EntrepriseInsee\n"
        "  4. reconcileZealot → EntrepriseModel\n"
        "  5. Repository.create/update\n"
        "  6. status=saved",
        title="Plan",
        style="dim",
    ))

    store = CredentialsStore()
    auth_insee = get_auth(store, "insee")
    store.close()
    if not auth_insee:
        return
    insee_client = InseeClient(auth=auth_insee)

    engine = get_engine()
    init_db(engine)
    session = get_session(engine)
    repo = EntrepriseRepository(session)
    user = {"user": "layer5", "role": "user"}

    try:
        for rec in WorkingMemory.records:
            if rec.status not in ("searched", "orphan"):
                continue

            insee = _prompt_choose_or_fetch(rec, insee_client)
            if insee is None:
                rec.status = "skipped"
                continue

            # OrganisationZealot minimal si pas déjà en WM
            org = rec.zealot
            if org is None:
                from acquisition.sources import OrganisationZealot
                org = OrganisationZealot(
                    id=rec.organisation_id,
                    nom=rec.nom,
                    siren=rec.siren,
                    organisation_type_id=rec.type_id,
                    type_label=rec.type_label,
                )

            try:
                model = EntrepriseMapper.reconcileZealot(org, insee)
            except ValueError as e:
                console.print(f"[red]Mapper: {e}[/]")
                rec.status = "skipped"
                continue

            # Intégration locale SIRENE
            try:
                existing = repo.get_by_siren(model.siren) if model.siren else None
                if existing is None:
                    saved = repo.create(model, user=user, source=model.source or "insee+zealot")
                else:
                    patch = {}
                    for col in (
                        "denomination", "sigle", "naf", "naf_naf25", "categorie",
                        "etat", "forme_juridique", "nic_siege", "siret_siege",
                        "tranche_effectif", "date_creation", "statut_diffusion",
                    ):
                        if getattr(existing, col) is None and getattr(model, col) is not None:
                            patch[col] = getattr(model, col)
                    if model.id_zealot and not existing.id_zealot:
                        patch["id_zealot"] = model.id_zealot
                    if patch:
                        saved = repo.update(model.siren, patch, user=user) or existing
                    else:
                        saved = existing
                    console.print(f"[dim]  SIREN {model.siren} déjà local — patch {list(patch.keys())}[/]")

                rec.local_id = saved.id
                rec.siren = model.siren
                rec.status = "saved"
                console.print(
                    f"[green]✓ org#{rec.organisation_id} → local_id={saved.id} "
                    f"siren={saved.siren}  {saved.denomination!r}[/]"
                )
            except ConflictError as e:
                console.print(f"[yellow]Conflit SIREN: {e}[/]")
                rec.status = "conflict"
            except Exception as e:
                console.print(f"[red]Persist: {e}[/]")
                rec.status = "error"
    finally:
        session.close()

    console.print("[dim]Étape 3 terminée. Push Zealot (attach) = étape 4.[/]")


def _prompt_choose_or_fetch(rec: WMRecord, insee_client: InseeClient):
    """Retourne EntrepriseInsee ou None (skip)."""
    console.print(Panel(
        f"[bold]org#{rec.organisation_id}[/]  {rec.nom!r}\n"
        f"M{rec.match_pct}%  V{rec.veracity_pct}%  G{rec.global_pct}%",
        title="Qualification",
    ))

    if rec.scored:
        t = Table(show_lines=True)
        t.add_column("#", width=4)
        t.add_column("%", width=4)
        t.add_column("SIREN", width=10)
        t.add_column("Dénomination", width=36)
        t.add_column("NAF", width=8)
        t.add_column("État", width=4)
        for i, s in enumerate(rec.scored, 1):
            t.add_row(
                str(i),
                str(s.score_pct),
                s.insee.siren or "",
                (s.insee.denomination or "")[:36],
                s.insee.naf or "",
                s.insee.etat or "",
            )
        console.print(t)
        choix = Prompt.ask(
            "N° candidat, SIREN/SIRET, ou [s]kip",
            default="1" if rec.scored else "s",
        )
    else:
        console.print("[yellow]Aucun candidat — saisie SIREN/SIRET requise.[/]")
        choix = Prompt.ask("SIREN (9) ou SIRET (14), ou [s]kip", default="s")

    if choix.lower() in ("s", "skip", ""):
        return None

    if choix.isdigit() and rec.scored and 1 <= int(choix) <= len(rec.scored):
        cs = rec.scored[int(choix) - 1]
        rec.chosen = cs
        return cs.insee

    digits = re.sub(r"\D", "", choix)
    if len(digits) == 14:
        siren = digits[:9]
    elif len(digits) == 9:
        siren = digits
    else:
        console.print("[red]Entrée invalide.[/]")
        return None

    console.print(f"[dim]→ GET /siren/{siren}[/]")
    data = insee_client.get_siren(siren)
    if not data:
        console.print("[yellow]INSEE: SIREN introuvable.[/]")
        return None

    # get_siren peut renvoyer {uniteLegale: {...}} ou directement l'unité
    unite = data.get("uniteLegale") or data
    try:
        return EntrepriseInsee.from_api(unite)
    except Exception as e:
        console.print(f"[red]Parse INSEE: {e}[/]")
        return None


# ── Affichage WM ────────────────────────────────────────────────────

def show_wm() -> None:
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
            f"siren={r.siren or '—'}  status={r.status}  "
            f"M{r.match_pct} V{r.veracity_pct} G{r.global_pct}"
        )
        for s in (r.scored or [])[:3]:
            console.print(
                f"      · {s.score_pct:3d}%  {s.insee.siren}  "
                f"{s.insee.denomination!r}  "
                f"naf={s.insee.naf or '—'}  etat={s.insee.etat or '—'}  "
                f"{s.detail}"
            )