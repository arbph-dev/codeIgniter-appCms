// assets/js/features/adresse/adresse.properties.js
// ─────────────────────────────────────────────────────────────────────────────
// Un seul PropertySet (pas de dualité create/edit comme Image) :
// tous les champs textuels sont éditables à la création et à la modification.
//
// Champs read-only calculés côté serveur (géocodage) :
//   adr_lat, adr_lng — affichés dans detail(), absents du formulaire
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schéma unique — champs éditables de l'adresse.
 */
export const AdressePropertySet = [
    {
        name        : 'adr_rue',
        description : 'Voie',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : '12 rue de la Paix…',
            required    : '',
            maxlength   : '255',
        },
        validate    : (v) => v.trim().length >= 2 || 'Voie trop courte.',
    },
    {
        name        : 'adr_complement',
        description : 'Complément',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : 'Bâtiment, appartement…',
            maxlength   : '255',
        },
    },
    {
        name        : 'adr_cp',
        description : 'Code postal',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : '75001',
            required    : '',
            maxlength   : '10',
        },
        validate    : (v) => v.trim().length >= 2 || 'Code postal invalide.',
    },
    {
        name        : 'adr_ville',
        description : 'Ville',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : 'Paris',
            required    : '',
            maxlength   : '100',
        },
        validate    : (v) => v.trim().length >= 1 || 'Ville requise.',
    },
    {
        name        : 'adr_pays',
        description : 'Pays',
        type        : 'text',
        default     : 'France',
        options     : {
            placeholder : 'France',
            maxlength   : '100',
        },
    },
]

/**
 * Aucun champ calculé côté client — lat/lng sont calculés par le serveur.
 */
export const AdresseComputePropertySet = []
