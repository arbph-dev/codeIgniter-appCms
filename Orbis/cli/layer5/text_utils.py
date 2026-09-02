# cli/layer5/text_utils.py
"""
Normalisation de texte partagée — dénominations INSEE / Zealot.
"""
from __future__ import annotations

import re
import unicodedata


def norm_upper(s: str) -> str:
    """Minuscules → ASCII approx → MAJUSCULES, apostrophes neutralisées, espaces compactés."""
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.upper().replace("'", " ").replace("’", " ")
    return re.sub(r"\s+", " ", s).strip()


def tokens(s: str) -> list[str]:
    return [t for t in norm_upper(s).split() if t]


def normalize_insee_denom(nom: str) -> str:
    """Alias explicite pour l'usage côté requête Lucene INSEE."""
    return norm_upper(nom)