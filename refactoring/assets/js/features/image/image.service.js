// assets/js/features/image/image.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Accès API Image.
//
// Deux modes de sauvegarde distincts (différence structurelle vs MotWorkbench) :
//   CREATE (id = null) → POST multipart/form-data { file, alt, status, user_id }
//   UPDATE (id > 0)    → PUT  application/json    { alt, status }
//
// Champs read-only calculés à l'upload (jamais envoyés en update) :
//   filename, width, height, ratio, extension, size_ko, path
// ─────────────────────────────────────────────────────────────────────────────

import { apiFetch } from '/assets/js/core/apiFetch.js'

/**
 * Liste / recherche paginée des images.
 *
 * @param {object}  params
 * @param {string}  [params.q]       Recherche texte (alt, filename…)
 * @param {string}  [params.status]  Filtre statut ('draft' | 'published' | 'archived')
 * @param {number}  [params.page]
 * @param {number}  [params.perPage]
 * @returns {Promise<{ data: Object[], pager: object }>}
 */
export async function fetchImage({ q, status, page = 1, perPage = 20 } = {})
{
    const params = new URLSearchParams()
    if (q)       params.set('q',        q)
    if (status)  params.set('status',   status)
    if (page)    params.set('page',     page)
    if (perPage) params.set('per_page', perPage)

    const res = await apiFetch(`/api/image?${params}`)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    return res.json()
}

/**
 * Charge une image par ID (vue détail enrichie).
 *
 * @param {number} id
 * @returns {Promise<{ data: object }>}
 */
export async function fetchImageById(id)
{
    const res = await apiFetch(`/api/image/${id}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

/**
 * Crée ou met à jour une image.
 *
 * CREATE : id = null → POST multipart/form-data
 *   • apiFetch ne pose pas de Content-Type sur FormData (boundary auto)
 *
 * UPDATE : id > 0 → PUT application/json
 *   • filename, dimensions, ratio, path sont read-only — non envoyés
 *
 * @param {object}      params
 * @param {number|null} [params.id]
 * @param {File}        [params.file]
 * @param {string}      [params.alt]
 * @param {string}      [params.status]
 * @param {number}      [params.user_id]
 * @returns {Promise<{ data: object }>}
 */
export async function saveImage({ id = null, file = null, alt = '', status = 'draft', user_id = null } = {})
{
    if (id)
    {
        // ── UPDATE — JSON pur ────────────────────────────────────────────────
        const res = await apiFetch(`/api/image/${id}`, {
            method : 'PUT',
            body   : JSON.stringify({ alt, status }),
        })

        if (!res.ok)
        {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.message ?? `HTTP ${res.status}`)
        }

        return res.json()
    }

    // ── CREATE — FormData (fichier obligatoire) ───────────────────────────────
    const body = new FormData()
    if (file)    body.append('file',    file)
    if (alt)     body.append('alt',     alt)
    if (status)  body.append('status',  status)
    if (user_id) body.append('user_id', String(user_id))

    const res = await apiFetch('/api/image', {
        method : 'POST',
        body,
    })

    if (!res.ok)
    {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `HTTP ${res.status}`)
    }

    return res.json()
}

/**
 * Supprime une image.
 *
 * @param {number} id
 * @returns {Promise<object>}
 */
export async function deleteImage(id)
{
    const res = await apiFetch(`/api/image/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

/**
 * Recherche rapide pour autocomplete.
 *
 * @param {object} params
 * @param {string} params.q
 * @param {number} [params.len]
 * @returns {Promise<{ data: object[] }>}
 */
export async function fetchImageLike({ q = '', len = 10 } = {})
{
    const params = new URLSearchParams({ q, len })
    const res    = await apiFetch(`/api/image/like?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
