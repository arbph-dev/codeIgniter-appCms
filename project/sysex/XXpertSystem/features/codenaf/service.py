"""
features/codenaf/service.py
Accès réseau pur — retourne des dict bruts, ne publie rien.
"""
from __future__ import annotations


def _get_client():
    from services.auth import CredentialsStore
    from ci_client.codesnaf import CodeNafClient
    store = CredentialsStore()
    auth  = store.build_and_login("zealot")
    store.close()
    if not auth:
        raise RuntimeError("Auth zealot échouée")
    return CodeNafClient("https://zealot.fr/api", auth=auth)


def fetch_naf(q: str = None, code: str = None, page: int = 1, per_page: int = 10) -> dict:
    return _get_client().search(q or code, per_page=per_page) if q or code else {}


def fetch_naf_like(q: str, len_: int = 10) -> list:
    if not q or len(q) < 2:
        return []
    return _get_client().like(q, len_=len_)


def fetch_naf_hierarchy(code: str) -> list:
    return _get_client().hierarchy(code)
