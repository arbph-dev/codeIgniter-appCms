// js/features/adresse/adresse.service.js

import { apiFetch } from '../../core/apiFetch.js'

export async function fetchAdresse({ id, q, page = 1, perPage = 20 }) {
    const params = new URLSearchParams()
    if (id)     params.append('id', id)
    else if (q) params.append('q', q)
    params.append('page',     page)
    params.append('per_page', perPage)

    const res = await apiFetch(`/api/adresse?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

export async function fetchAdresseLike({ q, len = 10 }) {
    if (!q || q.length < 2) return []
    try {
        const res  = await apiFetch(`/api/adresse/like?q=${encodeURIComponent(q)}&len=${len}`)
        const json = await res.json()
        return json.data ?? []
    } catch { return [] }
}

export async function saveAdresse(payload) {
    const method = payload.id ? 'PUT' : 'POST'
    const url    = payload.id ? `/api/adresse/${payload.id}` : '/api/adresse'
    const res    = await apiFetch(url, { method, body: JSON.stringify(payload) })
    if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.message ?? `HTTP ${res.status}`)
    }
    return res.json()
}

export async function deleteAdresse(id) {
    const res = await apiFetch(`/api/adresse/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
