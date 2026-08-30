# services/api/entreprise_client.py
"""
Client API Entreprise — zealot.fr

Routes :
    GET    /api/entreprise              Liste paginée (q, page, per_page)
    GET    /api/entreprise/like         Autocomplete (q, len)
    GET    /api/entreprise/:id          Détail complet (org + ent + refs)
    POST   /api/entreprise              Crée org + entreprise (transaction)
    PUT    /api/entreprise/:id          Met à jour org + entreprise (transaction)
    DELETE /api/entreprise/:id          Soft delete via org mère

⚠ LIMITE API ACTUELLE :
    POST /entreprise crée TOUJOURS une nouvelle organisation mère.
    Il n'existe pas d'endpoint pour rattacher une entreprise à une
    organisation existante sans créer de doublon.
    → Pour les organisations orphelines (id, nom uniquement), utiliser
      OrganisationClient.update() pour enrichir l'org, et attendre
      l'ajout d'un endpoint POST /organisation/:id/entreprise.

Réponse type GET /entreprise/:id :
    {
        "id": 1, "organisation_id": 5,
        "siret": "12345678901234", "codenaf_id": "6201Z",
        "forme_juridique_id": "SARL",
        "capital": 50000.00, "effectif_min": 5, "effectif_max": 15,
        "nom": "ACME", "slug": "acme", "siren": "123456789",
        "type_label": "ENTREPRISE",
        "codenaf_nom": "Développement logiciels",
        "forme_juridique_nom": "SARL"
    }

Usage :
    auth   = store.build_and_login("zealot")
    client = EntrepriseClient(auth)
    page   = client.list(q="algue")
    ent    = client.get_by_id(1)
    all_   = client.list_all()

    # Créer une entreprise complète (nouvelle org créée automatiquement)
    created = client.create(
        nom="Nouvelle SARL", siren="123456789",
        siret="12345678901234", codenaf_id="6201Z",
    )

    # Enrichir une entreprise existante depuis INSEE
    client.update(1, siret="...", codenaf_id="...", siren="...")
"""
from __future__ import annotations

from typing import Optional
from .BaseApiClient import BaseApiClient

ZEALOT_BASE = "https://zealot.fr/api"


