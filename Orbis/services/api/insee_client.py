# services/api/insee_client.py

from typing import Optional
from .BaseApiClient import BaseApiClient

INSEE_BASE = "https://api.insee.fr/api-sirene/3.11"


class InseeClient(BaseApiClient):
    """
    Client INSEE Sirene v3.11

    Usage :
        auth   = store.build_and_login("insee")
        client = InseeClient(auth)
        data   = client.search_siren("siren:448451484")
    """

    _source  = "insee"

    def __init__(self, auth, timeout: int = 10, save_samples: bool = False):
        super().__init__(INSEE_BASE, auth=auth, timeout=timeout, save_samples=save_samples)

    # ------------------------------------------------------------------
    # SIREN — unités légales
    # ------------------------------------------------------------------

    def search_siren(
        self,
        q:      str,
        nombre: int           = 20,
        debut:  int           = 0,
        date:   Optional[str] = None,
        champs: Optional[list]= None,
    ) -> Optional[dict]:
        params = {"q": q, "nombre": nombre, "debut": debut}
        if date:   params["date"]   = date
        if champs: params["champs"] = ",".join(champs)
        data = self.get("/siren", params)
        self._save(data, "search_siren", {"q": q})
        return data

    def get_siren(self, siren: str, date: Optional[str] = None) -> Optional[dict]:
        params = {"date": date} if date else {}
        data = self.get(f"/siren/{siren}", params)
        self._save(data, "get_siren", {"siren": siren})
        return data

    # ------------------------------------------------------------------
    # SIRET — établissements
    # ------------------------------------------------------------------

    def search_siret(
        self,
        q:      str,
        nombre: int           = 20,
        debut:  int           = 0,
        date:   Optional[str] = None,
    ) -> Optional[dict]:
        params = {"q": q, "nombre": nombre, "debut": debut}
        if date: params["date"] = date
        data = self.get("/siret", params)
        self._save(data, "search_siret", {"q": q})
        return data

    def get_siret(self, siret: str) -> Optional[dict]:
        data = self.get(f"/siret/{siret}")
        self._save(data, "get_siret", {"siret": siret})
        return data

    # ------------------------------------------------------------------
    # Pagination automatique
    # ------------------------------------------------------------------

    def search_all(
        self,
        q:           str,
        max_results: int = 200,
        endpoint:    str = "siren",
    ) -> list:
        results  = []
        debut    = 0
        nombre   = min(20, max_results)
        fn       = self.search_siren if endpoint == "siren" else self.search_siret
        items_key = "unitesLegales" if endpoint == "siren" else "etablissements"

        while len(results) < max_results:
            data = fn(q, nombre=nombre, debut=debut)
            if not data:
                break
            items = data.get(items_key, [])
            if not items:
                break
            results.extend(items)
            total  = data.get("header", {}).get("total", 0)
            debut += nombre
            if debut >= total:
                break

        return results[:max_results]


# ------------------------------------------------------------------
# Extracteur normalisé (utilitaire libre, sans instance)
# ------------------------------------------------------------------

def extract_unite_legale(u: dict) -> dict:
    periodes = u.get("periodesUniteLegale", [{}])
    p = periodes[0] if periodes else {}
    return {
        "siren":           u.get("siren"),
        "denomination":    p.get("denominationUniteLegale") or u.get("denominationUniteLegale"),
        "sigle":           p.get("sigleUniteLegale"),
        "naf":             p.get("activitePrincipaleUniteLegale"),
        "categorie":       u.get("categorieEntreprise"),
        "etat":            p.get("etatAdministratifUniteLegale"),
        "forme_juridique": p.get("categorieJuridiqueUniteLegale"),
        "date_creation":   u.get("dateCreationUniteLegale"),
    }
