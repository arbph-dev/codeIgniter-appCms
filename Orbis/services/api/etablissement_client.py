# services/api/etablissement_client.py
"""
Client API Établissement — zealot.fr

Routes :
    GET    /etablissement
    GET    /etablissement/like
    GET    /etablissement/:id
    POST   /etablissement
    PUT    /etablissement/:id
    DELETE /etablissement/:id
    GET    /organisation/:id/etablissements
    POST   /organisation/:id/etablissement   → siège (ensureSiege)

Le client ne crée pas d'adresse : passer adresse_id déjà résolu (BAN → AdresseClient).
"""
from __future__ import annotations

from typing import Any, Optional

from .BaseApiClient import BaseApiClient

ZEALOT_BASE = "https://zealot.fr/api"


class EtablissementClient(BaseApiClient):

    _source = "zealot_etab"

    def __init__(self, auth, timeout: int = 10, save_samples: bool = False):
        super().__init__(
            ZEALOT_BASE,
            auth=auth,
            timeout=timeout,
            save_samples=save_samples,
        )

    # ── Lecture ─────────────────────────────────────────────────────

    def list(
        self,
        q: Optional[str] = None,
        org: Optional[int] = None,
        siege: Optional[int] = None,
        actif: Optional[int] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> Optional[dict]:
        """
        GET /etablissement
        Filtres : q, org (organisation_id), siege (0|1), actif (0|1)
        """
        params: dict[str, Any] = {
            "page": max(1, page),
            "per_page": min(100, max(1, per_page)),
        }
        if q and q.strip():
            params["q"] = q.strip()
        if org is not None:
            params["org"] = int(org)
        if siege is not None:
            params["siege"] = int(siege)
        if actif is not None:
            params["actif"] = int(actif)

        data = self.get("/etablissement", params)
        self._save(data, "list", params)
        return data

    def get_by_id(self, id_: int) -> Optional[dict]:
        """GET /etablissement/:id — withRelations + ligne4."""
        data = self.get(f"/etablissement/{id_}")
        self._save(data, "get_by_id", {"id": id_})
        return (data or {}).get("data")

    def like(self, q: str, len_: int = 10) -> list[dict]:
        """GET /etablissement/like — id, siret, nom, organisation_nom."""
        q = q.strip()
        if len(q) < 2:
            return []
        params = {"q": q, "len": min(50, max(1, len_))}
        data = self.get("/etablissement/like", params)
        self._save(data, "like", params)
        return (data or {}).get("data", [])

    def by_organisation(self, organisation_id: int) -> list[dict]:
        """GET /organisation/:id/etablissements — siège en tête."""
        data = self.get(f"/organisation/{organisation_id}/etablissements")
        self._save(data, "by_organisation", {"organisation_id": organisation_id})
        return (data or {}).get("data") or []

    def list_all(
        self,
        q: Optional[str] = None,
        org: Optional[int] = None,
        max_results: int = 1000,
    ) -> list[dict]:
        results: list[dict] = []
        page = 1
        per_page = min(100, max_results)
        while len(results) < max_results:
            data = self.list(q=q, org=org, page=page, per_page=per_page)
            if not data:
                break
            items = data.get("data") or []
            if not items:
                break
            results.extend(items)
            pager = data.get("pager") or {}
            total_pages = pager.get("pageCount")
            if total_pages is None:
                total = pager.get("total", 0)
                per_p = pager.get("perPage", per_page) or per_page
                total_pages = (total + per_p - 1) // per_p if per_p else page
            if page >= total_pages:
                break
            page += 1
        return results[:max_results]

    # ── Écriture ────────────────────────────────────────────────────

    def create(
        self,
        organisation_id: int,
        siret: str,
        *,
        nic: Optional[str] = None,
        nom: Optional[str] = None,
        is_siege: int = 0,
        actif: int = 1,
        adresse_id: Optional[int] = None,
        parent_id: Optional[int] = None,
        code: Optional[str] = None,
        telephone: Optional[str] = None,
        email: Optional[str] = None,
        **kwargs: Any,
    ) -> Optional[dict]:
        """
        POST /etablissement — établissement quelconque (pas ensureSiege).
        nic dérivé côté serveur si absent.
        """
        payload: dict[str, Any] = {
            "organisation_id": organisation_id,
            "siret": siret,
            "is_siege": is_siege,
            "actif": actif,
        }
        optional = {
            "nic": nic,
            "nom": nom,
            "adresse_id": adresse_id,
            "parent_id": parent_id,
            "code": code,
            "telephone": telephone,
            "email": email,
        }
        payload.update({k: v for k, v in optional.items() if v is not None})
        payload.update(kwargs)

        data = self.post("/etablissement", payload)
        self._save(data, "create", payload)
        return (data or {}).get("data")

    def update(self, id_: int, **kwargs: Any) -> Optional[dict]:
        """PUT /etablissement/:id — ex. adresse_id, telephone, nom."""
        if not kwargs:
            return self.get_by_id(id_)
        data = self.put(f"/etablissement/{id_}", kwargs)
        self._save(data, "update", {"id": id_, **kwargs})
        return (data or {}).get("data")

    def delete(self, id_: int) -> bool:
        """DELETE /etablissement/:id — hard delete."""
        data = self.delete(f"/etablissement/{id_}")
        self._save(data, "delete", {"id": id_})
        return data is not None

    def ensure_siege(
        self,
        organisation_id: int,
        siret: str,
        *,
        adresse_id: Optional[int] = None,
        nom: Optional[str] = None,
        siren: Optional[str] = None,
    ) -> Optional[dict]:
        """
        POST /organisation/:id/etablissement
        Délègue à EntrepriseService::ensureSiege (un seul is_siege=1).
        """
        payload: dict[str, Any] = {"siret": siret}
        if adresse_id is not None:
            payload["adresse_id"] = adresse_id
        if nom:
            payload["nom"] = nom
        if siren:
            payload["siren"] = siren

        data = self.post(
            f"/organisation/{organisation_id}/etablissement",
            payload,
        )
        self._save(
            data,
            "ensure_siege",
            {"organisation_id": organisation_id, **payload},
        )
        return (data or {}).get("data")
