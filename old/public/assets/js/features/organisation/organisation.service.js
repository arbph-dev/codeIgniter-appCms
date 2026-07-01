// js/features/organisation/organisation.service.js
import { apiFetch } from '../../core/apiFetch.js'

export async function fetchOrg({ q, typeId, page = 1, perPage = 20 }) {
    const p = new URLSearchParams()
    if (q)      p.append('q',    q)
    if (typeId) p.append('type', typeId)
    p.append('page', page); p.append('per_page', perPage)
    const res = await apiFetch(`/api/organisation?${p}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

export async function fetchOrgLike({ q, len = 10 }) {
    if (!q || q.length < 2) return []
    try {
        const res  = await apiFetch(`/api/organisation/like?q=${encodeURIComponent(q)}&len=${len}`)
        const json = await res.json()
        return json.data ?? []
    } catch { return [] }
}

export async function saveOrg(payload) {
    const method = payload.id ? 'PUT' : 'POST'
    const url    = payload.id ? `/api/organisation/${payload.id}` : '/api/organisation'
    const res    = await apiFetch(url, { method, body: JSON.stringify(payload) })
    if (!res.ok) { const j = await res.json().catch(()=>({})); throw new Error(j.message ?? `HTTP ${res.status}`) }
    return res.json()
}

export async function deleteOrg(id) {
    const res = await apiFetch(`/api/organisation/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
