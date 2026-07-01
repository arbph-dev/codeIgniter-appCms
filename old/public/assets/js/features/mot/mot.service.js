// js/features/mot/mot.service.js
import { apiFetch } from '../../core/apiFetch.js'
//20260510-001 apiFetch gere les token API 

export async function fetchMot({ id, q, page = 1, perPage = 10 }) {
    let url = '/api/mot?'
    if (id) url += `id=${encodeURIComponent(id)}`
    else if (q) url += `q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`
    
    const response = await apiFetch(url) //20260510-001

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
}
/* 20260524-001

export async function fetchMotLike({ q, len = 10 }) {
 
    const url = `/api/mot/like?q=${encodeURIComponent(q)}&len=${len}`
 
    const res = await apiFetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? []       // tableau [{mot_id, mot_lbl}]
}
*/    
/* 20260524-002*/

export async function fetchMotLike({ q, len = 10 }) {
        if (!q || q.length < 2) {
               // bus.publish('mot:ui:response', { sourceId, items: [] })
                return [] 
        }

        try {
            let url = `/api/mot/like?q=${encodeURIComponent(q)}&len=${len}`
            const res  = await apiFetch(url)
            const json = await res.json()
            return json.data ?? []
        } 
        catch {
            return [] 
        }

}




    // 20260506-002 voir Controller Api/Mot
    /**
     * recoit en entrée 
     *  payload 
     * - id : null pour un nouveau mot sinon id depuis selection dan sliste ?
     * - lbl : la syntaxe du mot nouveau , la correction si modification
     * 
     * remplis deux fonctions :
     * - create si id est vide
     * - update si id est spécifié
     * 
     * on selectionne entre les methodes POST et PUT 
     * routes =>
     * $routes->post  ('mot',        'Mot::create');      // POST /api/mot
     * $routes->put   ('mot/(:num)', 'Mot::update/$1');   // PUT  /api/mot/N
     * 
     * on definit l'url
     * - create : '/api/mot'
     * - update : `/api/mot/${id}`
     * 
     * A VOIR 422 si ajout d'un mot existant, le mot n'est pas ajouté le code est peux explicite
     */
export async function saveMot({ id, lbl }) {
    const method = id ? 'PUT' : 'POST'
    const url    = id ? `/api/mot/${id}` : '/api/mot'
    
    const res = await apiFetch(
        url, 
        {
            method,
            body: JSON.stringify({ mot_lbl: lbl }),
        }
    )
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}




// 20260506-002 voir Controller Api/Mot
export async function deleteMot(id) {

    const res = await apiFetch(
        `/api/mot/${id}`, 
        { 
            method: 'DELETE' 
        }
    )

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}