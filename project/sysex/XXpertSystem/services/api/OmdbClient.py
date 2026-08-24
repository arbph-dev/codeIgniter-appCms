# services/api/OmdbClient.py

from .BaseApiClient import BaseApiClient


class OmdbClient(BaseApiClient):

    def __init__(self, auth):
        super().__init__(
            base_url="https://www.omdbapi.com",
            auth=auth
        )

    def search(self, title: str) -> dict:
        """
        Recherche par titre.
        → {"Search": [...], "totalResults": "n", "Response": "True"}
        """
        return self.get(params={"s": title})

    def get_movie(self, imdb_id: str) -> dict:
        """
        Fiche complète par imdbID.
        → {"Title": "...", "Year": "...", "Director": "...", ...}
        """
        return self.get(params={"i": imdb_id, "plot": "full"})
