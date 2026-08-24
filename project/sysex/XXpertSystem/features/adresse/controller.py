"""
features/adresse/controller.py
Orchestre le pipeline complet :
    adresse:ban:search
        → BAN /search
        → publie adresse:ban:loaded (liste scorée)

    adresse:ban:select  { index: N }
        → resolve_type_voie  (validated / approx / pending)
        → fetch_codepostal_id
        → ban_to_ci_payload
        → publie adresse:ready  (payload prêt, attente confirmation)
        → si pending_type : publie adresse:pending:type (avertissement)

    adresse:save  { payload: {...} }
        → POST /api/adresse
        → publie adresse:saved

    adresse:search  { q: "..." }
        → GET /api/adresse?q=
        → publie adresse:loaded

    adresse:get  { id: N }
        → GET /api/adresse/{id}
        → publie adresse:detail:loaded
"""
from .store import adresse_store


def init_adresse_controller(bus) -> None:

    # ── Géocodage BAN ────────────────────────────────────────────────────────

    def on_ban_search(payload):
        q = payload.get("q", "") if isinstance(payload, dict) else str(payload)
        if not q:
            bus.publish("adresse:error", "Adresse vide")
            return

        adresse_store["loading"]     = True
        adresse_store["ban_results"] = []
        adresse_store["selected"]    = None
        bus.publish("adresse:loading", True)

        try:
            from .ban_service import fetch_ban_search
            results = fetch_ban_search(q, limit=5)
            adresse_store["ban_results"] = results
            bus.publish("adresse:ban:loaded", results)
        except Exception as err:
            adresse_store["error"] = str(err)
            bus.publish("adresse:error", str(err))
        finally:
            adresse_store["loading"] = False
            bus.publish("adresse:loading", False)

    # ── Sélection d'un résultat BAN + résolution via FieldMapper ──────────────

    def on_ban_select(payload):
        index = payload.get("index", 0) if isinstance(payload, dict) else 0
        results = adresse_store["ban_results"]

        if not results or index >= len(results):
            bus.publish("adresse:error", "Index invalide")
            return

        selected = results[index]
        adresse_store["selected"] = selected
        bus.publish("adresse:loading", True)

        try:
            from .ci_adresse_service import ban_to_ci_payload

            # FieldMapper orchestre resolve_type_voie + fetch_codepostal_id
            result = ban_to_ci_payload(selected)

            # Remonter les warnings du mapper vers le bus
            resolve_meta = {}
            for w in result.warnings:
                if w.value and isinstance(w.value, dict) and "status" in w.value:
                    resolve_meta[w.field] = w.value
                    status = w.value.get("status")
                    if status == "pending":
                        adresse_store["pending_types"].append(w.value)
                        bus.publish("adresse:pending:type", w.value)
                    elif status == "approx":
                        bus.publish("adresse:approx:type", w.value)
                elif w.level == "error":
                    bus.publish("adresse:error", w.message)
                    return

            if not result.ok:
                return

            bus.publish("adresse:ready", {
                "payload":      result.payload,
                "ban_result":   selected,
                "resolve_meta": resolve_meta,
            })

        except Exception as err:
            adresse_store["error"] = str(err)
            bus.publish("adresse:error", str(err))
        finally:
            bus.publish("adresse:loading", False)
    # ── Sauvegarde CI ────────────────────────────────────────────────────────

    def on_save(payload):
        ci_payload = payload.get("payload") if isinstance(payload, dict) else payload
        if not ci_payload:
            bus.publish("adresse:error", "Payload vide")
            return

        bus.publish("adresse:loading", True)
        try:
            from .ci_adresse_service import fetch_adresse_create
            created = fetch_adresse_create(ci_payload)
            adresse_store["last_saved"] = created
            bus.publish("adresse:saved", created)
        except Exception as err:
            adresse_store["error"] = str(err)
            bus.publish("adresse:error", str(err))
        finally:
            bus.publish("adresse:loading", False)

    # ── Recherche CI ─────────────────────────────────────────────────────────

    def on_search(payload):
        q        = payload.get("q", "")        if isinstance(payload, dict) else str(payload)
        page     = payload.get("page", 1)      if isinstance(payload, dict) else 1
        per_page = payload.get("per_page", 20) if isinstance(payload, dict) else 20
        bus.publish("adresse:loading", True)
        try:
            from .ci_adresse_service import fetch_adresse_search
            result = fetch_adresse_search(q, page=page, per_page=per_page)
            bus.publish("adresse:loaded", result)
        except Exception as err:
            bus.publish("adresse:error", str(err))
        finally:
            bus.publish("adresse:loading", False)

    def on_get(payload):
        adresse_id = payload.get("id") if isinstance(payload, dict) else int(payload)
        bus.publish("adresse:loading", True)
        try:
            from .ci_adresse_service import fetch_adresse_get
            item = fetch_adresse_get(adresse_id)
            if item:
                bus.publish("adresse:detail:loaded", item)
            else:
                bus.publish("adresse:error", f"Adresse #{adresse_id} introuvable")
        except Exception as err:
            bus.publish("adresse:error", str(err))
        finally:
            bus.publish("adresse:loading", False)

    # ── Abonnements ──────────────────────────────────────────────────────────

    bus.subscribe("adresse:ban:search", on_ban_search)
    bus.subscribe("adresse:ban:select", on_ban_select)
    bus.subscribe("adresse:save",       on_save)
    bus.subscribe("adresse:search",     on_search)
    bus.subscribe("adresse:get",        on_get)
