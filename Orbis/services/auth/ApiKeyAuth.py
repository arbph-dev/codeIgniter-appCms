"""
services/auth/ApiKeyAuth.py

Authentification par clé API — header ou query param.

Usage :
    # INSEE : clé en header
    auth = ApiKeyAuth(api_key="xxx", header_name="X-INSEE-Api-Key-Integration")
    session = auth.get_session()

    # Autre API : clé en query param
    auth = ApiKeyAuth(api_key="xxx", query_name="api_key")
"""
import requests
from .AuthProvider import AuthProvider


class ApiKeyAuth(AuthProvider):

    def __init__(
        self,
        api_key: str,
        header_name: str = None,
        query_name: str = None,
    ):
        """
        api_key      : valeur de la clé
        header_name  : nom du header HTTP (ex: "X-INSEE-Api-Key-Integration")
        query_name   : nom du paramètre query (ex: "api_key")

        Les deux peuvent être définis simultanément.
        """
        if not header_name and not query_name:
            raise ValueError("header_name ou query_name requis")

        self.api_key     = api_key
        self.header_name = header_name
        self.query_name  = query_name

        self._session = requests.Session()
        self._session.headers.update({"Accept": "application/json"})

        if header_name:
            self._session.headers[header_name] = api_key

    # ------------------------------------------------------------------
    # AuthProvider interface
    # ------------------------------------------------------------------

    def get_session(self) -> requests.Session:
        return self._session

    @property
    def is_logged(self) -> bool:
        return bool(self.api_key)

    def params(self) -> dict:
        """Retourne les query params à ajouter à chaque requête."""
        if self.query_name:
            return {self.query_name: self.api_key}
        return {}

    def __repr__(self):
        mode = f"header={self.header_name}" if self.header_name else f"query={self.query_name}"
        return f"ApiKeyAuth({mode}, key={'***' + self.api_key[-4:] if self.api_key else 'vide'})"
