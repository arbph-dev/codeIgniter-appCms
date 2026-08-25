# services/api/OpenLibraryClient.py

from typing import Optional
from .BaseApiClient import BaseApiClient

OL_BASE = "https://openlibrary.org"


class OpenLibraryClient(BaseApiClient):
    """
    OpenLibrary — https://openlibrary.org/developers/api

    API publique, sans authentification.

    Usage :
        client = OpenLibraryClient()
        results = client.search_title("Dune")
        books   = [OpenLibraryClient.extract_book(d) for d in results.get("docs", [])]
    """

    _source = "openlibrary"

    def __init__(self, timeout: int = 15, save_samples: bool = False):
        super().__init__(OL_BASE, auth=None, timeout=timeout, save_samples=save_samples)

    # ------------------------------------------------------------------
    # Recherche
    # ------------------------------------------------------------------

    def search_title(self, title: str, limit: int = 20) -> Optional[dict]:
        data = self.get("/search.json", {"title": title, "limit": limit})
        self._save(data, "search_title", {"title": title})
        return data

    def search_author(self, author: str, limit: int = 20) -> Optional[dict]:
        data = self.get("/search.json", {"author": author, "limit": limit})
        self._save(data, "search_author", {"author": author})
        return data

    def search_subject(self, subject: str, limit: int = 20) -> Optional[dict]:
        data = self.get("/search.json", {"subject": subject, "limit": limit})
        self._save(data, "search_subject", {"subject": subject})
        return data

    # ------------------------------------------------------------------
    # ISBN
    # ------------------------------------------------------------------

    def by_isbn(self, isbn: str) -> Optional[dict]:
        data = self.get("/api/books", {
            "bibkeys": f"ISBN:{isbn}",
            "format":  "json",
            "jscmd":   "data",
        })
        self._save(data, "by_isbn", {"isbn": isbn})
        return data

    # ------------------------------------------------------------------
    # Works / Auteurs (clés OL)
    # ------------------------------------------------------------------

    def get_work(self, work_key: str) -> Optional[dict]:
        """
        work_key : "OL45804W" ou "/works/OL45804W"
        → GET /works/OL45804W.json
        """
        key  = work_key if work_key.startswith("/works/") else f"/works/{work_key}"
        data = self.get(f"{key}.json")
        self._save(data, "get_work", {"work_key": work_key})
        return data

    def get_author(self, author_key: str) -> Optional[dict]:
        """
        author_key : "OL23919A" ou "/authors/OL23919A"
        → GET /authors/OL23919A.json
        """
        key  = author_key if author_key.startswith("/authors/") else f"/authors/{author_key}"
        data = self.get(f"{key}.json")
        self._save(data, "get_author", {"author_key": author_key})
        return data

    # ------------------------------------------------------------------
    # Normalisation (futur mapper couche 3)
    # ------------------------------------------------------------------

    @staticmethod
    def extract_book(doc: dict) -> dict:
        """
        Normalise un item docs[] de search.json → dict plat.
        Deviendra OpenLibraryMapper.mapToModel() en couche 3.
        """
        return {
            "title":         doc.get("title"),
            "author":        ", ".join(doc.get("author_name", [])),
            "year":          doc.get("first_publish_year"),
            "isbn":          (doc.get("isbn")      or [None])[0],
            "publisher":     (doc.get("publisher") or [None])[0],
            "language":      (doc.get("language")  or [None])[0],
            "edition_count": doc.get("edition_count"),
            "key":           doc.get("key"),
        }
