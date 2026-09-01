# services/api/adresse_client.py

"""
Client API Adresse — zealot.fr

Routes :
    GET    /api/adresse
    GET    /api/adresse/like
    GET    /api/adresse/:id
    POST   /api/adresse
    PUT    /api/adresse/:id
    DELETE /api/adresse/:id

Le client ne contient aucune logique BAN.
Le champ ban_id est simplement transmis à l'API lorsqu'il est fourni.
"""

from __future__ import annotations

from typing import Any, Optional

from .BaseApiClient import BaseApiClient


ZEALOT_BASE = "https://zealot.fr/api"


class AdresseClient(BaseApiClient):

    _source = "zealot_adresse"

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
        page: int = 1,
        per_page: int = 20,
    ) -> Optional[dict]:
        """
        GET /adresse?q=...&page=...&per_page=...
        """

        params: dict[str, Any] = {
            "page": max(1, page),
            "per_page": min(100, max(1, per_page)),
        }

        if q and q.strip():
            params["q"] = q.strip()

        data = self.get("/adresse", params)

        self._save(data, "list", params)

        return data

    def get_by_id(self, id_: int) -> Optional[dict]:
        """
        GET /adresse/:id

        Retourne l'adresse enrichie par l'API.
        """

        data = self.get(f"/adresse/{id_}")

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
        GET /adresse/like?q=...&len=...

        Autocomplete.
        """

        q = q.strip()

        if len(q) < 2:
            return []

        params = {
            "q": q,
            "len": min(50, max(1, len_)),
        }

        data = self.get("/adresse/like", params)

        self._save(data, "like", params)

        return (data or {}).get("data", [])

    def list_all(
        self,
        q: Optional[str] = None,
        max_results: int = 1000,
    ) -> list[dict]:
        """
        Parcourt automatiquement les pages de /adresse.
        """

        results: list[dict] = []

        if max_results <= 0:
            return results

        page = 1
        per_page = min(100, max_results)

        while len(results) < max_results:

            data = self.list(
                q=q,
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
        voienom: str,
        codepostal_id: int,
        voietype_id: Optional[int] = None,
        voienumero: Optional[str] = None,
        voierpt: Optional[str] = None,
        voiecharniere: Optional[int] = None,
        complement: Optional[str] = None,
        infodistribution: Optional[str] = None,
        acheminement: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        precision: Optional[str] = None,
        ban_id: Optional[str] = None,
        **kwargs: Any,
    ) -> Optional[dict]:
        """
        POST /adresse

        codepostal_id est obligatoire.

        ban_id est volontairement traité comme un champ ordinaire :
        aucune résolution ou interrogation BAN n'est effectuée ici.
        """

        payload: dict[str, Any] = {
            "voienom": voienom,
            "codepostal_id": codepostal_id,
        }

        optional_fields = {
            "voietype_id": voietype_id,
            "voienumero": voienumero,
            "voierpt": voierpt,
            "voiecharniere": voiecharniere,
            "complement": complement,
            "infodistribution": infodistribution,
            "acheminement": acheminement,
            "latitude": latitude,
            "longitude": longitude,
            "precision": precision,
            "ban_id": ban_id,
        }

        payload.update(
            {
                key: value
                for key, value in optional_fields.items()
                if value is not None
            }
        )

        payload.update(kwargs)

        data = self.post("/adresse", payload)

        self._save(data, "create", payload)

        return (data or {}).get("data")

    def update(
        self,
        id_: int,
        **kwargs: Any,
    ) -> Optional[dict]:
        """
        PUT /adresse/:id
        """

        if not kwargs:
            return self.get_by_id(id_)

        data = self.put(
            f"/adresse/{id_}",
            kwargs,
        )

        self._save(
            data,
            "update",
            {"id": id_, **kwargs},
        )

        return (data or {}).get("data")

    def delete(self, id_: int) -> bool:
        """
        DELETE /adresse/:id
        """

        data = self.delete(f"/adresse/{id_}")

        self._save(
            data,
            "delete",
            {"id": id_},
        )

        return data is not None