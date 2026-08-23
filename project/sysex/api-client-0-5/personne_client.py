"""
Client API Personne — zealot.fr
Suit le même pattern que InpiClient / InseeClient.

Auth : Bearer token (POST /api/auth/login → token)
       Le token est réinjecté automatiquement sur chaque requête.
       Un refresh automatique est tenté sur 401.

Usage :
    client = PersonneClient("https://zealot.fr", "user@example.com", "password")
    client.login()

    # Recherche
    results = client.search("de Gaulle")

    # Fiche complète (personne + aliases + parcours + relations)
    fiche = client.get_by_id(1)

    # Création
    p = client.create({"nom": "Dupont", "prenoms": "Jean"})

    # Aliases
    client.alias_create(p["id"], {"alias": "J. Dupont", "alias_type": "pseudonyme"})
"""

import requests
from typing import Optional


class PersonneClient:

    def __init__(self, base_url: str, username: str = "", password: str = ""):
        self.base_url  = base_url.rstrip("/")
        self.username  = username
        self.password  = password
        self.token: Optional[str] = None

        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "Accept":       "application/json",
        })

    # ------------------------------------------------------------------
    # Auth
    # ------------------------------------------------------------------

    def login(self) -> bool:
        """POST /api/auth/login → récupère le Bearer token."""
        try:
            r = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"email": self.username, "password": self.password},
            )
            r.raise_for_status()
            data = r.json()
            self.token = data.get("token") or data.get("access_token")
            if self.token:
                self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                return True
            print(f"[PersonneClient] Login OK mais token introuvable : {data}")
            return False
        except requests.HTTPError as e:
            print(f"[PersonneClient] HTTP Error login : {e} — {e.response.text[:300]}")
            return False
        except requests.RequestException as e:
            print(f"[PersonneClient] Request Error login : {e}")
            return False

    # ------------------------------------------------------------------
    # Personnes — lecture
    # ------------------------------------------------------------------

    def search(self, q: str, page: int = 1, per_page: int = 20) -> Optional[dict]:
        """
        GET /api/personnes?q=...
        Retourne { data: [...], meta: { page, per_page, total, pages } }.
        """
        return self._get("/api/personnes", params={
            "q"       : q,
            "page"    : page,
            "per_page": per_page,
        })

    def list(self, page: int = 1, per_page: int = 20) -> Optional[dict]:
        """GET /api/personnes — liste paginée sans filtre."""
        return self._get("/api/personnes", params={
            "page"    : page,
            "per_page": per_page,
        })

    def get_by_id(self, personne_id: int) -> Optional[dict]:
        """
        GET /api/personnes/{id}
        Retourne { personne, aliases, parcours, relations }.
        """
        # return self._get(f"/api/personnes/{personne_id}")
        result = self._get(f"/api/personnes/{personne_id}")
        return (result or {}).get("data")        

    def list_all(self, q: str = "", max_results: int = 500) -> list:
        """
        Itère sur les pages jusqu'à max_results.
        Retourne la liste plate des personnes.
        """
        results = []
        page    = 1
        per_page = min(50, max_results)

        while len(results) < max_results:
            data = self.search(q, page=page, per_page=per_page) if q \
                   else self.list(page=page, per_page=per_page)

            if not data:
                break

            items = data.get("data", [])
            if not items:
                break

            results.extend(items)

            meta  = data.get("meta", {}) or data.get("pager", {})
            total = meta.get("total", 0)
            pages = meta.get("pages") or meta.get("pageCount", 1)

            if page >= pages or len(results) >= total:
                break
            page += 1

        return results[:max_results]

    # ------------------------------------------------------------------
    # Personnes — écriture
    # ------------------------------------------------------------------

    def create(self, data: dict) -> Optional[dict]:
        """POST /api/personnes"""
        return self._post("/api/personnes", data)

    def update(self, personne_id: int, data: dict) -> Optional[dict]:
        """PUT /api/personnes/{id}"""
        return self._put(f"/api/personnes/{personne_id}", data)

    def delete(self, personne_id: int) -> Optional[dict]:
        """DELETE /api/personnes/{id}"""
        return self._delete(f"/api/personnes/{personne_id}")

    def merge(self, source_id: int, target_id: int) -> Optional[dict]:
        """POST /api/personnes/{sourceId}/merge/{targetId}"""
        return self._post(f"/api/personnes/{source_id}/merge/{target_id}", {})

    # ------------------------------------------------------------------
    # Aliases
    # ------------------------------------------------------------------

    def alias_list(self, personne_id: int) -> list:
        """GET /api/personne-aliases?personne_id={id}"""
        data = self._get("/api/personne-aliases", params={
            "personne_id": personne_id,
            "per_page"   : 50,
        })
        return (data or {}).get("data", [])

    def alias_create(self, personne_id: int, alias_data: dict) -> Optional[dict]:
        """POST /api/personne-aliases"""
        return self._post("/api/personne-aliases", {
            **alias_data,
            "personne_id": personne_id,
        })

    def alias_update(self, alias_id: int, alias_data: dict) -> Optional[dict]:
        """PUT /api/personne-aliases/{id}"""
        return self._put(f"/api/personne-aliases/{alias_id}", alias_data)

    def alias_delete(self, alias_id: int) -> Optional[dict]:
        """DELETE /api/personne-aliases/{id}"""
        return self._delete(f"/api/personne-aliases/{alias_id}")

    # ------------------------------------------------------------------
    # Parcours
    # ------------------------------------------------------------------

    def parcours_list(self, personne_id: int) -> list:
        """GET /api/personne-parcours?personne_id={id}"""
        data = self._get("/api/personne-parcours", params={
            "personne_id": personne_id,
            "per_page"   : 50,
        })
        return (data or {}).get("data", [])

    def parcours_create(self, personne_id: int, parcours_data: dict) -> Optional[dict]:
        """POST /api/personne-parcours"""
        return self._post("/api/personne-parcours", {
            **parcours_data,
            "personne_id": personne_id,
        })

    def parcours_update(self, parcours_id: int, parcours_data: dict) -> Optional[dict]:
        """PUT /api/personne-parcours/{id}"""
        return self._put(f"/api/personne-parcours/{parcours_id}", parcours_data)

    def parcours_delete(self, parcours_id: int) -> Optional[dict]:
        """DELETE /api/personne-parcours/{id}"""
        return self._delete(f"/api/personne-parcours/{parcours_id}")

    # ------------------------------------------------------------------
    # HTTP — couche basse
    # ------------------------------------------------------------------

    def _get(self, path: str, params: dict = None) -> Optional[dict]:
        return self._request("GET", path, params=params)

    def _post(self, path: str, data: dict) -> Optional[dict]:
        return self._request("POST", path, json=data)

    def _put(self, path: str, data: dict) -> Optional[dict]:
        return self._request("PUT", path, json=data)

    def _delete(self, path: str) -> Optional[dict]:
        return self._request("DELETE", path)

    def _request(self, method: str, path: str, **kwargs) -> Optional[dict]:
        url = f"{self.base_url}{path}"
        try:
            r = self.session.request(method, url, **kwargs)
            print(f"[PersonneClient] {method} {r.request.url} → {r.status_code}")

            # Token expiré → une tentative de refresh
            if r.status_code == 401 and self.username:
                print("[PersonneClient] 401 — tentative de refresh token...")
                if self.login():
                    r = self.session.request(method, url, **kwargs)

            r.raise_for_status()
