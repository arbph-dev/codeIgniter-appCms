"""
Client INPI - Registre National des Entreprises (RNE)

API  : https://registre-national-entreprises.inpi.fr/api
Auth : BearerAuth (POST /sso/login) — injecté via auth.get_session()

Usage :
    from services.auth import CredentialsStore
    store  = CredentialsStore()
    auth   = store.build_and_login("inpi")   # login SSO effectué ici
    store.close()

    client   = InpiClient(auth=auth)
    results  = client.search("immobilier paris", per_page=5)
    dirigeants = client.get_dirigeants("448451484")
"""
import requests
from typing import Optional

from services.auth import AuthProvider

INPI_BASE = "https://registre-national-entreprises.inpi.fr/api"


class InpiClient:

    def __init__(self, auth: AuthProvider, timeout: int = 10):
        """
        auth    : AuthProvider (BearerAuth déjà loggué via build_and_login)
        timeout : timeout réseau en secondes
        """
        self.timeout = timeout
        self.session = auth.get_session()

    # ------------------------------------------------------------------
    # Recherche
    # ------------------------------------------------------------------

    def search(
        self, query: str, page: int = 1, per_page: int = 10
    ) -> Optional[dict]:
        """
        Recherche fulltext dans le RNE.
        Retourne toujours un dict {"companies": [...], "total": n}.
        """
        try:
            r = self.session.get(
                f"{INPI_BASE}/companies",
                params={"query": query, "pageIndex": page, "pageSize": per_page},
                timeout=self.timeout,
            )
            print(f"[INPI] GET {r.request.url}")
            r.raise_for_status()
            data = r.json()

            if isinstance(data, list):
                return {"companies": data, "total": len(data)}

            for key in ("companies", "results", "data", "items"):
                if key in data:
                    return {"companies": data[key], "total": data.get("total", len(data[key]))}

            return {"companies": [], "total": 0}

        except requests.HTTPError as e:
            print(f"[INPI] HTTP Error search : {e} — {e.response.text[:300]}")
            return None

    def get_by_siren(self, siren: str) -> Optional[dict]:
        """Fiche complète d'une entreprise par SIREN."""
        try:
            r = self.session.get(
                f"{INPI_BASE}/companies/{siren}", timeout=self.timeout
            )
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

        candidates = [
            "representants", "dirigeants", "personnes",
            "beneficiairesEffectifs",
        ]

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

        # Cas 1 : entrepreneur individuel
        content = data.get("formality", {}).get("content", {})
        if "personnePhysique" in content:
            pp   = content["personnePhysique"]
            desc = (
                pp.get("identite", {})
                  .get("entrepreneur", {})
                  .get("descriptionPersonne", {})
            )
            if not desc:
                desc = pp
            return [{"descriptionPersonne": desc, "_source": "personnePhysique"}]

        # Cas 2 : listes classiques
        result = _find(data, candidates)
        if result:
            return result

        # Fallback debug
        print(f"[INPI] Structure reçue pour {siren} :")
        if isinstance(data, dict):
            content = data.get("formality", {}).get("content", {})
            print(f"  Clés dans formality.content : {list(content.keys())}")
            for k, v in content.items():
                print(f"  {k}: {type(v).__name__} = {str(v)[:120]}")
        return []
