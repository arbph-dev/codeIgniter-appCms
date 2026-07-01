// js/features/auth/auth.service.js

const BASE = '/api/auth'

function authHeaders(token = null) {
    const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    return headers
}

// ── POST /api/auth/login ─────────────────────────────────────────────────────

export async function fetchLogin({ email, password }) {
    const res = await fetch(`${BASE}/login`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
        // 422 validation, 401 credentials invalides
        const msg = data.errors
            ? Object.values(data.errors).join(' ')
            : (data.error ?? `HTTP ${res.status}`)
        throw new Error(msg)
    }

    return data // { token, user: { id, username, email, groups, permissions } }
}

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
// Accepte session Shield OU Bearer token

export async function fetchMe(token = null) {
    const res = await fetch(`${BASE}/me`, {
        headers: authHeaders(token),
    })

    if (res.status === 401) return null  // non connecté — pas une erreur

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    return await res.json() // { id, username, email, groups, permissions }
}
//2026-05-09-003
/*
export async function fetchMe(token = null) {
    const bearerToken = token ?? sessionStorage.getItem('auth_token')
    if (!bearerToken) return null

    const res = await fetch(`${BASE}/me`, {
        headers: authHeaders(bearerToken),
    })

    if (res.status === 401) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
}
*/


// ── POST /api/auth/logout ────────────────────────────────────────────────────

export async function fetchLogout(token) {
    const res = await fetch(`${BASE}/logout`, {
        method:  'POST',
        headers: authHeaders(token),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    return await res.json()
}
