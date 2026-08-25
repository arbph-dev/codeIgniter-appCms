"""
ORBIS — main.py  V5

    V3  json_store — sauvegarde systématique après chaque appel API
    V4  Tree JSON + extract_schema
    V5  BaseApiClient, menus numériques uniformes, OMDB / OpenLibrary / BAN

Démarrage :
    python main.py               → menu principal
    python main.py --init-creds  → saisie credentials directe
"""
import sys
from rich.console import Console
from rich.table   import Table
from rich.prompt  import Prompt, Confirm
from rich.panel   import Panel
from rich.tree    import Tree

from core.json_store import save_response, extract_schema
from services.auth   import CredentialsStore, AuthProvider

console = Console()


# ===========================================================================
# Helpers présentation
# ===========================================================================

def _menu(titre: str, items: list[str]) -> str:
    """Affiche un menu numéroté et retourne le choix (str)."""
    console.print(f"\n[bold cyan]{titre}[/]")
    for i, label in enumerate(items, 1):
        console.print(f"  [cyan]{i}[/]  {label}")
    console.print(f"  [cyan]0[/]  Retour")
    return Prompt.ask("Choix", choices=["0"] + [str(i) for i in range(1, len(items) + 1)])


def _json_tree(data, label: str = "Root") -> Tree:
    """Construit un Rich Tree depuis un dict/list JSON."""
    tree = Tree(f"📂 [bold blue]{label}[/bold blue]")

    def _build(node, branch):
        if isinstance(node, dict):
            for k, v in node.items():
                if isinstance(v, (dict, list)):
                    _build(v, branch.add(f"[bold cyan]{k}[/bold cyan]"))
                else:
                    val = (
                        "[italic red]null[/italic red]"  if v is None
                        else f"[italic yellow]{v}[/italic yellow]" if isinstance(v, bool)
                        else str(v)
                    )
                    branch.add(f"[bold green]{k}[/bold green]: {val}")
        elif isinstance(node, list):
            for i, item in enumerate(node):
                if isinstance(item, (dict, list)):
                    _build(item, branch.add(f"[bold magenta][{i}][/bold magenta]"))
                else:
                    branch.add(f"[bold magenta][{i}][/bold magenta]: {item}")

    _build(data, tree)
    return tree


def _sauvegarder(data, source: str, endpoint: str, params: dict = None) -> str | None:
    """Sauvegarde systématique après chaque appel API. Retourne le nom du fichier."""
    if data is None:
        return None
    filename = save_response(data, source=source, endpoint=endpoint, params=params or {})
    console.print(f"[dim]💾 {filename}[/]")
    return filename


def _voir_detail(data):
    """Affichage tree / schéma sur demande (non systématique)."""
    if not data:
        return
    choix = _menu("Détail JSON", ["Tree complet", "Schéma de types"])
    if choix == "1":
        console.print(_json_tree(data))
    elif choix == "2":
        console.print(extract_schema(data))


# ===========================================================================
# Helper auth
# ===========================================================================

def _get_auth(store: CredentialsStore, service: str) -> AuthProvider | None:
    creds = store.get(service)
    if not creds:
        console.print(f"[yellow]Credentials '{service}' non configurés (choix 7 → Credentials)[/]")
        return None
    auth = store.build_and_login(service)
    if not auth:
        console.print(f"[red]Échec connexion '{service}'[/]")
        return None
    return auth


# ===========================================================================
# Menus API
# ===========================================================================

