// js/features/adresse/adresse.store.js

export const adresseStore = {
    data:       [],
    loading:    false,
    error:      null,
    q:          null,
    selected:   null,
    mode:       'list',   // 'list' | 'form' | 'detail'
    pagination: { page: 1, perPage: 20, total: 0 },
}