#            return r.json()
            content_type = r.headers.get("Content-Type", "")
            if "application/json" not in content_type:
                print(f"[PersonneClient] Réponse non-JSON reçue — authentification requise ?")
                print(f"[PersonneClient] Content-Type : {content_type}")
                return None
            return r.json()

        except requests.HTTPError as e:
            print(f"[PersonneClient] HTTP Error : {e} — {e.response.text[:300]}")
            return None
        except requests.RequestException as e:
            print(f"[PersonneClient] Request Error : {e}")
            return None


# ------------------------------------------------------------------
# Usage direct
# ------------------------------------------------------------------
if __name__ == "__main__":
    import os

    client = PersonneClient(
        base_url = os.getenv("APP_URL",      "https://zealot.fr"),
        username = os.getenv("APP_USER",     ""),
        password = os.getenv("APP_PASSWORD", ""),
    )

    # Sans auth — fonctionne si l'API est publique
    # client.login()  # décommenter quand l'auth est en place

    print("=== Recherche ===")
    results = client.search("de Gaulle")
    if results:
        for p in (results.get("data") or [])[:3]:
            print(f"  #{p.get('id')} — {p.get('nom_complet')}")

    print("\n=== Fiche complète ===")
    fiche = client.get_by_id(1)
    if fiche:
        p = fiche.get("personne") or fiche.get("data", {})
        print(f"  {p.get('nom_complet')}")
        print(f"  Aliases  : {len(fiche.get('aliases',  []))}")
        print(f"  Parcours : {len(fiche.get('parcours', []))}")
        print(f"  Relations: {len(fiche.get('relations',[]))}")
