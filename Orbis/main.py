"""
Console Rich - Supervision des clients INPI / INSEE
Usage : python main.py


modification 2026-08-22 -M01

pour usage avec api du site
- ajout PersonneClient

"""
import os
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.prompt import Prompt, Confirm
from rich import print as rprint

from api.inpi_client import InpiClient
from api.insee_client import InseeClient, extract_unite_legale
# M01
from api.personne_client import PersonneClient



console = Console()

# ------------------------------------------------------------------
# Config (variables d'env ou saisie interactive)
# ------------------------------------------------------------------
def get_config() -> dict:
    return {
        "inpi_user": os.getenv("INPI_USER", ""),
        "inpi_pass": os.getenv("INPI_PASS", ""),
        "insee_key": os.getenv("INSEE_KEY", ""),
    }



def fmt_ci_date(val) -> str:
    """Normalise un champ date CI (objet ou string) en 'YYYY-MM-DD'."""
    if not val:
        return ''
    if isinstance(val, dict):
        return str(val.get("date", ""))[:10]
    return str(val)[:10]


# ------------------------------------------------------------------
# Affichage
# ------------------------------------------------------------------
def show_insee_results(units: list):
    table = Table(title="Résultats INSEE Sirene", show_lines=True)
    table.add_column("SIREN", style="cyan", width=12)
    table.add_column("Dénomination", style="white", width=40)
    table.add_column("NAF", width=8)
    table.add_column("Catégorie", width=8)
    table.add_column("État", width=6)
    table.add_column("Créé le", width=12)

    for u in units:
        e = extract_unite_legale(u)
        etat_color = "green" if e.get("etat") == "A" else "red"
        table.add_row(
            e.get("siren", ""),
            e.get("denomination", "") or "",
            e.get("naf", "") or "",
            e.get("categorie", "") or "",
            f"[{etat_color}]{e.get('etat', '')}[/{etat_color}]",
            e.get("date_creation", "") or "",
        )
    console.print(table)

# ------------------------------------------------------------------

def show_inpi_results(companies: list):
    table = Table(title="Résultats INPI RNE", show_lines=True)
    table.add_column("SIREN", style="cyan", width=12)
    table.add_column("Dénomination", style="white", width=40)
    table.add_column("Forme juridique", width=20)
    table.add_column("Siège", width=20)

    for c in companies:
        table.add_row(
            c.get("siren", ""),
            c.get("denomination", "") or c.get("nomCommercial", "") or "",
            c.get("formeJuridique", "") or "",
            c.get("codePostal", "") or "",
        )
    console.print(table)


# ------------------------------------------------------------------
# M01
def show_personne_results(personnes: list):
    table = Table(title="Résultats Personne", show_lines=True)
    table.add_column("ID",          style="cyan", width=6)
    table.add_column("Nom complet", style="white", width=35)
    table.add_column("Né(e) le",   width=12)
    table.add_column("Aliases",     width=8)
    table.add_column("Relations",   width=10)

    for p in personnes:
        # get_by_id retourne { personne, aliases, parcours, relations }
        # search/list retourne directement la personne
        pers     = p.get("personne") or p
        aliases  = p.get("aliases",  [])
        relations= p.get("relations",[])
        nais     = pers.get("date_naissance") or ""
        """
        if isinstance(nais, dict):
            nais = nais.get("date", "")[:10]
        table.add_row(
            str(pers.get("id", "")),
            pers.get("nom_complet", "") or "",
            str(nais)[:10],
            """
        table.add_row(
            str(pers.get("id", "")),
            pers.get("nom_complet", "") or "",
            fmt_ci_date(pers.get("date_naissance")),            
            str(len(aliases)),
            str(len(relations)),
        )
    console.print(table)


