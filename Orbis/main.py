"""
ORBIS — main3.py

Toute la logique d'authentification est déléguée à services/auth.
Les clients métier ne reçoivent qu'une session déjà configurée.

Ordre de démarrage :
    python main2.py               → menu principal
    python main2.py --init-creds  → saisie guidée des credentials


V3 ajout core/json_store.py pour logging json
    def menu_insee():
        ...
        if choix == "1" : # "siren"  
        ...    
            filename = save_response(data, source="insee", endpoint="siren", params={"q": q})
            console.print(f"[dim]Sauvegarde : {filename}[/]")  

V4 ajout Tree
    def menu_insee():
        ...
        if choix == "1" : # "siren"  
        ...    
            tree = afficher_json_recursive(data)
            console.print(tree)


    ajout extract_schema(....) depuis from core.json_store 
    → {"title": "str", "year": "int", "cast": ["str"]}

V5 repris services api
    services/api/BaseApiClient.py


"""
import sys
from rich.console       import Console
from rich.table         import Table
from rich.prompt        import Prompt, Confirm
from rich.panel         import Panel
from rich.tree          import Tree

from core.json_store    import save_response , extract_schema
from services.auth      import CredentialsStore, AuthProvider

console = Console()
# ===========================================================================
# Helpers data / presentation
# ===========================================================================
"""
try:
    data = json.loads(json_data)
    console = Console()
    tree = afficher_json_recursive(data)
    console.print(tree)
except json.JSONDecodeError:
    print("Erreur : Le format JSON est invalide.")
"""
def afficher_json_recursive(data, tree=None):
    # Initialisation de l'arbre au premier appel
    if tree is None:
        tree = Tree("📂 [bold blue]Root[/bold blue]")

    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                # Branche pour les objets ou listes imbriquées
                branch = tree.add(f"[bold cyan]{key}[/bold cyan]")
                afficher_json_recursive(value, branch)
            else:
                # Affichage des valeurs simples avec gestion des types spéciaux
                val_str = str(value)
                if value is None:
                    val_str = "[italic red]null[/italic red]"
                elif isinstance(value, bool):
                    val_str = f"[italic yellow]{value}[/italic yellow]"
                tree.add(f"[bold green]{key}[/bold green]: {val_str}")

    elif isinstance(data, list):
        for index, item in enumerate(data):
            if isinstance(item, (dict, list)):
                branch = tree.add(f"[bold magenta][{index}][/bold magenta]")
                afficher_json_recursive(item, branch)
            else:
                tree.add(f"[bold magenta][{index}][/bold magenta]: {item}")
    return tree

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
        """

        """
        console.print("\n[bold cyan]INSEE Sirene[/]")
        console.print("1. siren")
        console.print("2. siret")
        console.print("0. Retour")

        choix = Prompt.ask("Choix")  

        if choix == "0" : #retour
            break

        if choix == "1" : # "siren"
            
            q = Prompt.ask("Requête Lucene (siren/)")            
            
            data = client.search_siren(q, nombre=10)
            if data:
                total = data.get("header", {}).get("total", 0)
                console.print(f"Total : {total}")
                for u in data.get("unitesLegales", []):
                    e = extract_unite_legale(u)
                    console.print(f"  {e['siren']} — {e['denomination']} ({e['naf']}) [{e['categorie']}]")

                filename = save_response(data, source="insee", endpoint="siren", params={"q": q})
                console.print(f"[dim]Sauvegarde : {filename}[/]")

                # exploiter les données dnas un tableau
                # extract_unite_legale

                table = Table(title=f"INSEE Siren — {q!r}", show_lines=True)
                table.add_column("siren", style="cyan",  width=12)
                table.add_column("denomination", style="white", width=45)
                table.add_column("naf", width=8)
                table.add_column("categorie",  width=8)

                for u in data.get("unitesLegales", []):
                    r = extract_unite_legale(u)
                    table.add_row(
                        f"{r['siren']}",
                        r["denomination"],
                        r["naf"],
                        r["categorie"],
                    )
                
                console.print(table)

                tree = afficher_json_recursive(data)
                console.print(tree)

                console.print( extract_schema(data) )

            else:
                console.print("[yellow]Aucun resultat.[/]")
                continue

        elif choix == "2" :
            q = Prompt.ask("Requête Lucene (siret/)") 

            data = client.search_siret(q, nombre=10)
            if data:
                for et in data.get("etablissements", []):
                    console.print(f"  {et.get('siret')} — {et.get('denominationUniteLegale')}")
        
        else:
            console.print(f"Commande inconnue ")
            #break

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
