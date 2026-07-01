// js/features/codepostal/codepostal.store.js

export const cpStore = {
    data:       [],
    loading:    false,
    error:      null,
    q:          null,
    selected:   null,
    mode:       'list',   // 'list' | 'detail'
    pagination: { page: 1, perPage: 20, total: 0 },
}
