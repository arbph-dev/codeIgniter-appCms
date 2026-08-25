# services/api/OmdbClient.py
from typing import Optional
from .BaseApiClient import BaseApiClient

OMDB_BASE = "https://www.omdbapi.com"


class OmdbClient(BaseApiClient):
    """
    Client OMDB — Open Movie Database

    Auth : ApiKeyAuth(api_key=..., query_name="apikey")
           La clé est injectée automatiquement par BaseApiClient._request()

    Usage :
        auth   = store.build_auth("omdb")          # build_auth, pas build_and_login
        client = OmdbClient(auth)

        results = client.search("Dune")
        movie   = client.get_movie(results["Search"][0]["imdbID"])
        print(movie["Title"], movie["Director"])
    """

    _source = "omdb"

    def __init__(self, auth, timeout: int = 10, save_samples: bool = False):
        super().__init__(OMDB_BASE, auth=auth, timeout=timeout, save_samples=save_samples)

    def search(self, title: str, type_: str = None, year: str = None) -> Optional[dict]:
        """
        Recherche par titre.
        → {"Search": [...], "totalResults": "n", "Response": "True"}

        type_ : "movie" | "series" | "episode"
        year  : ex "2021"
        """
        params = {"s": title}
        if type_: params["type"] = type_
        if year:  params["y"]    = year
        data = self.get(params=params)
        self._save(data, "search", {"title": title})
        return data

    def get_movie(self, imdb_id: str, plot: str = "full") -> Optional[dict]:
        """
        Fiche complète par imdbID.
        → {"Title": "...", "Year": "...", "Director": "...", ...}
        """
        data = self.get(params={"i": imdb_id, "plot": plot})
        self._save(data, "get_movie", {"imdb_id": imdb_id})
        return data

    def get_by_title(self, title: str, year: str = None) -> Optional[dict]:
        """Fiche exacte par titre (recherche t=, différent de s=)."""
        params = {"t": title, "plot": "full"}
        if year: params["y"] = year
        data = self.get(params=params)
        self._save(data, "get_by_title", {"title": title})
        return data
