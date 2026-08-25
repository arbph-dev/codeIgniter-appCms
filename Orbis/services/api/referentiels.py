# ci_client/referentiels.py
"""
Clients référentiels zealot.fr — données combo / liste / radio

    FormeJuridiqueClient  /forme-juridiques
    CodesNafClient        /codes-naf

Ces endpoints retournent des listes stables (rarement mises à jour).
Un cache mémoire simple évite les appels répétés dans une même session.

Usage :
    auth = store.build_and_login("zealot")

    fj_client  = FormeJuridiqueClient(auth)
    naf_client = CodesNafClient(auth)

    formes = fj_client.list()          # [{"id": 1, "code": "5710", "libelle": "..."}, ...]
    naf    = naf_client.get_by_code("68.10Z")
"""
from typing import Optional
from services.api.BaseApiClient import BaseApiClient

ZEALOT_BASE = "https://zealot.fr/api"


class FormeJuridiqueClient(BaseApiClient):

    _source = "zealot_fj"

    def __init__(self, auth, timeout: int = 10, save_samples: bool = False):
        super().__init__(ZEALOT_BASE, auth=auth, timeout=timeout, save_samples=save_samples)
        self._cache: Optional[list] = None

    def list(self) -> list:
        """Retourne toutes les formes juridiques. Résultat mis en cache."""
        if self._cache is None:
            data = self.get("/forme-juridiques")
            self._save(data, "list")
            self._cache = (data or {}).get("data", [])
        return self._cache

    def get_by_id(self, fj_id: int) -> Optional[dict]:
        data = self.get(f"/forme-juridiques/{fj_id}")
        return (data or {}).get("data")

    def get_by_code(self, code: str) -> Optional[dict]:
        """Recherche dans le cache par code INSEE (ex: '5710')."""
        return next(
            (f for f in self.list() if f.get("code") == code),
            None,
        )

    def as_choices(self) -> list[tuple[int, str]]:
        """Retourne [(id, libelle), ...] — prêt pour un combo QML ou Rich."""
        return [(f["id"], f.get("libelle", f.get("label", str(f["id"])))) for f in self.list()]

    def invalidate_cache(self):
        self._cache = None


class CodesNafClient(BaseApiClient):

    _source = "zealot_naf"

    def __init__(self, auth, timeout: int = 10, save_samples: bool = False):
        super().__init__(ZEALOT_BASE, auth=auth, timeout=timeout, save_samples=save_samples)
        self._cache: Optional[list] = None

    def list(self) -> list:
        if self._cache is None:
            data = self.get("/codes-naf")
            self._save(data, "list")
            self._cache = (data or {}).get("data", [])
        return self._cache

    def get_by_code(self, code: str) -> Optional[dict]:
        """Ex : get_by_code("68.10Z") → {"code": "68.10Z", "libelle": "Activités des marchands de biens..."}"""
        return next(
            (n for n in self.list() if n.get("code") == code),
            None,
        )

    def as_choices(self) -> list[tuple[str, str]]:
        """Retourne [(code, libelle), ...] — prêt pour un combo."""
        return [(n["code"], n.get("libelle", n["code"])) for n in self.list()]

    def invalidate_cache(self):
        self._cache = None
