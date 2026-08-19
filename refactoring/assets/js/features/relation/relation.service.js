// assets/js/features/relation/relation.service.js
import { apiFetch } from '/assets/js/core/apiFetch.js'

const BASE = '/api/relations'

/**
 * Toutes les relations d'une entité (bidirectionnel).
 * Retourne [{ relation, relation_type }, ...]
 * — enrichissement fait côté PHP par RelationService::enrich().
 */
export async function fetchRelationsForEntity(entityType, entityId)
{
    const params = new URLSearchParams({ entity_type: entityType, entity_id: entityId })
    const res    = await apiFetch(`${BASE}?${params}`)
    if (!res.ok) throw new Error(`fetchRelationsForEntity HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? []
}

export async function createRelation(data)
{
    const res = await apiFetch(BASE, { method: 'POST', body: JSON.stringify(data) })
    if (!res.ok) throw new Error(`createRelation HTTP ${res.status}`)
    return res.json()
}

export async function updateRelation(id, data)
{
    const res = await apiFetch(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    if (!res.ok) throw new Error(`updateRelation HTTP ${res.status}`)
    return res.json()
}

/**
 * Désactivation douce — actif = 0, historique conservé.
 * À préférer à deleteRelation pour les relations passées.
 * PATCH /api/relations/{id}/deactivate
 */
export async function deactivateRelation(id)
{
    const res = await apiFetch(`${BASE}/${id}/deactivate`, { method: 'PATCH' })
    if (!res.ok) throw new Error(`deactivateRelation HTTP ${res.status}`)
    return res.json()
}

/**
 * Suppression physique — réservée aux erreurs de saisie.
 */
export async function deleteRelation(id)
{
    const res = await apiFetch(`${BASE}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`deleteRelation HTTP ${res.status}`)
    return res.json()
}
