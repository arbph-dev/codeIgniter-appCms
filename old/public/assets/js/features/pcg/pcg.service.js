// js/features/pcg/pcg.service.js

import { apiFetch } from '../../core/apiFetch.js'

const BASE = '/api/comptespcg'

// ── Recherche / liste paginée ─────────────────────────────────────────────────
// GET /api/comptespcg?q=banque&classe=5&page=1&perPage=50

export async function fetchPcg({ q = '', classe = null, page = 1, perPage = 50 } = {}) {
    let url = `${BASE}?page=${page}&perPage=${perPage}`
    if (q)      url += `&q=${encodeURIComponent(q)}`
    if (classe) url += `&classe=${encodeURIComponent(classe)}`

    const res = await apiFetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()  // { data: [...], pager: {...} }
}

// ── Détail d'un compte ────────────────────────────────────────────────────────
// GET /api/comptespcg/{numpcg}

export async function fetchPcgOne(numpcg) {
    const res = await apiFetch(`${BASE}/${numpcg}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
}

// ── Enfants directs ───────────────────────────────────────────────────────────
// GET /api/comptespcg/{numpcg}/children

export async function fetchPcgChildren(numpcg) {
    const res = await apiFetch(`${BASE}/${numpcg}/children`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
}

// ── Hiérarchie vers la racine ─────────────────────────────────────────────────
// GET /api/comptespcg/{numpcg}/hierarchy

export async function fetchPcgHierarchy(numpcg) {
    const res = await apiFetch(`${BASE}/${numpcg}/hierarchy`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
}

// ── Arbre complet ─────────────────────────────────────────────────────────────
// GET /api/comptespcg/tree

export async function fetchPcgTree() {
    const res = await apiFetch(`${BASE}/tree`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
}