def menu_insee():
    from services.api.insee_client import InseeClient, extract_unite_legale

    store = CredentialsStore()
    auth  = _get_auth(store, "insee")
    store.close()
    if not auth:
        return
    client = InseeClient(auth=auth)

    while True:
        choix = _menu("INSEE Sirene", ["Recherche SIREN", "Recherche SIRET"])
        if choix == "0":
            break

        elif choix == "1":
            q    = Prompt.ask("Requête Lucene")
            data = client.search_siren(q, nombre=10)
            _sauvegarder(data, "insee", "search_siren", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            total = data.get("header", {}).get("total", 0)
            t = Table(title=f"SIREN — {q!r}  (total {total})", show_lines=True)
            t.add_column("SIREN",        style="cyan",  width=12)
            t.add_column("Dénomination", style="white", width=45)
            t.add_column("NAF",                         width=8)
            t.add_column("Catégorie",                   width=8)
            for u in data.get("unitesLegales", []):
                r = extract_unite_legale(u)
                t.add_row(r["siren"] or "", r["denomination"] or "", r["naf"] or "", r["categorie"] or "")
            console.print(t)
            _voir_detail(data)

        elif choix == "2":
            q    = Prompt.ask("Requête Lucene")
            data = client.search_siret(q, nombre=10)
            _sauvegarder(data, "insee", "search_siret", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"SIRET — {q!r}", show_lines=True)
            t.add_column("SIRET",        style="cyan", width=14)
            t.add_column("Dénomination", style="white", width=45)
            for et in data.get("etablissements", []):
                t.add_row(et.get("siret") or "", et.get("denominationUniteLegale") or "")
            console.print(t)
            _voir_detail(data)


def menu_inpi():
    from services.api.inpi_client import InpiClient

    store = CredentialsStore()
    auth  = _get_auth(store, "inpi")
    store.close()
    if not auth:
        return
    client = InpiClient(auth=auth)

    while True:
        choix = _menu("INPI RNE", ["Recherche fulltext", "Fiche par SIREN", "Dirigeants par SIREN"])
        if choix == "0":
            break

        elif choix == "1":
            q    = Prompt.ask("Recherche")
            data = client.search(q, per_page=10)
            _sauvegarder(data, "inpi", "search", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"INPI — {q!r}  (total {data.get('total','?')})", show_lines=True)
            t.add_column("SIREN",        style="cyan", width=12)
            t.add_column("Dénomination", style="white", width=50)
            for c in data.get("companies", []):
                t.add_row(c.get("siren") or "", c.get("denomination") or "")
            console.print(t)
            _voir_detail(data)

        elif choix == "2":
            siren = Prompt.ask("SIREN")
            data  = client.get_by_siren(siren)
            _sauvegarder(data, "inpi", "get_by_siren", {"siren": siren})
            if data:
                _voir_detail(data)

        elif choix == "3":
            siren      = Prompt.ask("SIREN")
            dirigeants = client.get_dirigeants(siren)
            _sauvegarder({"dirigeants": dirigeants}, "inpi", "dirigeants", {"siren": siren})
            if dirigeants:
                t = Table(title=f"Dirigeants — {siren}", show_lines=True)
                t.add_column("Nom",     style="white", width=25)
                t.add_column("Prénoms", style="white", width=25)
                for d in dirigeants:
                    desc = d.get("descriptionPersonne", d)
                    t.add_row(desc.get("nom") or "", desc.get("prenoms") or "")
                console.print(t)


def menu_personne():
    from services.api.personne_client import PersonneClient

    store = CredentialsStore()
    auth  = _get_auth(store, "zealot")
    store.close()
    if not auth:
        return
    client = PersonneClient(auth=auth)

    while True:
        choix = _menu("Personnes — zealot.fr", ["Recherche", "Fiche par ID"])
        if choix == "0":
            break

        elif choix == "1":
            q    = Prompt.ask("Nom")
            data = client.search(q)
            _sauvegarder(data, "zealot", "search_personne", {"q": q})
            if not data:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"Personnes — {q!r}", show_lines=True)
            t.add_column("ID",         style="cyan", width=6)
            t.add_column("Nom complet", style="white", width=40)
            for p in (data.get("data") or []):
                t.add_row(str(p.get("id") or ""), p.get("nom_complet") or "")
            console.print(t)
            _voir_detail(data)

        elif choix == "2":
            pid   = Prompt.ask("ID personne")
            fiche = client.get_by_id(int(pid))
            _sauvegarder(fiche, "zealot", "get_personne", {"id": pid})
            if fiche:
                p = fiche.get("personne") or fiche
                console.print(Panel(
                    f"[white]{p.get('nom_complet')}[/]\n"
                    f"Aliases  : {len(fiche.get('aliases',  []))}\n"
                    f"Parcours : {len(fiche.get('parcours', []))}\n"
                    f"Relations: {len(fiche.get('relations',[]))}",
                    title=f"Personne #{pid}"
                ))
                _voir_detail(fiche)


