"""
ORBIS — main2.py

Toute la logique d'authentification est déléguée à services/auth.
Les clients métier ne reçoivent qu'une session déjà configurée.

Ordre de démarrage :
    python main2.py               → menu principal
    python main2.py --init-creds  → saisie guidée des credentials
"""
import sys
from rich.console import Console
from rich.table   import Table
from rich.prompt  import Prompt, Confirm
from rich.panel import Panel

from services.auth import CredentialsStore, AuthProvider

console = Console()


# ===========================================================================
# Helpers auth
# ===========================================================================

def _get_auth(store: CredentialsStore, service: str) -> AuthProvider | None:
    """
    Construit et connecte le provider pour `service`.
    Affiche un message clair si les credentials sont absents ou si le login échoue.
    """
    creds = store.get(service)
    if not creds:
        console.print(
            f"[yellow]Credentials '{service}' non configurés — lancez --init-creds[/]"
        )
        return None

    auth = store.build_and_login(service)
    if not auth:
        console.print(f"[red]Échec connexion '{service}'[/]")
        return None

    return auth


# ===========================================================================
# Sous-menus API
# ===========================================================================

def menu_insee():
    """Sous-menu INSEE Sirene."""
    try:
        from services.api.insee_client import InseeClient, extract_unite_legale
    except ImportError as e:
        console.print(f"[red]Import manquant : {e}[/]")
        return

    store = CredentialsStore()
    auth  = _get_auth(store, "insee")
    store.close()
    if not auth:
        return

    client = InseeClient(auth=auth)

    while True:
        console.rule("[bold cyan]INSEE Sirene[/]")
        choix = Prompt.ask(
            "Action",
            choices=["siren", "siret", "retour"],
            default="retour",
        )
        if choix == "retour":
            break

        q = Prompt.ask("Requête Lucene")

        if choix == "siren":
            data = client.search_siren(q, nombre=10)
            if data:
                total = data.get("header", {}).get("total", 0)
                console.print(f"Total : {total}")
                for u in data.get("unitesLegales", []):
                    e = extract_unite_legale(u)
                    console.print(f"  {e['siren']} — {e['denomination']} ({e['naf']}) [{e['categorie']}]")
        else:
            data = client.search_siret(q, nombre=10)
            if data:
                for et in data.get("etablissements", []):
                    console.print(f"  {et.get('siret')} — {et.get('denominationUniteLegale')}")


def menu_inpi():
    """Sous-menu INPI RNE."""
    try:
        from services.api.inpi_client import InpiClient
    except ImportError as e:
        console.print(f"[red]Import manquant : {e}[/]")
        return

    store = CredentialsStore()
    auth  = _get_auth(store, "inpi")
    store.close()
    if not auth:
        return

    client = InpiClient(auth=auth)

    while True:
        console.rule("[bold cyan]INPI RNE[/]")
        choix = Prompt.ask(
            "Action",
            choices=["search", "siren", "dirigeants", "retour"],
            default="retour",
        )
        if choix == "retour":
            break

        if choix == "search":
            q    = Prompt.ask("Recherche")
            data = client.search(q, per_page=10)
            if data:
                console.print(f"Total : {data.get('total', '?')}")
                for c in data.get("companies", [])[:10]:
                    console.print(f"  {c.get('siren')} — {c.get('denomination')}")

        elif choix in ("siren", "dirigeants"):
            siren = Prompt.ask("SIREN (9 chiffres)")
            if choix == "siren":
                data = client.get_by_siren(siren)
                if data:
                    console.print_json(data=data)
            else:
                dirigeants = client.get_dirigeants(siren)
                if dirigeants:
                    for d in dirigeants:
                        desc = d.get("descriptionPersonne", d)
                        console.print(f"  {desc.get('nom')} {desc.get('prenoms')}")


