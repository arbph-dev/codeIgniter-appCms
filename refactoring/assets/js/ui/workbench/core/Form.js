// assets/js/ui/shared/Form.js
// ─────────────────────────────────────────────────────────────────────────────
// Composant formulaire piloté par un PropertySet déclaratif.
//
// Responsabilités :
//   • générer les champs depuis PropertySet
//   • valider (navigateur natif + fonction validate de la Property)
//   • extraire et caster les valeurs
//   • calculer les ComputePropertySet
//   • afficher les erreurs inline
//   • gérer Enter / Escape
//
// Ce que Form ne fait PAS :
//   • aucun appel API
//   • aucun verrou (lock/unlock) — géré par le Panel
//   • aucun affichage de feedback API — géré par le Panel
//   • aucune connaissance de l'ID métier
//
// ─────────────────────────────────────────────────────────────────────────────
// PropertySet — schéma d'un champ :
//
//   {
//     name        : 'mot_lbl',           // identifiant
//     description : 'Libellé',           // texte du label
//     type        : 'text',              // 'text' | 'number' | 'date'
//     default     : '',                  // valeur par défaut
//     options     : {                    // attributs HTML de l'input
//       placeholder : 'Libellé du mot…',
//       required    : '',
//       pattern     : '[a-zA-Z]{2,}',
//     },
//     validate    : (v) => true | 'msg', // validateur custom (optionnel)
//   }
//
// ComputePropertySet — schéma d'un champ calculé :
//
//   {
//     name      : 'slug',
//     calculate : (data) => data.mot_lbl.toLowerCase(),
//   }
// ─────────────────────────────────────────────────────────────────────────────

import { create } from '/assets/js/core/domhelper.js'

export class Form
{
    /**
     * @param {object}     config
     * @param {object[]}   config.propertySet          Schéma des champs éditables
     * @param {object[]}   [config.computePropertySet] Champs calculés après validation
     * @param {Function}   [config.onSubmit]           (data: object) => void
     * @param {Function}   [config.onCancel]           () => void
     * @param {object}     [config.labels]             Surcharge des libellés boutons
     * @param {string}     [config.labels.submit]      Défaut : 'Enregistrer'
     * @param {string}     [config.labels.cancel]      Défaut : 'Annuler'
     */
    constructor({
        propertySet        = [],
        computePropertySet = [],
        onSubmit           = null,
        onCancel           = null,
        labels             = {},
    } = {})
    {
        this._ps        = propertySet
        this._cps       = computePropertySet
        this._onSubmit  = onSubmit
        this._onCancel  = onCancel
        this._labels    = {
            submit : labels.submit ?? 'Enregistrer',
            cancel : labels.cancel ?? 'Annuler',
        }

        this.element    = null
        this._inputs    = new Map()    // name → HTMLInputElement
        this._errorEls  = new Map()    // name → HTMLElement
        this._submitBtn = null
    }

    // ── API publique ──────────────────────────────────────────────────────────

    /**
     * Construit et retourne l'élément DOM du formulaire.
     * @returns {HTMLElement}
     */
    render()
    {
        this.element = create('div', { class: 'wb_form' })

        this._ps.forEach(prop => {
            this.element.appendChild(this._createField(prop))
        })

        // Boutons
        const btnRow    = create('div', { class: 'wb_detail_btn_row' })
        this._submitBtn = create('button', {
            type  : 'button',
            class : 'wb-btn wb-btn--active',
            text  : this._labels.submit,
        })
        const cancelBtn = create('button', {
            type  : 'button',
            class : 'wb-btn',
            text  : this._labels.cancel,
        })

        this._submitBtn.addEventListener('click', () => this._handleSubmit())
        cancelBtn.addEventListener('click',       () => this._onCancel?.())

        // Enter / Escape sur tous les champs
        this._inputs.forEach(input =>
        {
            input.addEventListener('keydown', (e) =>
            {
                if (e.key === 'Enter')  this._submitBtn.click()
                if (e.key === 'Escape') cancelBtn.click()
            })
        })

        btnRow.append(this._submitBtn, cancelBtn)
        this.element.appendChild(btnRow)

        return this.element
    }

    /**
     * Pré-remplit le formulaire avec des données existantes (mode édition).
     * @param {object} data  Objet dont les clés correspondent aux noms du PropertySet
     */
    fill(data)
    {
        this._ps.forEach(prop =>
        {
            const input = this._inputs.get(prop.name)
            if (!input) return

            const value = data[prop.name] ?? prop.default ?? ''

            if (prop.type === 'date' && value instanceof Date)
            {
                input.value = this._dateToInputValue(value)
            }
            else
            {
                input.value = value
            }
        })

        this._clearErrors()

        // Sélectionne le contenu du premier champ pour édition rapide
        const first = this._inputs.get(this._ps[0]?.name)
        if (first) { first.focus(); first.select() }
    }

