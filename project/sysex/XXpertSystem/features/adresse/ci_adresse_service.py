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
    # Ordre important : les plus longs d'abord pour éviter match partiel
    _PATTERNS: list[tuple[str, int]] = [
        ("de l'",  4),   # apostrophe droit
        ("de l’", 4), # apostrophe typographique
        ("de la",  2),   # AVANT "de l" pour eviter match partiel
        ("de l",   4),   # sans apostrophe (rare)
        ("des",    3),
        ("du",     1),
        ("de",     5),
        ("aux",    6),
        ("au",     6),
        ("les",    7),
        ("le",     7),
        ("la",     7),
        ("l'",     7),
        ("l’",7),
        ("l",      7),
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
        print(f"[codepostal] codeinsee={citycode} status={r.status_code}")
        if r.ok:
            raw = r.json()
            print(f"[codepostal] reponse cles={list(raw.keys())} data={raw.get('data', raw)!r:.200}")
            data = raw.get("data", [])
            if data:
                return data[0].get("id")

    # Fallback : code postal seul
    if postcode:
        r = session.get(
            "https://zealot.fr/api/codepostal",
            params={"codepostal": postcode},
            timeout=10,
        )
        print(f"[codepostal] codepostal={postcode} status={r.status_code}")
        if r.ok:
            raw = r.json()
            print(f"[codepostal] reponse cles={list(raw.keys())} data={str(raw.get('data', raw)):.200}")
            data = raw.get("data", [])
            if data:
                return data[0].get("id")
        print("[codepostal] INTROUVABLE")

    return None


# ─────────────────────────────────────────────────────────────────────────────
# Mapping BAN → payload CI Adresse
# ─────────────────────────────────────────────────────────────────────────────

def ban_to_ci_payload(
    ban_result:    dict,
    typevoie_id:   int | None,
    codepostal_id: int | None,
) -> dict:
    """
    Construit le payload JSON pour POST /api/adresse depuis un résultat BAN parsé.

    ban_result    : dict retourné par parse_ban_feature()
    typevoie_id   : id CI résolu par typevoie_service.resolve_type_voie()
    codepostal_id : id CI résolu par fetch_codepostal_id()

    Retourne un dict prêt pour le POST CI.
    """
    # Numéro + indice de répétition
    numero, voierpt = IndiceRepetition.extract(ban_result.get("housenumber", ""))

    # Charnière + nom de voie pur
    charniere_code, voienom = Charniere.extract(ban_result.get("nom_voie", ""))

    # Précision géocodage
    precision = GeocodePrecision.from_ban(
        ban_type = ban_result.get("type",  ""),
        score    = ban_result.get("score", 0.0),
    )

    payload = {
        "codepostal_id":  codepostal_id,
        "voietype_id":    typevoie_id,
        "voienumero":     numero        or None,
        "voierpt":        voierpt       or None,
        "voiecharniere":  charniere_code if charniere_code > 0 else None,
        "voienom":        voienom       or ban_result.get("street", ""),
        "acheminement":   ban_result.get("city", ""),
        "latitude":       ban_result.get("lat"),
        "longitude":      ban_result.get("lon"),
        "precision":      precision,
    }

    # Nettoyage des None pour ne pas envoyer de clés vides
    return {k: v for k, v in payload.items() if v is not None}


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
