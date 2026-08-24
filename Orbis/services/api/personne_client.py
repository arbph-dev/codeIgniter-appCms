"""
Client API Personne — zealot.fr

API  : https://zealot.fr/api
Auth : BearerAuth (POST /auth/login) — injecté via auth.get_session()

Usage :
    from services.auth import CredentialsStore
    store  = CredentialsStore()
    auth   = store.build_and_login("zealot")
    store.close()

    client = PersonneClient(auth=auth)

    # Recherche
    results = client.search("de Gaulle")

    # Fiche complète (personne + aliases + parcours + relations)
    fiche = client.get_by_id(1)

    # Création
    p = client.create({"nom": "Dupont", "prenoms": "Jean"})

    # Aliases
    client.alias_create(p["id"], {"alias": "J. Dupont", "alias_type": "pseudonyme"})
"""
import requests
from typing import Optional

from services.auth import AuthProvider

PERSONNE_BASE = "https://zealot.fr/api"


class PersonneClient:

    def __init__(
        self,
        auth:     AuthProvider,
        base_url: str = PERSONNE_BASE,
        timeout:  int = 10,
    ):
        """
        auth     : AuthProvider (BearerAuth déjà loggué via build_and_login("zealot"))
        base_url : ex "https://zealot.fr/api"  (sans slash final)
        """
        self.base_url = base_url.rstrip("/")
        self.timeout  = timeout
        self.session  = auth.get_session()

    # ------------------------------------------------------------------
    # Personnes — lecture
    # ------------------------------------------------------------------

    def search(self, q: str, page: int = 1, per_page: int = 20) -> Optional[dict]:
        """
        GET /personnes?q=...
        Retourne { data: [...], meta: { page, per_page, total, pages } }.
        """
        return self._get("/personnes", params={
            "q":        q,
            "page":     page,
            "per_page": per_page,
        })

    def list(self, page: int = 1, per_page: int = 20) -> Optional[dict]:
        """GET /personnes — liste paginée sans filtre."""
        return self._get("/personnes", params={
            "page":     page,
            "per_page": per_page,
        })

    def get_by_id(self, personne_id: int) -> Optional[dict]:
        """
        GET /personnes/{id}
        Retourne { personne, aliases, parcours, relations }.
        """
        result = self._get(f"/personnes/{personne_id}")
        return (result or {}).get("data")

    def list_all(self, q: str = "", max_results: int = 500) -> list:
        """Itère sur les pages jusqu'à max_results. Retourne une liste plate."""
        results  = []
        page     = 1
        per_page = min(50, max_results)

        while len(results) < max_results:
            data = (
                self.search(q, page=page, per_page=per_page)
                if q
                else self.list(page=page, per_page=per_page)
            )
            if not data:
                break
            items = data.get("data", [])
            if not items:
                break
            results.extend(items)

            meta  = data.get("meta", {}) or data.get("pager", {})
            total = meta.get("total", 0)
            pages = meta.get("pages") or meta.get("pageCount", 1)
            if page >= pages or len(results) >= total:
                break
            page += 1

        return results[:max_results]

    # ------------------------------------------------------------------
    # Personnes — écriture
    # ------------------------------------------------------------------

    def create(self, data: dict) -> Optional[dict]:
        """POST /personnes"""
        return self._post("/personnes", data)

    def update(self, personne_id: int, data: dict) -> Optional[dict]:
        """PUT /personnes/{id}"""
        return self._put(f"/personnes/{personne_id}", data)

    def delete(self, personne_id: int) -> Optional[dict]:
        """DELETE /personnes/{id}"""
        return self._delete(f"/personnes/{personne_id}")

    def merge(self, source_id: int, target_id: int) -> Optional[dict]:
        """POST /personnes/{sourceId}/merge/{targetId}"""
        return self._post(f"/personnes/{source_id}/merge/{target_id}", {})

    # ------------------------------------------------------------------
    # Aliases
    # ------------------------------------------------------------------

    def alias_list(self, personne_id: int) -> list:
        """GET /personne-aliases?personne_id={id}"""
        data = self._get("/personne-aliases", params={
            "personne_id": personne_id,
            "per_page":    50,
        })
        return (data or {}).get("data", [])

    def alias_create(self, personne_id: int, alias_data: dict) -> Optional[dict]:
        """POST /personne-aliases"""
        return self._post("/personne-aliases", {**alias_data, "personne_id": personne_id})

    def alias_update(self, alias_id: int, alias_data: dict) -> Optional[dict]:
        """PUT /personne-aliases/{id}"""
        return self._put(f"/personne-aliases/{alias_id}", alias_data)

    def alias_delete(self, alias_id: int) -> Optional[dict]:
        """DELETE /personne-aliases/{id}"""
        return self._delete(f"/personne-aliases/{alias_id}")

    # ------------------------------------------------------------------
    # Parcours
    # ------------------------------------------------------------------

    def parcours_list(self, personne_id: int) -> list:
        """GET /personne-parcours?personne_id={id}"""
        data = self._get("/personne-parcours", params={
            "personne_id": personne_id,
            "per_page":    50,
        })
        return (data or {}).get("data", [])

    def parcours_create(self, personne_id: int, parcours_data: dict) -> Optional[dict]:
        """POST /personne-parcours"""
        return self._post("/personne-parcours", {**parcours_data, "personne_id": personne_id})

    def parcours_update(self, parcours_id: int, parcours_data: dict) -> Optional[dict]:
        """PUT /personne-parcours/{id}"""
        return self._put(f"/personne-parcours/{parcours_id}", parcours_data)

    def parcours_delete(self, parcours_id: int) -> Optional[dict]:
        """DELETE /personne-parcours/{id}"""
        return self._delete(f"/personne-parcours/{parcours_id}")

    # ------------------------------------------------------------------
    # HTTP — couche basse
    # ------------------------------------------------------------------

    def _get(self, path: str, params: dict = None) -> Optional[dict]:
        return self._request("GET", path, params=params)

    def _post(self, path: str, data: dict) -> Optional[dict]:
        return self._request("POST", path, json=data)

    def _put(self, path: str, data: dict) -> Optional[dict]:
        return self._request("PUT", path, json=data)

    def _delete(self, path: str) -> Optional[dict]:
        return self._request("DELETE", path)

    def _request(self, method: str, path: str, **kwargs) -> Optional[dict]:
        url = f"{self.base_url}{path}"
        try:
            r = self.session.request(method, url, timeout=self.timeout, **kwargs)
            print(f"[PersonneClient] {method} {r.request.url} → {r.status_code}")
            r.raise_for_status()

            content_type = r.headers.get("Content-Type", "")
            if "application/json" not in content_type:
                print(f"[PersonneClient] Réponse non-JSON — Content-Type: {content_type}")
                return None

            return r.json()

        except requests.HTTPError as e:
            print(f"[PersonneClient] HTTP Error : {e} — {e.response.text[:300]}")
            return None
        except requests.RequestException as e:
            print(f"[PersonneClient] Request Error : {e}")
            return None