def menu_omdb():
    from services.api.OmdbClient import OmdbClient

    store = CredentialsStore()
    creds = store.get("omdb")
    if not creds or not creds.get("api_key"):
        key = Prompt.ask("[yellow]Clé OMDB absente — entrez-la maintenant[/]")
        store.set("omdb", api_key=key)
    auth   = store.build_auth("omdb")    # ApiKeyAuth — pas de login réseau
    store.close()
    client = OmdbClient(auth=auth)

    while True:
        choix = _menu("OMDB Films", ["Recherche par titre", "Fiche par IMDb ID"])
        if choix == "0":
            break

        elif choix == "1":
            titre   = Prompt.ask("Titre")
            results = client.search(titre)
            _sauvegarder(results, "omdb", "search", {"title": titre})
            movies  = (results or {}).get("Search", [])
            if not movies:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"OMDB — {titre!r}", show_lines=True)
            t.add_column("N°",       style="cyan", width=4)
            t.add_column("Titre",    style="white", width=40)
            t.add_column("Année",               width=6)
            t.add_column("Type",                width=10)
            t.add_column("IMDb ID",  style="dim", width=12)
            for i, m in enumerate(movies, 1):
                t.add_row(str(i), m.get("Title",""), m.get("Year",""), m.get("Type",""), m.get("imdbID",""))
            console.print(t)

            n = Prompt.ask("N° pour la fiche complète (0 = annuler)", default="0")
            if n.isdigit() and 1 <= int(n) <= len(movies):
                imdb_id = movies[int(n) - 1]["imdbID"]
                movie   = client.get_movie(imdb_id)
                _sauvegarder(movie, "omdb", "get_movie", {"imdb_id": imdb_id})
                if movie:
                    console.print(Panel(
                        f"[white]{movie.get('Title')}[/] ({movie.get('Year')})\n"
                        f"Réalisateur : {movie.get('Director')}\n"
                        f"Acteurs     : {movie.get('Actors')}\n"
                        f"IMDb        : {movie.get('imdbRating')} ★",
                        title=imdb_id
                    ))
                    _voir_detail(movie)

        elif choix == "2":
            imdb_id = Prompt.ask("IMDb ID (ex: tt1375666)")
            movie   = client.get_movie(imdb_id)
            _sauvegarder(movie, "omdb", "get_movie", {"imdb_id": imdb_id})
            if movie:
                console.print(Panel(
                    f"[white]{movie.get('Title')}[/] ({movie.get('Year')})\n"
                    f"Réalisateur : {movie.get('Director')}\n"
                    f"IMDb        : {movie.get('imdbRating')} ★",
                    title=imdb_id
                ))
                _voir_detail(movie)


def menu_openlibrary():
    from services.api.OpenLibraryClient import OpenLibraryClient

    client = OpenLibraryClient()

    while True:
        choix = _menu("OpenLibrary", ["Titre", "Auteur", "Sujet", "ISBN"])
        if choix == "0":
            break

        mode_map = {"1": ("search_title",   "title"),
                    "2": ("search_author",   "author"),
                    "3": ("search_subject",  "subject")}

        if choix in mode_map:
            method_name, param_key = mode_map[choix]
            q    = Prompt.ask(param_key.capitalize())
            data = getattr(client, method_name)(q)
            _sauvegarder(data, "openlibrary", method_name, {param_key: q})
            docs = (data or {}).get("docs", [])
            if not docs:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"OpenLibrary — {q!r}  ({len(docs)} résultats)", show_lines=True)
            t.add_column("Titre",   style="white", width=45)
            t.add_column("Auteur",  style="cyan",  width=25)
            t.add_column("Année",               width=6)
            t.add_column("ISBN",    style="dim", width=14)
            for doc in docs[:10]:
                b = OpenLibraryClient.extract_book(doc)
                t.add_row(b["title"] or "", b["author"] or "", str(b["year"] or ""), b["isbn"] or "")
            console.print(t)
            _voir_detail(data)

        elif choix == "4":
            isbn = Prompt.ask("ISBN")
            data = client.by_isbn(isbn)
            _sauvegarder(data, "openlibrary", "by_isbn", {"isbn": isbn})
            if data:
                _voir_detail(data)


