// assets/js/features/organisation/organisation.constants.js
// ─────────────────────────────────────────────────────────────────────────────
// Miroir JS de la table organisation_types.
// Pas d'enum PHP, pas de model — référentiel stable (7 types métier).
// À synchroniser si la table évolue.
// ─────────────────────────────────────────────────────────────────────────────

export const ORGANISATION_TYPES = [
    { value: '1', label: 'Entreprise'                },
    { value: '2', label: 'Association loi 1901'      },
    { value: '3', label: 'Coopérative'               },
    { value: '4', label: 'Établissement public'      },
    { value: '5', label: 'Établissement scolaire'    },
    { value: '6', label: 'Collectivité territoriale' },
    { value: '7', label: 'Musée / Site culturel'     },
]

/** Lookup rapide id → label */
export function getOrgTypeLabel(id)
{
    return ORGANISATION_TYPES.find(t => t.value === String(id))?.label ?? '—'
}
