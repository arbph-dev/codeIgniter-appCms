"""
services/auth/CredentialsStore.py

Stockage local des credentials dans une table SQLite dédiée.

Table :
    CREATE TABLE credentials (
        service    TEXT PRIMARY KEY,
        login      TEXT,
        password   TEXT,
        api_key    TEXT,
        token      TEXT,
        updated_at DATETIME
    );

Usage :
    store = CredentialsStore()
    store.set("insee",   api_key="ma_cle_insee")
    store.set("inpi",    login="user@mail.com", password="secret")
    store.set("zealot",  login="admin@zealot.fr", password="secret")

    creds = store.get("insee")
    # → {"service": "insee", "api_key": "ma_cle_insee", ...}

    # Construction directe du bon provider + login
    auth = store.build_and_login("insee")   → ApiKeyAuth  (session prête)
    auth = store.build_and_login("inpi")    → BearerAuth  (déjà loggué)
    auth = store.build_and_login("zealot")  → BearerAuth  (déjà loggué)
"""
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Optional

from .BearerAuth   import BearerAuth
from .ApiKeyAuth   import ApiKeyAuth
from .AuthProvider import AuthProvider


# ---------------------------------------------------------------------------
# Mapping service → config du provider
# ---------------------------------------------------------------------------
SERVICE_CONFIG = {
    # API Bearer — CI Shield (zealot.fr)
    "zealot": {
        "type":       "bearer",
        "base_url":   "https://zealot.fr/api",
        "login_path": "/auth/login",
    },
    # API Bearer — INPI RNE
    "inpi": {
        "type":       "bearer",
        "base_url":   "https://registre-national-entreprises.inpi.fr/api",
        "login_path": "/sso/login",
    },
    # API Key header — INSEE Sirene
    "insee": {
        "type":        "apikey",
        "header_name": "X-INSEE-Api-Key-Integration",
    },
    # API Key query param — OMDB
    "omdb": {
        "type":       "apikey",
        "query_name": "apikey",
    },
}

# Chemin par défaut : data/credentials.db à la racine du projet
_DEFAULT_DB = Path(__file__).parent.parent.parent / "data" / "credentials.db"


class CredentialsStore:

    def __init__(self, db_path=None):
        self.db_path = Path(db_path) if db_path else _DEFAULT_DB
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(self.db_path))
        self._conn.row_factory = sqlite3.Row
        self._setup()

    # ------------------------------------------------------------------
    # Schéma
    # ------------------------------------------------------------------

    def _setup(self):
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS credentials (
                service    TEXT PRIMARY KEY,
                login      TEXT,
                password   TEXT,
                api_key    TEXT,
                token      TEXT,
                updated_at DATETIME
            )
        """)
        self._conn.commit()

    # ------------------------------------------------------------------
    # CRUD
    # ------------------------------------------------------------------

    def set(
        self,
        service:  str,
        login:    str = None,
        password: str = None,
        api_key:  str = None,
        token:    str = None,
    ) -> bool:
        """Insère ou met à jour les credentials d'un service."""
        try:
            self._conn.execute("""
                INSERT INTO credentials (service, login, password, api_key, token, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(service) DO UPDATE SET
                    login      = excluded.login,
                    password   = excluded.password,
                    api_key    = excluded.api_key,
                    token      = excluded.token,
                    updated_at = excluded.updated_at
            """, (service, login, password, api_key, token,
                  datetime.now().isoformat()))
            self._conn.commit()
            return True
        except Exception as e:
            print(f"[Credentials] Erreur set({service}) : {e}")
            return False

    def get(self, service: str) -> Optional[dict]:
        """
        Retourne les credentials d'un service sous forme de dict.
        Ex : store.get("insee") → {"service": "insee", "api_key": "...", ...}
        """
        cur = self._conn.execute(
            "SELECT * FROM credentials WHERE service = ?", (service,)
        )
        row = cur.fetchone()
        return dict(row) if row else None

    def delete(self, service: str) -> bool:
        self._conn.execute(
            "DELETE FROM credentials WHERE service = ?", (service,)
        )
        self._conn.commit()
        return True

    def list_services(self) -> list[str]:
        """Liste tous les services enregistrés."""
        cur = self._conn.execute(
            "SELECT service FROM credentials ORDER BY service"
        )
        return [r[0] for r in cur.fetchall()]

    # ------------------------------------------------------------------
    # Factory
    # ------------------------------------------------------------------

    def build_auth(self, service: str) -> Optional[AuthProvider]:
        """
        Construit le bon AuthProvider pour un service.
        Ne fait PAS le login — appeler auth.login() ensuite si nécessaire.

        Ex :
            auth = store.build_auth("zealot")
            auth.login(creds["login"], creds["password"])
        """
        creds = self.get(service)
        if not creds:
            print(f"[Credentials] Service inconnu : {service}")
            return None

        cfg = SERVICE_CONFIG.get(service)
        if not cfg:
            print(f"[Credentials] Pas de config pour : {service}")
            return None

        if cfg["type"] == "bearer":
            return BearerAuth(
                base_url   = cfg["base_url"],
                login_path = cfg.get("login_path", "/auth/login"),
            )

        if cfg["type"] == "apikey":
            api_key = creds.get("api_key")
            if not api_key:
                print(f"[Credentials] api_key manquante pour : {service}")
                return None
            return ApiKeyAuth(
                api_key     = api_key,
                header_name = cfg.get("header_name"),
                query_name  = cfg.get("query_name"),
            )

        return None

    def build_and_login(self, service: str) -> Optional[AuthProvider]:
        """
        Construit le provider ET effectue le login en une seule étape.
        - BearerAuth : utilise login/password de la table, appelle login().
        - ApiKeyAuth : session prête directement, pas de login réseau.
        Retourne None en cas d'échec.
        """
        auth  = self.build_auth(service)
        creds = self.get(service)
        if not auth or not creds:
            return None

        if isinstance(auth, BearerAuth):
            login    = creds.get("login")
            password = creds.get("password")
            if not login or not password:
                print(f"[Credentials] login/password manquants pour : {service}")
                return None
            if not auth.login(login, password):
                return None

        return auth

    # ------------------------------------------------------------------
    # Utilitaires
    # ------------------------------------------------------------------

    def close(self):
        self._conn.close()

    def __repr__(self):
        services = self.list_services()
        return f"CredentialsStore({self.db_path}, services={services})"
