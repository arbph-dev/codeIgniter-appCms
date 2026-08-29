# services/api/organisation_client.py
"""
Client API Organisation — zealot.fr

Routes :
    GET    /api/organisation              Liste paginée (q, type, page, per_page)
    GET    /api/organisation/like         Autocomplete (q, len)
    GET    /api/organisation/:id          Détail + type_label
    POST   /api/organisation              Créer
    PUT    /api/organisation/:id          Mettre à jour
    DELETE /api/organisation/:id          Soft delete

Réponse liste :
    {"status": 200, "data": [...], "pager": {"currentPage", "perPage", "total"}}

Usage :
    auth   = store.build_and_login("zealot")
    client = OrganisationClient(auth)
    page   = client.list(q="algue", page=1, per_page=20)
    org    = client.get_by_id(5)
    orgs   = client.list_all(max_results=500)
"""
from __future__ import annotations

from typing import Optional
from .BaseApiClient import BaseApiClient

ZEALOT_BASE = "https://zealot.fr/api"


class OrganisationClient(BaseApiClient):

    _source = "zealot_org"

    def __init__(self, auth, timeout: int = 10, save_samples: bool = False):
        super().__init__(ZEALOT_BASE, auth=auth, timeout=timeout, save_samples=save_samples)

    # ── Lecture ──────────────────────────────────────────────────────

    def list(
        self,
        q:        Optional[str] = None,
        type_id:  Optional[int] = None,
        page:     int = 1,
        per_page: int = 20,
    ) -> Optional[dict]:
        """
        GET /organisation?q=...&type=...&page=...&per_page=...
        Retourne {"status": 200, "data": [...], "pager": {...}}.
        """
        params: dict = {"page": max(1, page), "per_page": min(100, per_page)}
        if q:       params["q"]    = q
        if type_id: params["type"] = type_id

        data = self.get("/organisation", params)
        self._save(data, "list", params)
        return data

    def get_by_id(self, id_: int) -> Optional[dict]:
        """GET /organisation/:id → dict ou None."""
        data = self.get(f"/organisation/{id_}")
        self._save(data, "get_by_id", {"id": id_})
        return (data or {}).get("data")

    def like(self, q: str, len_: int = 10) -> list[dict]:
        """
        GET /organisation/like?q=...&len=...
        → [{id, nom, siren}, ...]   (min 2 car.)
        """
        if len(q.strip()) < 2:
            return []
        data = self.get("/organisation/like", {"q": q.strip(), "len": min(50, len_)})
        self._save(data, "like", {"q": q})
        return (data or {}).get("data", [])

    def list_all(
        self,
        q:           Optional[str] = None,
        type_id:     Optional[int] = None,
        max_results: int = 1000,
    ) -> list[dict]:
        """
        Itère automatiquement sur les pages.
        Retourne une liste plate d'organisations.
        """
        results:  list[dict] = []
        page      = 1
        per_page  = min(50, max_results)

        while len(results) < max_results:
            data = self.list(q=q, type_id=type_id, page=page, per_page=per_page)
            if not data:
                break
            items = data.get("data", [])
            if not items:
                break
            results.extend(items)

            pager      = data.get("pager", {})
            total      = pager.get("total", 0)
            per_p      = pager.get("perPage", per_page)
            total_pages = (total + per_p - 1) // per_p if per_p else 1

            if page >= total_pages:
                break
            page += 1

        return results[:max_results]

    def list_orphans(self, max_results: int = 500) -> list[dict]:
        """
        Organisations sans SIREN (champ siren NULL ou vide).
        Filtre côté client — l'API ne propose pas ce filtre nativement.
        """
        return [
            org for org in self.list_all(max_results=max_results)
            if not org.get("siren")
        ]

    # ── Écriture ─────────────────────────────────────────────────────

    def create(
        self,
        nom:                  str,
        siren:                Optional[str] = None,
        organisation_type_id: int  = 1,
        **kwargs,
    ) -> Optional[dict]:
        """
        POST /organisation
        Crée une organisation seule (sans entreprise associée).
        kwargs : description, site_web, email, telephone, rna, urlreg, ...
        """
        payload = {"nom": nom, "organisation_type_id": organisation_type_id}
        if siren:
            payload["siren"] = siren
        payload.update(kwargs)

        data = self.post("/organisation", payload)
        return (data or {}).get("data")

    def update(self, id_: int, **kwargs) -> Optional[dict]:
        """
        PUT /organisation/:id
        Tous les champs sont optionnels.
        Cas typique du rapprochement :
            client.update(id_=5, siren="448451484", date_creation="2003-04-01")
        """
        data = self.put(f"/organisation/{id_}", kwargs)
        return (data or {}).get("data")

    def delete(self, id_: int) -> bool:
        """DELETE /organisation/:id  (soft delete)."""
        result = self._request("DELETE", f"/organisation/{id_}")
        return result is not None
