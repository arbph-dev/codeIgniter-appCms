"""
Client INPI - Registre National des Entreprises (RNE)
API : https://registre-national-entreprises.inpi.fr/api
"""
import requests
from typing import Optional


INPI_BASE = "https://registre-national-entreprises.inpi.fr/api"


class InpiClient:
    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self.token: Optional[str] = None
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    # ------------------------------------------------------------------
    # Auth
    # ------------------------------------------------------------------
    def login(self) -> bool:
        """Authentification SSO → récupère le JWT."""
        try:
            r = self.session.post(
                f"{INPI_BASE}/sso/login",
                json={"username": self.username, "password": self.password},
            )
            r.raise_for_status()
            data = r.json()
            # Le token est dans data["token"] selon la doc INPI
            self.token = data.get("token") or data.get("access_token")
            if self.token:
                self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                return True
            print(f"[INPI] Login OK mais token introuvable : {data}")
            return False
        except requests.HTTPError as e:
            print(f"[INPI] HTTP Error login : {e} — {e.response.text}")
            return False
        except requests.RequestException as e:
            print(f"[INPI] Request Error login : {e}")
            return False

    # ------------------------------------------------------------------
    # Recherche
    # ------------------------------------------------------------------
    def search(self, query: str, page: int = 1, per_page: int = 10) -> Optional[dict]:
        """
        Recherche fulltext dans le RNE.
        Retourne toujours un dict {"companies": [...], "total": n}
        """
        self._ensure_auth()
        try:
            r = self.session.get(
                f"{INPI_BASE}/companies",
                params={"query": query, "pageIndex": page, "pageSize": per_page},
            )
            print(f"[INPI] GET {r.request.url}")
            r.raise_for_status()
            data = r.json()
            # L'API peut retourner une liste directe ou un dict enveloppé
            if isinstance(data, list):
                return {"companies": data, "total": len(data)}
            # Dict avec clé variable selon version API
            for key in ("companies", "results", "data", "items"):
                if key in data:
                    return {"companies": data[key], "total": data.get("total", len(data[key]))}
            return {"companies": [], "total": 0}
        except requests.HTTPError as e:
            print(f"[INPI] HTTP Error search : {e} — {e.response.text[:300]}")
            return None

    def get_by_siren(self, siren: str) -> Optional[dict]:
        """Fiche complète d'une entreprise par SIREN."""
        self._ensure_auth()
        try:
            r = self.session.get(f"{INPI_BASE}/companies/{siren}")
            r.raise_for_status()
            return r.json()
        except requests.HTTPError as e:
            print(f"[INPI] HTTP Error get_by_siren : {e} — {e.response.text}")
            return None

    def get_dirigeants(self, siren: str) -> Optional[list]:
        """Dirigeants / représentants d'une entreprise."""
        data = self.get_by_siren(siren)
        if not data:
            return None

        # On explore récursivement pour trouver les listes de personnes
        # La structure INPI varie : representants, dirigeants, personnes, beneficiaires...
        candidates = [
            "representants",
            "dirigeants",
            "personnes",
            "beneficiairesEffectifs",
        ]

        # Cherche à plusieurs niveaux de profondeur
        def _find(obj, keys, depth=0):
            if depth > 6 or not isinstance(obj, (dict, list)):
                return None
            if isinstance(obj, list):
                for item in obj:
                    r = _find(item, keys, depth + 1)
                    if r is not None:
                        return r
            if isinstance(obj, dict):
                for k in keys:
                    if k in obj and isinstance(obj[k], list) and obj[k]:
                        return obj[k]
                for v in obj.values():
                    r = _find(v, keys, depth + 1)
                    if r is not None:
                        return r
            return None

        # Cas 1 : personnePhysique = entrepreneur individuel, il EST le dirigeant
        content = data.get("formality", {}).get("content", {})
        if "personnePhysique" in content:
            pp = content["personnePhysique"]
            # Chemin exact : identite.entrepreneur.descriptionPersonne
            desc = (pp.get("identite", {})
                      .get("entrepreneur", {})
                      .get("descriptionPersonne", {}))
            if not desc:
                desc = pp  # fallback
            return [{"descriptionPersonne": desc, "_source": "personnePhysique"}]

        # Cas 2 : cherche les listes classiques de représentants
        result = _find(data, candidates)
        if result:
            return result

        # Fallback debug
        print(f"[INPI] Structure reçue pour {siren} :")
        if isinstance(data, dict):
            content = data.get("formality", {}).get("content", {})
            print(f"  Clés dans formality.content : {list(content.keys())}")
            for k, v in content.items():
                print(f"    {k}: {type(v).__name__} = {str(v)[:120]}")
        return []

    # ------------------------------------------------------------------
    # Interne
    # ------------------------------------------------------------------
    def _ensure_auth(self):
        if not self.token:
            print("[INPI] Non authentifié — tentative de login...")
            self.login()


# ------------------------------------------------------------------
# Usage direct
# ------------------------------------------------------------------
if __name__ == "__main__":
    import os
    client = InpiClient(
        username=os.getenv("INPI_USER", ""),
        password=os.getenv("INPI_PASS", ""),
    )
    if client.login():
        print("[INPI] Login OK")
        results = client.search("immobilier paris", per_page=5)
        if results:
            print(f"[INPI] {results.get('total', '?')} résultats")
            for c in results.get("companies", [])[:3]:
                print(f"  {c.get('siren')} — {c.get('denomination')}")