# ------------------------------------------------------------------
# Menus
# ------------------------------------------------------------------
def menu_insee(client: InseeClient):
    console.print(Panel("[bold cyan]INSEE Sirene[/bold cyan]"))
    console.print("1. Recherche libre (syntaxe Lucene)")
    console.print("2. Recherche PME par NAF")
    console.print("3. Fiche par SIREN")
    console.print("0. Retour")

    choice = Prompt.ask("Choix")

    if choice == "1":
        console.print("[dim]Syntaxe Lucene — champs sensibles à la casse :[/dim]")
        console.print("[dim]  siren:448451484[/dim]")
        console.print("[dim]  denominationUniteLegale:BOUYGUES[/dim]")
        console.print("[dim]  periode(activitePrincipaleUniteLegale:68.10Z) AND categorieEntreprise:PME[/dim]")
        q = Prompt.ask("Requête")
        nombre = int(Prompt.ask("Nombre de résultats", default="20"))
        data = client.search_siren(q=q, nombre=nombre)
        if data:
            units = data.get("unitesLegales", [])
            total = data.get("header", {}).get("total", 0)
            console.print(f"[green]{total} résultats au total, affichage de {len(units)}[/green]")
            show_insee_results(units)

    elif choice == "2":
        naf = Prompt.ask("Code NAF (ex: 68.10Z)")
        cat = Prompt.ask("Catégorie (PME / ETI / GE / laisser vide)", default="")
        q = f"periode(activitePrincipaleUniteLegale:{naf})"
        if cat:
            q += f" AND categorieEntreprise:{cat}"
        data = client.search_siren(q=q, nombre=20, date="2030-12-31")
        if data:
            units = data.get("unitesLegales", [])
            total = data.get("header", {}).get("total", 0)
            console.print(f"[green]{total} résultats[/green]")
            show_insee_results(units)

    elif choice == "3":
        siren = Prompt.ask("SIREN (9 chiffres)")
        fiche = client.get_siren(siren)
        if fiche:
            ul = fiche.get("uniteLegale", {})
            show_insee_results([ul])


def menu_inpi(client: InpiClient):
    console.print(Panel("[bold magenta]INPI RNE[/bold magenta]"))

    if not client.token:
        console.print("[yellow]Connexion INPI...[/yellow]")
        if not client.login():
            console.print("[red]Échec login INPI[/red]")
            return

    console.print("1. Recherche par nom / mot-clé")
    console.print("2. Fiche par SIREN")
    console.print("3. Dirigeants par SIREN")
    console.print("0. Retour")

    choice = Prompt.ask("Choix")

    if choice == "1":
        q = Prompt.ask("Recherche")
        data = client.search(q, per_page=10)
        if data:
            companies = data.get("companies", [])
            console.print(f"[green]{data.get('total', '?')} résultats[/green]")
            show_inpi_results(companies)

    elif choice == "2":
        siren = Prompt.ask("SIREN")
        fiche = client.get_by_siren(siren)
        if fiche:
            rprint(fiche)

    elif choice == "3":
        siren = Prompt.ask("SIREN")
        dirigeants = client.get_dirigeants(siren)
        if dirigeants:
            table = Table(title=f"Dirigeants — {siren}", show_lines=True)
            table.add_column("Nom", style="cyan", width=25)
            table.add_column("Prénom(s)", width=20)
            table.add_column("Rôle", width=10)
            table.add_column("Naissance", width=12)
            for d in dirigeants:
                desc = d.get("descriptionPersonne") or d.get("individu", {}).get("descriptionPersonne") or d
                nom     = desc.get("nom", "")
                prenoms = " ".join(desc.get("prenoms", [])) if isinstance(desc.get("prenoms"), list) else desc.get("prenoms", "")
                role    = desc.get("role", "") or ("EI" if d.get("_source") == "personnePhysique" else "")
                nais    = desc.get("dateDeNaissance", "")
                table.add_row(nom, prenoms, role, nais)
            console.print(table)
        elif dirigeants is not None:
            console.print("[yellow]Aucun dirigeant trouvé[/yellow]")

