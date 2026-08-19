// assets/js/features/personne/personne-parcours.service.js
//
// CRUD unitaire — même stratégie que personne-alias.service.js.
// structure_id et adresse_id exclus de cette itération.
import { apiFetch } from '/assets/js/core/apiFetch.js'

const BASE = '/api/personne-parcours'

export async function fetchParcours(personneId)
{
    const res = await apiFetch(`${BASE}?personne_id=${personneId}&per_page=50`)
    if (!res.ok) throw new Error(`fetchParcours HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? []
}

/**
 * id = null → POST ; id > 0 → PUT.
 * personne_id doit être inclus dans data lors de la création.
 */
export async function saveParcours({ id = null, ...data })
{
    const res = await apiFetch(
        id ? `${BASE}/${id}` : BASE,
        { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) }
    )
    if (!res.ok) throw new Error(`saveParcours HTTP ${res.status}`)
    return res.json()
}

export async function deleteParcours(id)
{
    const res = await apiFetch(`${BASE}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`deleteParcours HTTP ${res.status}`)
    return res.json()
}
