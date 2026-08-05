// Le schéma déclaratif du formulaire Mot.
// Séparé de la logique Panel — peut être réutilisé (ex. autocomplete, filtres).

export const MotPropertySet = [
    {
        name        : 'mot_lbl',
        description : 'Libellé',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : 'Libellé du mot…',
        },
        validate    : (v) => v.trim().length > 0 || 'Le libellé est requis',
    },
]

// Pas de ComputePropertySet pour Mot — le mot n'a pas de champ calculé.
export const MotComputePropertySet = []
