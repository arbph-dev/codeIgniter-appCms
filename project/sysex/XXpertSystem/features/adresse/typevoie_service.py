"""
features/adresse/typevoie_service.py
Résolution du type de voie BAN → id CI.

Règle :
  1. Normalise le libellé (strip, title case)
  2. Cherche dans CI via /api/typevoie/like
  3. Match exact    → retourne (id, 'validated')
  4. Match approché → retourne (id, 'approx')   ← afficher avertissement
  5. Absent         → crée avec status=pending   → retourne (id, 'pending')
"""
from __future__ import annotations
from .ban_service import normalize_type_label


def _get_session():
    from services.auth import CredentialsStore
    store = CredentialsStore()
    auth  = store.build_and_login("zealot")
    store.close()
    if not auth:
        raise RuntimeError("Auth zealot échouée")
    return auth.get_session()


def fetch_tv_like(q: str, len_: int = 10) -> list[dict]:
    """GET /api/typevoie/like?q=...  → [{'id', 'nom'}, ...]"""
    session = _get_session()
    r = session.get(
        "https://zealot.fr/api/typevoie/like",
        params={"q": q, "len": len_},
        timeout=10,
    )
    r.raise_for_status()
    return r.json().get("data", [])


def fetch_tv_create_pending(nom: str, nom_ban: str) -> dict | None:
    """
    POST /api/typevoie  avec status=pending.
    nom     : libellé normalisé  ex "Voie verte"
    nom_ban : forme brute BAN    ex "Voie verte"
    """
    session = _get_session()
    # id requis par CI — on utilise 0 comme sentinel,
    # l'admin devra assigner un vrai id lors de la validation
    payload = {
        "nom":     nom,
        "nom_ban": nom_ban,
        "status":  "pending",
    }
    r = session.post(
        "https://zealot.fr/api/typevoie",
        json=payload,
        timeout=10,
    )
    if not r.ok:
        return None
    data = r.json()
    return data.get("data") or data


def resolve_type_voie(ban_type_raw: str) -> tuple[int | None, str, str]:
    """
    Résout un type de voie BAN vers un id CI.

    Retourne (id, status, label) où status est :
      'validated' → match exact dans CI
      'approx'    → match approché (à vérifier)
      'pending'   → créé en attente de validation
      'error'     → échec réseau ou CI

    Ex :
      resolve_type_voie("Rue")         → (12, 'validated', 'Rue')
      resolve_type_voie("Voie verte")  → (99, 'pending',   'Voie verte')
    """
    if not ban_type_raw:
        return (None, "error", "")

    normalized = normalize_type_label(ban_type_raw)
    if not normalized:
        return (None, "error", "")

    print(f"[typevoie] resolve: raw={ban_type_raw!r} normalized={normalized!r}")
    try:
        candidates = fetch_tv_like(normalized, len_=10)
        print(f"[typevoie] candidates: {candidates}")
    except Exception as e:
        print(f"[typevoie] fetch_tv_like ERROR: {e}")
        return (None, "error", str(e))

    # Match exact insensible à la casse
    for c in candidates:
        if c.get("nom", "").strip().lower() == normalized.lower():
            return (c["id"], "validated", c["nom"])

    # Match approché — premier résultat si la liste n'est pas vide
    if candidates:
        best = candidates[0]
        return (best["id"], "approx", best["nom"])

    # Absent → créer pending
    try:
        created = fetch_tv_create_pending(nom=normalized, nom_ban=ban_type_raw)
        if created:
            return (created.get("id"), "pending", normalized)
        return (None, "error", f"Échec création pending pour {normalized!r}")
    except Exception as e:
        return (None, "error", str(e))
