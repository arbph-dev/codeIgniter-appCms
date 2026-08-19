// assets/js/features/personne/personne.service.js
import { apiFetch } from '/assets/js/core/apiFetch.js'

const BASE = '/api/personnes'

/**
 * Recherche rapide (suggest) — retourne un tableau plat de personnes.
 * Utilisé par RelationPickerDialog (dialog_personne_picker, dialog_merge_picker).
 */
export async function fetchPersonneLike({ q, len = 20 } = {})
{
    const params = new URLSearchParams({ q, per_page: len })
    const res    = await apiFetch(`${BASE}?${params}`)
    if (!res.ok) throw new Error(`fetchPersonneLike HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? []
}

/**
 * Liste paginée — retourne { data[], pager }.
 */
export async function fetchPersonne({ q, page = 1, perPage = 20 } = {})
{
    const params = new URLSearchParams({ page, per_page: perPage })
    if (q) params.set('q', q)
    const res = await apiFetch(`${BASE}?${params}`)
    if (!res.ok) throw new Error(`fetchPersonne HTTP ${res.status}`)
    return res.json()
}

/**
 * Fiche complète — retourne { personne, aliases, parcours, relations }.
 * Correspond à PersonneService::findWithRelations().
 */
export async function fetchPersonneById(id)
{
    const res = await apiFetch(`${BASE}/${id}`)
    if (!res.ok) throw new Error(`fetchPersonneById HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? null
}

/**
 * Création ou mise à jour partielle.
 * id = null → POST /api/personnes
 * id > 0   → PUT  /api/personnes/{id}
 */
export async function savePersonne({ id = null, ...data })
{
    const res = await apiFetch(
        id ? `${BASE}/${id}` : BASE,
        { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) }
    )
    if (!res.ok) throw new Error(`savePersonne HTTP ${res.status}`)
    return res.json()
}

export async function deletePersonne(id)
{
    const res = await apiFetch(`${BASE}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`deletePersonne HTTP ${res.status}`)
    return res.json()
}

/**
 * Fusionne sourceId dans targetId.
 * La source est soft-deleted après fusion (merge_into_id = targetId).
 * POST /api/personnes/{sourceId}/merge/{targetId}
 */
export async function mergePersonne(sourceId, targetId)
{
    const res = await apiFetch(`${BASE}/${sourceId}/merge/${targetId}`, { method: 'POST' })
    if (!res.ok) throw new Error(`mergePersonne HTTP ${res.status}`)
    return res.json()
}
