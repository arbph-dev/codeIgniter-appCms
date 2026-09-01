# Orbis

client/agrégateur Python multi-API, avec authentification factorisée, credentials locaux SQLAlchemy, puis interface PySide6.

## Architecture des 6 couches 
```
┌──────────────────────────────────────────────────────────────────┐
│ 6 · PRÉSENTATION   QML — Layout / Panels / CrudToolbar           │
│     ConflictLog visible admin ·                                  │
├──────────────────────────────────────────────────────────────────┤
│ 5 · LOGIQUE MÉTIER  tag, score, dédoublonnage, règles            │
├──────────────────────────────────────────────────────────────────┤
│ 4 · PERSISTANCE     EntrepriseModel (SQLAlchemy)                 │
│     Repository : CRUD + import/export CSV                        │
├──────────────────────────────────────────────────────────────────┤
│ 3 · TRANSFORMATION  EntrepriseMapper                             │
│     mapInsee / mapInpi / mapZealot / mapUi → EntrepriseModel     │
├──────────────────────────────────────────────────────────────────┤
│ 2 · ACQUISITION    API EntrepriseInsee / Inpi / Zealot / UI      │
│     + CSV · JSON ·                                               │
├──────────────────────────────────────────────────────────────────┤
│ 1 · SÉCURITÉ        CredentialsStore(encryption=NoEncryption())  │
│     AuthProvider → ApiKeyAuth / BearerAuth                       │
│     EncryptionProvider → NoEncryption | FernetEncryption         │
└──────────────────────────────────────────────────────────────────┘
```


## structure

- [main.py](/Orbis/main.py)
- [main2.py](/Orbis/main2.py)
- [main6_light.py](/Orbis/main6_light.py)
- acquisition\
  - [sources.py](/Orbis/acquisition/sources.py)
- cli\
  - [__init__.py](/Orbis/cli/__init__.py)
  - [menu.py](/Orbis/cli/menu.py)
  - [presentation.py](/Orbis/cli/presentation.py)
  - menus\
    - [__init__.py](/Orbis/cli/menus/__init__.py)
    - [ban.py](/Orbis/cli/menus/ban.py)
    - [credentials.py](/Orbis/cli/menus/credentials.py)
    - [inpi.py](/Orbis/cli/menus/inpi.py)
    - [insee.py](/Orbis/cli/menus/insee.py)
    - [omdb.py](/Orbis/cli/menus/omdb.py)
    - [openlibrary.py](/Orbis/cli/menus/openlibrary.py)
    - [personne.py](/Orbis/cli/menus/personne.py)
    - [poligraph.py](/Orbis/cli/menus/poligraph.py)
- core\
  - [__init__.py](/Orbis/cli/menus/__init__.py)
  - [json_store.py](/Orbis/cli/menus/json_store.py)
- persistence\
  - [conflict_log.py](/Orbis/persistence/conflict_log.py)
  - [db.py](/Orbis/persistence/db.py)
  - [models.py](/Orbis/persistence/models.py)
  - [repository.py](/Orbis/persistence/repository.py)
  - [siren_guard.py](/Orbis/persistence/siren_guard.py)
- services\
  - services\api\
    - [__init__.py](/Orbis/services/api/__init__.py)
    - [BanClient.py](/Orbis/services/api/BanClient.py)
    - [BaseApiClient.py](/Orbis/services/api/BaseApiClient.py)
    - [inpi_client.py](/Orbis/services/api/inpi_client.py)
    - [insee_client.py](/Orbis/services/api/insee_client.py)
    - [OmdbClient.py](/Orbis/services/api/OmdbClient.py)
    - [OpenLibraryClient.py](/Orbis/services/api/OpenLibraryClient.py)
    - [poligraph_client.py](/Orbis/services/api/poligraph_client.py)
    - [personne_client.py](/Orbis/services/api/personne_client.py)
    - [referentiels.py](/Orbis/services/api/referentiels.py)
  - services\auth\
    - [__init__.py](/Orbis/services/auth/__init__.py) 
    - [ApiKeyAuth.py](/Orbis/services/auth/ApiKeyAuth.py)
    - [AuthProvider.py](/Orbis/services/auth/AuthProvider.py)
    - [BearerAuth.py](/Orbis/services/auth/BearerAuth.py)
    - [CredentialsStore.py](/Orbis/services/auth/CredentialsStore.py)
