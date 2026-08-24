"""
features/omdb/service.py
Accès réseau pur — retourne des dict bruts, ne publie rien.
Miroir de codenaf.service.js
"""
from __future__ import annotations


def _get_client():
    from services.auth import CredentialsStore
    from services.api.OmdbClient import OmdbClient
    store = CredentialsStore()
    auth  = store.build_auth("omdb")
    store.close()
    if not auth:
        raise RuntimeError("Clé OMDB non configurée — lancez store.set('omdb', api_key='...')")
    return OmdbClient(auth)


def fetch_omdb_search(title: str) -> dict:
    return _get_client().search(title)


def fetch_omdb_movie(imdb_id: str) -> dict:
    return _get_client().get_movie(imdb_id)
