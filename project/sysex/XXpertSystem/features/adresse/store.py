"""
features/adresse/store.py
"""

adresse_store = {
    "ban_results":    [],   # liste des résultats BAN parsés
    "selected":       None, # résultat BAN sélectionné par l'utilisateur
    "pending_types":  [],   # types de voie créés en pending ce soir
    "loading":        False,
    "error":          None,
    "last_saved":     None, # dernière adresse CI créée
}
