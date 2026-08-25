# services/api/personne_client.py

from typing import Optional
from .BaseApiClient import BaseApiClient

PERSONNE_BASE = "https://zealot.fr/api"


class PersonneClient(BaseApiClient):
    """
    Client API Personne — zealot.fr

    Usage :
        auth   = store.build_and_login("zealot")
        client = PersonneClient(auth)
        data   = client.search("de Gaulle")
        fiche  = client.get_by_id(1)
    """

    _source = "zealot_personne"

    def __init__(
        self,
        auth,
        base_url:     str  = PERSONNE_BASE,
        timeout:      int  = 10,
        save_samples: bool = False,
    ):
        super().__init__(base_url, auth=auth, timeout=timeout, save_samples=save_samples)

    # ------------------------------------------------------------------
    # Personnes — lecture
    # ------------------------------------------------------------------

    def search(self, q: str, page: int = 1, per_page: int = 20) -> Optional[dict]:
        data = self.get("/personnes", {"q": q, "page": page, "per_page": per_page})
        self._save(data, "search", {"q": q})
        return data

    def list(self, page: int = 1, per_page: int = 20) -> Optional[dict]:
        return self.get("/personnes", {"page": page, "per_page": per_page})

    def get_by_id(self, personne_id: int) -> Optional[dict]:
        result = self.get(f"/personnes/{personne_id}")
        self._save(result, "get_by_id", {"id": personne_id})
        return (result or {}).get("data")

    def list_all(self, q: str = "", max_results: int = 500) -> list:
        results  = []
        page     = 1
        per_page = min(50, max_results)

        while len(results) < max_results:
            data = self.search(q, page=page, per_page=per_page) if q else self.list(page=page, per_page=per_page)
            if not data:
                break
            items = data.get("data", [])
            if not items:
                break
            results.extend(items)
            meta  = data.get("meta") or data.get("pager", {})
            pages = meta.get("pages") or meta.get("pageCount", 1)
            if page >= pages or len(results) >= meta.get("total", 0):
                break
            page += 1

        return results[:max_results]

    # ------------------------------------------------------------------
    # Personnes — écriture
    # ------------------------------------------------------------------

    def create(self, data: dict) -> Optional[dict]:
        return self.post("/personnes", data)

    def update(self, personne_id: int, data: dict) -> Optional[dict]:
        return self.put(f"/personnes/{personne_id}", data)

    def delete_personne(self, personne_id: int) -> Optional[dict]:
        return self.delete(f"/personnes/{personne_id}")

    def merge(self, source_id: int, target_id: int) -> Optional[dict]:
        return self.post(f"/personnes/{source_id}/merge/{target_id}", {})

    # ------------------------------------------------------------------
    # Aliases
    # ------------------------------------------------------------------

    def alias_list(self, personne_id: int) -> list:
        data = self.get("/personne-aliases", {"personne_id": personne_id, "per_page": 50})
        return (data or {}).get("data", [])

    def alias_create(self, personne_id: int, alias_data: dict) -> Optional[dict]:
        return self.post("/personne-aliases", {**alias_data, "personne_id": personne_id})

    def alias_update(self, alias_id: int, alias_data: dict) -> Optional[dict]:
        return self.put(f"/personne-aliases/{alias_id}", alias_data)

    def alias_delete(self, alias_id: int) -> Optional[dict]:
        return self.delete(f"/personne-aliases/{alias_id}")

    # ------------------------------------------------------------------
    # Parcours
    # ------------------------------------------------------------------

    def parcours_list(self, personne_id: int) -> list:
        data = self.get("/personne-parcours", {"personne_id": personne_id, "per_page": 50})
        return (data or {}).get("data", [])

    def parcours_create(self, personne_id: int, parcours_data: dict) -> Optional[dict]:
        return self.post("/personne-parcours", {**parcours_data, "personne_id": personne_id})

    def parcours_update(self, parcours_id: int, parcours_data: dict) -> Optional[dict]:
        return self.put(f"/personne-parcours/{parcours_id}", parcours_data)

    def parcours_delete(self, parcours_id: int) -> Optional[dict]:
        return self.delete(f"/personne-parcours/{parcours_id}")
