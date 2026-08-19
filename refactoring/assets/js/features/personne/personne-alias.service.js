// assets/js/features/personne/personne-alias.service.js
//
// CRUD unitaire — ne jamais passer par syncAliases (PersonneService::update).
// La sync complète est destructive ; ici chaque opération est atomique.
import { apiFetch } from '/assets/js/core/apiFetch.js'

const BASE = '/api/personne-aliases'

export async function fetchAliases(personneId)
{
    const res = await apiFetch(`${BASE}?personne_id=${personneId}&per_page=50`)
    if (!res.ok) throw new Error(`fetchAliases HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? []
}

/**
 * id = null → POST ; id > 0 → PUT.
 * personne_id doit être inclus dans data lors de la création.
 */
export async function saveAlias({ id = null, ...data })
{
    const res = await apiFetch(
        id ? `${BASE}/${id}` : BASE,
        { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) }
    )
    if (!res.ok) throw new Error(`saveAlias HTTP ${res.status}`)
    return res.json()
}

export async function deleteAlias(id)
{
    const res = await apiFetch(`${BASE}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`deleteAlias HTTP ${res.status}`)
    return res.json()
}