    /**
     * Remet le formulaire à l'état vide (mode création).
     */
    reset()
    {
        this._ps.forEach(prop =>
        {
            const input = this._inputs.get(prop.name)
            if (input) input.value = prop.default ?? ''
        })

        this._clearErrors()

        this._inputs.get(this._ps[0]?.name)?.focus()
    }

    /**
     * Valide tous les champs, affiche les erreurs inline.
     * @returns {object|null}  Objet de données casté + champs calculés, ou null si invalide
     */
    extract()
    {
        this._clearErrors()

        const data            = {}
        let   valid           = true
        let   firstInvalidInput = null

        for (const prop of this._ps)
        {
            const input = this._inputs.get(prop.name)
            if (!input) continue

            const check = this._checkField(prop, input)

            if (!check.success)
            {
                this._showError(prop.name, check.error)
                if (!firstInvalidInput) firstInvalidInput = input
                valid = false
                // On continue pour afficher toutes les erreurs d'un coup
            }
            else
            {
                data[prop.name] = this._castValue(input, prop.type)
            }
        }

        if (!valid)
        {
            firstInvalidInput?.focus()
            return null
        }

        // Champs calculés — exécutés après validation complète
        this._cps.forEach(prop =>
        {
            if (prop.calculate) data[prop.name] = prop.calculate(data)
        })

        return data
    }

    /**
     * Libère les références DOM.
     */
    destroy()
    {
        this._inputs.clear()
        this._errorEls.clear()
        this.element    = null
        this._submitBtn = null
    }

    // ── Privées ───────────────────────────────────────────────────────────────

    /**
     * Construit le bloc label + input + zone erreur d'un champ.
     * @param {object} prop  Entrée du PropertySet
     * @returns {HTMLElement}
     */
    _createField(prop)
    {
        const fieldId = `wbf_${prop.name}`
        const wrapper = create('div', { class: 'wb_form_field' })

        const label = create('label', {
            class : 'wb_detail_label',
            text  : prop.description,
            for   : fieldId,
        })

        const input = create('input', {
            id    : fieldId,
            type  : prop.type ?? 'text',
            class : 'wb_detail_input',
            ...(prop.options ?? {}),
        })
        input.value = prop.default ?? ''

        // Zone d'erreur inline — invisible par défaut
        const errorEl = create('span', {
            class : 'wb_form_error wb_form_error--hidden',
        })

        this._inputs.set(prop.name, input)
        this._errorEls.set(prop.name, errorEl)

        wrapper.append(label, input, errorEl)
        return wrapper
    }

    /**
     * Valide un champ : validation native navigateur puis validate() de la Property.
     *
     * Contrat validate() : retourne true (succès) ou string (message d'erreur).
     * Note : si validate() retourne true mais que la valeur est encore égale
     * au default, le champ est considéré non renseigné.
     *
     * @param {object}          prop
     * @param {HTMLInputElement} input
     * @returns {{ success: boolean, error: string|null }}
     */
    _checkField(prop, input)
    {
        // 1. Validation native du navigateur (required, pattern, min, max…)
        if (!input.validity.valid)
        {
            const msg = input.validity.patternMismatch
                ? `${prop.description} : format invalide`
                : `${prop.description} : ${input.validationMessage}`
            return { success: false, error: msg }
        }

        // 2. Validateur custom de la Property
        if (prop.validate)
        {
            const result = prop.validate(input.value)

            if (result !== true || input.value === (prop.default ?? ''))
            {
                return {
                    success : false,
                    error   : typeof result === 'string'
                        ? result
                        : `${prop.description} invalide`,
                }
            }
        }

        return { success: true, error: null }
    }

    /**
     * Caste la valeur de l'input selon le type de la Property.
     * @param {HTMLInputElement} input
     * @param {string}           type
     * @returns {*}
     */
    _castValue(input, type)
    {
        switch (type)
        {
            case 'number':
                return parseInt(input.value, 10)

            case 'date': {
                const [y, m, d] = input.value.split('-').map(Number)
                return new Date(y, m - 1, d)
            }

            default:
                return input.value
        }
    }

    /** Convertit un objet Date en chaîne YYYY-MM-DD pour input[type=date]. */
    _dateToInputValue(date)
    {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    _handleSubmit()
    {
        const data = this.extract()
        if (data) this._onSubmit?.(data)
    }

    _showError(name, message)
    {
        const el = this._errorEls.get(name)
        if (!el) return
        el.textContent = message
        el.className   = 'wb_form_error'
    }

    _clearErrors()
    {
        this._errorEls.forEach(el =>
        {
            el.textContent = ''
            el.className   = 'wb_form_error wb_form_error--hidden'
        })
    }
}

export default Form
