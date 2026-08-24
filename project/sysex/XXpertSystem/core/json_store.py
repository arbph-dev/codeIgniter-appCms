"""
core/json_store.py
Sauvegarde et chargement de réponses API brutes avec métadonnées.

Usage :
    from core.json_store import save_response, load_response, list_samples

    ref = save_response(
        data     = api_result,
        source   = "omdb",
        endpoint = "search",
        params   = {"q": "Dune"}
    )
    # → data/samples/omdb_search_20260609_143022.json

    data, meta = load_response(ref)
"""
from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any


SAMPLES_DIR = Path(__file__).parent.parent / "data" / "samples"


# ─────────────────────────────────────────────────────────────────────────────
# Sauvegarde
# ─────────────────────────────────────────────────────────────────────────────

def save_response(
    data:     Any,
    source:   str,
    endpoint: str,
    params:   dict = None,
) -> str:
    """
    Sauvegarde data + métadonnées dans data/samples/.
    Retourne le nom du fichier créé (sans chemin).

    Structure du fichier :
    {
        "_meta": {
            "source":    "omdb",
            "endpoint":  "search",
            "params":    {"q": "Dune"},
            "timestamp": "2026-06-09T14:30:22",
            "saved_at":  "2026-06-09 14:30:22"
        },
        "data": { ... réponse brute ... }
    }
    """
    SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

    ts       = datetime.now()
    ts_str   = ts.strftime("%Y%m%d_%H%M%S")
    filename = f"{source}_{endpoint}_{ts_str}.json"
    filepath = SAMPLES_DIR / filename

    envelope = {
        "_meta": {
            "source":    source,
            "endpoint":  endpoint,
            "params":    params or {},
            "timestamp": ts.isoformat(timespec="seconds"),
            "saved_at":  ts.strftime("%Y-%m-%d %H:%M:%S"),
        },
        "data": data,
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(envelope, f, ensure_ascii=False, indent=2)

    return filename


# ─────────────────────────────────────────────────────────────────────────────
# Chargement
# ─────────────────────────────────────────────────────────────────────────────

def load_response(filename: str) -> tuple[Any, dict]:
    """
    Charge un fichier sauvegardé.
    Retourne (data, meta) — meta contient source, endpoint, params, timestamp.
    """
    filepath = SAMPLES_DIR / filename
    if not filepath.exists():
        raise FileNotFoundError(f"Fichier introuvable : {filepath}")

    with open(filepath, encoding="utf-8") as f:
        envelope = json.load(f)

    return envelope.get("data"), envelope.get("_meta", {})


# ─────────────────────────────────────────────────────────────────────────────
# Listing
# ─────────────────────────────────────────────────────────────────────────────

def list_samples(source: str = None, endpoint: str = None) -> list[dict]:
    """
    Liste les fichiers sauvegardés avec leurs métadonnées.
    Filtre optionnel par source et/ou endpoint.
    Retourne une liste de dicts triée par timestamp décroissant.
    """
    if not SAMPLES_DIR.exists():
        return []

    results = []
    for filepath in sorted(SAMPLES_DIR.glob("*.json"), reverse=True):
        try:
            with open(filepath, encoding="utf-8") as f:
                envelope = json.load(f)
            meta = envelope.get("_meta", {})
            if source   and meta.get("source")   != source:
                continue
            if endpoint and meta.get("endpoint") != endpoint:
                continue
            results.append({
                "filename":  filepath.name,
                "source":    meta.get("source", "?"),
                "endpoint":  meta.get("endpoint", "?"),
                "params":    meta.get("params", {}),
                "saved_at":  meta.get("saved_at", "?"),
                "timestamp": meta.get("timestamp", ""),
            })
        except (json.JSONDecodeError, KeyError):
            continue

    return results


# ─────────────────────────────────────────────────────────────────────────────
# Utilitaires d'analyse (base pour la suite)
# ─────────────────────────────────────────────────────────────────────────────

def extract_schema(obj: Any, _depth: int = 0, _max_depth: int = 5) -> Any:
    """
    Extrait un schéma de types depuis un dict/list réel.
    Utile pour comprendre la structure d'une réponse API inconnue.

    extract_schema({"title": "Dune", "year": 2021, "cast": ["Timothée"]})
    → {"title": "str", "year": "int", "cast": ["str"]}
    """
    if _depth > _max_depth:
        return "..."

    if isinstance(obj, dict):
        return {
            k: extract_schema(v, _depth + 1, _max_depth)
            for k, v in obj.items()
        }
    if isinstance(obj, list):
        if not obj:
            return []
        # Schéma du premier élément pour les listes
        return [extract_schema(obj[0], _depth + 1, _max_depth)]

    return type(obj).__name__


def save_schema(filename: str) -> str:
    """
    Charge un fichier sample, extrait le schéma de data, sauvegarde
    dans data/samples/schema_{filename}.
    Retourne le nom du fichier schéma créé.
    """
    data, meta = load_response(filename)
    schema = extract_schema(data)

    schema_filename = f"schema_{filename}"
    filepath = SAMPLES_DIR / schema_filename

    envelope = {
        "_meta": {**meta, "type": "schema", "source_file": filename},
        "data":  schema,
    }
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(envelope, f, ensure_ascii=False, indent=2)

    return schema_filename