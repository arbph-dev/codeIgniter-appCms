# services/api/BaseApiClient.py

import requests


class BaseApiClient:

    def __init__(self, base_url: str, auth=None, timeout: int = 20):
        self.base_url = base_url.rstrip("/")
        self.timeout  = timeout
        self.auth     = auth

        # Session depuis le provider ou nouvelle session
        if auth and hasattr(auth, "get_session"):
            self.session = auth.get_session()
        else:
            self.session = requests.Session()

        self.session.headers.setdefault("Accept", "application/json")

    def get(self, endpoint: str = "", params: dict = None):
        params = params or {}

        # Ajoute les query params d'auth si présents (ApiKeyAuth.params())
        if self.auth and hasattr(self.auth, "params"):
            params.update(self.auth.params())

        url = f"{self.base_url}/{endpoint.lstrip('/')}" if endpoint else self.base_url

        r = self.session.get(url, params=params, timeout=self.timeout)
        r.raise_for_status()
        return r.json()
