# services/api/inpi_client.py

from typing import Optional
from .BaseApiClient import BaseApiClient

INPI_BASE = "https://registre-national-entreprises.inpi.fr/api"


class InpiClient(BaseApiClient):
    """
    Client INPI — Registre National des Entreprises (RNE)

    Usage :
        auth   = store.build_and_login("inpi")   # login SSO ici
        client = InpiClient(auth)
        data   = client.search("bouygues", per_page=5)
    """

    _source = "inpi"

    def __init__(self, auth, timeout: int = 10, save_samples: bool = False):
        super().__init__(INPI_BASE, auth=auth, timeout=timeout, save_samples=save_samples)

    # ------------------------------------------------------------------
    # Recherche
    # ------------------------------------------------------------------

    def search(
        self,
        query:    str,
        page:     int = 1,
        per_page: int = 10,
    ) -> Optional[dict]:
        data = self.get("/companies", {
            "query":     query,
            "pageIndex": page,
            "pageSize":  per_page,
        })
        self._save(data, "search", {"query": query})

        if data is None:
            return None
        if isinstance(data, list):
            return {"companies": data, "total": len(data)}
        for key in ("companies", "results", "data", "items"):
            if key in data:
                return {"companies": data[key], "total": data.get("total", len(data[key]))}
        return {"companies": [], "total": 0}

    def get_by_siren(self, siren: str) -> Optional[dict]:
        data = self.get(f"/companies/{siren}")
        self._save(data, "get_by_siren", {"siren": siren})
        return data

    # ------------------------------------------------------------------
    # Extraction dirigeants (logique de parsing INPI conservée)
    # ------------------------------------------------------------------

    def get_dirigeants(self, siren: str) -> Optional[list]:
        data = self.get_by_siren(siren)
        if not data:
            return None

        # Cas 1 : entrepreneur individuel
        content = data.get("formality", {}).get("content", {})
        if "personnePhysique" in content:
            pp   = content["personnePhysique"]
            desc = (
                pp.get("identite", {})
                  .get("entrepreneur", {})
                  .get("descriptionPersonne", {})
            ) or pp
            return [{"descriptionPersonne": desc, "_source": "personnePhysique"}]

        # Cas 2 : listes représentants/dirigeants
        candidates = ["representants", "dirigeants", "personnes", "beneficiairesEffectifs"]

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

        return _find(data, candidates) or []
