# services/api/BanClient.py
"""
Client BAN — Base Adresse Nationale
https://api-adresse.data.gouv.fr

API publique, sans authentification.
Deux endpoints : /search/ (texte → coordonnées) et /reverse/ (coordonnées → adresse).

Usage :
    client  = BanClient()
    results = client.search("15 rue de la paix 29000 Quimper", limit=5)
    nearest = client.reverse(47.9959, -4.0956)

    # Utilitaires (sans réseau)
    from services.api.BanClient import extract_type_from_street, normalize_type_label
    type_voie, nom = extract_type_from_street("Av. Jean Jaurès")
"""
from __future__ import annotations

import re
from typing import Optional

from .BaseApiClient import BaseApiClient

BAN_BASE = "https://api-adresse.data.gouv.fr"

# ─────────────────────────────────────────────────────────────────────────────
# Table d'abréviations de types de voie
# ─────────────────────────────────────────────────────────────────────────────

_ABREV_MAP: dict[str, str] = {
    "r.":    "Rue",     "r":     "Rue",
    "av.":   "Avenue",  "av":    "Avenue",
    "bd.":   "Boulevard", "bd":  "Boulevard", "bld": "Boulevard", "blvd": "Boulevard",
    "imp.":  "Impasse",  "imp":  "Impasse",
    "pl.":   "Place",    "pl":   "Place",
    "all.":  "Allée",    "all":  "Allée",
    "chem.": "Chemin",   "chem": "Chemin",
    "rte.":  "Route",    "rte":  "Route",
    "sq.":   "Square",   "sq":   "Square",
    "res.":  "Résidence","res":  "Résidence",
    "lot.":  "Lotissement","lot":"Lotissement",
    "ham.":  "Hameau",   "ham":  "Hameau",
    "dom.":  "Domaine",  "dom":  "Domaine",
    "cit.":  "Cité",     "cite": "Cité",
}


# ─────────────────────────────────────────────────────────────────────────────
# Utilitaires — normalisation (sans réseau, sans instance)
# ─────────────────────────────────────────────────────────────────────────────

def extract_type_from_street(street: str) -> tuple[str, str]:
    """
    Extrait le type de voie et le nom de voie depuis le champ 'street' BAN.

    Ex : "Rue du Général de Gaulle" → ("Rue",     "du Général de Gaulle")
         "Av. Jean Jaurès"          → ("Avenue", "Jean Jaurès")
         "Voie verte"               → ("Voie",   "verte")   ← type inconnu : 1er mot
    """
    if not street:
        return ("", "")
    parts    = street.strip().split(None, 1)
    raw_type = parts[0]
    nom      = parts[1] if len(parts) > 1 else ""

    normalized = (
        _ABREV_MAP.get(raw_type.lower().rstrip(".") + ".")
        or _ABREV_MAP.get(raw_type.lower())
    )
    return (normalized, nom) if normalized else (raw_type.strip().capitalize(), nom)


def normalize_type_label(raw: str) -> str:
    """
    Normalise un libellé de type de voie pour comparaison insensible à la casse.
    "  RUE  " → "Rue"  /  "grande rue" → "Grande Rue"
    """
    if not raw:
        return ""
    return re.sub(r"\s+", " ", raw.strip()).title()


# ─────────────────────────────────────────────────────────────────────────────
# Parsers GeoJSON → dict métier (fonctions pures, sans réseau)
# ─────────────────────────────────────────────────────────────────────────────

def parse_ban_feature(feature: dict) -> dict:
    """
    Normalise un Feature GeoJSON BAN → dict plat exploitable.

    {
        "ban_id":      "29232_1234_00015",
        "label":       "15 Rue du Général de Gaulle 29000 Quimper",
        "score":       0.94,
        "type":        "housenumber",       # housenumber / street / municipality
        "housenumber": "15",
        "street":      "Rue du Général de Gaulle",
        "type_voie":   "Rue",              # extrait + normalisé
        "nom_voie":    "du Général de Gaulle",
        "postcode":    "29000",
        "citycode":    "29232",            # code INSEE commune
        "city":        "Quimper",
        "context":     "29, Finistère, Bretagne",
        "lat":         47.9959,
        "lon":        -4.0956,
        "x":           154234.5,           # Lambert93
        "y":           6788432.1,
    }
    """
    props      = feature.get("properties", {})
    coords     = feature.get("geometry",   {}).get("coordinates", [None, None])
    street     = props.get("street", "")
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
        "lat":         coords[1] if len(coords) > 1 else None,
        "lon":         coords[0] if coords else None,
        "x":           props.get("x"),
        "y":           props.get("y"),
    }


def parse_ban_response(geojson: dict) -> list[dict]:
    """Parse une FeatureCollection BAN → liste de dicts triés par score décroissant."""
    features = (geojson or {}).get("features", [])
    results  = [parse_ban_feature(f) for f in features]
    return sorted(results, key=lambda r: r["score"], reverse=True)


# ─────────────────────────────────────────────────────────────────────────────
# Client HTTP
# ─────────────────────────────────────────────────────────────────────────────

class BanClient(BaseApiClient):
    """
    Client BAN héritant de BaseApiClient.
    Retourne des dicts métier normalisés (pas le GeoJSON brut).
    Le GeoJSON brut est sauvegardé via _save() si save_samples=True.
    """

    _source = "ban"

    def __init__(self, timeout: int = 10, save_samples: bool = False):
        super().__init__(BAN_BASE, auth=None, timeout=timeout, save_samples=save_samples)

    def search(self, q: str, limit: int = 5) -> list[dict]:
        """
        Géocode une adresse texte libre.
        Retourne une liste de résultats triés par score décroissant.

        Ex : client.search("15 rue de la paix 29000 Quimper")
        """
        if not q or len(q.strip()) < 3:
            return []
        raw = self.get("/search/", {"q": q.strip(), "limit": limit})
        self._save(raw, "search", {"q": q})          # sauvegarde le GeoJSON brut
        return parse_ban_response(raw)

    def reverse(self, lat: float, lon: float) -> Optional[dict]:
        """
        Géocode inverse : coordonnées → adresse la plus proche.
        Retourne le premier résultat ou None.
        """
        raw     = self.get("/reverse/", {"lat": lat, "lon": lon})
        self._save(raw, "reverse", {"lat": lat, "lon": lon})
        results = parse_ban_response(raw)
        return results[0] if results else None