- transformation/
  - [mapper.py](/Orbis/transformation/mapper.py)



| Path | File | couche | notes |
| --- | ---| ---| --- |
| /cli/layer5/ | [__init__.py](/Orbis/cli/layer5/__init__.py) | 5 | --- |
| /cli/layer5/ | [etapes.py](/Orbis/cli/layer5/etapes.py) | 5 | --- |
| /cli/layer5/ | [scoring.py](/Orbis/cli/layer5/scoring.py) | 5 | --- |
| /cli/layer5/ | [working_memory.py](/Orbis/cli/layer5/working_memory.py) | 5 | --- |


----
# Travaux
- simplification des fichiers
  - séparer chaque menu en fichiers de commande
- mise a jour documentation


## services\api\
Le notes d'implémentation à reprendre vers api et ou métiers
- [insee_note.md](/Orbis/services/api/insee_note.md)
- poligraph en cours
----

##  ui
je réfléchis a employer qt, qt quick qml qtcreator et webassembly pour utiliser les mêmes technologies sur le front javascript et le client python est ce une bonne option ?

----



# couche 1

AuthProvider.py
- AuthProvider permet l'authentification
ApiKeyAuth.py
- ApiKeyAuth injecter une clé dans un header ou dans les paramètres.

BearerAuth.py
- BearerAuth gére login, token Bearer, /me, logout et session HTTP.

CredentialsStore.py
- CredentialsStore contient déjà le mapping SERVICE_CONFIG (zealot, inpi, insee, omdb....)
    zealot → Bearer
    inpi   → Bearer
    insee  → ApiKey
    omdb   → ApiKey


pattern identique
```python
InseeClient(auth=auth)
InpiClient(auth=auth)
PersonneClient(auth=auth)
```

Un helper _get_auth(store, service) centralise la récupération + connexion. Chaque menu est désormais :

```python
store = CredentialsStore()
auth  = _get_auth(store, "insee")  # ou "inpi", "zealot"
store.close()
client = InseeClient(auth=auth)
```

Le menu_credentials() offre le CRUD complet (liste, add bearer/apikey, delete) accessible via --init-creds ou depuis le menu principal.

CredentialsStore reçoit un EncryptionProvider en paramètre optionnel. Aujourd'hui NoEncryption(), demain FernetEncryption(key_from_api) sans toucher au reste.

CredentialsStore → SQLAlchemy : le SQLite brut fonctionne et couvre le besoin ; la migration SQLAlchemy peut se faire sans toucher aux clients ni à main.py (seul CredentialsStore.py sera modifié).




CredentialsStore reçoit un EncryptionProvider en paramètre optionnel. Aujourd'hui NoEncryption(), demain FernetEncryption(key_from_api) sans toucher au reste.

La clef fournie par l'API est une idée intéressante : au démarrage du client desktop, on s'authentifie et l'API retourne la clef de chiffrement de session. La base locale ne peut pas être ouverte sans avoir préalablement prouvé son identité au serveur. C'est un vrai gain sans complexity excessive.


# couche 2

BaseApiClient          ✓
InseeClient            ✓  _source="insee"
InpiClient             ✓  _source="inpi"
PersonneClient         ✓  _source="zealot_personne"
FormeJuridiqueClient   ✓  _source="zealot_fj"
CodesNafClient         ✓  _source="zealot_naf"
OmdbClient             ✓  _source="omdb"
OpenLibraryClient      ✓  _source="openlibrary"
BanClient              ✓  _source="ban"

## BaseApiClient
BaseApiClient a besoin de : _request() centralisé avec try/except, post(), put(), delete(), et le hook json_store.

Ce que BaseApiClient résout maintenant

_request() est le point unique.  :

```python
# Avant (chaque client faisait ça)           # Après (BaseApiClient le fait)
self.session = auth.get_session()             →  super().__init__(base_url, auth)
self.session.headers.update({"Accept":...})   →  setdefault dans __init__
try:                                          →  _request() centralise tout
    r = self.session.get(url, ...)
    r.raise_for_status()
    return r.json()
except requests.HTTPError as e:
    print(...)
    return None
except requests.RequestException as e:
    ...
```

