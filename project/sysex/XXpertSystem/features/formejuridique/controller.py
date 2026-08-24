"""
features/formejuridique/controller.py
Orchestre bus ↔ service ↔ store.
Couvre lecture ET écriture — c'est la feature la plus complète.
"""
from .store   import fj_store
from .service import (
    fetch_fj_get, fetch_fj_search, fetch_fj_like,
    fetch_fj_create, fetch_fj_update, fetch_fj_delete,
    fetch_fj_resolve, fetch_fj_ensure,
)


def init_fj_controller(bus) -> None:

    # ── Lecture ──────────────────────────────────────────────────────────────

    def on_get(payload):
        code = payload.get("code") if isinstance(payload, dict) else str(payload)
        bus.publish("fj:loading", True)
        try:
            item = fetch_fj_get(code)
            fj_store["detail"] = item
            fj_store["code"]   = code
            if item:
                bus.publish("fj:detail:loaded", item)
            else:
                bus.publish("fj:error", f"Code {code!r} introuvable")
        except Exception as err:
            bus.publish("fj:error", str(err))
        finally:
            bus.publish("fj:loading", False)

    def on_search(payload):
        q        = payload.get("q", "")       if isinstance(payload, dict) else str(payload)
        per_page = payload.get("per_page", 20) if isinstance(payload, dict) else 20
        page     = payload.get("page", 1)      if isinstance(payload, dict) else 1
        fj_store["loading"] = True
        fj_store["error"]   = None
        bus.publish("fj:loading", True)
        try:
            result = fetch_fj_search(q, per_page=per_page, page=page)
            fj_store["data"]  = result.get("data", [])
            fj_store["q"]     = q
            fj_store["pagination"] = result.get("pager", {})
            bus.publish("fj:loaded", fj_store)
        except Exception as err:
            fj_store["error"] = str(err)
            bus.publish("fj:error", str(err))
        finally:
            fj_store["loading"] = False
            bus.publish("fj:loading", False)

    def on_like(payload):
        q    = payload.get("q", "")    if isinstance(payload, dict) else str(payload)
        len_ = payload.get("len", 10)  if isinstance(payload, dict) else 10
        try:
            items = fetch_fj_like(q, len_=len_)
            bus.publish("fj:like:loaded", items)
        except Exception as err:
            bus.publish("fj:error", str(err))

    # ── Écriture ─────────────────────────────────────────────────────────────

    def on_create(payload):
        code = payload.get("code", "")        if isinstance(payload, dict) else ""
        desc = payload.get("description", "") if isinstance(payload, dict) else ""
        bus.publish("fj:loading", True)
        try:
            item = fetch_fj_create(code, desc)
            if item:
                bus.publish("fj:created", item)
            else:
                bus.publish("fj:error", f"Échec création {code!r}")
        except Exception as err:
            bus.publish("fj:error", str(err))
        finally:
            bus.publish("fj:loading", False)

    def on_update(payload):
        code = payload.get("code", "")        if isinstance(payload, dict) else ""
        desc = payload.get("description", "") if isinstance(payload, dict) else ""
        bus.publish("fj:loading", True)
        try:
            item = fetch_fj_update(code, desc)
            if item:
                bus.publish("fj:updated", item)
            else:
                bus.publish("fj:error", f"Échec mise à jour {code!r}")
        except Exception as err:
            bus.publish("fj:error", str(err))
        finally:
            bus.publish("fj:loading", False)

    def on_delete(payload):
        code = payload.get("code") if isinstance(payload, dict) else str(payload)
        bus.publish("fj:loading", True)
        try:
            ok = fetch_fj_delete(code)
            if ok:
                bus.publish("fj:deleted", code)
            else:
                bus.publish("fj:error", f"Échec suppression {code!r}")
        except Exception as err:
            bus.publish("fj:error", str(err))
        finally:
            bus.publish("fj:loading", False)

    # ── Pipeline helpers ─────────────────────────────────────────────────────

    def on_resolve(payload):
        """Publie fj:resolved avec juste le libellé — usage enrichissement."""
        code      = payload.get("code")      if isinstance(payload, dict) else str(payload)
        source_id = payload.get("source_id") if isinstance(payload, dict) else None
        try:
            label = fetch_fj_resolve(code)
            bus.publish("fj:resolved", {"code": code, "label": label, "source_id": source_id})
        except Exception as err:
            bus.publish("fj:error", str(err))

    def on_ensure(payload):
        """Crée si absent — usage import pipeline."""
        code = payload.get("code", "")        if isinstance(payload, dict) else ""
        desc = payload.get("description", "") if isinstance(payload, dict) else ""
        try:
            item = fetch_fj_ensure(code, desc)
            bus.publish("fj:ensured", item)
        except Exception as err:
            bus.publish("fj:error", str(err))

    # ── Abonnements ──────────────────────────────────────────────────────────

    bus.subscribe("fj:get",     on_get)
    bus.subscribe("fj:search",  on_search)
    bus.subscribe("fj:like",    on_like)
    bus.subscribe("fj:create",  on_create)
    bus.subscribe("fj:update",  on_update)
    bus.subscribe("fj:delete",  on_delete)
    bus.subscribe("fj:resolve", on_resolve)
    bus.subscribe("fj:ensure",  on_ensure)
