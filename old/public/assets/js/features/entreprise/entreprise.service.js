// js/features/entreprise/entreprise.service.js
import { apiFetch } from '../../core/apiFetch.js'

export async function fetchEnt({ q, page=1, perPage=20 }) {
    const p = new URLSearchParams()
    if (q) p.append('q', q)
    p.append('page',page); p.append('per_page',perPage)
    const res = await apiFetch(`/api/entreprise?${p}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

export async function fetchEntLike({ q, len=10 }) {
    if (!q||q.length<2) return []
    try {
        const res  = await apiFetch(`/api/entreprise/like?q=${encodeURIComponent(q)}&len=${len}`)
        const json = await res.json()
        return json.data ?? []
    } catch { return [] }
}

export async function saveEnt(payload) {
    const method = payload.id ? 'PUT' : 'POST'
    const url    = payload.id ? `/api/entreprise/${payload.id}` : '/api/entreprise'
    const res    = await apiFetch(url, {method, body:JSON.stringify(payload)})
    if (!res.ok) { const j=await res.json().catch(()=>({})); throw new Error(j.message??`HTTP ${res.status}`) }
    return res.json()
}

export async function deleteEnt(id) {
    const res = await apiFetch(`/api/entreprise/${id}`, {method:'DELETE'})
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
