"""
akinator/core/rules.py
Charge config/rules_naf.json et enregistre les règles dans ForwardEngine.
Aucune règle n'est codée en dur ici.
"""
import json
from pathlib import Path
from rich.console import Console

console = Console()
CFG_DIR = Path(__file__).parent.parent / "config"


def load_rules(kb, forward_engine):
    """
    Lit rules_naf.json et enregistre les règles dans forward_engine.
    kb : KnowledgeBase (pour accès aux méthodes get_instance_value etc.)
    """
    cfg_path = CFG_DIR / "rules_naf.json"
    if not cfg_path.exists():
        console.print("[yellow]config/rules_naf.json introuvable — pas de règles[/]")
        return

    cfg = json.loads(cfg_path.read_text(encoding="utf-8"))

    naf_secteur      = cfg.get("naf_secteur", {})
    fj_type          = cfg.get("forme_juridique_type", {})
    effectif_cat     = cfg.get("effectif_categorie", {})

    for rule_def in cfg.get("forward_rules", []):
        handler = rule_def["handler"]

        if handler == "naf_prefix":
            # naf (ex: "68.10Z") → secteur via préfixe 2 chiffres
            mapping = {k: v for k, v in naf_secteur.items() if not k.startswith("_")}
            forward_engine.add_rule(
                conditions  = ["naf"],
                conclusion  = "secteur",
                calculation = _make_naf_handler(mapping),
                unit        = None,
                rule_id     = rule_def["id"],
                description = rule_def["description"],
            )

        elif handler == "forme_juridique_lookup":
            mapping = {k: v for k, v in fj_type.items() if not k.startswith("_")}
            forward_engine.add_rule(
                conditions  = ["forme_juridique"],
                conclusion  = "type_org",
                calculation = _make_lookup_handler(mapping),
                unit        = None,
                rule_id     = rule_def["id"],
                description = rule_def["description"],
            )

        elif handler == "effectif_range":
            forward_engine.add_rule(
                conditions  = ["effectif_max"],
                conclusion  = "categorie",
                calculation = _make_effectif_handler(effectif_cat),
                unit        = None,
                rule_id     = rule_def["id"],
                description = rule_def["description"],
            )

        elif handler == "categorie_to_class":
            forward_engine.add_rule(
                conditions  = ["categorie"],
                conclusion  = "_sous_classe",
                calculation = _categorie_to_class,
                unit        = None,
                rule_id     = rule_def["id"],
                description = rule_def["description"],
            )


# ------------------------------------------------------------------
# Fabriques de fonctions (closures sur les mappings JSON)
# ------------------------------------------------------------------

def _make_naf_handler(mapping: dict):
    """Retourne une fonction naf → secteur via préfixe 2 chiffres."""
    def handler(naf: str):
        if not naf:
            return None
        # Normalise : "68.10Z" → "68"
        prefix = naf.replace(".", "")[:2]
        return mapping.get(prefix)
    return handler


def _make_lookup_handler(mapping: dict):
    """Retourne une fonction code → libellé via lookup exact."""
    def handler(code: str):
        if not code:
            return None
        return mapping.get(str(code).strip())
    return handler


def _make_effectif_handler(effectif_cat: dict):
    """Retourne une fonction effectif_max → categorie."""
    def handler(effectif_max):
        if effectif_max is None:
            return None
        try:
            n = int(effectif_max)
        except (ValueError, TypeError):
            return None
        for cat, bounds in effectif_cat.items():
            if cat.startswith("_"):
                continue
            min_v = bounds.get("min", 0)
            max_v = bounds.get("max", float("inf"))
            if min_v <= n <= max_v:
                return cat
        return None
    return handler


def _categorie_to_class(categorie: str):
    """PME/ETI/GrandeEntreprise → nom de sous-classe."""
    mapping = {
        "PME": "PME",
        "ETI": "ETI",
        "GE":  "GrandeEntreprise",
        "GrandeEntreprise": "GrandeEntreprise",
    }
    return mapping.get(str(categorie).strip()) if categorie else None
