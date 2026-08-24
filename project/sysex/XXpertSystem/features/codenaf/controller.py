"""
features/codenaf/controller.py
Miroir exact de codenaf.controller.js
"""
from .store   import codenaf_store
from .service import fetch_naf, fetch_naf_like, fetch_naf_hierarchy


def init_codenaf_controller(bus) -> None:

    def on_search(payload):
        q    = payload.get("q")    if isinstance(payload, dict) else str(payload)
        code = payload.get("code") if isinstance(payload, dict) else None
        codenaf_store["loading"] = True
        bus.publish("naf:loading", True)
        try:
            result = fetch_naf(q=q, code=code)
            codenaf_store["data"] = result.get("data", [result] if result else [])
            codenaf_store["q"]    = q
            bus.publish("naf:loaded", codenaf_store)
        except Exception as err:
            codenaf_store["error"] = str(err)
            bus.publish("naf:error", str(err))
        finally:
            codenaf_store["loading"] = False
            bus.publish("naf:loading", False)

    def on_like(payload):
        q   = payload.get("q")   if isinstance(payload, dict) else str(payload)
        len_ = payload.get("len", 10) if isinstance(payload, dict) else 10
        try:
            items = fetch_naf_like(q, len_=len_)
            bus.publish("naf:like:loaded", items)
        except Exception as err:
            bus.publish("naf:error", str(err))

    def on_hierarchy(payload):
        code = payload.get("code") if isinstance(payload, dict) else str(payload)
        try:
            items = fetch_naf_hierarchy(code)
            bus.publish("naf:hierarchy:loaded", {"code": code, "items": items})
        except Exception as err:
            bus.publish("naf:error", str(err))

    bus.subscribe("naf:search",    on_search)
    bus.subscribe("naf:ui:like",   on_like)
    bus.subscribe("naf:hierarchy", on_hierarchy)
