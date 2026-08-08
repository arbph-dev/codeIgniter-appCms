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
        this.element = create('section', {
            class: 'wb_mot_detail_panel',
        })

        const header = toolbar({ title: 'Détail' })

        this._feedbackEl = create('div', {
            class : 'wb_detail_feedback wb_detail_feedback--hidden',
        })

        this.bodyEl = create('div', {
            class: 'wb_panel_body',
        })

        this.element.append(
            header,
            this._feedbackEl,
            this.bodyEl
        )

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
        if (!this.bodyEl)
            return

        this._destroyForm()
        this._hideFeedback()
        clear(this.bodyEl)

        if (!adresse)
        {
            this._showEmpty()
            return
        }

        this._currentAdresse = { ...adresse }

        const lignePostale = this._formatVoie(adresse)

        this.bodyEl.appendChild(
            detail([
                {
                    label : 'ID',
                    value : adresse.id,
                },
                {
                    label : 'Voie',
                    value : lignePostale,
                },
                {
                    label : 'Complément',
                    value : adresse.complement,
                },
                {
                    label : 'CP',
                    value : adresse.cp_codepostal,
                },
                {
                    label : 'Ville',
                    value : adresse.cp_commune,
                },
                {
                    label : 'Acheminement',
                    value : adresse.acheminement,
                },
                {
                    label : 'Latitude',
                    value : adresse.latitude ?? '—',
                },
                {
                    label : 'Longitude',
                    value : adresse.longitude ?? '—',
                },
                {
                    label : 'Précision',
                    value : adresse.precision ?? '—',
                },
            ])
        )

        // ── Actions ──────────────────────────────────────────────────────────

        const actions = create('div', {
            class: 'wb_detail_actions',
        })

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

        editBtn.addEventListener(
            'click',
            () => this._showEditForm(adresse)
        )

        delBtn.addEventListener(
            'click',
            () => this._confirmDelete(adresse)
        )

        actions.append(editBtn, delBtn)
        this.bodyEl.appendChild(actions)
    }

    showNew()
    {
        if (!this.bodyEl)
            return

        this._destroyForm()
        this._hideFeedback()

        this._currentAdresse = null

        clear(this.bodyEl)

        this._showForm({ id: null })
    }

    showFeedback(type, msg)
    {
        if (!this._feedbackEl)
            return

        this._feedbackEl.textContent = msg
        this._feedbackEl.className =
            `wb_detail_feedback wb_detail_feedback--${type}`
    }

    lock()
    {
        this._working = true
    }

    unlock()
    {
        this._working = false
    }

    clear()
    {
        if (!this.bodyEl)
            return

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

    /** @param {Function} fn (id: number|null, data: object) => void */
    onSave(fn)
    {
        this._onSaveFn = fn
    }

    onDelete(fn)
    {
        this._onDeleteFn = fn
    }

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
        const isNew = !adresse.id

        if (!isNew)
        {
            this.bodyEl.appendChild(
                detail([
                    {
                        label : 'ID',
                        value : adresse.id,
                    },
                ])
            )
        }

        this._form = new Form({
            propertySet        : AdressePropertySet,
            computePropertySet : AdresseComputePropertySet,

            labels : {
                submit : isNew
                    ? 'Créer'
                    : 'Enregistrer',
            },

            onSubmit : data =>
            {
                if (this._working)
                    return

                this._onSaveFn?.(
                    adresse.id ?? null,
                    data
                )
            },

            onCancel : () =>
            {
                if (this._working)
                    return

                this._currentAdresse
                    ? this.show(this._currentAdresse)
                    : this.clear()
            },
        })

        this.bodyEl.appendChild(
            this._form.render()
        )

        isNew
            ? this._form.reset()
            : this._form.fill(adresse)
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

        const label =
            [this._formatVoie(adresse), adresse.cp_commune]
                .filter(Boolean)
                .join(', ')
            || `#${adresse.id}`

        const zone = create('div', {
            class: 'wb_detail_confirm',
        })

        zone.appendChild(
            create('p', {
                class : 'wb_detail_confirm_msg',
                text  : `Supprimer « ${label} » ?`,
            })
        )

        const btnRow = create('div', {
            class: 'wb_detail_btn_row',
        })

        const confirmBtn = create('button', {
            type  : 'button',
            class : 'wb-btn wb-btn--danger',
            text  : 'Confirmer',
        })

        const cancelBtn = create('button', {
            type  : 'button',
            class : 'wb-btn',
            text  : 'Annuler',
        })

        confirmBtn.addEventListener('click', () =>
        {
            if (this._working)
                return

            this._onDeleteFn?.(adresse.id)
        })

        cancelBtn.addEventListener(
            'click',
            () => this.show(adresse)
        )

        btnRow.append(
            confirmBtn,
            cancelBtn
        )

        zone.appendChild(btnRow)
        this.bodyEl.appendChild(zone)
    }

    /**
     * Construit l'intitulé lisible de la voie à partir
     * des champs normalisés et de la donnée JOIN voietype_nom.
     *
     * Exemples :
     *   12 Bis rue de la République
     *   8 chemin des Fleurs
     *   rue de Bretagne
     */
    _formatVoie(adresse)
    {
        const numero = adresse.voienumero?.toString().trim()
        const nom    = adresse.voienom?.toString().trim()
        const type   = adresse.voietype_nom?.toString().trim()

        const repetitionLabels = {
            B : 'Bis',
            T : 'Ter',
            Q : 'Quater',
            C : 'Quinquies',
        }

        const repetition =
            repetitionLabels[adresse.voierpt] ?? ''

        return [
            numero,
            repetition,
            type,
            nom,
        ]
            .filter(Boolean)
            .join(' ')
    }

    _hideFeedback()
    {
        if (!this._feedbackEl)
            return

        this._feedbackEl.textContent = ''

        this._feedbackEl.className =
            'wb_detail_feedback wb_detail_feedback--hidden'
    }

    _destroyForm()
    {
        this._form?.destroy()
        this._form = null
    }
}

export default AdresseDetailPanel
