// assets/js/ui/shared/validation/rules.js
// ─────────────────────────────────────────────────────────────────────────────
// Règles de validation unitaires.
//
// Contrat : chaque règle est une fonction (value) => true | string
//   • true   → valide
//   • string → message d'erreur
//
// Les règles paramétrées sont des fabriques : minLength(3) retourne une règle.
//
// Ne pas étendre sans besoin démontré sur un formulaire existant.
// ─────────────────────────────────────────────────────────────────────────────


// ── Règles de base ────────────────────────────────────────────────────────────

export const required = (value) =>
    (value !== null && value !== undefined && String(value).trim() !== '')
    || 'Ce champ est requis'

export const minLength = (min) => (value) =>
    String(value).length >= min
    || `Minimum ${min} caractère${min > 1 ? 's' : ''} requis`

export const maxLength = (max) => (value) =>
    String(value).length <= max
    || `Maximum ${max} caractère${max > 1 ? 's' : ''} autorisés`

export const pattern = (regex, message) => (value) =>
    regex.test(String(value))
    || message


// ── Règles métier (reprises de l'existant) ────────────────────────────────────

export const email = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    || 'Email invalide'

export const phone = (value) =>
    /^0[1-9][0-9]{8}$/.test(value)
    || 'Téléphone invalide (format : 0612345678)'

export const date = (value) => {
    if (!value) return 'Date requise'
    return !isNaN(new Date(value).getTime()) || 'Date invalide'
}
