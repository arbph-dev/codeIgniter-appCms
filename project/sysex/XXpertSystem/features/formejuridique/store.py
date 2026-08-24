"""
features/formejuridique/store.py
"""

fj_store = {
    "data":       [],
    "loading":    False,
    "error":      None,
    "q":          None,
    "code":       None,
    "detail":     None,   # fiche courante
    "pagination": {"currentPage": 1, "perPage": 20, "total": 0},
}
