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

----
## Travaux
- simplification des fichiers
  - séparer chaque menu en fichiers de commande
- mise a jour documentation


## services\api\
Le notes d'implémentation à reprendre vers api et ou métiers
- [insee_note.md](/Orbis/services/api/insee_note.md)
- poligraph en cours
----


je réfléchis a employer qt, qt quick qml qtcreator et webassembly pour utiliser les mêmes technologies sur le front javascript et le client python est ce une bonne option ?
