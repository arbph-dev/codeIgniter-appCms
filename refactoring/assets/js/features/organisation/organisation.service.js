// assets/js/features/organisation/organisation.service.js
// Adapté depuis old — chemins new architecture, pattern image/adresse.service.js

import { apiFetch } from '/assets/js/core/apiFetch.js'

export async function fetchOrg({ q, typeId, page = 1, perPage = 20 } = {})
{
    const p = new URLSearchParams()
    if (q)      p.set('q',        q)
    if (typeId) p.set('type',     typeId)
    p.set('page', page); p.set('per_page', perPage)
    const res = await apiFetch(`/api/organisation?${p}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

export async function fetchOrgLike({ q, len = 10 } = {})
{
    if (!q || q.length < 2) return []
    try {
        const res  = await apiFetch(`/api/organisation/like?q=${encodeURIComponent(q)}&len=${len}`)
        const json = await res.json()
        return json.data ?? []
    } catch { return [] }
}

export async function saveOrg({ id = null, ...fields } = {})
{
    const method = id ? 'PUT' : 'POST'
    const url    = id ? `/api/organisation/${id}` : '/api/organisation'
    const res    = await apiFetch(url, { method, body: JSON.stringify(fields) })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `HTTP ${res.status}`)
    }
    return res.json()
}

export async function deleteOrg(id)
{
    const res = await apiFetch(`/api/organisation/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
