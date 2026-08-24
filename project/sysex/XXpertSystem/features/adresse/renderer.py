"""
features/adresse/renderer.py
Affichage Rich — pipeline interactif BAN → sélection → confirmation → CI.
"""
from rich.console import Console
from rich.table   import Table
from rich.panel   import Panel

from rich.markup import escape

console = Console()


def _e(value) -> str:
    """Échappe les crochets Rich dans une valeur variable.
    À utiliser pour toute donnée externe injectée dans du markup.
    """
    return escape(str(value)) if value is not None else ""

# Labels charnière pour affichage
_CHARNIERE_LABELS = {
    0: "",
    1: "du",
    2: "de la",
    3: "des",
    4: "de l'",
    5: "de",
    6: "au/aux",
    7: "le/la/les",
}


def init_adresse_renderer(bus) -> None:

    def on_loading(loading):
        if loading:
            console.print("[dim]⏳ Adresse...[/]")

    # ── Résultats BAN ────────────────────────────────────────────────────────

    def on_ban_loaded(results):
        if not results:
            console.print(Panel("Aucun résultat BAN.", style="yellow"))
            return

        table = Table(title="Résultats BAN", show_lines=True)
        table.add_column("N°",        style="cyan",  width=4)
        table.add_column("Score",     style="cyan",  width=6)
        table.add_column("Label",     style="white", width=42)
        table.add_column("Type",      style="dim",   width=13)
        table.add_column("Type voie", style="green", width=12)
        table.add_column("CP",        width=7)
        table.add_column("Ville",     width=16)

        for i, r in enumerate(results):
            table.add_row(
                str(i + 1),
                f"{r['score']:.2f}",
                r["label"],
                r["type"],
                r["type_voie"],
                r["postcode"],
                r["city"],
            )
        console.print(table)

        # Sélection interactive inline
        from rich.prompt import Prompt
        ch = Prompt.ask(
            "Sélectionner un résultat (0 = annuler)",
            default="1",
        )
        if ch == "0" or not ch.isdigit():
            return
        idx = int(ch) - 1
        if 0 <= idx < len(results):
            bus.publish("adresse:ban:select", {"index": idx})

    # ── Avertissements type de voie ──────────────────────────────────────────

    def on_pending_type(payload):
        console.print(Panel(
            f"[yellow]⚠ Type de voie créé en attente de validation[/]\n"
            f"  BAN    : [dim]{_e(payload.get('nom_ban'))}[/]\n"
            f"  CI id  : [cyan]{_e(payload.get('id'))}[/]  "
            f"nom : [white]{_e(payload.get('nom_ci'))}[/]\n"
            f"  [dim]→ GET /api/typevoie?status=pending pour valider[/]",
            border_style="yellow",
            title="[bold yellow]TypeVoie pending[/]",
        ))

    def on_approx_type(payload):
        console.print(
            f"[dim]ℹ  TypeVoie approché :[/] "
            f"[yellow]{_e(payload.get('nom_ban'))}[/] → "
            f"[green]{_e(payload.get('nom_ci'))}[/] "
            f"[dim](id {_e(payload.get('id'))})[/]"
        )

    # ── Payload prêt — confirmation ──────────────────────────────────────────

    def on_ready(payload):
        ci   = payload.get("payload", {})
        meta = payload.get("resolve_meta", {})
        # tv_label/status depuis resolve_meta (warnings mapper)
        tv_info = meta.get("voietype_id", {})
        tv_st   = tv_info.get("status", "validated")
        tv_lb   = tv_info.get("label",  "")
        # Si validated, pas de warning — on restitue depuis le payload
        if not tv_lb:
            tv_lb = str(ci.get("voietype_id", ""))

        charniere_label = _CHARNIERE_LABELS.get(ci.get("voiecharniere", 0), "")

        # Reconstitue la ligne 4 pour vérification visuelle
        ligne4_parts = filter(None, [
            str(ci.get("voienumero") or ""),
            str(ci.get("voierpt")    or ""),
            str(tv_lb                or ""),
            str(charniere_label      or ""),
            str(ci.get("voienom")    or ""),
        ])
        ligne4 = " ".join(p for p in ligne4_parts if p)

        # Tableau récap — toutes les valeurs passent par _e()
        table = Table(title="Adresse a enregistrer", show_lines=True)
        table.add_column("Champ",   style="cyan",  width=18)
        table.add_column("Valeur",  style="white", width=40)
        table.add_column("Statut",  style="dim",   width=12)

        rows = [
            ("Ligne 4",       ligne4,                                          ""),
            ("voienom",       ci.get("voienom",       ""),                     ""),
            ("voiecharniere", str(ci.get("voiecharniere", ""))
                              + (" (" + charniere_label + ")" if charniere_label else ""), ""),
            ("voienumero",    ci.get("voienumero",    ""),                     ""),
            ("voierpt",       ci.get("voierpt",       ""),                     ""),
            ("type_voie",     str(tv_lb) + " (id " + str(ci.get("voietype_id", "")) + ")",
                                                                               tv_st),
            ("codepostal_id", str(ci.get("codepostal_id", "")),                ""),
            ("acheminement",  ci.get("acheminement",  ""),                     ""),
            ("precision",     ci.get("precision",     ""),                     ""),
            ("lat / lon",     str(ci.get("latitude", "")) + " / "
                              + str(ci.get("longitude", "")),                  ""),
        ]
        for champ, valeur, statut in rows:
            # Statut : markup conditionnel uniquement si statut non vide
            if statut == "pending":
                statut_cell = "[yellow]pending[/yellow]"
            elif statut == "approx":
                statut_cell = "[dim]approx[/dim]"
            elif statut:
                statut_cell = _e(statut)
            else:
                statut_cell = ""
            table.add_row(_e(champ), _e(valeur), statut_cell)
        console.print(table)

        from rich.prompt import Confirm
        if Confirm.ask("[bold]Enregistrer cette adresse dans CI ?[/]", default=True):
            bus.publish("adresse:save", {"payload": ci})

    # ── Confirmation sauvegarde ──────────────────────────────────────────────

    def on_saved(item):
        console.print(Panel(
            f"[green]✓ Adresse enregistrée[/]  id=[cyan]{_e(item.get('id'))}[/]\n"
            f"  {_e(item.get('ligne4', item.get('voienom', '')))}  "
            f"[dim]{_e(item.get('acheminement', ''))}[/]",
            border_style="green",
        ))

    # ── Recherche CI ─────────────────────────────────────────────────────────

    def on_loaded(result):
        items = result.get("data", [])
        if not items:
            console.print(Panel("Aucune adresse trouvée.", style="yellow"))
            return
        table = Table(title="Adresses CI", show_lines=True)
        table.add_column("id",      style="cyan",  width=6)
        table.add_column("Ligne 4", style="white", width=44)
        table.add_column("CP",      width=7)
        table.add_column("Ville",   width=16)
        for it in items:
            table.add_row(
                str(it.get("id", "")),
                it.get("ligne4", it.get("voienom", "")),
                it.get("cp_codepostal", ""),
                it.get("cp_commune", ""),
            )
        console.print(table)

    def on_detail_loaded(item):
        console.print(Panel(
            f"[cyan]#{_e(item.get('id'))}[/]  "
            f"[white]{_e(item.get('ligne4', item.get('voienom','')))}[/]\n"
            f"[dim]{_e(item.get('cp_codepostal',''))} "
            f"{_e(item.get('cp_commune',''))}[/]",
            title="[bold]Adresse CI[/]",
            border_style="cyan",
        ))

    def on_error(msg):
        console.print(f"[red]Adresse erreur :[/] {_e(msg)}")

    # ── Abonnements ──────────────────────────────────────────────────────────

    bus.subscribe("adresse:loading",       on_loading)
    bus.subscribe("adresse:ban:loaded",    on_ban_loaded)
    bus.subscribe("adresse:pending:type",  on_pending_type)
    bus.subscribe("adresse:approx:type",   on_approx_type)
    bus.subscribe("adresse:ready",         on_ready)
    bus.subscribe("adresse:saved",         on_saved)
    bus.subscribe("adresse:loaded",        on_loaded)
    bus.subscribe("adresse:detail:loaded", on_detail_loaded)
    bus.subscribe("adresse:error",         on_error)
