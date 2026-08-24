"""
features/api_tests/controller.py
Requêtes de test avec sauvegarde automatique via json_store.
Branché sur menu_api_tests() dans main.py.
"""
from core.json_store import save_response, list_samples


def init_api_tests_controller(bus) -> None:

    # ── Test OMDB ────────────────────────────────────────────────────────────
    def on_test_omdb(payload):
        q = payload.get("q", "") if isinstance(payload, dict) else str(payload)
        bus.publish("api_tests:loading", {"source": "omdb", "q": q})
        try:
            from features.omdb.service import fetch_omdb_search
            result = fetch_omdb_search(q)
            filename = save_response(
                data     = result,
                source   = "omdb",
                endpoint = "search",
                params   = {"q": q},
            )
            bus.publish("api_tests:saved", {
                "source":   "omdb",
                "endpoint": "search",
                "filename": filename,
                "data":     result,
            })
        except Exception as err:
            bus.publish("api_tests:error", {"source": "omdb", "error": str(err)})

    # ── Test CodeNaf ─────────────────────────────────────────────────────────
    def on_test_codenaf_search(payload):
        q = payload.get("q", "") if isinstance(payload, dict) else str(payload)
        bus.publish("api_tests:loading", {"source": "codenaf", "q": q})
        try:
            from features.codenaf.service import fetch_naf
            result = fetch_naf(q=q, per_page=20)
            filename = save_response(
                data     = result,
                source   = "codenaf",
                endpoint = "search",
                params   = {"q": q, "per_page": 20},
            )
            bus.publish("api_tests:saved", {
                "source":   "codenaf",
                "endpoint": "search",
                "filename": filename,
                "data":     result,
            })
        except Exception as err:
            bus.publish("api_tests:error", {"source": "codenaf", "error": str(err)})

    def on_test_codenaf_like(payload):
        q = payload.get("q", "") if isinstance(payload, dict) else str(payload)
        bus.publish("api_tests:loading", {"source": "codenaf", "q": q})
        try:
            from features.codenaf.service import fetch_naf_like
            result = fetch_naf_like(q, len_=10)
            filename = save_response(
                data     = result,
                source   = "codenaf",
                endpoint = "like",
                params   = {"q": q, "len": 10},
            )
            bus.publish("api_tests:saved", {
                "source":   "codenaf",
                "endpoint": "like",
                "filename": filename,
                "data":     result,
            })
        except Exception as err:
            bus.publish("api_tests:error", {"source": "codenaf", "error": str(err)})

    # ── Lister les samples sauvegardés ────────────────────────────────────────
    def on_list_samples(payload):
        source   = payload.get("source")   if isinstance(payload, dict) else None
        endpoint = payload.get("endpoint") if isinstance(payload, dict) else None
        samples  = list_samples(source=source, endpoint=endpoint)
        bus.publish("api_tests:samples_loaded", samples)

    bus.subscribe("api_tests:omdb:search",      on_test_omdb)
    bus.subscribe("api_tests:codenaf:search",   on_test_codenaf_search)
    bus.subscribe("api_tests:codenaf:like",     on_test_codenaf_like)
    bus.subscribe("api_tests:list_samples",     on_list_samples)
