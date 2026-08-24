"""
services/auth — couche d'authentification ORBIS

Exports :
    AuthProvider     interface abstraite
    ApiKeyAuth       clé API (header ou query param)  → INSEE, OMDB
    BearerAuth       Bearer token login/logout/me     → zealot, INPI
    CredentialsStore stockage SQLite + factory        → build_and_login()
"""
from .AuthProvider    import AuthProvider
from .ApiKeyAuth      import ApiKeyAuth
from .BearerAuth      import BearerAuth
from .CredentialsStore import CredentialsStore

__all__ = ["AuthProvider", "ApiKeyAuth", "BearerAuth", "CredentialsStore"]
