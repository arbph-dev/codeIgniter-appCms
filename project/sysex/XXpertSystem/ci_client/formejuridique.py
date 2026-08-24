"""
ci_client/formejuridique.py
Client pour l'API FormeJuridique de zealot.fr — lecture + écriture.

Routes couvertes :
    GET    /api/formejuridique                    → liste paginée
    GET    /api/formejuridique?q=soci             → recherche
    GET    /api/formejuridique?id=5499            → par code exact
    GET    /api/formejuridique/{id}               → fiche par code
    GET    /api/formejuridique/like?q=soci&len=10 → autocomplete
    POST   /api/formejuridique                    → créer
    PUT    /api/formejuridique/{id}               → modifier
    DELETE /api/formejuridique/{id}               → supprimer

Structure d'une FormeJuridique :
    { "id": "5499", "description": "Société par actions simplifiée" }

Note PK :
    La PK est un CHAR(4) paddé zéros à gauche.
    "5499" → "5499"  /  "10" → "0010"  /  5499 → "5499"
    pad_id() gère la normalisation automatiquement.

Usage pipeline :
    fj = FormeJuridiqueClient("https://zealot.fr/api", auth=auth)
    item = fj.get("5499")           # lookup par code INSEE
    nom  = fj.resolve("5499")       # → "Société par actions simplifiée"
    ok   = fj.ensure("5499", "SAS") # crée si absent
"""
import requests
from typing import Optional


def pad_id(code) -> str:
    """Normalise un code forme juridique sur 4 chiffres. '5' → '0005'"""
    return str(code).strip().zfill(4)


