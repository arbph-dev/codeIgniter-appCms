# cli/menus/etablissement.py
"""
Menu Établissement Zealot — tests + CRUD léger.
"""
from __future__ import annotations

from rich.console import Console
from rich.prompt import Confirm, IntPrompt, Prompt
from rich.table import Table

from services.auth import CredentialsStore
from services.api.etablissement_client import EtablissementClient
from services.api.adresse_client import AdresseClient
from services.api.codepostal_client import CodePostalClient
from services.api.typevoie_client import TypeVoieClient
# from services.api.ban_client import BanClient # TODO RENAME file BanClient to ban_client
from services.api.BanClient import BanClient 

from services.api.adresse_from_ban import create_adresse_from_ban
from acquisition.sources import AdresseBan

from cli.menu import menu, get_auth
from cli.presentation import sauvegarder, voir_detail

console = Console()


def _table_etabs(items: list[dict], title: str = "Établissements") -> None:
    t = Table(title=title, show_lines=True)
    t.add_column("ID", style="cyan", width=6)
    t.add_column("SIRET", width=16)
    t.add_column("Nom", width=28)
    t.add_column("Siège", width=5)
    t.add_column("Adr", width=6)
    t.add_column("Org", width=6)
    for e in items:
        t.add_row(
            str(e.get("id") or ""),
            str(e.get("siret") or ""),
            (e.get("nom") or e.get("organisation_nom") or "")[:28],
            "oui" if str(e.get("is_siege")) in ("1", "true", "True") else "",
            str(e.get("adresse_id") or "—"),
            str(e.get("organisation_id") or ""),
        )
    console.print(t)


def menu_etablissement() -> None:
    store = CredentialsStore()
    auth = get_auth(store, "zealot")
    store.close()
    if not auth:
        return

    client = EtablissementClient(auth=auth, save_samples=True)

    while True:
        choix = menu("Zealot — Établissements", [
            "Lister / rechercher",
            "Par organisation",
            "Fiche établissement",
            "Autocomplétion",
            "Lier adresse (BAN → siège/org)",
            "Ensure siège (POST org/…/etablissement)",
            "Modifier (champs libres)",
        ])
        if choix == "0":
            break

        # 1 — LISTE
        elif choix == "1":
            q = Prompt.ask("Recherche (siret/nom)", default="").strip()
            org_s = Prompt.ask("Filtre organisation_id", default="").strip()
            org = int(org_s) if org_s.isdigit() else None
            data = client.list(q=q or None, org=org, page=1, per_page=20)
            sauvegarder(data, "zealot_etab", "list", {"q": q, "org": org})
            items = (data or {}).get("data") or []
            if not items:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            _table_etabs(items)
            console.print(f"[dim]Total : {(data or {}).get('pager', {}).get('total', '?')}[/]")

        # 2 — BY ORG
        elif choix == "2":
            org_id = IntPrompt.ask("organisation_id", default=10)
            rows = client.by_organisation(org_id)
            sauvegarder({"data": rows}, "zealot_etab", "by_organisation", {"org": org_id})
            if not rows:
                console.print("[yellow]Aucun établissement pour cette org.[/]")
                continue
            _table_etabs(rows, title=f"Org #{org_id}")

        # 3 — FICHE
        elif choix == "3":
            id_ = IntPrompt.ask("ID établissement")
            data = client.get_by_id(id_)
            sauvegarder(data, "zealot_etab", "get_by_id", {"id": id_})
            if data:
                voir_detail(data)
            else:
                console.print("[yellow]Introuvable.[/]")

        # 4 — LIKE
        elif choix == "4":
            q = Prompt.ask("Recherche").strip()
            if len(q) < 2:
                console.print("[yellow]Au moins 2 caractères.[/]")
                continue
            results = client.like(q, len_=IntPrompt.ask("Nombre", default=10))
            sauvegarder({"data": results}, "zealot_etab", "like", {"q": q})
            if not results:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"Like — {q!r}")
            t.add_column("ID")
            t.add_column("SIRET")
            t.add_column("Nom")
            t.add_column("Org")
            for r in results:
                t.add_row(
                    str(r.get("id") or ""),
                    str(r.get("siret") or ""),
                    str(r.get("nom") or ""),
                    str(r.get("organisation_nom") or ""),
                )
            console.print(t)

        # 5 — BAN → adresse → update etablissement
        elif choix == "5":
            _lier_adresse_ban(client, auth)

        # 6 — ENSURE SIEGE
        elif choix == "6":
            org_id = IntPrompt.ask("organisation_id")
            siret = Prompt.ask("SIRET (14 chiffres)").strip()
            nom = Prompt.ask("Nom (optionnel)", default="").strip() or None
            if not Confirm.ask(f"ensure_siege org={org_id} siret={siret} ?"):
                continue
            data = client.ensure_siege(org_id, siret, nom=nom)
            sauvegarder(data, "zealot_etab", "ensure_siege", {"org": org_id, "siret": siret})
            if data:
                console.print("[green]✓ Siège créé / mis à jour.[/]")
                voir_detail(data)
            else:
                console.print("[red]Échec.[/]")

        # 7 — UPDATE libre
        elif choix == "7":
            id_ = IntPrompt.ask("ID établissement")
            fiche = client.get_by_id(id_)
            if not fiche:
                console.print("[yellow]Introuvable.[/]")
                continue
            console.print("[dim]Laisser vide = ne pas modifier[/]")
            updates = {}
            for key in ("nom", "telephone", "email", "adresse_id"):
                raw = Prompt.ask(key, default=str(fiche.get(key) or "")).strip()
                if raw == str(fiche.get(key) or ""):
                    continue
                if key == "adresse_id":
                    if raw.isdigit():
                        updates[key] = int(raw)
                else:
                    updates[key] = raw or None
            if not updates:
                console.print("[dim]Aucun changement.[/]")
                continue
            data = client.update(id_, **updates)
            sauvegarder(data, "zealot_etab", "update", {"id": id_, **updates})
            if data:
                console.print("[green]✓ Mis à jour.[/]")
                voir_detail(data)
            else:
                console.print("[red]Échec.[/]")


