// assets/js/ui/shared/Form.js
// ─────────────────────────────────────────────────────────────────────────────
// Iteration002 — extension type 'select' + type 'file'
//
// Nouveautés vs Iteration001 :
//   • PropertySet : type 'select' → <select> piloté par options.choices
//   • PropertySet : type 'file'   → <input type="file"> avec options.accept etc.
//   • _createField()  dispatche sur prop.type
//   • fill()          saute les champs file (restriction navigateur)
//   • reset()         vide explicitement les champs file (field.value = '')
//   • _checkField()   trois branches : file / select / textuels
//   • _castValue()    ajout case 'file' → files[0]
//   • render()        Enter/Escape ignorés sur select et file
//
// Schema PropertySet étendu :
//
//   { type: 'select', options: { choices: [{value, label}], required: '' } }
//   { type: 'file',   options: { accept: 'image/*', required: '' } }
//
// Contrat inchangé : render / fill / reset / extract
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
     * @param {object}     [config.labels]
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
        this._inputs    = new Map()    // name → HTMLInputElement | HTMLSelectElement
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

        // Enter / Escape uniquement sur les champs textuels
        // Select : Enter gère le dropdown nativement
        // File   : Enter n'a pas de sémantique de soumission
        this._inputs.forEach((field, name) =>
        {
            const prop = this._ps.find(p => p.name === name)
            if (!prop || prop.type === 'select' || prop.type === 'file') return

            field.addEventListener('keydown', (e) =>
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
     * Pré-remplit le formulaire (mode édition).
     * Les champs file sont ignorés — restriction navigateur.
     *
     * @param {object} data
     */
    fill(data)
    {
        this._ps.forEach(prop =>
        {
            // Les champs file ne peuvent pas être pré-remplis
            if (prop.type === 'file') return

            const field = this._inputs.get(prop.name)
            if (!field) return

            const value = data[prop.name] ?? prop.default ?? ''

            if (prop.type === 'date' && value instanceof Date)
            {
                field.value = this._dateToInputValue(value)
            }
            else
            {
                field.value = value
            }
        })

        this._clearErrors()

        // Focus sur le premier champ éditable (exclut file)
        const firstEditable = this._ps.find(p => p.type !== 'file')
        const first = firstEditable ? this._inputs.get(firstEditable.name) : null
        if (first) { first.focus(); first.select?.() }
    }

    /**
     * Remet le formulaire à l'état vide (mode création).
     */
    reset()
    {
        this._ps.forEach(prop =>
        {
            const field = this._inputs.get(prop.name)
            if (!field) return

            if (prop.type === 'file')
            {
                // Vider la sélection de fichier
                field.value = ''
            }
            else
            {
                field.value = prop.default ?? ''
            }
        })

        this._clearErrors()

        const firstEditable = this._ps.find(p => p.type !== 'file')
        const first = firstEditable ? this._inputs.get(firstEditable.name) : null
        first?.focus()
    }

    /**
     * Valide tous les champs et retourne l'objet de données, ou null si invalide.
     * @returns {object|null}
     */
    extract()
    {
        this._clearErrors()

        const data              = {}
        let   valid             = true
        let   firstInvalidField = null

        for (const prop of this._ps)
        {
            const field = this._inputs.get(prop.name)
            if (!field) continue

            const check = this._checkField(prop, field)

            if (!check.success)
            {
                this._showError(prop.name, check.error)
                if (!firstInvalidField) firstInvalidField = field
                valid = false
            }
            else
            {
                data[prop.name] = this._castValue(field, prop.type)
            }
        }

        if (!valid)
        {
            firstInvalidField?.focus()
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
     * Construit le bloc label + champ + zone erreur d'un champ.
     *
     * Dispatch selon prop.type :
     *   'select' → <select> + <option> depuis options.choices
     *   'file'   → <input type="file">
     *   autres   → <input type="..."> (comportement original)
     *
     * Note : options.choices est extrait avant de passer les attrs HTML,
     * pour éviter qu'il soit défini comme attribut sur le <select>.
     *
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

        // Extraire choices — clé métier non transmise comme attribut HTML
        const { choices = [], ...htmlOpts } = prop.options ?? {}

        let field

        if (prop.type === 'select')
        {
            field = create('select', {
                id    : fieldId,
                class : 'wb_detail_input',
                ...htmlOpts,
            })

            choices.forEach(({ value, label: lbl }) =>
            {
                field.appendChild(create('option', { value, text: lbl }))
            })

            // Valeur par défaut : prop.default ou premier choix disponible
            field.value = prop.default ?? (choices[0]?.value ?? '')
        }
        else if (prop.type === 'file')
        {
            field = create('input', {
                id    : fieldId,
                type  : 'file',
                class : 'wb_detail_input',
                ...htmlOpts,
            })
            // Pas de valeur par défaut — restriction navigateur
        }
        else
        {
            field = create('input', {
                id    : fieldId,
                type  : prop.type ?? 'text',
                class : 'wb_detail_input',
                ...htmlOpts,
            })
            field.value = prop.default ?? ''
        }

        // Zone d'erreur inline — invisible par défaut
        const errorEl = create('span', {
            class : 'wb_form_error wb_form_error--hidden',
        })

        this._inputs.set(prop.name, field)
        this._errorEls.set(prop.name, errorEl)

        wrapper.append(label, field, errorEl)
        return wrapper
    }

    /**
     * Valide un champ selon son type.
     *
     * Trois branches :
     *   'file'   → required via files.length + validate(files[0])
     *   'select' → validité native + validate(value) sans contrainte sur le default
     *   autres   → comportement original (validité native + validate(value) ≠ default)
     *
     * @param {object}                        prop
     * @param {HTMLInputElement|HTMLSelectElement} field
     * @returns {{ success: boolean, error: string|null }}
     */
    _checkField(prop, field)
    {
        // ── Type file ─────────────────────────────────────────────────────────
        if (prop.type === 'file')
        {
            const isRequired = 'required' in (prop.options ?? {})

            if (isRequired && (!field.files || field.files.length === 0))
            {
                return {
                    success : false,
                    error   : `${prop.description} : fichier requis`,
                }
            }

            // Validateur custom reçoit le File object, pas la fake path string
            if (prop.validate && field.files?.length)
            {
                const result = prop.validate(field.files[0])
                if (result !== true)
                {
                    return {
                        success : false,
                        error   : typeof result === 'string' ? result : `${prop.description} invalide`,
                    }
                }
            }

            return { success: true, error: null }
        }

        // ── Type select ───────────────────────────────────────────────────────
        if (prop.type === 'select')
        {
            if (!field.validity.valid)
            {
                return {
                    success : false,
                    error   : `${prop.description} : ${field.validationMessage}`,
                }
            }

            // La valeur par défaut d'un select EST une valeur valide
            // → on ne vérifie pas value === default ici
            if (prop.validate)
            {
                const result = prop.validate(field.value)
                if (result !== true)
                {
                    return {
                        success : false,
                        error   : typeof result === 'string' ? result : `${prop.description} invalide`,
                    }
                }
            }

            return { success: true, error: null }
        }

        // ── Types textuels (text, number, date…) — comportement original ──────
        if (!field.validity.valid)
        {
            const msg = field.validity.patternMismatch
                ? `${prop.description} : format invalide`
                : `${prop.description} : ${field.validationMessage}`
            return { success: false, error: msg }
        }

        if (prop.validate)
        {
            const result = prop.validate(field.value)

            if (result !== true || field.value === (prop.default ?? ''))
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
     * Caste la valeur du champ selon son type.
     *
     * @param {HTMLInputElement|HTMLSelectElement} field
     * @param {string}                            type
     * @returns {*}
     */
    _castValue(field, type)
    {
        switch (type)
        {
            case 'number':
                return parseInt(field.value, 10)

            case 'date': {
                const [y, m, d] = field.value.split('-').map(Number)
                return new Date(y, m - 1, d)
            }

            case 'file':
                // Retourne le File object (ou null si aucun fichier)
                return field.files?.[0] ?? null

            default:
                // text, select et tout autre type → valeur texte
                return field.value
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