class FormeJuridiqueClient:

    def __init__(self, base_url: str, auth=None, timeout: int = 10):
        """
        base_url : ex "https://zealot.fr/api"
        auth     : AuthProvider (BearerAuth...)
        """
        self.base_url = base_url.rstrip("/")
        self.timeout  = timeout
        self.session  = auth.get_session() if auth else requests.Session()
        if not auth:
            self.session.headers.update({
                "Accept":       "application/json",
                "Content-Type": "application/json",
            })
        self._cache: dict[str, dict] = {}

    # ------------------------------------------------------------------
    # Lecture
    # ------------------------------------------------------------------
    def get(self, code) -> Optional[dict]:
        """
        Fiche par code exact.
        Ex : client.get("5499") ou client.get(5499)
        → {"id": "5499", "description": "Société par actions simplifiée", ...}
        """
        code = pad_id(code)
        if code in self._cache:
            return self._cache[code]
        try:
            r = self.session.get(
                f"{self.base_url}/formejuridique/{code}",
                timeout=self.timeout
            )
            if r.status_code == 404:
                return None
            r.raise_for_status()
            # Réponse via ApiResponse trait : {"data": {...}, "status": 200}
            data = r.json()
            item = data.get("data") or data
            if item:
                self._cache[code] = item
            return item
        except requests.HTTPError as e:
            print(f"[FormeJuridique] HTTP Error get({code}) : {e.response.status_code}")
            return None
        except requests.RequestException as e:
            print(f"[FormeJuridique] Request Error : {e}")
            return None

    def search(self, q: str, per_page: int = 20, page: int = 1) -> dict:
        """
        Recherche par description.
        → {"data": [...], "pager": {...}}
        """
        try:
            r = self.session.get(
                f"{self.base_url}/formejuridique",
                params={"q": q, "per_page": per_page, "page": page},
                timeout=self.timeout
            )
            r.raise_for_status()
            return r.json()
        except requests.HTTPError as e:
            print(f"[FormeJuridique] HTTP Error search({q!r}) : {e.response.status_code}")
            return {"data": [], "pager": {}}
        except requests.RequestException as e:
            print(f"[FormeJuridique] Request Error : {e}")
            return {"data": [], "pager": {}}

    def like(self, q: str, len_: int = 10) -> list[dict]:
        """
        Autocomplete — retourne [{"id", "description"}, ...]
        q doit faire au moins 2 caractères.
        """
        if len(q) < 2:
            return []
        try:
            r = self.session.get(
                f"{self.base_url}/formejuridique/like",
                params={"q": q, "len": len_},
                timeout=self.timeout
            )
            r.raise_for_status()
            return r.json().get("data", [])
        except requests.RequestException as e:
            print(f"[FormeJuridique] Request Error like({q!r}) : {e}")
            return []

    # ------------------------------------------------------------------
    # Écriture
    # ------------------------------------------------------------------
    def create(self, code, description: str) -> Optional[dict]:
        """
        Crée une forme juridique.
        Ex : client.create("9999", "Ma forme juridique")
        → {"id": "9999", "description": "..."} ou None si erreur
        """
        code = pad_id(code)
        try:
            r = self.session.post(
                f"{self.base_url}/formejuridique",
                json={"id": code, "description": description.strip()},
                timeout=self.timeout
            )
            r.raise_for_status()
            data = r.json()
            item = data.get("data") or data
            if item:
                self._cache[code] = item
            return item
        except requests.HTTPError as e:
            body = self._safe_json(e.response)
            print(f"[FormeJuridique] HTTP Error create({code}) : {e.response.status_code} — {body}")
            return None
        except requests.RequestException as e:
            print(f"[FormeJuridique] Request Error : {e}")
            return None

    def update(self, code, description: str) -> Optional[dict]:
        """
        Met à jour la description d'une forme juridique existante.
        """
        code = pad_id(code)
        try:
            r = self.session.put(
                f"{self.base_url}/formejuridique/{code}",
                json={"description": description.strip()},
                timeout=self.timeout
            )
            r.raise_for_status()
            data = r.json()
            item = data.get("data") or data
            self._cache.pop(code, None)  # invalide le cache
            return item
        except requests.HTTPError as e:
            body = self._safe_json(e.response)
            print(f"[FormeJuridique] HTTP Error update({code}) : {e.response.status_code} — {body}")
            return None
        except requests.RequestException as e:
            print(f"[FormeJuridique] Request Error : {e}")
            return None

    def delete(self, code) -> bool:
        """Supprime une forme juridique. Retourne True si succès."""
        code = pad_id(code)
        try:
            r = self.session.delete(
                f"{self.base_url}/formejuridique/{code}",
                timeout=self.timeout
            )
            r.raise_for_status()
            self._cache.pop(code, None)
            return True
        except requests.HTTPError as e:
            print(f"[FormeJuridique] HTTP Error delete({code}) : {e.response.status_code}")
            return False
        except requests.RequestException as e:
            print(f"[FormeJuridique] Request Error : {e}")
            return False

    # ------------------------------------------------------------------
    # Helpers pipeline
    # ------------------------------------------------------------------
    def resolve(self, code) -> Optional[str]:
        """
        Retourne la description d'un code.
        Usage pipeline : fj_nom = client.resolve("5499")
        → "Société par actions simplifiée"
        """
        item = self.get(code)
        return item.get("description") if item else None

    def exists(self, code) -> bool:
        """Vérifie si un code existe en base CI."""
        return self.get(code) is not None

    def ensure(self, code, description: str) -> Optional[dict]:
        """
        Retourne l'item existant ou le crée si absent.
        Usage pipeline : évite les doublons sans avoir à tester avant.
        """
        existing = self.get(code)
        if existing:
            return existing
        return self.create(code, description)

    # ------------------------------------------------------------------
    # Cache
    # ------------------------------------------------------------------
    def cache_clear(self):
        self._cache.clear()

    @property
    def cache_size(self) -> int:
        return len(self._cache)

    # ------------------------------------------------------------------
    # Interne
    # ------------------------------------------------------------------
    @staticmethod
    def _safe_json(response) -> dict:
        try:
            return response.json()
        except Exception:
            return {}

    def __repr__(self):
        return f"FormeJuridiqueClient({self.base_url!r}, cache={self.cache_size} items)"
