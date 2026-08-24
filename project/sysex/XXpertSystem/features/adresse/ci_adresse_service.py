"""
features/adresse/ci_adresse_service.py
Résolution complète d'un résultat BAN vers un payload CI Adresse.

Pipeline :
    BAN result
      ├── housenumber  → voienumero + voierpt (IndiceRepetition)
      ├── street       → type_voie_id + voiecharniere + voienom (Charniere)
      ├── postcode     → codepostal_id  (GET /api/codepostal)
      ├── type + score → precision      (GeocodePrecision)
      └── lat/lon      → latitude/longitude

Puis POST /api/adresse → id CI
"""
from __future__ import annotations
import re
from typing import Any


# ─────────────────────────────────────────────────────────────────────────────
# Enums locaux — miroir des Enums PHP côté CI
# ─────────────────────────────────────────────────────────────────────────────

class IndiceRepetition:
    """
    Suffixe du numéro de voie.
    CI stocke : B=Bis, T=Ter, Q=Quater, C=Quinquies
    """
    MAP = {
        "bis":       "B",
        "b":         "B",
        "ter":       "T",
        "t":         "T",
        "quater":    "Q",
        "q":         "Q",
        "quinquies": "C",
        "c":         "C",
    }

    @classmethod
    def extract(cls, housenumber: str) -> tuple[str, str]:
        """
        Extrait le numéro et l'indice depuis le champ housenumber BAN.
        "15 bis" → ("15", "B")
        "12"     → ("12", "")
        "7 ter"  → ("7",  "T")
        """
        if not housenumber:
            return ("", "")
        parts = housenumber.strip().split(None, 1)
        numero = parts[0]
        if len(parts) == 1:
            return (numero, "")
        suffix = parts[1].lower().rstrip(".")
        return (numero, cls.MAP.get(suffix, ""))


class Charniere:
    """
    Article entre le type de voie et le nom de voie.
    CI stocke un entier 0-7 (enum PHP Charniere).

    Mapping valeur → int CI :
      0 = (aucune)
      1 = du
      2 = de la
      3 = des
      4 = de l'  / de l
      5 = de
      6 = au / aux
      7 = le / la / les / l'
    """
    # Codes CI confirmés (voiecharniere, less_than[8] = valeurs 0-7) :
    #   0 = aucune → None (champ omis)    1 = le/la/les (à confirmer)
    #   2 = du      3 = de la    4 = des
    #   5 = de l'   6 = de       7 = au/aux
    _PATTERNS: list[tuple[str, int]] = [
        ("de l'",  5),   # apostrophe droit    → CI 5
        ("de l’", 5), # apostrophe typographique
        ("de la",  3),   # AVANT "de l"        → CI 3
        ("de l",   5),   # sans apostrophe     → CI 5
        ("des",    4),   #                     → CI 4
        ("du",     2),   #                     → CI 2
        ("de",     6),   #                     → CI 6
        ("aux",    7),   #                     → CI 7
        ("au",     7),   #                     → CI 7
        ("les",    1),   # CI 1 à confirmer
        ("le",     1),
        ("la",     1),
        ("l'",     1),
        ("l’",1),
        ("l",      1),
    ]

    @classmethod
    def extract(cls, nom_voie: str) -> tuple[int, str]:
        """
        Détecte et sépare la charnière du début du nom de voie.
        Retourne (code_int, nom_sans_charniere).

        "du Général de Gaulle"    → (1, "Général de Gaulle")
        "de la Paix"              → (2, "Paix")
        "des Lilas"               → (3, "Lilas")
        "de l'Église"             → (4, "Église")
        "Jean Jaurès"             → (0, "Jean Jaurès")
        "de Brest"                → (5, "Brest")
        """
        if not nom_voie:
            return (0, "")

        lower = nom_voie.lower().strip()

        for pattern, code in cls._PATTERNS:
            # Le pattern doit être suivi d'un espace ou d'une apostrophe
            if lower.startswith(pattern):
                rest = nom_voie[len(pattern):].strip()
                if rest:  # s'assurer qu'il reste quelque chose après
                    return (code, rest)

        return (0, nom_voie.strip())


class GeocodePrecision:
    """
    Précision de la localisation.
    Valeurs CI : numero / voie / commune / approx
    """
    @staticmethod
    def from_ban(ban_type: str, score: float) -> str:
        """
        Déduit la précision depuis le type BAN et le score.
        ban_type : "housenumber" / "street" / "municipality"
        """
        if ban_type == "housenumber" and score >= 0.7:
            return "numero"
        if ban_type == "housenumber" and score < 0.7:
            return "voie"
        if ban_type == "street":
            return "voie"
        if ban_type == "municipality":
            return "commune"
        return "approx"

    @staticmethod
    def from_manual() -> str:
        """Adresse saisie manuellement sans géocodage."""
        return "approx"


# ─────────────────────────────────────────────────────────────────────────────
# Résolution CodePostal CI
# ─────────────────────────────────────────────────────────────────────────────

def _get_session():
    from services.auth import CredentialsStore
    store = CredentialsStore()
    auth  = store.build_and_login("zealot")
    store.close()
    if not auth:
        raise RuntimeError("Auth zealot échouée")
    return auth.get_session()


