// js/features/codepostal/codepostal.service.js

import { apiFetch } from '../../core/apiFetch.js'

// ── Recherche paginée ─────────────────────────────────────────────────────────
export async function fetchCp({ q, codepostal, codeinsee, page = 1, perPage = 20 }) {
    const params = new URLSearchParams()
    if (q)          params.append('q',          q)
    if (codepostal) params.append('codepostal', codepostal)
    if (codeinsee)  params.append('codeinsee',  codeinsee)
    params.append('page',     page)
    params.append('per_page', perPage)

    const res = await apiFetch(`/api/codepostal?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

// ── Autocomplete ──────────────────────────────────────────────────────────────
export async function fetchCpLike({ q, len = 15 }) {
    if (!q || q.length < 2) return []
    try {
        const res  = await apiFetch(`/api/codepostal/like?q=${encodeURIComponent(q)}&len=${len}`)
        const json = await res.json()
        return json.data ?? []
    } catch { return [] }
}
