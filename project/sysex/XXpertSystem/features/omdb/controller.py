"""
features/omdb/controller.py
Orchestre bus ↔ service ↔ store.
Miroir de codenaf.controller.js
"""
from .store   import omdb_store
from .service import fetch_omdb_search, fetch_omdb_movie


def init_omdb_controller(bus) -> None:
    """Enregistre tous les handlers OMDB sur le bus global."""

    def on_search(payload):
        title = payload.get("q", "") if isinstance(payload, dict) else str(payload)
        omdb_store["loading"] = True
        omdb_store["error"]   = None
        bus.publish("omdb:loading", True)
        try:
            result = fetch_omdb_search(title)
            omdb_store["data"] = result.get("Search", [])
            omdb_store["q"]    = title
            bus.publish("omdb:loaded", omdb_store)
        except Exception as err:
            omdb_store["error"] = str(err)
            bus.publish("omdb:error", str(err))
        finally:
            omdb_store["loading"] = False
            bus.publish("omdb:loading", False)

    def on_movie(payload):
        imdb_id = payload.get("id") if isinstance(payload, dict) else str(payload)
        bus.publish("omdb:loading", True)
        try:
            movie = fetch_omdb_movie(imdb_id)
            omdb_store["detail"] = movie
            bus.publish("omdb:movie:loaded", movie)
        except Exception as err:
            bus.publish("omdb:error", str(err))
        finally:
            bus.publish("omdb:loading", False)

    bus.subscribe("omdb:search", on_search)
    bus.subscribe("omdb:movie",  on_movie)
