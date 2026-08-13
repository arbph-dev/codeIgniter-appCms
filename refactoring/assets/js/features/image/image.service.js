// assets/js/features/image/image.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Iteration002 :
//   fetchImage   — ajout params status + include
//   fetchImageById — ajout param include
//   Status corrigés : pending | validated | rejected
// ─────────────────────────────────────────────────────────────────────────────

import { apiFetch } from '/assets/js/core/apiFetch.js'

/**
 * Liste / recherche paginée.
 *
 * @param {object}   params
 * @param {string}   [params.q]
 * @param {string}   [params.status]   'pending' | 'validated' | 'rejected'
 * @param {string}   [params.include]  'mot_ids' | 'mots' (csv)
 * @param {number}   [params.page]
 * @param {number}   [params.perPage]
 * @returns {Promise<{ data: object[], pager: object }>}
 */
export async function fetchImage({ q, status, include, page = 1, perPage = 20 } = {})
{
    const params = new URLSearchParams()
    if (q)       params.set('q',        q)
    if (status)  params.set('status',   status)
    if (include) params.set('include',  include)
    if (page)    params.set('page',     page)
    if (perPage) params.set('per_page', perPage)

    const res = await apiFetch(`/api/image?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

/**
 * Charge une image par ID.
 *
 * @param {number} id
 * @param {string} [include]  'mots' pour charger les tags complets
 * @returns {Promise<{ data: object }>}
 */
export async function fetchImageById(id, include = null)
{
    const params = include ? `?include=${include}` : ''
    const res    = await apiFetch(`/api/image/${id}${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

/**
 * Crée (POST multipart) ou met à jour (PUT JSON) une image.
 *
 * @param {object}      params
 * @param {number|null} [params.id]
 * @param {File}        [params.file]
 * @param {string}      [params.alt]
 * @param {string}      [params.status]  'pending' | 'validated' | 'rejected'
 * @param {number}      [params.user_id]
 */
export async function saveImage({ id = null, file = null, alt = '', status = 'pending', user_id = null } = {})
{
    if (id)
    {
        const res = await apiFetch(`/api/image/${id}`, {
            method : 'PUT',
            body   : JSON.stringify({ alt, status }),
        })
        if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message ?? `HTTP ${res.status}`) }
        return res.json()
    }

    const body = new FormData()
    if (file)    body.append('file',    file)
    if (alt)     body.append('alt',     alt)
    if (status)  body.append('status',  status)
    if (user_id) body.append('user_id', String(user_id))

    const res = await apiFetch('/api/image', { method: 'POST', body })
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message ?? `HTTP ${res.status}`) }
    return res.json()
}

/**
 * Supprime une image.
 */
export async function deleteImage(id)
{
    const res = await apiFetch(`/api/image/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

/**
 * Autocomplete.
 */
export async function fetchImageLike({ q = '', len = 10 } = {})
{
    const params = new URLSearchParams({ q, len })
    const res    = await apiFetch(`/api/image/like?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
