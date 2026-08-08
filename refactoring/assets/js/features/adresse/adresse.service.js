// assets/js/features/adresse/adresse.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Adapté depuis old/adresse.service.js :
//   • apiFetch importé depuis le chemin architecture new
//   • id renommé adr_id (cohérence mot_id / img_id)
//   • fetchAdresse : paramètres séparés (q, page, perPage) — id retiré,
//     fetchAdresseById couvre ce cas
//   • saveAdresse : JSON pur (pas de FormData — aucun champ file)
//   • gestion d'erreur alignée sur image.service.js
// ─────────────────────────────────────────────────────────────────────────────

import { apiFetch } from '/assets/js/core/apiFetch.js'

/**
 * Liste / recherche paginée des adresses.
 *
 * @param {object}  params
 * @param {string}  [params.q]       Recherche texte (ville, rue…)
 * @param {number}  [params.page]
 * @param {number}  [params.perPage]
 * @returns {Promise<{ data: object[], pager: object }>}
 */
export async function fetchAdresse({ q, page = 1, perPage = 20 } = {})
{
    const params = new URLSearchParams()
    if (q)       params.set('q',        q)
    if (page)    params.set('page',     page)
    if (perPage) params.set('per_page', perPage)

    const res = await apiFetch(`/api/adresse?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

/**
 * Charge une adresse par ID.
 *
 * @param {number} id
 * @returns {Promise<{ data: object }>}
 */
export async function fetchAdresseById(id)
{
    const res = await apiFetch(`/api/adresse/${id}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

/**
 * Recherche rapide pour autocomplete.
 *
 * @param {object} params
 * @param {string} params.q
 * @param {number} [params.len]
 * @returns {Promise<object[]>}  tableau d'items (jamais throw)
 */
export async function fetchAdresseLike({ q = '', len = 10 } = {})
{
    if (!q || q.length < 2) return []

    try
    {
        const params = new URLSearchParams({ q, len })
        const res    = await apiFetch(`/api/adresse/like?${params}`)
        const json   = await res.json()
        return json.data ?? []
    }
    catch
    {
        return []
    }
}

/**
 * Crée (POST) ou met à jour (PUT) une adresse.
 * JSON pur — aucun champ file dans Adresse.
 *
 * @param {object}      params
 * @param {number|null} [params.adr_id]
 * @param {string}      [params.adr_rue]
 * @param {string}      [params.adr_complement]
 * @param {string}      [params.adr_cp]
 * @param {string}      [params.adr_ville]
 * @param {string}      [params.adr_pays]
 * @returns {Promise<{ data: object }>}
 */
export async function saveAdresse({ adr_id = null, ...fields } = {})
{
    const method = adr_id ? 'PUT' : 'POST'
    const url    = adr_id ? `/api/adresse/${adr_id}` : '/api/adresse'

    const res = await apiFetch(url, {
        method,
        body : JSON.stringify(fields),
    })

    if (!res.ok)
    {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `HTTP ${res.status}`)
    }

    return res.json()
}

/**
 * Supprime une adresse.
 *
 * @param {number} id
 * @returns {Promise<object>}
 */
export async function deleteAdresse(id)
{
    const res = await apiFetch(`/api/adresse/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
