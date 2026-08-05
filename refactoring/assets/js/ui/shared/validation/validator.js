// assets/js/ui/shared/validation/validator.js
// ─────────────────────────────────────────────────────────────────────────────
// Orchestrateur de validation.
//
// Ne connaît pas le DOM — aucune dépendance UI.
// Les comportements temps réel et submit appartiennent à Form.js (Phase B.3).
// ─────────────────────────────────────────────────────────────────────────────


/**
 * Valide une valeur contre une liste de règles.
 * S'arrête à la première règle en échec.
 *
 * @param {*}          value   Valeur à valider
 * @param {Function[]} rules   Tableau de règles (value) => true | string
 * @returns {{ valid: boolean, error: string|null }}
 *
 * @example
 * validate('', [required])
 * // → { valid: false, error: 'Ce champ est requis' }
 *
 * validate('ab', [required, minLength(3)])
 * // → { valid: false, error: 'Minimum 3 caractères requis' }
 *
 * validate('abc', [required, minLength(3)])
 * // → { valid: true, error: null }
 */
export function validate(value, rules = [])
{
    for (const rule of rules)
    {
        const result = rule(value)
        if (result !== true)
        {
            return { valid: false, error: result }
        }
    }
    return { valid: true, error: null }
}


/**
 * Valide un ensemble de champs en une passe.
 *
 * @param {Array<{ name: string, value: *, rules: Function[] }>} fields
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 *
 * @example
 * validateAll([
 *     { name: 'lbl', value: input.value, rules: [required, maxLength(100)] },
 *     { name: 'email', value: mail.value, rules: [required, email] },
 * ])
 * // → { valid: false, errors: { email: 'Email invalide' } }
 */
export function validateAll(fields = [])
{
    const errors = {}

    for (const field of fields)
    {
        const { valid, error } = validate(field.value, field.rules)
        if (!valid) errors[field.name] = error
    }

    return {
        valid  : Object.keys(errors).length === 0,
        errors,
    }
}
