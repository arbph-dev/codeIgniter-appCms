// js/features/formejuridique/formejuridique.service.js

import { apiFetch } from '../../core/apiFetch.js'

// ── GET (liste / recherche / par id) ─────────────────────────────────────────
export async function fetchFj({ id, q, page = 1, perPage = 20 }) {
    let url = '/api/formejuridique?'

    if (id)      url += `id=${encodeURIComponent(id)}`
    else if (q)  url += `q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`
    else         url += `page=${page}&per_page=${perPage}`

    const res = await apiFetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

// ── Autocomplete ──────────────────────────────────────────────────────────────
export async function fetchFjLike({ q, len = 10 }) {
    if (!q || q.length < 2) return []
    try {
        const res  = await apiFetch(`/api/formejuridique/like?q=${encodeURIComponent(q)}&len=${len}`)
        const json = await res.json()
        return json.data ?? []
    } catch {
        return []
    }
}

// ── CREATE / UPDATE ───────────────────────────────────────────────────────────
export async function saveFj({ id, description }) {
    const method = id ? 'PUT' : 'POST'
    const url    = id ? `/api/formejuridique/${id}` : '/api/formejuridique'

    const res = await apiFetch(url, {
        method,
        body: JSON.stringify({ id, description }),
    })
    if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.message ?? `HTTP ${res.status}`)
    }
    return res.json()
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function deleteFj(id) {
    const res = await apiFetch(`/api/formejuridique/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