Les 3 clients passent de 529 lignes à 332 (−37 %). Le gain réel est plus important : ce qui reste dans chaque client est 100 % domain logic


## Outils de debug
json_store — deux niveaux qui coexistent

Niveau client (save_samples=True) — pour les scripts batch ou le mode debug :

```python
client = InseeClient(auth, save_samples=True)
# → chaque appel sauvegarde automatiquement dans data/samples/
```
Niveau menu (explicite) — pour l'affichage à l'utilisateur :

```python
data     = client.search_siren(q)                                    # client reste pur
filename = save_response(data, source="insee", endpoint="siren", params={"q": q})
console.print(f"[dim]Sauvegarde : {filename}[/]")
```
Les deux peuvent être actifs en même temps sans conflit.

-----

## Les dataclasses sources (couche 2)
( acquisition/sources.py )
Ils sont rééalisés depuis le JSON de json_store

Ce sont des conteneurs simples, sans logique, qui reflètent fidèlement la structure brute de chaque source. 

Chaque classe représente la réponse brute d'un fournisseur, aplatie en un dict métier via from_api().

Flux :
- API → client.method() → dict brut → Source.from_api(dict) → Source

- Source → EntrepriseMapper.map*() → EntrepriseModel  (couche 3, à venir)

Couche 2 : acquisition/sources.py
  EntrepriseInsee     ✓  testé sur JSON réel
  PersonneZealot      ✓  testé sur JSON réel
  AdresseBan          ✓  testé sur JSON réel
  OmdbFilm            ✓  testé sur JSON réel
  OmdbResultItem      ✓  testé sur JSON réel
  OuvrageOpenLibrary  ✓  testé sur JSON réel
  EntrepriseInpi      ⚠  skeleton — JSON sample manquant


INSEE 
deux niveaux de champs bien distincts : 
    la racine porte
        siren,
        categorieEntreprise,
        dateCreation,
        trancheEffectifs.
    
    Les infos métier (denomination, naf, formeJuridique, etat) sont dans periodesUniteLegale[0] 
    — la période courante est toujours dateFin: null. 

Le siret_siege se calcule : siren + nicSiege.

La NAF25 (activitePrincipaleNAF25UniteLegale) est à la racine uniquement, pas dans les périodes.

PersonneZealot —
les dates arrivent en objet {"date": "1890-11-22 00:00:00.000000", "timezone_type": 3, "timezone": "UTC"}. _extract_date() en coupe les 10 premiers caractères.
Champ detail en HTML long, bio en texte court — les deux sont conservés séparément.

OpenLibrary — les ISBN et publisher ne sont pas dans search.json (contrairement à ce que extract_book() supposait).
Ils ne viennent que via by_isbn(). cover_i est un entier qui se transforme en URL via cover_url property.


EntrepriseZealot
skeleton volontairement minimal car le JSON sample manque encore. 
Les champs couvrent le cas connu : organisations créées sans SIREN (siren: Optional[str]).
**from_api()** accepte indifféremment nom ou denomination selon ce que l'API retourne.
À affiner dès réception du JSON /organisations.

EntrepriseUI — pas de **from_api()** car il n'y a pas d'API source : les valeurs viennent directement du formulaire. Seuls siren et denomination sont obligatoires, tout le reste est optionnel. forme_juridique prend le code à 4 chiffres (ex: "5499") pour rester cohérent avec les autres sources.

```python
@dataclass
class OmdbResultItem:
    """
    Item d'une liste de résultats OMDB (search).
    Source : OmdbClient.search(titre) → data["Search"][n]
    """
    imdb_id: str
    title:   Optional[str]
    year:    Optional[str]
    type_:   Optional[str]    # movie / series / game
    poster:  Optional[str]    # URL ou "N/A"

    @classmethod
    def from_api(cls, data: dict) -> "OmdbResultItem":
        return cls(
            imdb_id = data.get("imdbID", ""),
            title   = data.get("Title"),
            year    = data.get("Year"),
            type_   = data.get("Type"),
            poster  = data.get("Poster"),
        )

    def to_dict(self) -> dict:
        return asdict(self)
```

----------------------------------------------------------------------------------------------------------------------------------