def menu_personne():
    """Sous-menu Personne (zealot.fr)."""
    try:
        from services.api.personne_client import PersonneClient
    except ImportError as e:
        console.print(f"[red]Import manquant : {e}[/]")
        return

    store = CredentialsStore()
    auth  = _get_auth(store, "zealot")
    store.close()
    if not auth:
        return

    client = PersonneClient(auth=auth)

    while True:
        console.rule("[bold cyan]Personnes — zealot.fr[/]")
        choix = Prompt.ask(
            "Action",
            choices=["search", "fiche", "retour"],
            default="retour",
        )
        if choix == "retour":
            break

        if choix == "search":
            q    = Prompt.ask("Nom")
            data = client.search(q)
            if data:
                for p in (data.get("data") or [])[:10]:
                    console.print(f"  #{p.get('id')} — {p.get('nom_complet')}")

        elif choix == "fiche":
            pid   = int(Prompt.ask("ID personne"))
            fiche = client.get_by_id(pid)
            if fiche:
                p = fiche.get("personne") or fiche
                console.print(f"  {p.get('nom_complet')}")
                console.print(f"  Aliases  : {len(fiche.get('aliases', []))}")
                console.print(f"  Parcours : {len(fiche.get('parcours', []))}")
                console.print(f"  Relations: {len(fiche.get('relations', []))}")


# ===========================================================================
# CRUD Credentials
# ===========================================================================

def menu_credentials():
    """Sous-menu CRUD credentials — stockage SQLite local."""
    store = CredentialsStore()

    while True:
        console.rule("[bold yellow]Credentials[/]")
        services = store.list_services()

        if services:
            t = Table("Service", "Login", "API Key", "Modifié le")
            for svc in services:
                c = store.get(svc)
                t.add_row(
                    svc,
                    c.get("login") or "—",
                    ("***" + c["api_key"][-4:]) if c.get("api_key") else "—",
                    (c.get("updated_at") or "")[:16],
                )
            console.print(t)
        else:
            console.print("[dim]Aucun credential enregistré.[/]")

        choix = Prompt.ask(
            "Action",
            choices=["add", "delete", "retour"],
            default="retour",
        )

        if choix == "retour":
            break

        elif choix == "add":
            svc  = Prompt.ask("Service (ex: insee, inpi, zealot, omdb)")
            kind = Prompt.ask("Type", choices=["bearer", "apikey"])

            if kind == "bearer":
                login    = Prompt.ask("Login / email")
                password = Prompt.ask("Mot de passe", password=True)
                store.set(svc, login=login, password=password)
            else:
                api_key = Prompt.ask("API Key")
                store.set(svc, api_key=api_key)

            console.print(f"[green]✓ '{svc}' enregistré.[/]")

        elif choix == "delete":
            svc = Prompt.ask("Service à supprimer")
            if Confirm.ask(f"Supprimer '{svc}' ?"):
                store.delete(svc)
                console.print(f"[yellow]'{svc}' supprimé.[/]")

    store.close()


# ===========================================================================
# Menu principal
# ===========================================================================

def main():
    # Mode init rapide en ligne de commande
    if "--init-creds" in sys.argv:
        menu_credentials()
        return

    console.print(Panel.fit(
        "[bold blue]ORBIS — V0.6[/bold blue]\n"
        "[dim]Qualification structurelle[/dim]",
        style="bold blue"
    ))

    while True:
        """
        console.rule("[bold blue]ORBIS[/]")
        choix = Prompt.ask(
            "Module",
            choices=["insee", "inpi", "personne", "credentials", "quitter"],
            default="quitter",
        )
        """

        console.print("\n[bold]Menu principal[/bold]")
        console.print("1. INSEE Sirene")
        console.print("2. INPI RNE")
        console.print("3. Personnes")
        console.print("4. credentials")
        console.print("0. Quitter")

        choix = Prompt.ask("Choix")        

        if choix == "0":
            break
        elif choix == "1":
            menu_insee()
        elif choix == "2":
            menu_inpi()
        elif choix == "3":
            menu_personne()
        elif choix == "4":
            menu_credentials()


if __name__ == "__main__":
    main()
