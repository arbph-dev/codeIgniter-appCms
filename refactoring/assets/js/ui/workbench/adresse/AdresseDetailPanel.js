// assets/js/ui/workbench/adresse/AdresseDetailPanel.js

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { create, clear, detail } from '/assets/js/core/domhelper.js'
import { toolbar } from '/assets/js/ui/shared/templates/toolbar.template.js'
import { Form }    from '/assets/js/ui/shared/Form.js'
import {
    AdressePropertySet,
    AdresseComputePropertySet,
} from '/assets/js/features/adresse/adresse.properties.js'

export class AdresseDetailPanel extends PanelBase
{
    constructor(config = {})
    {
        super()

        this.element          = null
        this.bodyEl           = null
        this._feedbackEl      = null

        this._currentAdresse  = null
        this._working         = false
        this._form            = null

        this._onSaveFn        = null
        this._onDeleteFn      = null
    }

    render()
    {
        this.element = create('section', { class: 'wb_mot_detail_panel' })

        const header = toolbar({ title: 'Détail' })

        this._feedbackEl = create('div', {
            class : 'wb_detail_feedback wb_detail_feedback--hidden',
        })

        this.bodyEl = create('div', { class: 'wb_panel_body' })

        this.element.append(header, this._feedbackEl, this.bodyEl)

        this.clear()
        return this.element
    }

    /**
     * Affiche une adresse en lecture + actions Modifier / Supprimer.
     *
     * @param {object|null} adresse
     */
    show(adresse)
    {
        if (!this.bodyEl) return
        this._destroyForm()
        this._hideFeedback()
        clear(this.bodyEl)

        if (!adresse) { this._showEmpty(); return }

        this._currentAdresse = { ...adresse }

        // ── Ligne postale formatée ────────────────────────────────────────────
        const lignePostale = [adresse.adr_rue, adresse.adr_complement]
            .filter(Boolean).join(', ')

        this.bodyEl.appendChild(
            detail([
                { label: 'ID',          value: adresse.adr_id          },
                { label: 'Voie',        value: lignePostale            },
                { label: 'CP',          value: adresse.adr_cp          },
                { label: 'Ville',       value: adresse.adr_ville       },
                { label: 'Pays',        value: adresse.adr_pays        },
                { label: 'Latitude',    value: adresse.adr_lat ?? '—'  },
                { label: 'Longitude',   value: adresse.adr_lng ?? '—'  },
            ])
        )

        // ── Actions ──────────────────────────────────────────────────────────
        const actions = create('div', { class: 'wb_detail_actions' })

        const editBtn = create('button', { type: 'button', class: 'wb-btn', text: 'Modifier' })
        const delBtn  = create('button', { type: 'button', class: 'wb-btn wb-btn--danger', text: 'Supprimer' })

        editBtn.addEventListener('click', () => this._showEditForm(adresse))
        delBtn.addEventListener('click',  () => this._confirmDelete(adresse))

        actions.append(editBtn, delBtn)
        this.bodyEl.appendChild(actions)
    }

    showNew()
    {
        if (!this.bodyEl) return
        this._destroyForm()
        this._hideFeedback()
        this._currentAdresse = null
        clear(this.bodyEl)
        this._showForm({ adr_id: null })
    }

    showFeedback(type, msg)
    {
        if (!this._feedbackEl) return
        this._feedbackEl.textContent = msg
        this._feedbackEl.className   = `wb_detail_feedback wb_detail_feedback--${type}`
    }

    lock()   { this._working = true  }
    unlock() { this._working = false }

    clear()
    {
        if (!this.bodyEl) return
        this._destroyForm()
        this._hideFeedback()
        this._currentAdresse = null
        this._showEmpty()
    }

    destroy()
    {
        this._destroyForm()
        this.element         = null
        this.bodyEl          = null
        this._feedbackEl     = null
        this._currentAdresse = null
        this._onSaveFn       = null
        this._onDeleteFn     = null
    }

    // ── Callbacks ─────────────────────────────────────────────────────────────

    /** @param {Function} fn  (id: number|null, data: object) => void */
    onSave(fn)   { this._onSaveFn   = fn }
    onDelete(fn) { this._onDeleteFn = fn }

    // ── Privées ───────────────────────────────────────────────────────────────

    _showEmpty()
    {
        clear(this.bodyEl)
        this.bodyEl.appendChild(
            create('p', {
                class : 'wb-empty',
                text  : 'Sélectionnez une adresse dans la liste.',
            })
        )
    }

    _showForm(adresse)
    {
        const isNew = !adresse.adr_id

        if (!isNew)
        {
            this.bodyEl.appendChild(detail([{ label: 'ID', value: adresse.adr_id }]))
        }

        this._form = new Form({
            propertySet        : AdressePropertySet,
            computePropertySet : AdresseComputePropertySet,
            labels             : { submit: isNew ? 'Créer' : 'Enregistrer' },
            onSubmit           : (data) =>
            {
                if (this._working) return
                this._onSaveFn?.(adresse.adr_id ?? null, data)
            },
            onCancel           : () =>
            {
                if (this._working) return
                this._currentAdresse ? this.show(this._currentAdresse) : this.clear()
            },
        })

        this.bodyEl.appendChild(this._form.render())
        isNew ? this._form.reset() : this._form.fill(adresse)
    }

    _showEditForm(adresse)
    {
        this._destroyForm()
        clear(this.bodyEl)
        this._showForm(adresse)
    }

    _confirmDelete(adresse)
    {
        this._destroyForm()
        clear(this.bodyEl)

        const label = [adresse.adr_rue, adresse.adr_ville].filter(Boolean).join(', ')
            || `#${adresse.adr_id}`

        const zone = create('div', { class: 'wb_detail_confirm' })
        zone.appendChild(create('p', {
            class : 'wb_detail_confirm_msg',
            text  : `Supprimer « ${label} » ?`,
        }))

        const btnRow     = create('div', { class: 'wb_detail_btn_row' })
        const confirmBtn = create('button', { type: 'button', class: 'wb-btn wb-btn--danger', text: 'Confirmer' })
        const cancelBtn  = create('button', { type: 'button', class: 'wb-btn', text: 'Annuler' })

        confirmBtn.addEventListener('click', () =>
        {
            if (this._working) return
            this._onDeleteFn?.(adresse.adr_id)
        })
        cancelBtn.addEventListener('click', () => this.show(adresse))

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

    _destroyForm()
    {
        this._form?.destroy()
        this._form = null
    }
}

export default AdresseDetailPanel
