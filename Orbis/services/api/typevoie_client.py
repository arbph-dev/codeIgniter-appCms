# services/api/typevoie_client.py

"""
Client API TypeVoie — zealot.fr

Référentiel CRUD :
    GET    /api/typevoie
    GET    /api/typevoie/:id
    GET    /api/typevoie/like
    POST   /api/typevoie
    PUT    /api/typevoie/:id
    DELETE /api/typevoie/:id
"""

from __future__ import annotations

from typing import Any, Optional

from .BaseApiClient import BaseApiClient


ZEALOT_BASE = "https://zealot.fr/api"


class TypeVoieClient(BaseApiClient):

    _source = "zealot_typevoie"

    def __init__(
        self,
        auth,
        timeout: int = 10,
        save_samples: bool = False,
    ):
        super().__init__(
            ZEALOT_BASE,
            auth=auth,
            timeout=timeout,
            save_samples=save_samples,
        )

    # ------------------------------------------------------------------
    # Lecture
    # ------------------------------------------------------------------

    def list(
        self,
        q: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> Optional[dict]:
        """
        GET /typevoie?q=...&status=...&page=...&per_page=...
        """

        params: dict[str, Any] = {
            "page": max(1, page),
            "per_page": max(1, per_page),
        }

        if q and q.strip():
            params["q"] = q.strip()

        if status is not None:
            params["status"] = status

        data = self.get("/typevoie", params)

        self._save(data, "list", params)

        return data

    def get_by_id(self, id_: int) -> Optional[dict]:
        """
        GET /typevoie/:id
        """

        data = self.get(f"/typevoie/{id_}")

        self._save(
            data,
            "get_by_id",
            {"id": id_},
        )

        return (data or {}).get("data")

    def like(
        self,
        q: str,
        len_: int = 10,
    ) -> list[dict]:
        """
        GET /typevoie/like?q=...&len=...
        """

        q = q.strip()

        if len(q) < 2:
            return []

        params = {
            "q": q,
            "len": min(50, max(1, len_)),
        }

        data = self.get(
            "/typevoie/like",
            params,
        )

        self._save(data, "like", params)

        return (data or {}).get("data", [])

    def list_all(
        self,
        q: Optional[str] = None,
        status: Optional[str] = None,
        max_results: int = 1000,
    ) -> list[dict]:
        """
        Parcourt automatiquement les pages de /typevoie.
        """

        results: list[dict] = []

        if max_results <= 0:
            return results

        page = 1
        per_page = min(100, max_results)

        while len(results) < max_results:

            data = self.list(
                q=q,
                status=status,
                page=page,
                per_page=per_page,
            )

            if not data:
                break

            items = data.get("data", [])

            if not items:
                break

            results.extend(items)

            pager = data.get("pager", {})

            total = pager.get("total", 0)
            current_page = pager.get("currentPage", page)
            total_pages = pager.get("pageCount")

            if total_pages is None:
                per_p = pager.get("perPage", per_page)

                if per_p:
                    total_pages = (
                        total + per_p - 1
                    ) // per_p
                else:
                    total_pages = current_page

            if current_page >= total_pages:
                break

            page += 1

        return results[:max_results]

    # ------------------------------------------------------------------
    # Écriture
    # ------------------------------------------------------------------

    def create(
        self,
        id_: int,
        nom: str,
    ) -> Optional[dict]:
        """
        POST /typevoie

        L'API exige explicitement :
            {
                "id": 64,
                "nom": "Voie verte"
            }
        """

        payload = {
            "id": id_,
            "nom": nom,
        }

        data = self.post(
            "/typevoie",
            payload,
        )

        self._save(data, "create", payload)

        return (data or {}).get("data")

    def update(
        self,
        id_: int,
        nom: str,
    ) -> Optional[dict]:
        """
        PUT /typevoie/:id
        """

        payload = {
            "nom": nom,
        }

        data = self.put(
            f"/typevoie/{id_}",
            payload,
        )

        self._save(
            data,
            "update",
            {"id": id_, **payload},
        )

        return (data or {}).get("data")

    def delete(self, id_: int) -> bool:
        """
        DELETE /typevoie/:id
        """

        data = self.delete(
            f"/typevoie/{id_}",
        )

        self._save(
            data,
            "delete",
            {"id": id_},
        )

        return data is not None