# services/api/OpenLibraryClient.py

from .BaseApiClient import BaseApiClient


class OpenLibraryClient(BaseApiClient):
    """
    OpenLibrary
    https://openlibrary.org/developers/api

    API publique sans authentification.
    """

    def __init__(self):
        super().__init__(
            base_url="https://openlibrary.org",
            auth=None
        )

    # ------------------------------------------------------------------
    # Recherche
    # ------------------------------------------------------------------

    def search_title( self, title: str, limit: int = 20 ) -> dict:
        return self.get( "/search.json", params={ "title": title, "limit": limit } )

    def search_subject( self, subject: str, limit: int = 20) -> dict:
        return self.get("/search.json", params={ "subject": subject, "limit": limit } )

    def search_author( self, author: str, limit: int = 20 ) -> dict:
        return self.get( "/search.json", params={ "author": author,"limit": limit} )

    # ------------------------------------------------------------------
    # ISBN
    # ------------------------------------------------------------------

    def by_isbn( self, isbn: str ) -> dict:
        return self.get( "/api/books", params={ "bibkeys": f"ISBN:{isbn}", "format": "json", "jscmd": "data" } )

    # ------------------------------------------------------------------
    # Works
    # ------------------------------------------------------------------

    def get_work(
        self,
        work_key: str
    ) -> dict:
        """
        Exemple :
            /works/OL45804W.json
        """
        if not work_key.startswith("/works/"):
            work_key = f"/works/{work_key}"

        return self.get(
            f"{work_key}.json"
        )

    # ------------------------------------------------------------------
    # Auteurs
    # ------------------------------------------------------------------

    def get_author(
        self,
        author_key: str
    ) -> dict:
        """
        Exemple :
            /authors/OL23919A.json
        """
        if not author_key.startswith("/authors/"):
            author_key = f"/authors/{author_key}"

        return self.get(
            f"{author_key}.json"
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def extract_book(doc: dict) -> dict:
        """
        Normalisation légère d'un résultat search.json.
        """

        return {
            "title": doc.get("title"),
            "author": ", ".join(doc.get("author_name", [])),
            "year": doc.get("first_publish_year"),
            "isbn": (doc.get("isbn") or [None])[0],
            "publisher": (doc.get("publisher") or [None])[0],
            "language": (doc.get("language") or [None])[0],
            "edition_count": doc.get("edition_count"),
            "key": doc.get("key")
        }