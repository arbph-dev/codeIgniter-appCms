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

    Ressources :
        politiques
        affaires
        votes
        partis
        mandats
        elections

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

        data = client.politique_affaires("jean-luc-melenchon")
        data = client.politique_votes("jean-luc-melenchon")
        data = client.politique_relations("jean-luc-melenchon")

        data = client.list_affaires()
        data = client.list_votes()
        data = client.list_partis()
        data = client.get_parti("la-france-insoumise")
        data = client.list_mandats()
        data = client.list_elections()
        data = client.get_election("europeennes-2029")

    Remarque :
        /id/{poligraphId} est une route web canonique qui effectue
        une redirection HTTP vers une URL /politiques/{slug}.
        Sa résolution sera traitée ultérieurement par un
        PoligraphIdResolver dédié.
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
    ) -> Optional[dict]:
        """
        Liste les représentants politiques.

        Contrat observé :
            GET /politiques?page={page}&limit={limit}

        Pagination :
            page
            limit
            total
            totalPages

        Important :
            Aucun paramètre de recherche n'est documenté pour cet
            endpoint.

            Les tests ont notamment montré que les paramètres :
                q
                slug
                politicianSlug

            ne filtrent pas la collection /politiques.

            Ils ne font donc pas partie du contrat du client.
        """
        params = self._pagination(page, limit)

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

        GET /politiques/{slug}
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

        GET /politiques/{slug}/affaires
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

        GET /politiques/{slug}/votes
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

        GET /politiques/{slug}/relations
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

        Filtres documentés :
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

        GET /votes
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

        GET /partis
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

        GET /partis/{slug}
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
        Liste les mandats politiques.

        GET /mandats
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
        Liste les élections.

        GET /elections
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

        GET /elections/{slug}
        """
        data = self.get(f"/elections/{slug}")

        self._save(
            data,
            "get_election",
            {"slug": slug},
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

        Contrat observé :
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
        Supprime les paramètres dont la valeur est None.

        Exemple :

            list_affaires(
                statusCode="CONDAMNATION_DEFINITIVE",
                categoryCode=None,
            )

        produit uniquement :

            {
                "statusCode": "CONDAMNATION_DEFINITIVE"
            }
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
        Récupère automatiquement plusieurs pages d'une méthode
        de liste Poligraph.

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

        Exemple :

            results = client.search_all(
                client.list_affaires,
                max_results=500,
                statusCode="CONDAMNATION_DEFINITIVE",
            )

        Paramètres :
            max_results :
                nombre maximum d'éléments retournés.

            page :
                page initiale facultative.

            limit :
                taille de page facultative, plafonnée à 100.

        Retour :
            liste des éléments métier contenus dans "data".
        """
        results = []

        page = int(kwargs.pop("page", 1))

        limit = min(
            100,
            max(1, int(kwargs.pop("limit", 100))),
        )

        max_results = max(0, int(max_results))

        if max_results == 0:
            return results

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