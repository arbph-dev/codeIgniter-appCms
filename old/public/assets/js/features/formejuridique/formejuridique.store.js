// js/features/formejuridique/formejuridique.store.js

export const fjStore = {
    data:       [],
    loading:    false,
    error:      null,
    q:          null,
    selected:   null,
    mode:       'list',     // 'list' | 'form' | 'detail'
    pagination: { page: 1, perPage: 20, total: 0 },
}
