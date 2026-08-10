// assets/js/ui/shared/Form.js
// ─────────────────────────────────────────────────────────────────────────────
// Iteration004 — type 'radio' + type 'checkbox'
//
// radio    → groupe de boutons (organisation_type_id, statut…)
//            _inputs stocke le <div role="radiogroup">
//            _castValue  → input:checked.value | null
//            fill()      → coche le radio dont value === data[name]
//            reset()     → coche le radio dont value === prop.default
//            _checkField → required = au moins un coché
//
// checkbox → booléen unique (is_active, is_public…)
//            _inputs stocke le <input type="checkbox">
//            _castValue  → field.checked (boolean)
//            fill()      → field.checked = Boolean(data[name])
//            reset()     → field.checked = Boolean(prop.default)
//            _checkField → required = doit être coché
//
// Enter/Escape ignorés sur radio et checkbox (navigation native clavier)
//
// Schema PropertySet — type 'radio' :
//   { name:'organisation_type_id', type:'radio', default:'1',
//     options:{ choices:[{value:'1',label:'Entreprise'},…], required:'' } }
//
// Schema PropertySet — type 'checkbox' :
//   { name:'is_active', type:'checkbox', default:true,
//     options:{ label:'Oui, actif' } }
// ─────────────────────────────────────────────────────────────────────────────

import { create } from '/assets/js/core/domhelper.js'
import { bus }    from '/assets/js/core/eventBus.js'

export class Form
{
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

