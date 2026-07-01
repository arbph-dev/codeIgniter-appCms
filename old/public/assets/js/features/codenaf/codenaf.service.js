// js/features/codenaf/codenaf.service.js
// Ajout : fetchNafLike() pour autocomplete

import { apiFetch } from '../../core/apiFetch.js'

export async function fetchNaf({ q, code, page = 1, perPage = 10 }) {
    let url = '/api/codesnaf?'
    if (code)      url += `code=${encodeURIComponent(code)}`
    else if (q)    url += `q=${encodeURIComponent(q)}&page=${page}&perPage=${perPage}`
    const res = await apiFetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

// Autocomplete léger — pour formulaire Entreprise
export async function fetchNafLike({ q, len = 10 }) {
    if (!q || q.length < 2) return []
    try {
        const res  = await apiFetch(`/api/codesnaf/like?q=${encodeURIComponent(q)}&len=${len}`)
        const json = await res.json()
        return json.data ?? []
    } catch { return [] }
}

export async function fetchChildren(code) {
    const res = await apiFetch(`/api/codesnaf/${code}/children`)
    return res.json()
}

export async function fetchTree() {
    const res = await apiFetch('/api/codesnaf/tree')
    return res.json()
}