def menu_ban():
    from services.api.BanClient import BanClient, extract_type_from_street, normalize_type_label

    client = BanClient()

    while True:
        choix = _menu("Adresses BAN", [
            "Géocodage adresse libre",
            "Géocodage inverse (lat / lon)",
            "Extraction type de voie  [local]",
        ])
        if choix == "0":
            break

        elif choix == "1":
            q       = Prompt.ask("Adresse")
            results = client.search(q, limit=5)
            _sauvegarder(results, "ban", "search", {"q": q})
            if not results:
                console.print("[yellow]Aucun résultat.[/]")
                continue
            t = Table(title=f"BAN — {q!r}", show_lines=True)
            t.add_column("Score",     style="cyan", width=6)
            t.add_column("Label",     style="white", width=45)
            t.add_column("Type voie",              width=12)
            t.add_column("CP",                     width=6)
            t.add_column("Ville",                  width=18)
            for r in results:
                t.add_row(f"{r['score']:.2f}", r["label"], r["type_voie"], r["postcode"], r["city"])
            console.print(t)

        elif choix == "2":
            lat    = float(Prompt.ask("Latitude  (ex: 47.9959)"))
            lon    = float(Prompt.ask("Longitude (ex: -4.0956)"))
            result = client.reverse(lat, lon)
            _sauvegarder(result, "ban", "reverse", {"lat": lat, "lon": lon})
            if result:
                console.print(Panel(
                    f"[white]{result['label']}[/]\n"
                    f"type_voie=[cyan]{result['type_voie']}[/]  "
                    f"citycode=[cyan]{result['citycode']}[/]  "
                    f"score=[cyan]{result['score']:.2f}[/]",
                    title="BAN reverse"
                ))

        elif choix == "3":
            raw = Prompt.ask("Voie brute (ex: av. Jean Jaurès)")
            type_v, nom_v = extract_type_from_street(raw)
            console.print(
                f"  type extrait : [cyan]{type_v!r}[/]\n"
                f"  nom voie     : [white]{nom_v!r}[/]\n"
                f"  normalisé    : [green]{normalize_type_label(type_v)!r}[/]"
            )


# ===========================================================================
# Credentials CRUD
# ===========================================================================

def menu_credentials():
    store = CredentialsStore()

    while True:
        console.print()
        services = store.list_services()
        if services:
            t = Table("Service", "Login", "API Key", "Modifié le", title="Credentials enregistrés")
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

        choix = _menu("Credentials", ["Ajouter", "Supprimer"])
        if choix == "0":
            break

        elif choix == "1":
            svc  = Prompt.ask("Service  (insee · inpi · zealot · omdb · openlibrary)")
            kind = Prompt.ask("Type", choices=["1", "2"],
                              prompt="[1] Bearer login/password  [2] API Key")
            if kind == "1":
                login    = Prompt.ask("Login / email")
                password = Prompt.ask("Mot de passe", password=True)
                store.set(svc, login=login, password=password)
            else:
                api_key = Prompt.ask("API Key")
                store.set(svc, api_key=api_key)
            console.print(f"[green]✓ '{svc}' enregistré.[/]")

        elif choix == "2":
            svc = Prompt.ask("Service à supprimer")
            if Confirm.ask(f"Supprimer '{svc}' ?"):
                store.delete(svc)
                console.print(f"[yellow]'{svc}' supprimé.[/]")

    store.close()


# ===========================================================================
# Menu principal
# ===========================================================================

MENU_PRINCIPAL = [
    "INSEE Sirene",
    "INPI RNE",
    "Personnes (zealot)",
    "OMDB Films",
    "OpenLibrary Livres",
    "Adresses BAN",
    "Credentials",
]

HANDLERS = {
    "1": menu_insee,
    "2": menu_inpi,
    "3": menu_personne,
    "4": menu_omdb,
    "5": menu_openlibrary,
    "6": menu_ban,
    "7": menu_credentials,
}


def main():
    if "--init-creds" in sys.argv:
        menu_credentials()
        return

    console.print(Panel.fit(
        "[bold blue]ORBIS — V0.7[/bold blue]\n[dim]VersatileKnowledgeBase[/dim]",
        style="bold blue",
    ))

    while True:
        choix = _menu("Menu principal", MENU_PRINCIPAL)
        if choix == "0":
            break
        handler = HANDLERS.get(choix)
        if handler:
            try:
                handler()
            except KeyboardInterrupt:
                console.print("\n[dim]Interruption — retour au menu.[/]")
            except Exception as e:
                console.print(f"[red]Erreur inattendue : {e}[/]")


if __name__ == "__main__":
    main()
