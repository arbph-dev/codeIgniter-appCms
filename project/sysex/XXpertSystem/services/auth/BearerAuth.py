"""
services/auth/BearerAuth.py
Authentification par Bearer token (CI Shield, INPI...).

Usage :
    auth = BearerAuth("https://zealot.fr/api")
    auth.login("email@example.com", "password")
    session = auth.get_session()
"""
import requests
from typing import Optional
from .AuthProvider import AuthProvider


class BearerAuth(AuthProvider):

    def __init__(self, base_url: str, login_path: str = "/auth/login",
                 logout_path: str = "/auth/logout",
                 me_path: str = "/auth/me",
                 timeout: int = 10):
        """
        base_url    : ex "https://zealot.fr/api"
        login_path  : chemin du endpoint login (défaut /auth/login)
                      INPI utilise /sso/login
        """
        self.base_url    = base_url.rstrip("/")
        self.login_path  = login_path
        self.logout_path = logout_path
        self.me_path     = me_path
        self.timeout     = timeout
        self.token:      Optional[str]  = None
        self.user:       Optional[dict] = None
        self._session    = requests.Session()
        self._session.headers.update({
            "Accept":       "application/json",
            "Content-Type": "application/json",
        })

    # ------------------------------------------------------------------
    # Auth
    # ------------------------------------------------------------------
    def login(self, email: str, password: str) -> bool:
        """POST login_path → récupère le Bearer token."""
        try:
            r = self._session.post(
                f"{self.base_url}{self.login_path}",
                json={"email": email, "password": password},
                timeout=self.timeout
            )
            # INPI utilise username au lieu d'email
            if r.status_code in (400, 422):
                r = self._session.post(
                    f"{self.base_url}{self.login_path}",
                    json={"username": email, "password": password},
                    timeout=self.timeout
                )
            r.raise_for_status()
            data = r.json()

            self.token = data.get("token") or data.get("access_token")
            self.user  = data.get("user")

            if self.token:
                self._session.headers.update(
                    {"Authorization": f"Bearer {self.token}"}
                )
                name = self.user.get("username") if self.user else email
                print(f"[BearerAuth] Connecté : {name} → {self.base_url}")
                return True

            print(f"[BearerAuth] Login OK mais token absent : {data}")
            return False

        except requests.HTTPError as e:
            try:
                body = e.response.json() if e.response.content else {}
            except Exception:
                body = {}
            msg  = body.get("error") or body.get("message") or str(e)
            print(f"[BearerAuth] Échec login ({e.response.status_code}) : {msg}")
            return False
        except requests.RequestException as e:
            print(f"[BearerAuth] Erreur réseau : {e}")
            return False

    def logout(self) -> bool:
        if not self.token:
            return True
        try:
            self._session.post(
                f"{self.base_url}{self.logout_path}",
                timeout=self.timeout
            )
            self._clear()
            print(f"[BearerAuth] Déconnecté : {self.base_url}")
            return True
        except requests.RequestException as e:
            print(f"[BearerAuth] Erreur logout : {e}")
            self._clear()
            return False

    def me(self) -> Optional[dict]:
        if not self.token:
            return None
        try:
            r = self._session.get(
                f"{self.base_url}{self.me_path}",
                timeout=self.timeout
            )
            if r.status_code == 401:
                self._clear()
                return None
            r.raise_for_status()
            self.user = r.json()
            return self.user
        except requests.RequestException:
            return None

    def ensure_logged(self, email: str, password: str) -> bool:
        """Vérifie la session, relogin si nécessaire."""
        if self.token and self.me():
            return True
        return self.login(email, password)

    # ------------------------------------------------------------------
    # AuthProvider interface
    # ------------------------------------------------------------------
    def get_session(self) -> requests.Session:
        return self._session

    @property
    def is_logged(self) -> bool:
        return self.token is not None

    def _clear(self):
        self.token = None
        self.user  = None
        self._session.headers.pop("Authorization", None)

    def __repr__(self):
        state = f"connecté ({self.user.get('username')})" \
                if self.is_logged and self.user else "non connecté"
        return f"BearerAuth({self.base_url!r}, {state})"
