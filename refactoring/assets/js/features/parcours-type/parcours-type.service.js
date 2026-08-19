// assets/js/features/parcours-type/parcours-type.service.js
import { apiFetch } from '/assets/js/core/apiFetch.js'

const BASE = '/api/parcours-types'

/**
 * Référentiel complet — chargé une seule fois au bootstrap du Workbench.
 * Résultat injecté dans buildParcoursPropertySet() pour peupler le <select>.
 */
export async function fetchParcoursTypes()
{
    const res = await apiFetch(BASE)
    if (!res.ok) throw new Error(`fetchParcoursTypes HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? []
}
