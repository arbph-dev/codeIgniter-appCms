# services/api/image_client.py
"""
Client API Image — Zealot.

Endpoints couverts :
    GET    /api/image
    GET    /api/image/:id
    GET    /api/image/like
    PUT    /api/image/:id
    DELETE /api/image/:id

Upload volontairement non implémenté pour le moment.

Important :
    L'upload devra utiliser self._request() avec multipart/form-data
    (files=..., data=...) et non BaseApiClient.post(), qui est prévu
    pour du JSON.
"""

from __future__ import annotations

import os
import webbrowser
from typing import Any, Optional

from services.api.BaseApiClient import BaseApiClient


ZEALOT_BASE = "https://zealot.fr/api"
ZEALOT_WEB = "https://zealot.fr"


class ImageClient(BaseApiClient):
    """Client HTTP pour l'API Image de Zealot."""

    _source = "zealot_image"

    def __init__(
        self,
        auth=None,
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
    # LISTE
    # ------------------------------------------------------------------

    def list(
        self,
        q: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        per_page: int = 10,
    ) -> Optional[dict]:
        """
        Liste paginée des images.

        Paramètres API :
            q        : recherche filename / alt / path
            status   : pending / validated / rejected
            page
            per_page

        Retourne la réponse API complète.
        """
        params: dict[str, Any] = {
            "page": page,
            "per_page": per_page,
        }

        if q:
            params["q"] = q

        if status:
            params["status"] = status

        data = self.get("/image", params=params)

        self._save(
            data,
            "list",
            params=params,
        )

        return data

    # ------------------------------------------------------------------
    # FICHE
    # ------------------------------------------------------------------

    def get_by_id(
        self,
        id_: int,
        include: Optional[str] = None,
    ) -> Optional[dict]:
        """
        Récupère une image par son identifiant.

        include="mots" permet de demander les mots associés
        directement depuis l'API Image.
        """
        params = {}

        if include:
            params["include"] = include

        data = self.get(
            f"/image/{id_}",
            params=params or None,
        )

        self._save(
            data,
            "get_by_id",
            params=params or None,
        )

        return (data or {}).get("data")

    # ------------------------------------------------------------------
    # RECHERCHE RAPIDE
    # ------------------------------------------------------------------

    def like(
        self,
        q: str,
        len_: int = 10,
    ) -> list[dict]:
        """
        Recherche rapide via /image/like.

        L'API retourne une liste réduite :
            id
            filename
            alt
            path
        """
        params = {
            "q": q,
            "len": len_,
        }

        data = self.get(
            "/image/like",
            params=params,
        )

        self._save(
            data,
            "like",
            params=params,
        )

        return (data or {}).get("data", [])

    # ------------------------------------------------------------------
    # TOUTES LES IMAGES
    # ------------------------------------------------------------------

    def list_all(
        self,
        q: Optional[str] = None,
        status: Optional[str] = None,
        max_results: int = 1000,
        per_page: int = 100,
    ) -> list[dict]:
        """
        Récupère les images sur plusieurs pages.

        Arrêt lorsque :
            - aucune donnée n'est retournée ;
            - le nombre total atteint max_results ;
            - la pagination indique qu'il n'y a plus de page.
        """
        results: list[dict] = []
        page = 1

        while len(results) < max_results:
            data = self.list(
                q=q,
                status=status,
                page=page,
                per_page=per_page,
            )

            if not data:
                break

            rows = data.get("data") or []

            if not rows:
                break

            remaining = max_results - len(results)
            results.extend(rows[:remaining])

            pager = data.get("pager") or {}

            current_page = pager.get("currentPage", page)
            total_pages = pager.get("pageCount")

            if total_pages is not None:
                if current_page >= total_pages:
                    break
            elif len(rows) < per_page:
                break

            page += 1

        return results

    # ------------------------------------------------------------------
    # MODIFICATION
    # ------------------------------------------------------------------

    def update(
        self,
        id_: int,
        alt: Optional[str] = None,
        status: Optional[str] = None,
    ) -> Optional[dict]:
        """
        Modifie les champs autorisés par l'API Image.

        PUT /api/image/:id accepte uniquement :
            alt
            status
        """
        payload: dict[str, Any] = {}

        if alt is not None:
            payload["alt"] = alt

        if status is not None:
            payload["status"] = status

        if not payload:
            return self.get_by_id(id_)

        data = self._request(
            "PUT",
            f"/image/{id_}",
            json=payload,
        )

        self._save(
            data,
            "update",
            params={"id": id_},
        )

        return (data or {}).get("data")

    # ------------------------------------------------------------------
    # SUPPRESSION
    # ------------------------------------------------------------------

    def delete(self, id_: int) -> Optional[dict]:
        """
        Supprime l'image.

        Le contrôleur supprime également le fichier physique associé.
        """
        data = self._request(
            "DELETE",
            f"/image/{id_}",
        )

        self._save(
            data,
            "delete",
            params={"id": id_},
        )

        return data

    # ------------------------------------------------------------------
    # URL / VISUALISATION
    # ------------------------------------------------------------------

    @staticmethod
    def build_url(path: Optional[str]) -> Optional[str]:
        """
        Transforme le path retourné par l'API en URL web complète.

        Exemple :
            /assets/img/uploads/photo.jpg
            ->
            https://zealot.fr/assets/img/uploads/photo.jpg
        """
        if not path:
            return None

        path = str(path).strip()

        if not path:
            return None

        if path.startswith(("http://", "https://")):
            return path

        return f"{ZEALOT_WEB}/{path.lstrip('/')}"

    def get_url(
        self,
        image: dict | str,
    ) -> Optional[str]:
        """
        Construit l'URL d'une image.

        Accepte :
            - un dict image retourné par l'API ;
            - directement un path.
        """
        if isinstance(image, dict):
            return self.build_url(image.get("path"))

        return self.build_url(image)

    def open_in_browser(
        self,
        image: dict | str,
    ) -> bool:
        """
        Ouvre l'image dans le navigateur Windows par défaut.

        Aucun téléchargement local :
        le navigateur ouvre directement l'URL publique.
        """
        url = self.get_url(image)

        if not url:
            return False

        try:
            # Windows : ouverture directe avec l'association système.
            if os.name == "nt":
                os.startfile(url)  # type: ignore[attr-defined]
            else:
                webbrowser.open(url)

            return True

        except OSError:
            # Fallback générique.
            return webbrowser.open(url)

    def open_by_id(
        self,
        id_: int,
    ) -> bool:
        """
        Récupère une image puis ouvre son URL dans le navigateur.
        """
        image = self.get_by_id(id_)

        if not image:
            return False

        return self.open_in_browser(image)

    # ------------------------------------------------------------------
    # UPLOAD — À VENIR
    # ------------------------------------------------------------------
    #
    # NE PAS utiliser BaseApiClient.post() pour l'upload.
    #
    # Lorsque l'upload sera implémenté, il devra passer par :
    #
    #     self._request(
    #         "POST",
    #         "/image",
    #         files={"file": (...)},
    #         data={...},
    #     )
    #
    # afin de conserver multipart/form-data.
    #
    # ------------------------------------------------------------------