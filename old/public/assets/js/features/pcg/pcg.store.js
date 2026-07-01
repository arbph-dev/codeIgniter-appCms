// js/features/pcg/pcg.store.js

export const pcgStore = {
    // ── Recherche ────────────────────────────────────────────────────────────
    results:    [],
    query:      '',
    classe:     null,
    page:       1,
    perPage:    50,
    pager:      null,
    loading:    false,
    error:      null,

    // ── Sélection ────────────────────────────────────────────────────────────
    selected:   null,   // compte sélectionné { numpcg, nom, classe, parentnum }
    hierarchy:  [],     // chemin vers la racine
    children:   [],     // enfants directs du compte sélectionné

    // ── Tree (admin) ─────────────────────────────────────────────────────────
    tree:       [],     // arbre complet — chargé à la demande
    treeLoaded: false,

    reset() {
        this.results   = []
        this.query     = ''
        this.classe    = null
        this.page      = 1
        this.pager     = null
        this.error     = null
        this.selected  = null
        this.hierarchy = []
        this.children  = []
    },
}
