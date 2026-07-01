// js/features/codenaf/codenaf.store.js

export const nafStore = {
    data: [],
    loading: false,
    error: null,

    q: null,
    code: null,

    pagination: {
        currentPage: 1,
        perPage: 10,
        total: 0
    },

    tree: []
}