class EntrepriseClient(BaseApiClient):

    _source = "zealot_ent"

    def __init__(self, auth, timeout: int = 10, save_samples: bool = False):
        super().__init__(ZEALOT_BASE, auth=auth, timeout=timeout, save_samples=save_samples)

    # ── Lecture ──────────────────────────────────────────────────────

    def list(
        self,
        q:        Optional[str] = None,
        page:     int = 1,
        per_page: int = 20,
    ) -> Optional[dict]:
        """
        GET /entreprise?q=...&page=...&per_page=...
        q recherche sur : nom, SIRET (début), SIREN (début).
        """
        params: dict = {"page": max(1, page), "per_page": min(100, per_page)}
        if q:
            params["q"] = q
        data = self.get("/entreprise", params)
        self._save(data, "list", params)
        return data

    def get_by_id(self, id_: int) -> Optional[dict]:
        """
        GET /entreprise/:id
        Retourne l'objet entreprise complet avec les jointures.
        """
        data = self.get(f"/entreprise/{id_}")
        self._save(data, "get_by_id", {"id": id_})
        return (data or {}).get("data")

    def find_by_siren(self, siren: str) -> Optional[dict]:
        """
        Recherche une entreprise par SIREN via GET /entreprise?q={siren}.
        Retourne le premier résultat dont le siren correspond exactement, ou None.
        """
        data = self.list(q=siren, per_page=5)
        for item in (data or {}).get("data", []):
            if item.get("siren") == siren:
                return item
        return None

    def like(self, q: str, len_: int = 10) -> list[dict]:
        """
        GET /entreprise/like?q=...&len=...
        → [{id, nom}, ...]   (min 2 car.)
        """
        if len(q.strip()) < 2:
            return []
        data = self.get("/entreprise/like", {"q": q.strip(), "len": min(50, len_)})
        self._save(data, "like", {"q": q})
        return (data or {}).get("data", [])

    def list_all(
        self,
        q:           Optional[str] = None,
        max_results: int = 1000,
    ) -> list[dict]:
        """Itère automatiquement sur les pages."""
        results:  list[dict] = []
        page      = 1
        per_page  = min(50, max_results)

        while len(results) < max_results:
            data = self.list(q=q, page=page, per_page=per_page)
            if not data:
                break
            items = data.get("data", [])
            if not items:
                break
            results.extend(items)

            pager       = data.get("pager", {})
            total       = pager.get("total", 0)
            per_p       = pager.get("perPage", per_page)
            total_pages = (total + per_p - 1) // per_p if per_p else 1

            if page >= total_pages:
                break
            page += 1

        return results[:max_results]

    # ── Écriture ─────────────────────────────────────────────────────

    def create(
        self,
        nom:                  str,
        siren:                Optional[str]   = None,
        siret:                Optional[str]   = None,
        codenaf_id:           Optional[str]   = None,
        forme_juridique_id:   Optional[str]   = None,
        capital:              Optional[float] = None,
        effectif_min:         Optional[int]   = None,
        effectif_max:         Optional[int]   = None,
        organisation_type_id: int = 1,
        **kwargs,
    ) -> Optional[dict]:
        """
        POST /entreprise — crée l'organisation mère ET l'entreprise (transaction).
        ⚠ Crée TOUJOURS une nouvelle organisation — ne pas utiliser pour les
          organisations zealot déjà existantes (risque de doublon).

        Pour l'enrichissement d'orgs existantes : voir OrganisationClient.update()
        puis attendre POST /organisation/:id/entreprise (API à modifier).
        """
        payload: dict = {
            "nom": nom,
            "organisation_type_id": organisation_type_id,
        }
        if siren:              payload["siren"]              = siren
        if siret:              payload["siret"]              = siret
        if codenaf_id:         payload["codenaf_id"]         = codenaf_id
        if forme_juridique_id: payload["forme_juridique_id"] = forme_juridique_id
        if capital is not None:     payload["capital"]       = capital
        if effectif_min is not None: payload["effectif_min"] = effectif_min
        if effectif_max is not None: payload["effectif_max"] = effectif_max
        payload.update(kwargs)

        data = self.post("/entreprise", payload)
        return (data or {}).get("data")

    def update(self, id_: int, **kwargs) -> Optional[dict]:
        """
        PUT /entreprise/:id — met à jour org + entreprise (transaction).
        Champs organisation : nom, siren, description, site_web, email, telephone, ...
        Champs entreprise   : siret, codenaf_id, forme_juridique_id, capital,
                              effectif_min, effectif_max.
        Tous optionnels.

        Cas principal du rapprochement (org existante avec siren) :
            client.update(id_=1, siret="...", codenaf_id="47.78C")
        """
        data = self.put(f"/entreprise/{id_}", kwargs)
        return (data or {}).get("data")

    def delete(self, id_: int) -> bool:
        """DELETE /entreprise/:id (soft delete via org mère)."""
        result = self._request("DELETE", f"/entreprise/{id_}")
        return result is not None
    

    def attach_to_organisation(self, org_id: int, **kwargs) -> Optional[dict]:
        """
        POST /organisation/:id/entreprise
        Rattache une extension entreprise à une organisation existante.
        Ne crée PAS une nouvelle org.

        kwargs : siren, siret, adresse_id, codenaf_id, forme_juridique_id,
                 capital, effectif_min, effectif_max, …
        """
        data = self.post(f"/organisation/{org_id}/entreprise", kwargs)
        self._save(data, "attach", {"org_id": org_id, **kwargs})
        return (data or {}).get("data")
