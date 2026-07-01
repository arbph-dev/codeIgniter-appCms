// js/features/image/image.store.js

export const imageStore = {

    data: [],
    loading: false,
    error: null,

    q: null,
    id: null,
    status: null,

    selected: null,

    mode: 'list',

    uiSuggestions: {
        sourceId: null,
        items: [],
    },

    pagination: {
        page: 1,
        perPage: 10,
        total: 0
    }
}