# couche 3 
Le Mapper (couche 3 ) est le seul endroit où on "choisit" quoi garder.
Le Mapper est l'endroit où gérer les conflits de fusion : si INPI et INSEE ont une denomination différente pour le même SIREN, c'est la couche 3 qui choisit (ou qui stocke les deux avec une colonne source_denomination).

```python
# transformation/mapper.py

class EntrepriseMapper:

    @staticmethod
    def mapInseeToModel(src: EntrepriseInsee) -> EntrepriseModel:
        return EntrepriseModel(
            siren           = src.siren,
            denomination    = src.denomination,
            naf             = src.naf,
            categorie       = src.categorie,
            etat            = src.etat,
            forme_juridique = src.forme_juridique,
            source          = "insee",
        )

    @staticmethod
    def mapInpiToModel(src: EntrepriseInpi) -> EntrepriseModel:
        return EntrepriseModel(
            siren           = src.siren,
            denomination    = src.denomination,
            forme_juridique = src.forme_juridique,
            capital         = src.capital,
            source          = "inpi",
        )

    @staticmethod
    def mapZealotToModel(src: EntrepriseZealot) -> EntrepriseModel:
        return EntrepriseModel(
            siren        = src.siren,
            denomination = src.nom,
            source       = "zealot",
        )

    @staticmethod
    def mapUiToModel(src: EntrepriseUI) -> EntrepriseModel:
        return EntrepriseModel(
            siren        = src.siren,
            denomination = src.denomination,
            naf          = src.naf,
            source       = "ui",
        )
```

-------------------------
    EN COURS
-------------------------
# A voir
**fichiers à voir**


- persistence/conflict_log.py
- persistence/db.py 
- persistence/models.py
- persistence/repository.py
- persistence/siren_guard.py
- transformation/mapper.py


## couche 2 

### ci_client/referentiels.py
Clients référentiels zealot.fr — données combo / liste / radio
    FormeJuridiqueClient  /forme-juridiques
    CodesNafClient        /codes-naf
Ces endpoints retournent des listes stables (rarement mises à jour).
Un cache mémoire simple évite les appels répétés dans une même session.

Usage :
```python
auth = store.build_and_login("zealot")

fj_client  = FormeJuridiqueClient(auth)
naf_client = CodesNafClient(auth)

formes = fj_client.list()          # [{"id": 1, "code": "5710", "libelle": "..."}, ...]
naf    = naf_client.get_by_code("68.10Z")
```

### acquisition\sources.py


## couche3 
### mappers a reprendre
    EntrepriseZealot

Dans la doc de l'api Entreprise : 
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/Entreprise.md

le JSON pour les requetes
index() – GET /api/entreprise
show($id) – GET /api/entreprise/:id


### reconcileZealot()
à voir ne gere que  EntrepriseZealot et EntrepriseInsee => EntrepriseModel

### transformation/mapper.py
EntrepriseMapper (couche 3) convertit chaque dataclass d'acquisition (couche 2) en EntrepriseModel (couche 4).
 
Règles :
    • Un map*() = une source = un modèle partiel.
    • merge() fusionne deux modèles : les champs non-None de base
      ont priorité ; les None sont comblés par enrichment.
    • reconcileZealot() traite le cas organisation sans SIREN :
      INSEE fournit les données métier, zealot apporte l'id_zealot.
 
Flux :
    EntrepriseInsee  ──┐
    EntrepriseInpi   ──┤  map*()  ──►  EntrepriseModel  ──► Repository
    EntrepriseZealot ──┤
    EntrepriseUI     ──┘
 
    EntrepriseZealot (sans siren)  ──┐
                                     ├── reconcileZealot() ──► EntrepriseModel
    EntrepriseInsee  ────────────────┘




## couche4     
### persistence/db.py 
Moteur SQLAlchemy et Base déclarative partagés.
- Tous les modèles ORM importent **Base** depuis ce module.

init_db() crée les tables (CREATE TABLE IF NOT EXISTS).
  
Usage :

```python
    from persistence.db import get_engine, init_db, get_session

    engine = get_engine()          # data/orbis.db par défaut
    init_db(engine)                # crée les tables
    session = get_session(engine)
    session.close()
```

