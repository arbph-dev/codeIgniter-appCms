# services/api/BaseApiClient.py

import requests
from typing import Optional


class BaseApiClient:
    """
    Classe de base pour tous les clients API ORBIS.

    Ce qu'elle gère :
        - session HTTP depuis auth.get_session() ou session neutre
        - injection des query params auth (ApiKeyAuth.params())
        - header Accept: application/json
        - verbes HTTP : get / post / put / delete
        - gestion d'erreur centralisée (retourne None sans lever)
        - hook optionnel json_store (save_samples=True en mode dev)

    Sous-classes : définir _source = "insee" pour le nommage json_store.
    """

    _source: str = "unknown"   # override dans chaque sous-classe

    def __init__(
        self,
        base_url:     str,
        auth=None,
        timeout:      int  = 20,
        save_samples: bool = False,
    ):
        self.base_url     = base_url.rstrip("/")
        self.timeout      = timeout
        self.auth         = auth
        self._save_samples = save_samples

        self.session = (
            auth.get_session()
            if auth and hasattr(auth, "get_session")
            else requests.Session()
        )
        self.session.headers.setdefault("Accept", "application/json")

    # ------------------------------------------------------------------
    # Verbes publics
    # ------------------------------------------------------------------

    def get(self, endpoint: str = "", params: dict = None) -> Optional[dict]:
        return self._request("GET", endpoint, params=params)

    def post(self, endpoint: str = "", data: dict = None) -> Optional[dict]:
        return self._request("POST", endpoint, json=data)

    def put(self, endpoint: str = "", data: dict = None) -> Optional[dict]:
        return self._request("PUT", endpoint, json=data)

    def delete(self, endpoint: str = "") -> Optional[dict]:
        return self._request("DELETE", endpoint)

    # ------------------------------------------------------------------
    # Couche HTTP centralisée
    # ------------------------------------------------------------------

    def _request(
        self,
        method:   str,
        endpoint: str,
        params:   dict = None,
        **kwargs,
    ) -> Optional[dict]:
        """
        Point unique d'émission HTTP.
        - construit l'URL
        - injecte les query params d'auth (ApiKeyAuth)
        - log la requête
        - gère HTTPError et RequestException → retourne None
        """
        params = dict(params or {})

        # Injection clé API en query param (ApiKeyAuth avec query_name)
        if self.auth and hasattr(self.auth, "params"):
            params.update(self.auth.params())

        url = (
            f"{self.base_url}/{endpoint.lstrip('/')}"
            if endpoint
            else self.base_url
        )

        try:
            r = self.session.request(
                method,
                url,
                params=params or None,
                timeout=self.timeout,
                **kwargs,
            )
            print(f"[{self.__class__.__name__}] {method} {r.request.url} → {r.status_code}")
            r.raise_for_status()
            return r.json()

        except requests.HTTPError as e:
            body = ""
            try:
                body = e.response.json().get("message") or e.response.text[:200]
            except Exception:
                body = e.response.text[:200]
            print(f"[{self.__class__.__name__}] HTTP {e.response.status_code} : {body}")
            return None

        except requests.RequestException as e:
            print(f"[{self.__class__.__name__}] Erreur réseau : {e}")
            return None

    # ------------------------------------------------------------------
    # Hook json_store (no-op si save_samples=False)
    # ------------------------------------------------------------------

    def _save(
        self,
        data:     Optional[dict],
        ep_name:  str,
        params:   dict = None,
    ) -> Optional[str]:
        """
        Sauvegarde la réponse brute si save_samples=True.
        Retourne le nom du fichier créé, ou None.

        Usage dans une sous-classe :
            def search_siren(self, q):
                data = self.get("/siren", {"q": q})
                self._save(data, "search_siren", {"q": q})
                return data
        """
        if not self._save_samples or data is None:
            return None
        try:
            from core.json_store import save_response
            return save_response(
                data,
                source   = self._source,
                endpoint = ep_name,
                params   = params,
            )
        except ImportError:
            return None
