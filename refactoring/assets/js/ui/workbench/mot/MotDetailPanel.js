// assets/js/ui/workbench/mot/MotDetailPanel.js
import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js' // <- ajout
import { create, clear, detail } from '/assets/js/core/domhelper.js'

export class MotDetailPanel extends PanelBase // <- ajout
{
    constructor(config = {})
    {
        super() // <- ajout

        this.element     = null
        this.bodyEl      = null
        this._feedbackEl = null

        this._currentMot = null     // snapshot du mot affiché
        this._working    = false    // verrou anti double-submit

        this._onSaveFn   = null
        this._onDeleteFn = null
    }

    // ── API publique ──────────────────────────────────────────────────────────

    render()
    {
        this.element = create('section', { class: 'wb_mot_detail_panel' })

        const header = create('header', { class: 'wb_panel_header' })
        header.appendChild(create('h2', { text: 'Détail' }))

        // Zone feedback : persiste au-dessus du body, indépendante de son contenu
        this._feedbackEl = create('div', {
            class : 'wb_detail_feedback wb_detail_feedback--hidden',
        })

        this.bodyEl = create('div', { class: 'wb_panel_body' })

        this.element.append(header, this._feedbackEl, this.bodyEl)

        this.clear()
        return this.element
    }

    /**
     * Affiche un mot en lecture + actions Modifier / Supprimer.
     * @param {Object|null} mot  — {mot_id, mot_lbl, …}
     */
    show(mot)
    {
        if (!this.bodyEl) return
        this._hideFeedback()
        clear(this.bodyEl)

        if (!mot) { this._showEmpty(); return }

        this._currentMot = { ...mot }

        // ── Détail ──────────────────────────────────────────────────────────
        this.bodyEl.appendChild(
            detail([
                { label : 'ID',  value : mot.mot_id  },
                { label : 'Mot', value : mot.mot_lbl },
            ])
        )

        // ── Actions ─────────────────────────────────────────────────────────
        const actions = create('div', { class: 'wb_detail_actions' })

        const editBtn = create('button', {
            type  : 'button',
            class : 'wb-btn',
            text  : 'Modifier',
        })
        const delBtn = create('button', {
            type  : 'button',
            class : 'wb-btn wb-btn--danger',
            text  : 'Supprimer',
        })

        editBtn.addEventListener('click', () => this._showEditForm(mot))
        delBtn.addEventListener('click',  () => this._confirmDelete(mot))

        actions.append(editBtn, delBtn)
        this.bodyEl.appendChild(actions)
    }

    /**
     * Formulaire vide pour créer un nouveau mot.
     */
    showNew()
    {
        if (!this.bodyEl) return
        this._hideFeedback()
        this._currentMot = null
        clear(this.bodyEl)
        this._showForm({ mot_id: null, mot_lbl: '' })
    }

    /**
     * Affiche un message de retour (error | success) sans toucher au body.
     * @param {'error'|'success'} type
     * @param {string}            msg
     */
    showFeedback(type, msg)
    {
        if (!this._feedbackEl) return
        this._feedbackEl.textContent = msg
        this._feedbackEl.className   = `wb_detail_feedback wb_detail_feedback--${type}`
    }

    /**
     * Verrou — empêche les doubles soumissions pendant une opération async.
     * Appelé par MotWorkbench avant l'appel API.
     */
    lock()   { this._working = true  }
    unlock() { this._working = false }

    clear()
    {
        if (!this.bodyEl) return
        this._hideFeedback()
        this._currentMot = null
        this._showEmpty()
    }

    destroy()
    {
        this.element     = null
        this.bodyEl      = null
        this._feedbackEl = null
        this._currentMot = null
        this._onSaveFn   = null
        this._onDeleteFn = null
    }

    // ── Callbacks ─────────────────────────────────────────────────────────────

    /** @param {Function} fn  (id: number|null, lbl: string) => void */
    onSave(fn)   { this._onSaveFn   = fn }

