// assets/js/features/adresse/adresse.properties.js
// ─────────────────────────────────────────────────────────────────────────────
// Iteration002 — codepostal_id et voietype_id passent en type 'relation'.
//
// Champs read-only (absent du formulaire, affichés dans detail()) :
//   id           — PK
//   latitude     — geocodage serveur
//   longitude    — geocodage serveur
//   precision    — GeocodePrecision enum (numero/voie/commune/approx)
//   voietype_nom — JOIN type_voies
//   cp_codepostal— JOIN codes_postaux
//   cp_commune   — JOIN codes_postaux
//
// Champs relation :
//   codepostal_id → dialog_cp (fetchCpLike) — required
//   voietype_id   → dialog_tv (fetchTvLike) — permit_empty
// ─────────────────────────────────────────────────────────────────────────────

export const AdressePropertySet = [

    // ── Nom de voie (required) ────────────────────────────────────────────────

    {
        name        : 'voienom',
        description : 'Nom de voie',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : 'Lilas, Republique, Bretagne...',
            required    : '',
            maxlength   : '60',
        },
        validate : (v) => v.trim().length >= 1 || 'Nom de voie obligatoire.',
    },

    // ── Numero + indice ───────────────────────────────────────────────────────

    {
        name        : 'voienumero',
        description : 'Numero',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : '12',
            maxlength   : '10',
        },
    },

    {
        name        : 'voierpt',
        description : 'Indice',
        type        : 'select',
        default     : '',
        options     : {
            choices : [
                { value: '',  label: '—'         },
                { value: 'B', label: 'Bis'        },
                { value: 'T', label: 'Ter'        },
                { value: 'Q', label: 'Quater'     },
                { value: 'C', label: 'Quinquies'  },
            ],
        },
    },

    // ── Type de voie — relation dialog_tv ────────────────────────────────────
    // permit_empty — optionnel
    // fetchTvLike retourne { id, nom }
    // displayFn reconstruit depuis voietype_nom (JOIN) en mode fill()

    {
        name        : 'voietype_id',
        description : 'Type de voie',
        type        : 'relation',
        default     : '',
        options     : {
            dialogId    : 'dialog_tv',
            valueKey    : 'id',
            itemDisplay : (item) => item.nom ?? '',
            displayFn   : (data) => data.voietype_nom ?? '',
            placeholder : 'Type de voie...',
        },
    },

    // ── Charniere int 0-7 (permit_empty) ─────────────────────────────────────

    {
        name        : 'voiecharniere',
        description : 'Charnière',
        type        : 'select',
        default     : '',
        options     : {
            choices : [
                { value: '',  label: '— aucune —' },
                { value: '0', label: 'de'          },
                { value: '1', label: "d'"          },
                { value: '2', label: 'du'          },
                { value: '3', label: 'de la'       },
                { value: '4', label: 'des'         },
                { value: '5', label: "de l'"       },
                { value: '6', label: 'de las'      },
                { value: '7', label: 'de los'      },
            ],
        },
    },

    // ── Complement + infodistribution ─────────────────────────────────────────

    {
        name        : 'complement',
        description : 'Complement',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : 'Batiment A, app. 3, ZI...',
            maxlength   : '255',
        },
    },

    {
        name        : 'infodistribution',
        description : 'Info distribution',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : 'Lieudit, BP, CS...',
            maxlength   : '255',
        },
    },

    // ── Code postal — relation dialog_cp ─────────────────────────────────────
    // required — is_not_unique[codes_postaux.id]
    // fetchCpLike retourne { id, codepostal, commune }
    // displayFn reconstruit depuis cp_codepostal + cp_commune (JOIN) en mode fill()

    {
        name        : 'codepostal_id',
        description : 'Code postal',
        type        : 'relation',
        default     : '',
        options     : {
            dialogId    : 'dialog_cp',
            valueKey    : 'id',
            itemDisplay : (item) => [item.codepostal, item.commune].filter(Boolean).join(' '),
            displayFn   : (data) => [data.cp_codepostal, data.cp_commune].filter(Boolean).join(' '),
            placeholder : 'Code postal...',
            required    : '',
        },
        validate    : (v) => (parseInt(v, 10) > 0) || 'Code postal invalide.',
    },

    // ── Acheminement ──────────────────────────────────────────────────────────

    {
        name        : 'acheminement',
        description : 'Acheminement',
        type        : 'text',
        default     : '',
        options     : {
            placeholder : 'PONT L ABBE',
            maxlength   : '38',
        },
    },
]

export const AdresseComputePropertySet = []
