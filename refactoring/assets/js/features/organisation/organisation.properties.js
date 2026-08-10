// assets/js/features/organisation/organisation.properties.js
// ─────────────────────────────────────────────────────────────────────────────
// Trois PropertySets distincts :
//
//   OrgInfoPropertySet     — identité + type (onglet Informations / form create)
//   OrgContactPropertySet  — coordonnées + liens (onglet Contacts)
//   OrgAdressePropertySet  — adresse_id via AdressePickerDialog (onglet Adresse)
//
// Note adresse_id :
//   withRelations() ne joint pas les adresses → displayFn affiche "Adresse #id"
//   au chargement. itemDisplay donne le formatage complet après sélection picker.
//   Backend à enrichir (show() → inclure adresse sub-objet).
// ─────────────────────────────────────────────────────────────────────────────

import { ORGANISATION_TYPES } from './organisation.constants.js'

// ── Informations ──────────────────────────────────────────────────────────────

export const OrgInfoPropertySet = [
    {
        name        : 'nom',
        description : 'Nom',
        type        : 'text',
        default     : '',
        options     : { required: '', maxlength: '255', placeholder: 'Nom de la structure…' },
        validate    : (v) => v.trim().length >= 2 || 'Nom trop court.',
    },
    {
        name        : 'organisation_type_id',
        description : 'Type',
        type        : 'radio',
        default     : '1',
        options     : {
            required : '',
            choices  : ORGANISATION_TYPES,
        },
    },
    {
        name        : 'siren',
        description : 'SIREN',
        type        : 'text',
        default     : '',
        options     : { maxlength: '9', pattern: '\\d{0,9}', placeholder: '9 chiffres' },
    },
    {
        name        : 'rna',
        description : 'RNA',
        type        : 'text',
        default     : '',
        options     : { maxlength: '20', placeholder: 'W123456789' },
    },
    {
        name        : 'date_creation',
        description : 'Date de création',
        type        : 'text',
        default     : '',
        options     : { pattern: '\\d{4}-\\d{2}-\\d{2}', placeholder: 'YYYY-MM-DD' },
    },
    {
        name        : 'description',
        description : 'Description courte',
        type        : 'text',
        default     : '',
        options     : { maxlength: '500', placeholder: 'Résumé en une phrase…' },
    },
]

// ── Contacts + liens ──────────────────────────────────────────────────────────

export const OrgContactPropertySet = [
    {
        name        : 'email',
        description : 'Email',
        type        : 'email',
        default     : '',
        options     : { placeholder: 'contact@exemple.fr' },
    },
    {
        name        : 'telephone',
        description : 'Téléphone',
        type        : 'text',
        default     : '',
        options     : { maxlength: '50', placeholder: '02 98 …' },
    },
    {
        name        : 'site_web',
        description : 'Site web',
        type        : 'url',
        default     : '',
        options     : { placeholder: 'https://…' },
    },
    {
        name        : 'urlreg',
        description : 'Annuaire institutionnel',
        type        : 'url',
        default     : '',
        options     : { placeholder: 'https://annuaire-entreprises.data.gouv.fr/…' },
    },
    {
        name        : 'lien_facebook',
        description : 'Facebook',
        type        : 'url',
        default     : '',
        options     : { placeholder: 'https://facebook.com/…' },
    },
    {
        name        : 'lien_instagram',
        description : 'Instagram',
        type        : 'url',
        default     : '',
        options     : { placeholder: 'https://instagram.com/…' },
    },
    {
        name        : 'lien_linkedin',
        description : 'LinkedIn',
        type        : 'url',
        default     : '',
        options     : { placeholder: 'https://linkedin.com/company/…' },
    },
]

// ── Adresse (FK relation) ─────────────────────────────────────────────────────

export const OrgAdressePropertySet = [
    {
        name        : 'adresse_id',
        description : 'Adresse',
        type        : 'relation',
        default     : '',
        options     : {
            dialogId    : 'dialog_adresse',
            valueKey    : 'id',

            // Après sélection dans le picker (items de suggest() adresse)
            itemDisplay : (item) =>
            {
                const ligne1 = [item.voienumero, item.voietype_nom, item.voienom]
                    .filter(Boolean).join(' ')
                const ligne2 = [item.cp_codepostal, item.cp_commune]
                    .filter(Boolean).join(' ')
                return [ligne1, ligne2].filter(Boolean).join(' — ')
            },

            // En mode fill() — API ne retourne pas le sub-objet adresse (yet)
            // TODO : enrichir show() backend → inclure adresse.rue / codepostal / ville
            displayFn   : (data) =>
                data.adresse_id ? `Adresse #${data.adresse_id}` : '',

            placeholder : 'Sélectionner une adresse…',
        },
    },
]

// ── Compute (aucun côté client) ───────────────────────────────────────────────

export const OrgComputePropertySet = []