    /** @param {Function} fn  (id: number) => void */
    onDelete(fn) { this._onDeleteFn = fn }

    // ── Privées ───────────────────────────────────────────────────────────────

    _showEmpty()
    {
        clear(this.bodyEl)
        this.bodyEl.appendChild(
            create('p', {
                class : 'wb-empty',
                text  : 'Sélectionnez un mot dans la liste.',
            })
        )
    }

    /**
     * Formulaire partagé create / edit.
     * @param {{ mot_id: number|null, mot_lbl: string }} mot
     * @private
     */
    _showForm(mot)
    {
        const isNew = !mot.mot_id

        const form = create('div', { class: 'wb_detail_form' })

        // ID en lecture seule si édition
        if (!isNew)
        {
            form.appendChild(detail([{ label: 'ID', value: mot.mot_id }]))
        }

        form.appendChild(
            create('label', {
                class : 'wb_detail_label',
                text  : isNew ? 'Nouveau mot' : 'Libellé',
            })
        )

        const input = create('input', {
            type        : 'text',
            class       : 'wb_detail_input',
            placeholder : 'Libellé du mot…',
        })
        input.value = mot.mot_lbl ?? ''

        const btnRow   = create('div', { class: 'wb_detail_btn_row' })
        const saveBtn  = create('button', {
            type  : 'button',
            class : 'wb-btn wb-btn--active',
            text  : isNew ? 'Créer' : 'Enregistrer',
        })
        const cancelBtn = create('button', {
            type  : 'button',
            class : 'wb-btn',
            text  : 'Annuler',
        })

        saveBtn.addEventListener('click', () =>
        {
            if (this._working) return
            const lbl = input.value.trim()
            if (!lbl) { input.focus(); return }
            this._onSaveFn?.(mot.mot_id ?? null, lbl)
        })

        cancelBtn.addEventListener('click', () =>
        {
            if (this._working) return
            this._currentMot ? this.show(this._currentMot) : this.clear()
        })

        input.addEventListener('keydown', (e) =>
        {
            if (e.key === 'Enter')  saveBtn.click()
            if (e.key === 'Escape') cancelBtn.click()
        })

        btnRow.append(saveBtn, cancelBtn)
        form.append(input, btnRow)
        this.bodyEl.appendChild(form)
        input.focus()
        if (mot.mot_lbl) input.select()
    }

    /** Passe en mode formulaire d'édition. */
    _showEditForm(mot)
    {
        clear(this.bodyEl)
        this._showForm(mot)
    }

    /** Affiche la demande de confirmation avant suppression. */
    _confirmDelete(mot)
    {
        clear(this.bodyEl)

        const zone = create('div', { class: 'wb_detail_confirm' })

        zone.appendChild(
            create('p', {
                class : 'wb_detail_confirm_msg',
                text  : `Supprimer « ${mot.mot_lbl} » ?`,
            })
        )

        const btnRow     = create('div', { class: 'wb_detail_btn_row' })
        const confirmBtn = create('button', {
            type  : 'button',
            class : 'wb-btn wb-btn--danger',
            text  : 'Confirmer',
        })
        const cancelBtn  = create('button', {
            type  : 'button',
            class : 'wb-btn',
            text  : 'Annuler',
        })

        confirmBtn.addEventListener('click', () =>
        {
            if (this._working) return
            this._onDeleteFn?.(mot.mot_id)
        })
        cancelBtn.addEventListener('click', () => this.show(mot))

        btnRow.append(confirmBtn, cancelBtn)
        zone.appendChild(btnRow)
        this.bodyEl.appendChild(zone)
    }

    _hideFeedback()
    {
        if (!this._feedbackEl) return
        this._feedbackEl.textContent = ''
        this._feedbackEl.className   = 'wb_detail_feedback wb_detail_feedback--hidden'
    }
}

export default MotDetailPanel