def _lier_adresse_ban(etab: EtablissementClient, auth) -> None:
    """BAN → POST /adresse → PUT etablissement.adresse_id."""
    id_ = IntPrompt.ask("ID établissement à lier")
    fiche = etab.get_by_id(id_)
    if not fiche:
        console.print("[yellow]Établissement introuvable.[/]")
        return

    console.print(
        f"[dim]siret={fiche.get('siret')}  "
        f"adresse_id actuel={fiche.get('adresse_id')}[/]"
    )
    q = Prompt.ask(
        "Adresse BAN (texte)",
        default="",
    ).strip()
    if len(q) < 5:
        console.print("[yellow]Requête trop courte.[/]")
        return

    ban_client = BanClient()  # adapte si auth nécessaire
    raw = ban_client.search(q, limit=8)
    if not raw:
        console.print("[yellow]Aucun hit BAN.[/]")
        return

    bans = []
    for r in raw:
        bans.append(r if hasattr(r, "ban_id") else AdresseBan.from_parsed(r))

    t = Table(title="BAN", show_lines=True)
    t.add_column("#", width=4)
    t.add_column("Score", width=6)
    t.add_column("Label", width=50)
    t.add_column("ban_id", width=20)
    for i, b in enumerate(bans, 1):
        t.add_row(
            str(i),
            f"{b.score:.2f}" if b.score is not None else "",
            b.label or "",
            b.ban_id or "",
        )
    console.print(t)

    n = Prompt.ask("N° à utiliser", default="1")
    if not n.isdigit() or not (1 <= int(n) <= len(bans)):
        return
    ban = bans[int(n) - 1]

    if not Confirm.ask("Créer adresse Zealot et lier ?", default=True):
        return

    addr = AdresseClient(auth=auth)
    cp = CodePostalClient(auth=auth)
    tv = TypeVoieClient(auth=auth)

    try:
        result = create_adresse_from_ban(ban, addr, cp, tv, dry_run=False)
    except Exception as e:
        console.print(f"[red]Adresse: {e}[/]")
        return

    created = result.get("created")
    if not created or not created.get("id"):
        console.print("[red]POST /adresse a échoué.[/]")
        voir_detail(result.get("payload") or {})
        return

    adresse_id = int(created["id"])
    console.print(f"[green]✓ Adresse #{adresse_id}[/]")

    updated = etab.update(id_, adresse_id=adresse_id)
    if updated:
        console.print(f"[green]✓ Établissement lié adresse_id={adresse_id}[/]")
        voir_detail(updated)
    else:
        console.print("[red]Update établissement échoué.[/]")
