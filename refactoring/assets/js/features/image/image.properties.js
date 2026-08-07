// assets/js/features/image/image.properties.js
// ─────────────────────────────────────────────────────────────────────────────
// Deux schémas distincts (différence structurelle vs MotWorkbench) :
//
//   ImageCreatePropertySet — CREATE : file + alt + status
//   ImageEditPropertySet   — UPDATE : alt + status seulement
//
// Champs read-only calculés à l'upload (affichés en lecture, jamais dans les
// PropertySet car non éditables) :
//   filename, width, height, ratio, extension, size_ko, path
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schéma CREATE — upload d'une nouvelle image.
 */
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
        // validate reçoit le File object (pas la fake path string)
        validate    : (file) =>
        {
            if (!file) return 'Fichier requis.'
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
            placeholder : 'Description de l\'image…',
            maxlength   : '255',
        },
    },
    {
        name        : 'status',
        description : 'Statut',
        type        : 'select',
        default     : 'draft',
        options     : {
            choices : [
                { value: 'draft',     label: 'Brouillon'  },
                { value: 'published', label: 'Publié'     },
                { value: 'archived',  label: 'Archivé'    },
            ],
        },
    },
]

/**
 * Schéma UPDATE — modification d'une image existante.
 * filename, dimensions, extension, size_ko, path → read-only, affichés via detail()
 */
export const ImageEditPropertySet = [
    {
        name        : 'alt',
        description : 'Texte alternatif',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : 'Description de l\'image…',
            maxlength   : '255',
        },
    },
    {
        name        : 'status',
        description : 'Statut',
        type        : 'select',
        default     : 'draft',
        options     : {
            choices : [
                { value: 'draft',     label: 'Brouillon'  },
                { value: 'published', label: 'Publié'     },
                { value: 'archived',  label: 'Archivé'    },
            ],
        },
    },
]

/**
 * Champs calculés côté serveur à l'upload — aucun ComputePropertySet côté client.
 */
export const ImageComputePropertySet = []
