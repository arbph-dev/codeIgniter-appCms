# cli/menus/insee.py
"""Menu INSEE Sirene — présentation CLI + validation couche 4 (persistance)."""
from __future__ import annotations

from rich.console import Console
from rich.prompt  import Confirm, Prompt
from rich.table   import Table

from services.auth                 import CredentialsStore
from services.api.insee_client     import InseeClient, extract_unite_legale
from cli.menu                      import menu, get_auth
from cli.presentation              import sauvegarder, voir_detail

console = Console()


def menu_insee() -> None:
    store = CredentialsStore()
    auth  = get_auth(store, "insee")
    store.close()
    if not auth:
        return

    client = InseeClient(auth=auth)

    while True:
        choix = menu("INSEE Sirene", [
            "Recherche SIREN",
            "Recherche SIRET",
            "Conflits SIREN  [base locale]",
        ])
        if choix == "0":
            break

        elif choix == "1":
            q      = Prompt.ask("Requête Lucene")
            data   = client.search_siren(q, nombre=10)
            sauvegarder(data, "insee", "search_siren", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue

            total  = data.get("header", {}).get("total", 0)
            unites = data.get("unitesLegales", [])

            t = Table(title=f"SIREN — {q!r}  (total {total})", show_lines=True)
            t.add_column("SIREN",        style="cyan",  width=12)
            t.add_column("Dénomination", style="white", width=45)
            t.add_column("NAF",                         width=8)
            t.add_column("Catégorie",                   width=8)
            for u in unites:
                r = extract_unite_legale(u)
                t.add_row(r["siren"] or "", r["denomination"] or "",
                          r["naf"] or "", r["categorie"] or "")
            console.print(t)

            # ── Couche 4 : persistance ──────────────────────────────
            if unites and Confirm.ask("Sauvegarder en base locale ?", default=False):
                _persister_unites(unites, source="insee")

            voir_detail(data)

        elif choix == "2":
            q    = Prompt.ask("Requête Lucene")
            data = client.search_siret(q, nombre=10)
            sauvegarder(data, "insee", "search_siret", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"SIRET — {q!r}", show_lines=True)
            t.add_column("SIRET",        style="cyan",  width=14)
            t.add_column("Dénomination", style="white", width=45)
            for et in data.get("etablissements", []):
                t.add_row(et.get("siret") or "",
                          et.get("denominationUniteLegale") or "")
            console.print(t)
            voir_detail(data)

        elif choix == "3":
            _afficher_conflits()


# ── Helpers couche 4 ─────────────────────────────────────────────────────

def _persister_unites(unites: list, source: str = "insee") -> None:
    from persistence.db          import get_engine, init_db, get_session
    from persistence.repository  import EntrepriseRepository
    from persistence.siren_guard import ConflictError
    from transformation.mapper   import EntrepriseMapper
    from acquisition.sources     import EntrepriseInsee

    engine  = get_engine()
    init_db(engine)
    session = get_session(engine)
    repo    = EntrepriseRepository(session)
    user    = {"user": "cli-insee", "role": "user"}
    ok = ko = 0

    for raw in unites:
        src   = EntrepriseInsee.from_api(raw)
        model = EntrepriseMapper.mapInseeToModel(src)
        try:
            repo.create(model, user=user, source=source)
            console.print(f"  [green]✓[/] {src.siren} — {src.denomination}")
            ok += 1
        except ConflictError:
            console.print(f"  [yellow]⚠[/] {src.siren} déjà présent (journalisé)")
            ko += 1

    console.print(f"\n[dim]Persistés : {ok}  |  Conflits : {ko}[/]")
    session.close()


def _afficher_conflits() -> None:
    from persistence.db         import get_engine, init_db, get_session
    from persistence.repository import EntrepriseRepository

    engine  = get_engine()
    init_db(engine)
    session = get_session(engine)
    repo    = EntrepriseRepository(session)
    logs    = repo.list_conflicts(resolved=False, limit=20)

    if not logs:
        console.print("[dim]Aucun conflit en attente.[/]")
        session.close()
        return

    t = Table(title=f"Conflits SIREN non résolus ({len(logs)})", show_lines=True)
    t.add_column("ID",    style="cyan",  width=5)
    t.add_column("SIREN", style="white", width=12)
    t.add_column("Qui",                  width=22)
    t.add_column("Force",                width=6)
    t.add_column("Date",                 width=20)
    for log in logs:
        p = log.payload or {}
        t.add_row(
            str(log.id),
            p.get("what", {}).get("siren", "?"),
            p.get("who",  {}).get("user",  "?"),
            "✓" if p.get("how", {}).get("force") else "—",
            str(log.timestamp)[:19],
        )
    console.print(t)
    session.close()