        this.element      = null
        this._inputs      = new Map()
        this._displays    = new Map()
        this._errorEls    = new Map()
        this._busHandlers = []
        this._submitBtn   = null
    }

    render()
    {
        this.element = create('div', { class: 'wb_form' })
        this._ps.forEach(prop => this.element.appendChild(this._createField(prop)))

        const btnRow    = create('div', { class: 'wb_detail_btn_row' })
        this._submitBtn = create('button', { type:'button', class:'wb-btn wb-btn--active', text:this._labels.submit })
        const cancelBtn = create('button', { type:'button', class:'wb-btn', text:this._labels.cancel })

        this._submitBtn.addEventListener('click', () => this._handleSubmit())
        cancelBtn.addEventListener('click',       () => this._onCancel?.())

        // Enter/Escape — champs textuels uniquement
        this._inputs.forEach((field, name) =>
        {
            const prop = this._ps.find(p => p.name === name)
            if (!prop) return
            const skip = ['select','file','relation','radio','checkbox']
            if (skip.includes(prop.type)) return

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

    fill(data)
    {
        this._ps.forEach(prop =>
        {
            if (prop.type === 'file') return

            if (prop.type === 'relation')
            {
                const hidden  = this._inputs.get(prop.name)
                const display = this._displays.get(prop.name)
                if (!hidden || !display) return
                const val    = data[prop.name]
                hidden.value = (val != null) ? String(val) : ''
                if (hidden.value)
                {
                    const fn = prop.options?.displayFn
                    display.value = fn ? fn(data) : hidden.value
                }
                else display.value = ''
                return
            }

            if (prop.type === 'radio')
            {
                const group = this._inputs.get(prop.name)
                if (!group) return
                const val = String(data[prop.name] ?? prop.default ?? '')
                group.querySelectorAll('input[type="radio"]').forEach(r => {
                    r.checked = r.value === val
                })
                return
            }

            if (prop.type === 'checkbox')
            {
                const field = this._inputs.get(prop.name)
                if (field) field.checked = Boolean(data[prop.name] ?? prop.default)
                return
            }

            const field = this._inputs.get(prop.name)
            if (!field) return
            const value = data[prop.name] ?? prop.default ?? ''
            if (prop.type === 'date' && value instanceof Date)
                field.value = this._dateToInputValue(value)
            else
                field.value = value
        })

        this._clearErrors()

        const firstEditable = this._ps.find(
            p => !['file','relation','radio','checkbox'].includes(p.type)
        )
        const first = firstEditable ? this._inputs.get(firstEditable.name) : null
        if (first) { first.focus(); first.select?.() }
    }

    reset()
    {
        this._ps.forEach(prop =>
        {
            if (prop.type === 'file')
            {
                const f = this._inputs.get(prop.name)
                if (f) f.value = ''
                return
            }

            if (prop.type === 'relation')
            {
                const hidden  = this._inputs.get(prop.name)
                const display = this._displays.get(prop.name)
                if (hidden)  hidden.value  = ''
                if (display) display.value = ''
                return
            }

            if (prop.type === 'radio')
            {
                const group = this._inputs.get(prop.name)
                if (!group) return
                const def = String(prop.default ?? '')
                group.querySelectorAll('input[type="radio"]').forEach(r => {
                    r.checked = r.value === def
                })
                return
            }

            if (prop.type === 'checkbox')
            {
                const f = this._inputs.get(prop.name)
                if (f) f.checked = Boolean(prop.default)
                return
            }

            const f = this._inputs.get(prop.name)
            if (f) f.value = prop.default ?? ''
        })

        this._clearErrors()

        const firstEditable = this._ps.find(
            p => !['file','relation','radio','checkbox'].includes(p.type)
        )
        const first = firstEditable ? this._inputs.get(firstEditable.name) : null
        first?.focus()
    }

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
            const invalidProp = this._ps.find(p => this._inputs.get(p.name) === firstInvalidField)
            if (invalidProp?.type === 'relation')
                this._displays.get(invalidProp.name)?.focus()
            else if (invalidProp?.type === 'radio')
                firstInvalidField.querySelector('input[type="radio"]')?.focus()
            else
                firstInvalidField?.focus()
            return null
        }

        this._cps.forEach(prop => { if (prop.calculate) data[prop.name] = prop.calculate(data) })
        return data
    }

    destroy()
    {
        this._busHandlers.forEach(({ event, handler }) => bus.unsubscribe(event, handler))
        this._busHandlers = []
        this._inputs.clear()
        this._displays.clear()
        this._errorEls.clear()
        this.element    = null
        this._submitBtn = null
    }

    // ── Construction des champs ───────────────────────────────────────────────

    _createField(prop)
    {
        const fieldId = 'wbf_' + prop.name
        const wrapper = create('div', { class: 'wb_form_field' })
        const label   = create('label', { class:'wb_detail_label', text:prop.description, for:fieldId })
        const { choices = [], ...htmlOpts } = prop.options ?? {}

        // ── Radio ──────────────────────────────────────────────────────────────
        if (prop.type === 'radio')
        {
            const group = create('div', {
                id    : fieldId,
                class : 'wb_radio_group',
                role  : 'radiogroup',
            })

            choices.forEach(({ value, label: lbl }) =>
            {
                const radioId   = fieldId + '_' + value
                const wrapLabel = create('label', { class:'wb_radio_label' })
                const radio     = create('input', { type:'radio', id:radioId, name:prop.name, value })
                if (String(value) === String(prop.default ?? '')) radio.checked = true
                wrapLabel.append(radio, document.createTextNode(' ' + lbl))
                group.appendChild(wrapLabel)
            })

            const errorEl = create('span', { class:'wb_form_error wb_form_error--hidden' })
            this._inputs.set(prop.name, group)
            this._errorEls.set(prop.name, errorEl)
            wrapper.append(label, group, errorEl)
            return wrapper
        }

        // ── Checkbox ───────────────────────────────────────────────────────────
        if (prop.type === 'checkbox')
        {
            const { label: inlineLabel, required, ...rest } = prop.options ?? {}

            const checkInput = create('input', {
                id    : fieldId,
                type  : 'checkbox',
                class : 'wb_checkbox_input',
            })
            if (required !== undefined) checkInput.setAttribute('required', '')
            if (prop.default) checkInput.checked = true

            const checkWrap  = create('div',   { class:'wb_checkbox_wrapper' })
            const checkLabel = create('label',  {
                class : 'wb_checkbox_text',
                for   : fieldId,
                text  : inlineLabel ?? prop.description,
            })
            checkWrap.append(checkInput, checkLabel)

            const errorEl = create('span', { class:'wb_form_error wb_form_error--hidden' })
            this._inputs.set(prop.name, checkInput)
            this._errorEls.set(prop.name, errorEl)
            wrapper.append(label, checkWrap, errorEl)
            return wrapper
        }

        // ── Relation ───────────────────────────────────────────────────────────
        if (prop.type === 'relation')
        {
            const opts        = prop.options ?? {}
            const dialogId    = opts.dialogId
            const valueKey    = opts.valueKey    ?? 'id'
            const itemDisplay = opts.itemDisplay ?? null
            const placeholder = opts.placeholder ?? 'Selectionner...'

            const displayInput = create('input', {
                id:'', type:'text', class:'wb_detail_input wb_relation_display',
                placeholder, readonly:''
            })
            displayInput.id = fieldId

            const hiddenInput = create('input', { type:'hidden' })

            const btn = create('button', { type:'button', class:'wb-btn wb_relation_btn', 'aria-label':'Selectionner' })
            btn.appendChild(create('i', { class:'fa fa-fw fa-search', 'aria-hidden':'true' }))
            btn.addEventListener('click', () => { if (dialogId) bus.publish('dialog:show', dialogId) })

            if (dialogId)
            {
                const handler = ({ sourceId, item }) =>
                {
                    if (sourceId !== dialogId) return
                    hiddenInput.value  = item[valueKey] != null ? String(item[valueKey]) : ''
                    displayInput.value = itemDisplay ? itemDisplay(item) : hiddenInput.value
                    this._clearFieldError(prop.name)
                }
                bus.subscribe('dialog:select', handler)
                this._busHandlers.push({ event:'dialog:select', handler })
            }

            this._inputs.set(prop.name, hiddenInput)
            this._displays.set(prop.name, displayInput)

            const inputRow = create('div', { class:'wb_relation_wrapper' })
            inputRow.append(displayInput, btn)

            const errorEl = create('span', { class:'wb_form_error wb_form_error--hidden' })
            this._errorEls.set(prop.name, errorEl)
            wrapper.append(label, inputRow, hiddenInput, errorEl)
            return wrapper
        }

        // ── Select ─────────────────────────────────────────────────────────────
        let field
        if (prop.type === 'select')
        {
            field = create('select', { id:fieldId, class:'wb_detail_input', ...htmlOpts })
            choices.forEach(({ value, label: lbl }) =>
                field.appendChild(create('option', { value, text:lbl }))
            )
            field.value = prop.default ?? (choices[0]?.value ?? '')
        }
        // ── File ───────────────────────────────────────────────────────────────
        else if (prop.type === 'file')
        {
            field = create('input', { id:fieldId, type:'file', class:'wb_detail_input', ...htmlOpts })
        }
        // ── Text / number / date / url / email… ────────────────────────────────
        else
        {
            field = create('input', { id:fieldId, type:prop.type??'text', class:'wb_detail_input', ...htmlOpts })
            field.value = prop.default ?? ''
        }

        const errorEl = create('span', { class:'wb_form_error wb_form_error--hidden' })
        this._inputs.set(prop.name, field)
        this._errorEls.set(prop.name, errorEl)
        wrapper.append(label, field, errorEl)
        return wrapper
    }

    // ── Validation ────────────────────────────────────────────────────────────

    _checkField(prop, field)
    {
        const opts       = prop.options ?? {}
        const isRequired = 'required' in opts

        if (prop.type === 'radio')
        {
            const checked = field.querySelector('input[type="radio"]:checked')
            if (isRequired && !checked)
                return { success:false, error: prop.description + ' : selection requise' }
            if (prop.validate && checked)
            {
                const r = prop.validate(checked.value)
                if (r !== true) return { success:false, error: typeof r==='string' ? r : prop.description+' invalide' }
            }
            return { success:true, error:null }
        }

        if (prop.type === 'checkbox')
        {
            if (isRequired && !field.checked)
                return { success:false, error: prop.description + ' : requis' }
            return { success:true, error:null }
        }

        if (prop.type === 'relation')
        {
            if (isRequired && !field.value)
                return { success:false, error: prop.description + ' : selection requise' }
            if (prop.validate && field.value)
            {
                const r = prop.validate(field.value)
                if (r !== true) return { success:false, error: typeof r==='string' ? r : prop.description+' invalide' }
            }
            return { success:true, error:null }
        }

        if (prop.type === 'file')
        {
            if (isRequired && (!field.files || field.files.length === 0))
                return { success:false, error: prop.description + ' : fichier requis' }
            if (prop.validate && field.files?.length)
            {
                const r = prop.validate(field.files[0])
                if (r !== true) return { success:false, error: typeof r==='string' ? r : prop.description+' invalide' }
            }
            return { success:true, error:null }
        }

        if (prop.type === 'select')
        {
            if (!field.validity.valid)
                return { success:false, error: prop.description + ' : ' + field.validationMessage }
            if (prop.validate)
            {
                const r = prop.validate(field.value)
                if (r !== true) return { success:false, error: typeof r==='string' ? r : prop.description+' invalide' }
            }
            return { success:true, error:null }
        }

        // text / number / date…
        if (!field.validity.valid)
        {
            const msg = field.validity.patternMismatch
                ? prop.description + ' : format invalide'
                : prop.description + ' : ' + field.validationMessage
            return { success:false, error:msg }
        }
        if (prop.validate)
        {
            const r = prop.validate(field.value)
            if (r !== true || field.value === (prop.default ?? ''))
                return { success:false, error: typeof r==='string' ? r : prop.description+' invalide' }
        }
        return { success:true, error:null }
    }

    _castValue(field, type)
    {
        switch (type)
        {
            case 'number'  : return parseInt(field.value, 10)
            case 'date'    : { const [y,m,d]=field.value.split('-').map(Number); return new Date(y,m-1,d) }
            case 'file'    : return field.files?.[0] ?? null
            case 'checkbox': return field.checked
            case 'radio'   : return field.querySelector('input[type="radio"]:checked')?.value ?? null
            case 'relation': { if(!field.value) return null; const n=parseInt(field.value,10); return isNaN(n)?field.value:n }
            default        : return field.value
        }
    }

    _dateToInputValue(date)
    {
        const y = date.getFullYear()
        const m = String(date.getMonth()+1).padStart(2,'0')
        const d = String(date.getDate()).padStart(2,'0')
        return y+'-'+m+'-'+d
    }

    _handleSubmit() { const data = this.extract(); if (data) this._onSubmit?.(data) }

    _showError(name, message)
    {
        const el = this._errorEls.get(name)
        if (!el) return
        el.textContent = message
        el.className   = 'wb_form_error'
    }

    _clearFieldError(name)
    {
        const el = this._errorEls.get(name)
        if (!el) return
        el.textContent = ''
        el.className   = 'wb_form_error wb_form_error--hidden'
    }

    _clearErrors()
    {
        this._errorEls.forEach(el => {
            el.textContent = ''
            el.className   = 'wb_form_error wb_form_error--hidden'
        })
    }
}

export default Form
