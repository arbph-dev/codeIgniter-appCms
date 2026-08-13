// assets/js/features/image/image.properties.js
// ─────────────────────────────────────────────────────────────────────────────
// Correction iteration003 :
//   status : draft/published/archived → pending/validated/rejected (ImageModel)
//
// Deux schémas distincts (inchangé) :
//   ImageCreatePropertySet — file + alt + status  (upload)
//   ImageEditPropertySet   — alt + status         (modification)
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CHOICES = [
    { value: 'pending',   label: 'En attente'  },
    { value: 'validated', label: 'Validée'     },
    { value: 'rejected',  label: 'Rejetée'     },
]

// ── CREATE ────────────────────────────────────────────────────────────────────

export const ImageCreatePropertySet = [
    {
        name        : 'file',
        description : 'Fichier image',
        type        : 'file',
        default     : null,
        options     : {
            accept   : 'image/*',
            required : '',
        },
        validate    : (file) =>
        {
            if (!file)                  return 'Fichier requis.'
            if (file.size > 10 * 1024 * 1024) return 'Taille max : 10 Mo.'
            return true
        },
    },
    {
        name        : 'alt',
        description : 'Texte alternatif',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : "Description de l'image…",
            maxlength   : '255',
        },
    },
    {
        name        : 'status',
        description : 'Statut',
        type        : 'select',
        default     : 'pending',
        options     : { choices: STATUS_CHOICES },
    },
]

// ── EDIT ──────────────────────────────────────────────────────────────────────

export const ImageEditPropertySet = [
    {
        name        : 'alt',
        description : 'Texte alternatif',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : "Description de l'image…",
            maxlength   : '255',
        },
    },
    {
        name        : 'status',
        description : 'Statut',
        type        : 'select',
        default     : 'pending',
        options     : { choices: STATUS_CHOICES },
    },
]

export const ImageComputePropertySet = []
