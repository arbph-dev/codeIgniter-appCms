// assets/js/features/adresse/adresse.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Service API des adresses.
//
// Contrat aligné sur AdresseModel.php :
//   • PK : id
//   • Champs métier : voienom, voienumero, voierpt, voietype_id,
//     voiecharniere, complement, infodistribution, codepostal_id,
//     acheminement
//   • Coordonnées : latitude / longitude
//   • Données dénormalisées en lecture : voietype_nom, cp_codepostal,
//     cp_commune
//
// saveAdresse() utilise un JSON pur : aucun champ file dans Adresse.
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

    if (!res.ok)
        throw new Error(`HTTP ${res.status}`)

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

    if (!res.ok)
        throw new Error(`HTTP ${res.status}`)

    return res.json()
}

/**
 * Recherche rapide pour autocomplete.
 *
 * @param {object} params
 * @param {string} params.q
 * @param {number} [params.len]
 * @returns {Promise<object[]>} tableau d'items (jamais throw)
 */
export async function fetchAdresseLike({ q = '', len = 10 } = {})
{
    if (!q || q.length < 2)
        return []

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
 *
 * @param {object}      params
 * @param {number|null} [params.id]
 * @param {object}      fields Champs de l'adresse
 * @returns {Promise<{ data: object }>}
 */
export async function saveAdresse({ id = null, ...fields } = {})
{
    const method = id ? 'PUT' : 'POST'
    const url    = id ? `/api/adresse/${id}` : '/api/adresse'

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
    const res = await apiFetch(`/api/adresse/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok)
        throw new Error(`HTTP ${res.status}`)

    return res.json()
}
