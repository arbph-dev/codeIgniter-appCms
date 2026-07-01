// js/features/mot/mot.store.js

export const motStore = {  
    data: [],  
    loading: false,  
    error: null,
    q: null,       // 20260503-002
    id: null,      //  ajout q et id

    selected: null, //20260506-003 - pour panel crud
    mode: 'list',        // 'list' | 'form' | 'detail'      
    
    uiSuggestions: {
        sourceId : null,   // id du dernier input appelant
        items    : [],     // suggestions reçues
    },

    pagination: {  
        page: 1,  
        perPage: 10,  
        total: 0  
    }  
}