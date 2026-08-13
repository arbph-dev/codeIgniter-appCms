// assets/js/features/mot/mot.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Service Mot — new architecture.
// PK : mot_id (pas id) — tous les appels utilisent mot_id.
//
// fetchMot      — liste paginée (q, page, perPage)
// fetchMotLike  — autocomplete → items[] plat
// fetchMotBatch — multi-IDs en un appel → items[] plat (lazy load ImageTagger)
// saveMot       — POST (id=null) / PUT (id>0)
// deleteMot     — DELETE
// ─────────────────────────────────────────────────────────────────────────────

import { apiFetch } from '/assets/js/core/apiFetch.js'

/**
 * Liste / recherche paginée.
 *
 * @param {object}  params
 * @param {string}  [params.q]
 * @param {number}  [params.page]
 * @param {number}  [params.perPage]
 * @returns {Promise<{ data: object[], pager: object }>}
 */
export async function fetchMot({ q, page = 1, perPage = 20 } = {})
{
    const params = new URLSearchParams()
    if (q)      params.set('q',        q)
    params.set('page',     page)
    params.set('per_page', perPage)

    const res = await apiFetch(`/api/mot?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

/**
 * Autocomplete — retourne un tableau plat.
 * Compatible RelationPickerDialog.fetchFn et champ autocomplete.
 *
 * @param {object} params
 * @param {string} params.q
 * @param {number} [params.len]
 * @returns {Promise<object[]>}   [{ mot_id, mot_lbl }, …]
 */
export async function fetchMotLike({ q = '', len = 10 } = {})
{
    if (!q || q.length < 1) return []

    try
    {
        const params = new URLSearchParams({ q, len })
        const res    = await apiFetch(`/api/mot/like?${params}`)
        const json   = await res.json()
        return json.data ?? []
    }
    catch { return [] }
}

/**
 * Batch — charge plusieurs mots par leurs IDs en un seul appel.
 * Utilisé par l'ImageTagger pour afficher les labels des mot_ids d'une image.
 *
 * GET /api/mot/batch?ids=1,3,5
 * Limite serveur : 100 IDs max.
 *
 * @param {number[]} ids   tableau de mot_id
 * @returns {Promise<object[]>}  [{ mot_id, mot_lbl }, …] — même ordre que le tri serveur
 */
export async function fetchMotBatch(ids)
{
    if (!ids?.length) return []

    const deduped = [...new Set(ids.map(Number).filter(n => n > 0))]
    if (!deduped.length) return []

    try
    {
        const params = new URLSearchParams({ ids: deduped.join(',') })
        const res    = await apiFetch(`/api/mot/batch?${params}`)
        const json   = await res.json()
        return json.data ?? []
    }
    catch { return [] }
}

/**
 * Crée (POST) ou met à jour (PUT) un mot.
 *
 * @param {object}      params
 * @param {number|null} [params.id]     null = création
 * @param {string}      params.mot_lbl
 * @returns {Promise<{ data: object }>}
 */
export async function saveMot({ id = null, mot_lbl = '' } = {})
{
    const method = id ? 'PUT' : 'POST'
    const url    = id ? `/api/mot/${id}` : '/api/mot'

    const res = await apiFetch(url, {
        method,
        body : JSON.stringify({ mot_lbl }),
    })

    if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.message ?? `HTTP ${res.status}`)
    }

    return res.json()
}

/**
 * Supprime un mot.
 *
 * @param {number} id   mot_id
 */
export async function deleteMot(id)
{
    const res = await apiFetch(`/api/mot/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
