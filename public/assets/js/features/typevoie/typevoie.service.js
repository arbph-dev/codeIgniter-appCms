// js/features/typevoie/typevoie.service.js

import { apiFetch } from '../../core/apiFetch.js'

export async function fetchTv({ id, q, page = 1, perPage = 20 }) {
    let url = '/api/typevoie?'
    if (id)     url += `id=${encodeURIComponent(id)}`
    else if (q) url += `q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`
    else        url += `page=${page}&per_page=${perPage}`

    const res = await apiFetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

export async function fetchTvLike({ q, len = 10 }) {
    if (!q || q.length < 1) return []
    try {
        const res  = await apiFetch(`/api/typevoie/like?q=${encodeURIComponent(q)}&len=${len}`)
        const json = await res.json()
        return json.data ?? []
    } catch { return [] }
}

export async function saveTv({ id, nom }) {
    const method = id ? 'PUT' : 'POST'
    const url    = id ? `/api/typevoie/${id}` : '/api/typevoie'
    const res    = await apiFetch(url, { method, body: JSON.stringify({ id, nom }) })
    if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.message ?? `HTTP ${res.status}`)
    }
    return res.json()
}

export async function deleteTv(id) {
    const res = await apiFetch(`/api/typevoie/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