def fetch_codepostal_id(postcode: str, citycode: str = None) -> int | None:
    """
    Résout un code postal vers l'id CI.
    Si citycode (INSEE) fourni, filtre dessus pour lever l'ambiguïté
    des communes ayant plusieurs codes postaux.

    GET /api/codepostal?codepostal=29000  → premier résultat
    GET /api/codepostal?codeinsee=29232   → résultat précis
    """
    session = _get_session()

    # Priorité : code INSEE (plus précis)
    if citycode:
        r = session.get(
            "https://zealot.fr/api/codepostal",
            params={"codeinsee": citycode},
            timeout=10,
        )
        if r.ok:
            data = r.json().get("data", [])
            if data:
                try:
                    return int(data[0].get("id"))
                except (TypeError, ValueError):
                    pass

    # Fallback : code postal seul
    if postcode:
        r = session.get(
            "https://zealot.fr/api/codepostal",
            params={"codepostal": postcode},
            timeout=10,
        )
        if r.ok:
            data = r.json().get("data", [])
            if data:
                try:
                    return int(data[0].get("id"))
                except (TypeError, ValueError):
                    pass

    return None


# ─────────────────────────────────────────────────────────────────────────────
# Helpers transforms pour FieldMapper
# ─────────────────────────────────────────────────────────────────────────────

def _extract_numero(housenumber: str):
    """BAN housenumber '15 bis' -> 15 (int)"""
    if not housenumber:
        return None
    parts = housenumber.strip().split(None, 1)
    try:
        return int(parts[0])
    except (ValueError, TypeError):
        return None

def _extract_rpt(housenumber: str):
    """BAN housenumber '15 bis' -> 'B' """
    _, rpt = IndiceRepetition.extract(housenumber or "")
    return rpt or None

def _extract_charniere(nom_voie: str):
    """nom_voie -> code int CI (0 = aucune -> None envoye)"""
    code, _ = Charniere.extract(nom_voie or "")
    return code if code > 0 else None

def _extract_voienom(nom_voie: str, street: str = ""):
    """Extrait le nom pur apres charniere, fallback sur street."""
    _, nom = Charniere.extract(nom_voie or "")
    return nom or street or None


# ─────────────────────────────────────────────────────────────────────────────
# Mapping BAN -> payload CI Adresse  (declaratif via FieldMapper)
# ─────────────────────────────────────────────────────────────────────────────

def _build_ban_mapper():
    from .typevoie_service import resolve_type_voie
    m = FieldMapper("ban", "ci_adresse")
    
    m.field( "voienumero", from_="housenumber", type_=int, transform=_extract_numero )
    m.field( "voierpt", from_="housenumber", type_=str, transform=_extract_rpt)
    
    m.computed("voiecharniere", depends=["nom_voie"], fn=_extract_charniere)
    m.computed("voienom", depends=["nom_voie", "street"], fn=_extract_voienom)
    m.computed("precision", depends=["type", "score"], fn=GeocodePrecision.from_ban)
    
    m.resolve("voietype_id", from_="type_voie", fn=resolve_type_voie, type_=int)
    m.resolve("codepostal_id", from_="postcode", fn=fetch_codepostal_id, type_=int, aux={"citycode": "citycode"}, required=True)
    
    m.field("acheminement", from_="city",  type_=str)
    m.field("latitude", from_="lat",   type_=float)
    m.field("longitude", from_="lon",   type_=float)
    return m

_ban_mapper = None   # construit au premier appel

def ban_to_ci_payload(ban_result: dict):
    """
    Mappe un resultat BAN parse vers un payload CI Adresse.
    Retourne un MappingResult (payload + warnings integres).
    Remplace l'ancienne signature (result, tv_id, cp_id) :
    les resolutions FK sont maintenant declarees dans le mapper.
    """
    global _ban_mapper
    if _ban_mapper is None:
        _ban_mapper = _build_ban_mapper()
    return _ban_mapper.apply(ban_result)

# ─────────────────────────────────────────────────────────────────────────────
# CRUD CI Adresse
# ─────────────────────────────────────────────────────────────────────────────

def fetch_adresse_create(payload: dict) -> dict | None:
    """POST /api/adresse → dict créé ou None si erreur."""
    session = _get_session()
    r = session.post("https://zealot.fr/api/adresse", json=payload, timeout=10)
    if not r.ok:
        raise RuntimeError(f"POST /api/adresse {r.status_code} : {r.text[:200]}")
    data = r.json()
    return data.get("data") or data


def fetch_adresse_search(q: str, page: int = 1, per_page: int = 20) -> dict:
    """GET /api/adresse?q=..."""
    session = _get_session()
    r = session.get(
        "https://zealot.fr/api/adresse",
        params={"q": q, "page": page, "per_page": per_page},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()


def fetch_adresse_get(adresse_id: int) -> dict | None:
    """GET /api/adresse/{id}"""
    session = _get_session()
    r = session.get(f"https://zealot.fr/api/adresse/{adresse_id}", timeout=10)
    if r.status_code == 404:
        return None
    r.raise_for_status()
    data = r.json()
    return data.get("data") or data


def fetch_adresse_like(q: str, len_: int = 10) -> list[dict]:
    """GET /api/adresse/like?q=..."""
    session = _get_session()
    r = session.get(
        "https://zealot.fr/api/adresse/like",
        params={"q": q, "len": len_},
        timeout=10,
    )
    r.raise_for_status()
    return r.json().get("data", [])
