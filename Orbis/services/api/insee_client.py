"""
Client INSEE - API Sirene v3.11

API  : https://api.insee.fr/api-sirene/3.11/
Auth : ApiKeyAuth (header X-INSEE-Api-Key-Integration) — injecté via auth.get_session()

Usage :
    from services.auth import CredentialsStore
    store  = CredentialsStore()
    auth   = store.build_and_login("insee")
    store.close()

    client = InseeClient(auth=auth)
    data   = client.search_siren("siren:448451484")
"""
import requests
from typing import Optional

from services.auth import AuthProvider

INSEE_BASE = "https://api.insee.fr/api-sirene/3.11"


class InseeClient:

    def __init__(self, auth: AuthProvider, timeout: int = 10):
        """
        auth    : AuthProvider (ApiKeyAuth avec header X-INSEE-Api-Key-Integration)
        timeout : timeout réseau en secondes
        """
        self.timeout = timeout
        self.session = auth.get_session()

    # ------------------------------------------------------------------
    # Recherche SIREN (unités légales)
    # ------------------------------------------------------------------

    def search_siren(
        self,
        q:      str,
        nombre: int = 20,
        debut:  int = 0,
        date:   Optional[str]  = None,
        champs: Optional[list] = None,
    ) -> Optional[dict]:
        """
        Recherche parmi les unités légales (SIREN).

        Exemples de q :
            "siren:448451484"
            "periode(activitePrincipaleUniteLegale:68.10Z) AND categorieEntreprise:PME"
            "denominationUniteLegale:BOUYGUES AND etatAdministratifUniteLegale:A"

        date   : snapshot à une date donnée ex "2024-01-01"
        champs : liste de champs à retourner (réduction payload)
        """
        params = {"q": q, "nombre": nombre, "debut": debut}
        if date:
            params["date"] = date
        if champs:
            params["champs"] = ",".join(champs)
        try:
            r = self.session.get(
                f"{INSEE_BASE}/siren", params=params, timeout=self.timeout
            )
            print(f"[INSEE] GET {r.request.url}")
            r.raise_for_status()
            return r.json()
        except requests.HTTPError as e:
            print(f"[INSEE] HTTP Error search_siren : {e.response.status_code} — {e.response.text[:300]}")
            return None
        except requests.RequestException as e:
            print(f"[INSEE] Request Error : {e}")
            return None

    def get_siren(self, siren: str, date: Optional[str] = None) -> Optional[dict]:
        """Fiche d'une unité légale par SIREN."""
        params = {}
        if date:
            params["date"] = date
        try:
            r = self.session.get(
                f"{INSEE_BASE}/siren/{siren}", params=params, timeout=self.timeout
            )
            r.raise_for_status()
            return r.json()
        except requests.HTTPError as e:
            print(f"[INSEE] HTTP Error get_siren : {e.response.status_code}")
            return None

    # ------------------------------------------------------------------
    # Recherche SIRET (établissements)
    # ------------------------------------------------------------------

    def search_siret(
        self,
        q:      str,
        nombre: int = 20,
        debut:  int = 0,
        date:   Optional[str] = None,
    ) -> Optional[dict]:
        """
        Recherche parmi les établissements (SIRET).
        q : même syntaxe Lucene que search_siren mais champs établissement.
        Ex: "activitePrincipaleEtablissement:68.10Z AND codePostalEtablissement:75*"
        """
        params = {"q": q, "nombre": nombre, "debut": debut}
        if date:
            params["date"] = date
        try:
            r = self.session.get(
                f"{INSEE_BASE}/siret", params=params, timeout=self.timeout
            )
            r.raise_for_status()
            return r.json()
        except requests.HTTPError as e:
            print(f"[INSEE] HTTP Error search_siret : {e.response.status_code} — {e.response.text[:300]}")
            return None

    def get_siret(self, siret: str) -> Optional[dict]:
        """Fiche d'un établissement par SIRET."""
        try:
            r = self.session.get(
                f"{INSEE_BASE}/siret/{siret}", timeout=self.timeout
            )
            r.raise_for_status()
            return r.json()
        except requests.HTTPError as e:
            print(f"[INSEE] HTTP Error get_siret : {e.response.status_code}")
            return None

    # ------------------------------------------------------------------
    # Helpers pagination
    # ------------------------------------------------------------------

    def search_all(
        self, q: str, max_results: int = 200, endpoint: str = "siren"
    ) -> list:
        """
        Itère sur les pages jusqu'à max_results.
        Retourne la liste brute des unités légales ou établissements.
        """
        results = []
        debut   = 0
        nombre  = min(20, max_results)
        fn      = self.search_siren if endpoint == "siren" else self.search_siret

        while len(results) < max_results:
            data = fn(q, nombre=nombre, debut=debut)
            if not data:
                break
            items = data.get("unitesLegales") or data.get("etablissements") or []
            if not items:
                break
            results.extend(items)
            total  = data.get("header", {}).get("total", 0)
            debut += nombre
            if debut >= total:
                break

        return results[:max_results]


# ------------------------------------------------------------------
# Extracteur de champs normalisés (fonction utilitaire libre)
# ------------------------------------------------------------------

def extract_unite_legale(u: dict) -> dict:
    """Extrait les champs utiles d'une unité légale INSEE → dict plat."""
    periodes = u.get("periodesUniteLegale", [{}])
    p = periodes[0] if periodes else {}
    return {
        "siren":             u.get("siren"),
        "denomination":      p.get("denominationUniteLegale") or u.get("denominationUniteLegale"),
        "sigle":             p.get("sigleUniteLegale"),
        "naf":               p.get("activitePrincipaleUniteLegale"),
        "categorie":         u.get("categorieEntreprise"),
        "etat":              p.get("etatAdministratifUniteLegale"),
        "forme_juridique":   p.get("categorieJuridiqueUniteLegale"),
        "date_creation":     u.get("dateCreationUniteLegale"),
        "tranche_effectif":  u.get("trancheEffectifsUniteLegale"),
    }
