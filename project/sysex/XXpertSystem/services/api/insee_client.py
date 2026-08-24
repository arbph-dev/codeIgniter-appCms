"""
Client INSEE - API Sirene v3.11
API : https://api.insee.fr/api-sirene/3.11/
Doc : https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee

Champs clés :
  - siren (9 chiffres)
  - siret (14 chiffres = siren + nic)
  - activitePrincipaleUniteLegale  → code NAF ex: 68.10Z
  - categorieEntreprise            → PME / ETI / GE
  - denominationUniteLegale
  - etatAdministratifUniteLegale   → A (actif) / C (cessé)
"""
import requests
from typing import Optional


INSEE_BASE = "https://api.insee.fr/api-sirene/3.11"


class InseeClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "X-INSEE-Api-Key-Integration": self.api_key,
            "Accept": "application/json",
        })

    # ------------------------------------------------------------------
    # Recherche SIREN (unités légales)
    # ------------------------------------------------------------------
    def search_siren(
        self,
        q: str,
        nombre: int = 20,
        debut: int = 0,
        date: Optional[str] = None,
        champs: Optional[list] = None,
    ) -> Optional[dict]:
        """
        Recherche parmi les unités légales (SIREN).

        Exemples de q :
          "siren:448451484"
          "periode(activitePrincipaleUniteLegale:68.10Z) AND categorieEntreprise:PME"
          "denominationUniteLegale:BOUYGUES AND etatAdministratifUniteLegale:A"

        date : snapshot à une date donnée ex "2024-01-01"
        champs : liste de champs à retourner (réduction payload)
        """
        params = {"q": q, "nombre": nombre, "debut": debut}
        if date:
            params["date"] = date
        if champs:
            params["champs"] = ",".join(champs)

        try:
            r = self.session.get(f"{INSEE_BASE}/siren", params=params)
            # Debug : URL réelle envoyée
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
            r = self.session.get(f"{INSEE_BASE}/siren/{siren}", params=params)
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
        q: str,
        nombre: int = 20,
        debut: int = 0,
        date: Optional[str] = None,
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
            r = self.session.get(f"{INSEE_BASE}/siret", params=params)
            r.raise_for_status()
            return r.json()
        except requests.HTTPError as e:
            print(f"[INSEE] HTTP Error search_siret : {e.response.status_code} — {e.response.text[:300]}")
            return None

    def get_siret(self, siret: str) -> Optional[dict]:
        """Fiche d'un établissement par SIRET."""
        try:
            r = self.session.get(f"{INSEE_BASE}/siret/{siret}")
            r.raise_for_status()
            return r.json()
        except requests.HTTPError as e:
            print(f"[INSEE] HTTP Error get_siret : {e.response.status_code}")
            return None

    # ------------------------------------------------------------------
    # Helpers pagination
    # ------------------------------------------------------------------
    def search_all(self, q: str, max_results: int = 200, endpoint: str = "siren") -> list:
        """
        Itère sur les pages jusqu'à max_results.
        Retourne la liste brute des unités légales ou établissements.
        """
        results = []
        debut = 0
        nombre = min(20, max_results)
        fn = self.search_siren if endpoint == "siren" else self.search_siret

        while len(results) < max_results:
            data = fn(q, nombre=nombre, debut=debut)
            if not data:
                break
            items = data.get("unitesLegales") or data.get("etablissements") or []
            if not items:
                break
            results.extend(items)
            total = data.get("header", {}).get("total", 0)
            debut += nombre
            if debut >= total:
                break

        return results[:max_results]


# ------------------------------------------------------------------
# Extracteurs de champs normalisés
# ------------------------------------------------------------------
def extract_unite_legale(u: dict) -> dict:
    """Extrait les champs utiles d'une unité légale INSEE vers un dict plat."""
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


# ------------------------------------------------------------------
# Usage direct
# ------------------------------------------------------------------
if __name__ == "__main__":
    import os
    client = InseeClient(api_key=os.getenv("INSEE_KEY", ""))

    # Exemple : PME du secteur immobilier (NAF 68.10Z)
    print("=== PME immobilier NAF 68.10Z ===")
    data = client.search_siren(
        q="periode(activitePrincipaleUniteLegale:68.10Z) AND categorieEntreprise:PME",
        nombre=5,
        date="2030-12-31",
    )
    if data:
        total = data.get("header", {}).get("total", 0)
        print(f"Total : {total}")
        for u in data.get("unitesLegales", []):
            e = extract_unite_legale(u)
            print(f"  {e['siren']} — {e['denomination']} ({e['naf']}) [{e['categorie']}]")

    # Exemple : par SIREN direct
    print("\n=== Fiche SIREN ===")
    fiche = client.get_siren("448451484")
    if fiche:
        ul = fiche.get("uniteLegale", {})
        e = extract_unite_legale(ul)
        print(f"  {e['siren']} — {e['denomination']}")
