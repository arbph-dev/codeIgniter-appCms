# services/api/poligraph_client.py

from typing import Optional

from .BaseApiClient import BaseApiClient


POLIGRAPH_BASE = "https://poligraph.fr/api"


class PoligraphClient(BaseApiClient):
    """
    Client Python pour l'API publique Poligraph.

    API :
        https://poligraph.fr/api

    Documentation :
        https://poligraph.fr/docs/api

    Authentification :
        aucune.

    Pagination JSON :
        page  : numéro de page, défaut 1
        limit : nombre d'éléments, maximum 100

    Identifiants stables :
        PG = politique
        AF = affaire
        FC = fact-check
        SC = scrutin
        PT = parti
        EL = élection
        MA = mandat
        DO = dossier législatif
        GP = groupe parlementaire
        LM = liste municipale

    Usage :
        client = PoligraphClient()
        data = client.list_politiques()
        data = client.get_politique("jean-luc-melenchon")
        data = client.get_poligraph_id("PG-000001")
    """

    _source = "poligraph"

    def __init__(
        self,
        auth=None,
        timeout: int = 20,
        save_samples: bool = False,
    ):
        super().__init__(
            POLIGRAPH_BASE,
            auth=auth,
            timeout=timeout,
            save_samples=save_samples,
        )

    # ------------------------------------------------------------------
    # POLITIQUES
    # ------------------------------------------------------------------

    def list_politiques(
        self,
        page: int = 1,
        limit: int = 20,
        **filters,
    ) -> Optional[dict]:
        """
        Liste les représentants politiques.

        Les filtres sont transmis tels quels à l'API afin de ne pas
        figer prématurément le contrat des filtres Swagger.
        """
        params = self._pagination(page, limit)
        params.update(self._clean_filters(filters))

        data = self.get("/politiques", params)

        self._save(
            data,
            "list_politiques",
            params,
        )

        return data

    def get_politique(
        self,
        slug: str,
    ) -> Optional[dict]:
        """
        Détail d'un représentant politique par slug.
        """
        data = self.get(f"/politiques/{slug}")

        self._save(
            data,
            "get_politique",
            {"slug": slug},
        )

        return data

    def politique_affaires(
        self,
        slug: str,
        page: int = 1,
        limit: int = 20,
        **filters,
    ) -> Optional[dict]:
        """
        Affaires judiciaires d'un représentant.
        """
        params = self._pagination(page, limit)
        params.update(self._clean_filters(filters))

        data = self.get(
            f"/politiques/{slug}/affaires",
            params,
        )

        self._save(
            data,
            "politique_affaires",
            {"slug": slug, **params},
        )

        return data

    def politique_votes(
        self,
        slug: str,
        page: int = 1,
        limit: int = 20,
        **filters,
    ) -> Optional[dict]:
        """
        Votes parlementaires d'un représentant.
        """
        params = self._pagination(page, limit)
        params.update(self._clean_filters(filters))

        data = self.get(
            f"/politiques/{slug}/votes",
            params,
        )

        self._save(
            data,
            "politique_votes",
            {"slug": slug, **params},
        )

        return data

    def politique_relations(
        self,
        slug: str,
        page: int = 1,
        limit: int = 20,
        **filters,
    ) -> Optional[dict]:
        """
        Relations d'un représentant.
        """
        params = self._pagination(page, limit)
        params.update(self._clean_filters(filters))

        data = self.get(
            f"/politiques/{slug}/relations",
            params,
        )

        self._save(
            data,
            "politique_relations",
            {"slug": slug, **params},
        )

        return data

    # ------------------------------------------------------------------
    # AFFAIRES
    # ------------------------------------------------------------------

    def list_affaires(
        self,
        page: int = 1,
        limit: int = 20,
        **filters,
    ) -> Optional[dict]:
        """
        Liste les affaires judiciaires documentées.

        Exemples de filtres documentés :
            statusCode
            categoryCode
            severityCode
            involvement

        Exemple :
            client.list_affaires(
                statusCode="CONDAMNATION_DEFINITIVE"
            )
        """
        params = self._pagination(page, limit)
        params.update(self._clean_filters(filters))

        data = self.get("/affaires", params)

        self._save(
            data,
            "list_affaires",
            params,
        )

        return data

    # ------------------------------------------------------------------
    # VOTES
    # ------------------------------------------------------------------

    def list_votes(
        self,
        page: int = 1,
        limit: int = 20,
        **filters,
    ) -> Optional[dict]:
        """
        Liste les scrutins/votes parlementaires.
        """
        params = self._pagination(page, limit)
        params.update(self._clean_filters(filters))

        data = self.get("/votes", params)

        self._save(
            data,
            "list_votes",
            params,
        )

        return data

    # ------------------------------------------------------------------
    # PARTIS
    # ------------------------------------------------------------------

    def list_partis(
        self,
        page: int = 1,
        limit: int = 20,
        **filters,
    ) -> Optional[dict]:
        """
        Liste les partis politiques.
        """
        params = self._pagination(page, limit)
        params.update(self._clean_filters(filters))

        data = self.get("/partis", params)

        self._save(
            data,
            "list_partis",
            params,
        )

        return data

    def get_parti(
        self,
        slug: str,
    ) -> Optional[dict]:
        """
        Détail d'un parti politique par slug.
        """
        data = self.get(f"/partis/{slug}")

        self._save(
            data,
            "get_parti",
            {"slug": slug},
        )

        return data

    # ------------------------------------------------------------------
    # MANDATS
    # ------------------------------------------------------------------

    def list_mandats(
        self,
        page: int = 1,
        limit: int = 20,
        **filters,
    ) -> Optional[dict]:
        """
        Liste des mandats politiques.
        """
        params = self._pagination(page, limit)
        params.update(self._clean_filters(filters))

        data = self.get("/mandats", params)

        self._save(
            data,
            "list_mandats",
            params,
        )

        return data

    # ------------------------------------------------------------------
    # ELECTIONS
    # ------------------------------------------------------------------

    def list_elections(
        self,
        page: int = 1,
        limit: int = 20,
        **filters,
    ) -> Optional[dict]:
        """
        Liste des élections.
        """
        params = self._pagination(page, limit)
        params.update(self._clean_filters(filters))

        data = self.get("/elections", params)

        self._save(
            data,
            "list_elections",
            params,
        )

        return data

    def get_election(
        self,
        slug: str,
    ) -> Optional[dict]:
        """
        Détail d'une élection par slug.
        """
        data = self.get(f"/elections/{slug}")

        self._save(
            data,
            "get_election",
            {"slug": slug},
        )

        return data

    # ------------------------------------------------------------------
    # POLIGRAPH ID
    # ------------------------------------------------------------------

    def get_poligraph_id(
        self,
        poligraph_id: str,
    ) -> Optional[dict]:
        """
        Résolution d'un poligraphId.

        Exemple :
            PG-000542
            AF-000042

        Attention :
            /id/{poligraphId} est documenté comme une URL canonique
            résolue par redirection HTTP 308.

        Cette méthode est donc surtout prévue pour conserver une
        interface métier explicite côté client.
        """
        data = self.get(f"/id/{poligraph_id}")

        self._save(
            data,
            "get_poligraph_id",
            {"poligraphId": poligraph_id},
        )

        return data

    # ------------------------------------------------------------------
    # PAGINATION
    # ------------------------------------------------------------------

    @staticmethod
    def _pagination(
        page: int,
        limit: int,
    ) -> dict:
        """
        Construit les paramètres de pagination Poligraph.

        L'API documente :
            page  >= 1
            limit <= 100
        """
        page = max(1, int(page))
        limit = min(100, max(1, int(limit)))

        return {
            "page": page,
            "limit": limit,
        }

    @staticmethod
    def _clean_filters(
        filters: dict,
    ) -> dict:
        """
        Supprime les paramètres None.

        Permet notamment :

            list_affaires(
                statusCode="CONDAMNATION_DEFINITIVE",
                categoryCode=None,
            )

        de produire uniquement le paramètre utile.
        """
        return {
            key: value
            for key, value in filters.items()
            if value is not None
        }

    # ------------------------------------------------------------------
    # PAGINATION AUTOMATIQUE
    # ------------------------------------------------------------------

    def search_all(
        self,
        method,
        max_results: int = 1000,
        **kwargs,
    ) -> list:
        """
        Récupère automatiquement toutes les pages d'une méthode
        de liste Poligraph.

        Exemple :

            results = client.search_all(
                client.list_affaires,
                max_results=500,
                statusCode="CONDAMNATION_DEFINITIVE",
            )

        La méthode appelée doit retourner le format standard :

            {
                "data": [...],
                "pagination": {
                    "page": 1,
                    "limit": 100,
                    "total": 260,
                    "totalPages": 3
                }
            }
        """
        results = []

        page = int(kwargs.pop("page", 1))
        limit = min(
            100,
            max(1, int(kwargs.pop("limit", 100))),
        )

        while len(results) < max_results:
            data = method(
                page=page,
                limit=limit,
                **kwargs,
            )

            if not data:
                break

            items = data.get("data", [])

            if not items:
                break

            results.extend(items)

            pagination = data.get("pagination", {})

            total_pages = pagination.get("totalPages")

            if total_pages is None:
                break

            if page >= total_pages:
                break

            page += 1

        return results[:max_results]