# M01
def menu_personne(client: PersonneClient):
    console.print(Panel("[bold green]API Personne — zealot.fr[/bold green]"))
    console.print("1. Recherche")
    console.print("2. Fiche complète par ID")
    console.print("3. Liste paginée")
    console.print("0. Retour")

    choice = Prompt.ask("Choix")

    if choice == "1":
        q = Prompt.ask("Recherche (nom, prénom…)")
        data = client.search(q)
        if data:
            personnes = data.get("data", [])
            meta      = data.get("meta") or data.get("pager") or {}
            console.print(f"[green]{meta.get('total', len(personnes))} résultat(s)[/green]")
            show_personne_results(personnes)

    elif choice == "2":
        pid = int(Prompt.ask("ID personne"))
        fiche = client.get_by_id(pid)
        if fiche:
            show_personne_results([fiche])
            # pers = fiche.get("personne") or fiche.get("data", {})
            pers = fiche.get("personne", {})
            console.print(f"\n[bold]Aliases ({len(fiche.get('aliases', []))})[/bold]")
            for a in fiche.get("aliases", []):
                console.print(f"  {a.get('alias')} [{a.get('alias_type')}]")
            console.print(f"\n[bold]Parcours ({len(fiche.get('parcours', []))})[/bold]")
            for p in fiche.get("parcours", []):
                #console.print(f"  {p.get('titre')} — {p.get('date_debut', '?')[:10] if p.get('date_debut') else '?'}")
                console.print(f"  {p.get('titre')} — {fmt_ci_date(p.get('date_debut')) or '?'}")
            console.print(f"\n[bold]Relations ({len(fiche.get('relations', []))})[/bold]")
            for r in fiche.get("relations", []):
                rel  = r.get("relation", r)
                rtype= r.get("relation_type", {})
                console.print(f"  {rtype.get('label','?')} → {rel.get('target_type')} #{rel.get('target_id')}")

    elif choice == "3":
        page     = int(Prompt.ask("Page", default="1"))
        per_page = int(Prompt.ask("Par page", default="20"))
        data = client.list(page=page, per_page=per_page)
        if data:
            show_personne_results(data.get("data", []))
# ------------------------------------------------------------------
# Main
# ------------------------------------------------------------------
def main():
    console.print(Panel(
        "[bold white]Entreprises FR — Console[/bold white]\n"
        "[dim]INPI RNE + INSEE Sirene[/dim]",
        style="blue"
    ))

    cfg = get_config()

    # Credentials manquants → saisie interactive
    if not cfg["inpi_user"]:
        #cfg["inpi_user"] = Prompt.ask("INPI username")
        cfg["inpi_user"] = "arbph@sfr.fr"
    if not cfg["inpi_pass"]:
        #cfg["inpi_pass"] = Prompt.ask("INPI password", password=True)
        cfg["inpi_pass"] = "motdepassemotT!12"
    if not cfg["insee_key"]:
        #cfg["insee_key"] = Prompt.ask("Clé API INSEE")
        cfg["insee_key"] = "9edc9ba7-199a-4c0f-9c9b-a7199a5c0f71"

    inpi = InpiClient(cfg["inpi_user"], cfg["inpi_pass"])
    insee = InseeClient(cfg["insee_key"])
    # M01

    
    # personne = PersonneClient("https://zealot.fr", "", "")
    personne = PersonneClient("https://zealot.fr", "arbph@sfr.fr", "A58Defg!glgl")

    """
    # essai login correct => 200 ok
    personne = PersonneClient("https://zealot.fr", "arbph@sfr.fr", "A58Defg!glgl")
        [PersonneClient] GET https://zealot.fr/api/personnes?q=gaulle&page=1&per_page=20 → 200

    # essai erreur login => 401 
    personne = PersonneClient("https://zealot.fr", "aeeerfbph@sdddffr.fr", "A58Defg!glgl")
        [PersonneClient] GET https://zealot.fr/api/personnes?q=gaulle&page=1&per_page=20 → 401
        [PersonneClient] 401 — tentative de refresh token...
        [PersonneClient] HTTP Error login : 401 Client Error: Unauthorized for url: https://zealot.fr/api/auth/login — {"error":"Email ou mot de passe invalide"}
        [PersonneClient] HTTP Error : 401 Client Error: Unauthorized for url: https://zealot.fr/api/personnes?q=gaulle&page=1&per_page=20 — {"message":"The access token is invalid."}

    """
    personne.login()  # décommenter quand l'auth est en place

    while True:
        console.print("\n[bold]Menu principal[/bold]")
        console.print("1. INSEE Sirene")
        console.print("2. INPI RNE")
        console.print("3. Personnes")
        console.print("0. Quitter")

        choice = Prompt.ask("Choix")

        if choice == "1":
            menu_insee(insee)
        elif choice == "2":
            menu_inpi(inpi)
        elif choice == "3":
            menu_personne(personne)            
        elif choice == "0":
            break


if __name__ == "__main__":
    main()
