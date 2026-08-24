"""
features/adresse/ban_service.py
Client pour l'API BAN (Base Adresse Nationale).
https://api-adresse.data.gouv.fr

Sans clé, sans authentification.
Deux endpoints : /search (texte → coordonnées) et /reverse (coordonnées → adresse).
"""
from __future__ import annotations
import re
import requests

BAN_BASE    = "https://api-adresse.data.gouv.fr"
BAN_TIMEOUT = 10

# Abréviations courantes retournées par la BAN → forme normalisée
_ABREV_MAP = {
    "r.":    "Rue",
    "r":     "Rue",
    "av.":   "Avenue",
    "av":    "Avenue",
    "bd.":   "Boulevard",
    "bd":    "Boulevard",
    "bld":   "Boulevard",
    "blvd":  "Boulevard",
    "imp.":  "Impasse",
    "imp":   "Impasse",
    "pl.":   "Place",
    "pl":    "Place",
    "all.":  "Allée",
    "all":   "Allée",
    "chem.": "Chemin",
    "chem":  "Chemin",
    "rte":   "Route",
    "rte.":  "Route",
    "sq.":   "Square",
    "sq":    "Square",
    "res.":  "Résidence",
    "res":   "Résidence",
    "lot.":  "Lotissement",
    "lot":   "Lotissement",
    "ham.":  "Hameau",
    "ham":   "Hameau",
    "dom.":  "Domaine",
    "dom":   "Domaine",
    "cite":  "Cité",
    "cit.":  "Cité",
}


# ─────────────────────────────────────────────────────────────────────────────
# Normalisation du type de voie
# ─────────────────────────────────────────────────────────────────────────────

def extract_type_from_street(street: str) -> tuple[str, str]:
    """
    Extrait le type de voie et le nom de voie depuis le champ 'street' BAN.
    La BAN retourne street = "Rue du Général de Gaulle" — le type est le premier mot.

    Retourne (type_normalise, nom_voie).
    Ex : "Rue du Général de Gaulle" → ("Rue", "du Général de Gaulle")
         "R. de la Paix"            → ("Rue", "de la Paix")
         "Voie verte"               → ("Voie verte", "")   ← type inconnu, à valider
    """
    if not street:
        return ("", "")

    parts = street.strip().split(None, 1)
    if not parts:
        return ("", "")

    raw_type = parts[0]
    nom      = parts[1] if len(parts) > 1 else ""

    # Résolution abréviation
    normalized = _ABREV_MAP.get(raw_type.lower().rstrip(".") + ".", None) \
              or _ABREV_MAP.get(raw_type.lower(), None)

    if normalized:
        return (normalized, nom)

    # Title case minimal — "RUE" → "Rue", "avenue" → "Avenue"
    return (raw_type.strip().capitalize(), nom)


def normalize_type_label(raw: str) -> str:
    """
    Normalise un libellé de type de voie brut pour comparaison CI.
    Strip, title case, suppression doubles espaces.
    Ex : "  RUE  " → "Rue"  /  "grande rue" → "Grande Rue"
    """
    if not raw:
        return ""
    cleaned = re.sub(r"\s+", " ", raw.strip())
    return cleaned.title()


# ─────────────────────────────────────────────────────────────────────────────
# Parsing GeoJSON → dict métier
# ─────────────────────────────────────────────────────────────────────────────

def parse_ban_feature(feature: dict) -> dict:
    """
    Normalise un Feature GeoJSON BAN vers un dict exploitable.

    Retourne :
    {
        "ban_id":       "29232_1234_00015",
        "label":        "15 Rue du Général de Gaulle 29000 Quimper",
        "score":        0.94,
        "type":         "housenumber",          ← housenumber / street / municipality
        "housenumber":  "15",
        "street":       "Rue du Général de Gaulle",
        "type_voie":    "Rue",                  ← extrait + normalisé
        "nom_voie":     "du Général de Gaulle", ← sans le type
        "postcode":     "29000",
        "citycode":     "29232",                ← code INSEE commune
        "city":         "Quimper",
        "context":      "29, Finistère, Bretagne",
        "lat":          47.9959,
        "lon":         -4.0956,
        "x":            154234.5,               ← Lambert93
        "y":            6788432.1,
    }
    """
    props    = feature.get("properties", {})
    coords   = feature.get("geometry",   {}).get("coordinates", [None, None])
    street   = props.get("street", "")
    type_voie, nom_voie = extract_type_from_street(street)

    return {
        "ban_id":      props.get("id",          ""),
        "label":       props.get("label",        ""),
        "score":       props.get("score",        0.0),
        "type":        props.get("type",         ""),
        "housenumber": props.get("housenumber",  ""),
        "street":      street,
        "type_voie":   type_voie,
        "nom_voie":    nom_voie,
        "postcode":    props.get("postcode",     ""),
        "citycode":    props.get("citycode",     ""),
        "city":        props.get("city",         ""),
        "context":     props.get("context",      ""),
        "lat":         coords[1] if coords[1] is not None else None,
        "lon":         coords[0] if coords[0] is not None else None,
        "x":           props.get("x"),
        "y":           props.get("y"),
    }


def parse_ban_response(geojson: dict) -> list[dict]:
    """Parse une FeatureCollection BAN → liste de dicts métier triés par score."""
    features = geojson.get("features", [])
    results  = [parse_ban_feature(f) for f in features]
    return sorted(results, key=lambda r: r["score"], reverse=True)


# ─────────────────────────────────────────────────────────────────────────────
# Appels réseau
# ─────────────────────────────────────────────────────────────────────────────

def fetch_ban_search(q: str, limit: int = 5) -> list[dict]:
    """
    Géocode une adresse texte libre.
    Retourne une liste de résultats triés par score décroissant.

    Ex : fetch_ban_search("15 rue de la paix 29000 Quimper")
    """
    if not q or len(q.strip()) < 3:
        return []
    try:
        r = requests.get(
            f"{BAN_BASE}/search/",
            params={"q": q.strip(), "limit": limit},
            timeout=BAN_TIMEOUT,
        )
        r.raise_for_status()
        return parse_ban_response(r.json())
    except requests.RequestException as e:
        raise RuntimeError(f"BAN /search erreur : {e}") from e


def fetch_ban_reverse(lat: float, lon: float) -> dict | None:
    """
    Géocode inverse : coordonnées → adresse la plus proche.
    Retourne le premier résultat ou None.
    """
    try:
        r = requests.get(
            f"{BAN_BASE}/reverse/",
            params={"lat": lat, "lon": lon},
            timeout=BAN_TIMEOUT,
        )
        r.raise_for_status()
        results = parse_ban_response(r.json())
        return results[0] if results else None
    except requests.RequestException as e:
        raise RuntimeError(f"BAN /reverse erreur : {e}") from e
