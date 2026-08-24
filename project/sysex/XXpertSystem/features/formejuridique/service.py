"""
features/formejuridique/service.py
Accès réseau pur — wrapping de FormeJuridiqueClient.
Retourne des dict bruts, ne publie rien sur le bus.
"""
from __future__ import annotations


def _get_client():
    from services.auth import CredentialsStore
    from ci_client.formejuridique import FormeJuridiqueClient
    store = CredentialsStore()
    auth  = store.build_and_login("zealot")
    store.close()
    if not auth:
        raise RuntimeError("Auth zealot échouée — vérifiez vos credentials")
    return FormeJuridiqueClient("https://zealot.fr/api", auth=auth)


def fetch_fj_get(code: str) -> dict | None:
    return _get_client().get(code)


def fetch_fj_search(q: str, per_page: int = 20, page: int = 1) -> dict:
    return _get_client().search(q, per_page=per_page, page=page)


def fetch_fj_like(q: str, len_: int = 10) -> list:
    return _get_client().like(q, len_=len_)


def fetch_fj_create(code: str, description: str) -> dict | None:
    return _get_client().create(code, description)


def fetch_fj_update(code: str, description: str) -> dict | None:
    return _get_client().update(code, description)


def fetch_fj_delete(code: str) -> bool:
    return _get_client().delete(code)


def fetch_fj_resolve(code: str) -> str | None:
    """Retourne uniquement le libellé — usage pipeline."""
    return _get_client().resolve(code)


def fetch_fj_ensure(code: str, description: str) -> dict | None:
    """Crée si absent, retourne l'existant sinon — usage pipeline."""
    return _get_client().ensure(code, description)
