// assets/js/features/personne/personne.properties.js

// ─────────────────────────────────────────────────────────────────────────────
// PersonneInfoPropertySet
// Onglet "Identité" + form création
// ─────────────────────────────────────────────────────────────────────────────

export const PersonneInfoPropertySet = [
    {
        name        : 'nom',
        type        : 'text',
        description : 'Nom',
        default     : '',
        options     : { required: '', maxlength: '150' },
    },
    {
        name        : 'prenoms',
        type        : 'text',
        description : 'Prénoms',
        default     : '',
        options     : { maxlength: '150' },
    },
    {
        name        : 'nom_naissance',
        type        : 'text',
        description : 'Nom de naissance',
        default     : '',
        options     : { maxlength: '150' },
    },
    {
        name        : 'date_naissance',
        type        : 'date',
        description : 'Date de naissance',
        default     : '',
        options     : {},
    },
    {
        name        : 'date_deces',
        type        : 'date',
        description : 'Date de décès',
        default     : '',
        options     : {},
    },
]

// ─────────────────────────────────────────────────────────────────────────────
// PersonneAliasPropertySet
// InlineListEditor — onglet "Alias"
// ─────────────────────────────────────────────────────────────────────────────

export const PersonneAliasPropertySet = [
    {
        name        : 'alias',
        type        : 'text',
        description : 'Alias',
        default     : '',
        options     : { required: '', maxlength: '200' },
    },
    {
        name        : 'alias_type',
        type        : 'select',
        description : 'Type',
        default     : 'autre',
        options     : {
            choices : [
                { value: 'pseudonyme',       label: 'Pseudonyme'       },
                { value: 'nom_naissance',    label: 'Nom de naissance' },
                { value: 'nom_usage',        label: "Nom d'usage"      },
                { value: 'nom_scene',        label: 'Nom de scène'     },
                { value: 'nom_plume',        label: 'Nom de plume'     },
                { value: 'translitteration', label: 'Translittération' },
                { value: 'autre',            label: 'Autre'            },
            ],
        },
    },
    {
        name        : 'is_principal',
        type        : 'checkbox',
        description : 'Alias principal',
        default     : false,
        options     : { label: 'Alias principal' },
    },
    {
        name        : 'date_debut',
        type        : 'date',
        description : 'Début',
        default     : '',
        options     : {},
    },
    {
        name        : 'date_fin',
        type        : 'date',
        description : 'Fin',
        default     : '',
        options     : {},
    },
]

// ─────────────────────────────────────────────────────────────────────────────
// buildParcoursPropertySet
//
// Le champ `type` est un <select> peuplé depuis parcours_types — chargés au
// bootstrap via fetchParcoursTypes(), injectés ici pour construire les choices.
//
// @param {object[]} parcoursTypes  Résultat de fetchParcoursTypes()
// ─────────────────────────────────────────────────────────────────────────────

export function buildParcoursPropertySet(parcoursTypes = [])
{
    return [
        {
            name        : 'type',
            type        : 'select',
            description : 'Type de parcours',
            default     : parcoursTypes[0]?.id ? String(parcoursTypes[0].id) : '',
            options     : {
                required : '',
                choices  : parcoursTypes.map(t => ({ value: String(t.id), label: t.label })),
            },
        },
        {
            name        : 'titre',
            type        : 'text',
            description : 'Titre / poste',
            default     : '',
            options     : { required: '', maxlength: '255' },
        },
        {
            name        : 'date_debut',
            type        : 'date',
            description : 'Début',
            default     : '',
            options     : {},
        },
        {
            name        : 'date_fin',
            type        : 'date',
            description : 'Fin',
            default     : '',
            options     : {},
        },
    ]
}
