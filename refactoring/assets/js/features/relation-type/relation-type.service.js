// assets/js/features/relation-type/relation-type.service.js
import { apiFetch } from '/assets/js/core/apiFetch.js'

const BASE = '/api/relation-types'

/**
 * @param {object} [options]
 * @param {string} [options.sourceType]  Filtre sur source_type (ex. 'personne')
 * @param {string} [options.targetType]  Filtre sur target_type (ex. 'organisation')
 *
 * Cas d'usage principal au bootstrap :
 *   fetchRelationTypes({ sourceType: 'personne' })
 *   → tous les types dont la source est une personne,
 *     chaque item porte target_type qui détermine quel dialog ouvrir.
 */
export async function fetchRelationTypes({ sourceType, targetType } = {})
{
    const params = new URLSearchParams()
    if (sourceType) params.set('source_type', sourceType)
    if (targetType) params.set('target_type', targetType)
    const res = await apiFetch(`${BASE}?${params}`)
    if (!res.ok) throw new Error(`fetchRelationTypes HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? []
}