### EntrepriseModel ( persistence/models.py )

EntrepriseModel — ORM SQLAlchemy (couche 4)
- Table : entreprises
- Clé métier : siren (UNIQUE, INDEX)

EntrepriseModel est aujourd'hui un dataclass pur.
Les champs et leurs noms sont stables : le mapper (couche 3) ne changera pas quand on ajoutera les colonnes SQLAlchemy.
 
Flux :
    Source.from_api() → EntrepriseMapper.map*() → EntrepriseModel → Repository → DB

Moteur SQLAlchemy et Base déclarative partagés.





### persistence/conflict_log.py
ConflictLog — journal des conflits SIREN (couche 4)

**A GENERALISER**
    trop restricitf, ajouter stage pour la couche et pourra servir tout aulong du processus
 
Chaque tentative d'INSERT sur un SIREN existant est enregistrée ici.
Le payload JSON stocke le contexte complet : qui / quoi / où / comment / quand.
 
Table : conflict_log

Usage :
```py
    from persistence.conflict_log import ConflictLog, build_payload
 
    log = ConflictLog(payload=build_payload(
        user      = {"user": "admin@orbis", "role": "admin"},
        attempted = model,
        existing  = existing_model,
        source    = "insee",
        force     = True,
    ))
    session.add(log)
    session.commit()
```

### persistence/siren_guard.py

SirenGuard — protection anti-doublon SIREN (couche 4)
utilise
- from sqlalchemy.orm import Session
- from persistence.models      import EntrepriseModel
- from persistence.conflict_log import ConflictLog, build_payload
 
Intercepte tout INSERT avant qu'il n'atteigne la base.
En cas de doublon :
    • journalise dans ConflictLog (toujours)
    • lève ConflictError  (utilisateur standard)
    • met à jour et log forced_by (admin avec force=True)
 
Usage :
    guard  = SirenGuard(session, current_user={"user": "u@mail.fr", "role": "user"})
    saved  = guard.check_and_save(model, source="insee")
 
    # Force admin
    admin  = {"user": "admin@mail.fr", "role": "admin"}
    guard2 = SirenGuard(session, current_user=admin)
    saved  = guard2.check_and_save(model, source="insee", force=True)


### persistence/repository.py

EntrepriseRepository — CRUD + import/export CSV (couche 4)
- Tous les accès DB passent par ici.
-  Le Repository délègue les INSERTs à SirenGuard pour garantir l'unicité SIREN.
 
```py
    engine = get_engine()
    init_db(engine)
    session = get_session(engine)
 
    repo = EntrepriseRepository(session)
    user = {"user": "u@mail.fr", "role": "user"}
     # Création
    saved = repo.create(model, user=user, source="insee")
     # Lecture
    e = repo.get_by_siren("448451484")
    page = repo.list(page=1, per_page=20)
     # Mise à jour
    repo.update("448451484", {"denomination": "Nouveau nom"}, user=user)
     # Suppression
    repo.delete("448451484")
     # Import / Export CSV
    repo.import_csv("entreprises.csv", user=user)
    repo.export_csv("export.csv")
 
    session.close()
```

------------------------


### ── Validation couche 4 ────────────────────────────────
```py
if unites and Confirm.ask("Sauvegarder en base locale ?", default=False):
    _persister_unites(unites, source="insee")

_voir_detail(data)
```


### ── Helpers couche 4 ───────────────────────────────────────────────────────
```py
def _persister_unites(unites: list, source: str = "insee") -> None:
    """Mappe et persiste une liste d'unités légales via Repository + SirenGuard."""
    from persistence.db          import get_engine, init_db, get_session
    from persistence.repository  import EntrepriseRepository
    from persistence.siren_guard import ConflictError
    from transformation.mapper   import EntrepriseMapper
    from acquisition.sources     import EntrepriseInsee
 
    engine = get_engine()
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
``` 
 
```py 
def _afficher_conflits() -> None:
    """Affiche les conflits SIREN non résolus depuis la base locale."""
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
    t.add_column("ID",      style="cyan", width=5)
    t.add_column("SIREN",   style="white", width=12)
    t.add_column("Qui",     width=20)
    t.add_column("Force",   width=6)
    t.add_column("Date",    width=20)
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
``` 















