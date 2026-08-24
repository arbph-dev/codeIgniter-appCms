"""
ci_client/codesnaf.py
Client pour l'API CodeNaf de zealot.fr — lecture seule.

Routes couvertes :
    GET /api/codesnaf                   → liste paginée
    GET /api/codesnaf?q=terme           → recherche par nom
    GET /api/codesnaf/{code}            → fiche par code NAF
    GET /api/codesnaf/like?q=term&len=n → autocomplete
    GET /api/codesnaf/{code}/children   → enfants directs
    GET /api/codesnaf/{code}/hierarchy  → hiérarchie vers la racine
    GET /api/codesnaf/tree              → arbre complet

Structure d'un CodeNaf :
    { "codenaf": "68.10Z", "nom": "Activités des marchands...", "parentcode": "68.1" }

Usage :
    from services.auth import CredentialsStore
    store = CredentialsStore("./data/credentials.db")
    auth  = store.build_and_login("zealot")
    naf   = CodeNafClient("https://zealot.fr/api", auth=auth)
    item  = naf.get("68.10Z")
"""
import requests
from typing import Optional


class CodeNafClient:

    def __init__(self, base_url: str, auth=None, timeout: int = 10):
        """
        base_url : ex "https://zealot.fr/api"
        auth     : AuthProvider (BearerAuth, ApiKeyAuth...)
                   Si fourni, utilise sa session (token déjà injecté).
        """
        self.base_url = base_url.rstrip("/")
        self.timeout  = timeout
        self.session  = auth.get_session() if auth else requests.Session()
        if not auth:
            self.session.headers.update({"Accept": "application/json"})
        self._cache: dict[str, dict] = {}

    # ------------------------------------------------------------------
    # Lecture
    # ------------------------------------------------------------------
    def get(self, code: str) -> Optional[dict]:
        """
        Fiche par code NAF exact.
        → {"codenaf": "68.10Z", "nom": "...", "parentcode": "68.1"}
        """
        if code in self._cache:
            return self._cache[code]
        try:
            r = self.session.get(
                f"{self.base_url}/codesnaf/{code}",
                timeout=self.timeout
            )
            if r.status_code == 404:
                return None
            r.raise_for_status()
            item = r.json()
            self._cache[code] = item
            return item
        except requests.HTTPError as e:
            print(f"[CodeNaf] HTTP Error get({code}) : {e.response.status_code}")
            return None
        except requests.RequestException as e:
            print(f"[CodeNaf] Request Error : {e}")
            return None

    def search(self, q: str, per_page: int = 20, page: int = 1) -> dict:
        """Recherche par nom ou code. → {"data": [...], "pager": {...}}"""
        try:
            r = self.session.get(
                f"{self.base_url}/codesnaf",
                params={"q": q, "perPage": per_page, "page": page},
                timeout=self.timeout
            )
            r.raise_for_status()
            return r.json()
        except requests.HTTPError as e:
            print(f"[CodeNaf] HTTP Error search({q!r}) : {e.response.status_code}")
            return {"data": [], "pager": {}}
        except requests.RequestException as e:
            print(f"[CodeNaf] Request Error : {e}")
            return {"data": [], "pager": {}}

    def like(self, q: str, len_: int = 10) -> list[dict]:
        """Autocomplete léger → [{"codenaf", "nom"}, ...]"""
        if len(q) < 2:
            return []
        try:
            r = self.session.get(
                f"{self.base_url}/codesnaf/like",
                params={"q": q, "len": len_},
                timeout=self.timeout
            )
            r.raise_for_status()
            return r.json().get("data", [])
        except requests.RequestException as e:
            print(f"[CodeNaf] Request Error like({q!r}) : {e}")
            return []

    def children(self, code: str) -> list[dict]:
        """Enfants directs d'un code NAF."""
        try:
            r = self.session.get(
                f"{self.base_url}/codesnaf/{code}/children",
                timeout=self.timeout
            )
            r.raise_for_status()
            return r.json()
        except requests.RequestException as e:
            print(f"[CodeNaf] Request Error children({code}) : {e}")
            return []

    def hierarchy(self, code: str) -> list[dict]:
        """Hiérarchie complète vers la racine."""
        try:
            r = self.session.get(
                f"{self.base_url}/codesnaf/{code}/hierarchy",
                timeout=self.timeout
            )
            r.raise_for_status()
            return r.json()
        except requests.RequestException as e:
            print(f"[CodeNaf] Request Error hierarchy({code}) : {e}")
            return []

    def tree(self) -> list[dict]:
        """Arbre complet — à utiliser avec parcimonie."""
        try:
            r = self.session.get(
                f"{self.base_url}/codesnaf/tree",
                timeout=self.timeout
            )
            r.raise_for_status()
            return r.json()
        except requests.RequestException as e:
            print(f"[CodeNaf] Request Error tree() : {e}")
            return []

    # ------------------------------------------------------------------
    # Helpers pipeline
    # ------------------------------------------------------------------
    def resolve(self, code: str) -> Optional[str]:
        """Retourne le nom d'un code NAF. → "Activités des marchands..." """
        item = self.get(code)
        return item["nom"] if item else None

    def resolve_secteur(self, code: str, mapping: dict) -> Optional[str]:
        """Résout le secteur depuis le préfixe NAF et un mapping externe."""
        if not code:
            return None
        prefix = code.replace(".", "")[:2]
        return mapping.get(prefix)

    def exists(self, code: str) -> bool:
        return self.get(code) is not None

    # ------------------------------------------------------------------
    # Cache
    # ------------------------------------------------------------------
    def cache_clear(self):
        self._cache.clear()

    @property
    def cache_size(self) -> int:
        return len(self._cache)

    def __repr__(self):
        return f"CodeNafClient({self.base_url!r}, cache={self.cache_size} items)"
