// assets/js/ui/workbench/image/ImageDetailPanel.js
// ─────────────────────────────────────────────────────────────────────────────
// Différences vs MotDetailPanel :
//   • show()  affiche plus de champs read-only (filename, dimensions, etc.)
//   • _showForm() dispatch entre ImageCreatePropertySet et ImageEditPropertySet
//   • onSave callback : (id, data) où data = {file?, alt, status}
//     au lieu de (id, lbl)
//   • Pas de preview ici — géré par ImagePreviewPanel (zone right)
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { create, clear, detail } from '/assets/js/core/domhelper.js'
import { toolbar } from '/assets/js/ui/shared/templates/toolbar.template.js'
import { Form }   from '/assets/js/ui/shared/Form.js'
import {
    ImageCreatePropertySet,
    ImageEditPropertySet,
    ImageComputePropertySet,
} from '/assets/js/features/image/image.properties.js'

export class ImageDetailPanel extends PanelBase
{
    constructor(config = {})
    {
        super()

        this.element       = null
        this.bodyEl        = null
        this._feedbackEl   = null

        this._currentImage = null
        this._working      = false
        this._form         = null

        this._onSaveFn   = null
        this._onDeleteFn = null
    }

    // ── API publique ──────────────────────────────────────────────────────────

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
     * Affiche une image en lecture + actions Modifier / Supprimer.
     *
     * @param {object|null} image — {img_id, filename, extension, size_ko, width,
     *                               height, ratio, path, alt, status, …}
     */
    show(image)
    {
        if (!this.bodyEl) return
        this._destroyForm()
        this._hideFeedback()
        clear(this.bodyEl)

        if (!image) { this._showEmpty(); return }

        this._currentImage = { ...image }

        // ── Champs read-only ─────────────────────────────────────────────────
        this.bodyEl.appendChild(
            detail([
                { label: 'ID',         value: image.img_id    },
                { label: 'Fichier',    value: image.filename  },
                { label: 'Extension',  value: image.extension },
                { label: 'Taille',     value: image.size_ko ? `${image.size_ko} ko` : '—' },
                { label: 'Dimensions', value: (image.width && image.height) ? `${image.width} × ${image.height}` : '—' },
                { label: 'Ratio',      value: image.ratio     },
                { label: 'Alt',        value: image.alt       },
                { label: 'Statut',     value: image.status    },
            ])
        )

        // ── Actions ──────────────────────────────────────────────────────────
        const actions = create('div', { class: 'wb_detail_actions' })

        const editBtn = create('button', { type: 'button', class: 'wb-btn', text: 'Modifier' })
        const delBtn  = create('button', { type: 'button', class: 'wb-btn wb-btn--danger', text: 'Supprimer' })

        editBtn.addEventListener('click', () => this._showEditForm(image))
        delBtn.addEventListener('click',  () => this._confirmDelete(image))

        actions.append(editBtn, delBtn)
        this.bodyEl.appendChild(actions)
    }

    /**
     * Formulaire vide pour uploader une nouvelle image (ImageCreatePropertySet).
     */
    showNew()
    {
        if (!this.bodyEl) return
        this._destroyForm()
        this._hideFeedback()
        this._currentImage = null
        clear(this.bodyEl)
        this._showForm({ img_id: null, alt: '', status: 'draft' })
    }

    /**
     * @param {'error'|'success'} type
     * @param {string}            msg
     */
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
        this._currentImage = null
        this._showEmpty()
    }

    destroy()
    {
        this._destroyForm()
        this.element       = null
        this.bodyEl        = null
        this._feedbackEl   = null
        this._currentImage = null
        this._onSaveFn     = null
        this._onDeleteFn   = null
    }

    // ── Callbacks ─────────────────────────────────────────────────────────────

    /**
     * @param {Function} fn  (id: number|null, data: {file?, alt, status}) => void
     */
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
                text  : 'Sélectionnez une image dans la liste.',
            })
        )
    }

    /**
     * Construit le formulaire selon le mode (create vs edit).
     *
     * CREATE : ImageCreatePropertySet — file + alt + status
     * EDIT   : ImageEditPropertySet   — alt + status (file immuable)
     */
    _showForm(image)
    {
        const isNew = !image.img_id

        // ID en lecture seule pour le mode édition
        if (!isNew)
        {
            this.bodyEl.appendChild(detail([{ label: 'ID', value: image.img_id }]))
        }

        this._form = new Form({
            propertySet        : isNew ? ImageCreatePropertySet : ImageEditPropertySet,
            computePropertySet : ImageComputePropertySet,
            labels             : { submit: isNew ? 'Uploader' : 'Enregistrer' },
            onSubmit           : (data) =>
            {
                if (this._working) return
                // data = { file, alt, status } (create) ou { alt, status } (edit)
                this._onSaveFn?.(image.img_id ?? null, data)
            },
            onCancel           : () =>
            {
                if (this._working) return
                this._currentImage ? this.show(this._currentImage) : this.clear()
            },
        })

        this.bodyEl.appendChild(this._form.render())

        isNew ? this._form.reset() : this._form.fill(image)
    }

    _showEditForm(image)
    {
        this._destroyForm()
        clear(this.bodyEl)
        this._showForm(image)
    }

    _confirmDelete(image)
    {
        this._destroyForm()
        clear(this.bodyEl)

        const zone = create('div', { class: 'wb_detail_confirm' })
        zone.appendChild(create('p', {
            class : 'wb_detail_confirm_msg',
            text  : `Supprimer « ${image.filename ?? image.img_id} » ?`,
        }))

        const btnRow     = create('div', { class: 'wb_detail_btn_row' })
        const confirmBtn = create('button', { type: 'button', class: 'wb-btn wb-btn--danger', text: 'Confirmer' })
        const cancelBtn  = create('button', { type: 'button', class: 'wb-btn', text: 'Annuler' })

        confirmBtn.addEventListener('click', () =>
        {
            if (this._working) return
            this._onDeleteFn?.(image.img_id)
        })
        cancelBtn.addEventListener('click', () => this.show(image))

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

    /** Détruit le formulaire actif s'il en existe un. */
    _destroyForm()
    {
        this._form?.destroy()
        this._form = null
    }
}

export default ImageDetailPanel
