# Orbis

client/agrégateur Python multi-API, avec authentification factorisée, credentials locaux SQLAlchemy, puis interface PySide6.

## structure

- [main.py](/Orbis/main.py).py
- [main2.py](/Orbis/main2.py).py
- services\
  - services\api\
    - [__init__.py](/Orbis/services/api/__init__.py) 
    - [inpi_client.py](/Orbis/services/api/inpi_client.py)
    - [insee_client.py](/Orbis/services/api/insee_client.py)
    - [personne_client.py](/Orbis/services/api/personne_client.py)
  - services\auth\
    - [__init__.py](/Orbis/services/auth/__init__.py) 
    - [ApiKeyAuth.py](/Orbis/services/auth/ApiKeyAuth.py)
    - [AuthProvider.py](/Orbis/services/auth/AuthProvider.py)
    - [BearerAuth.py](/Orbis/services/auth/BearerAuth.py)
    - [CredentialsStore.py](/Orbis/services/auth/CredentialsStore.py)

----
## Travaux
- simplification des fichiers
- harmonisation credentials et auth



## services\api\

