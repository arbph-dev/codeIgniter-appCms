// assets/js/ui/workbench/imagetagger/TaggerPanel.js
// ─────────────────────────────────────────────────────────────────────────────
// Gestion des mots-tags d'une image.
// Mises à jour optimistes : chip ajouté/retiré immédiatement,
// revert sur erreur API (géré par le Workbench via addMot/removeMot).
//
// API publique :
//   render()                    → HTMLElement
//   show(image, mots)           → affiche image info + chips
//   clear()
//   addMot(mot)                 → ajoute chip (optimiste ou confirm)
//   removeMot(motId)            → retire chip (optimiste ou revert)
//   getMotCount()               → number (pour badge liste)
//   showFeedback(type, msg)
//   onAttach(fn)                fn(imageId, motId, motObj)
//   onDetach(fn)                fn(imageId, motId, motObj)
//   destroy()
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { create, clear, detail } from '/assets/js/core/domhelper.js'
import { toolbar }               from '/assets/js/ui/shared/templates/toolbar.template.js'
import { fetchMotLike }          from '/assets/js/features/mot/mot.service.js'

export class TaggerPanel extends PanelBase
{
    constructor()
    {
        super()

        this.element      = null
        this.bodyEl       = null
        this._feedbackEl  = null
        this._chipsEl     = null
        this._inputEl     = null
        this._suggestEl   = null

        this._imageId     = null
        this._mots        = new Map()   // mot_id (number) → {mot_id, mot_lbl}

        this._onAttachFn  = null
        this._onDetachFn  = null
        this._timer       = null
    }

    // ── Rendu ─────────────────────────────────────────────────────────────────

    render()
    {
        this.element = create('section', { class: 'wb_mot_detail_panel' })

        const header = toolbar({ title: 'Tags' })

        this._feedbackEl = create('div', {
            class : 'wb_detail_feedback wb_detail_feedback--hidden',
        })

        this.bodyEl = create('div', { class: 'wb_panel_body' })

        this.element.append(header, this._feedbackEl, this.bodyEl)
        this.clear()
        return this.element
    }

    // ── API publique ──────────────────────────────────────────────────────────

    show(image, mots = [])
    {
        if (!this.bodyEl) return
        this._hideFeedback()
        this._imageId = image.id
        this._mots.clear()
        mots.forEach(m => this._mots.set(Number(m.mot_id), m))

        clear(this.bodyEl)
        this._buildInfoSection(image)
        this._buildChipsSection()
        this._buildAutocomplete()
    }

    clear()
    {
        if (!this.bodyEl) return
        this._hideFeedback()
        this._imageId = null
        this._mots.clear()
        this._chipsEl  = null
        this._inputEl  = null
        this._suggestEl = null
        clear(this.bodyEl)
        this.bodyEl.appendChild(
            create('p', { class: 'wb-empty', text: 'Sélectionnez une image.' })
        )
    }

    /** Ajoute un mot (optimiste ou confirmation après succès API). */
    addMot(mot)
    {
        this._mots.set(Number(mot.mot_id), mot)
        this._renderChips()
    }

    /** Retire un mot (optimiste ou revert après erreur API). */
    removeMot(motId)
    {
        this._mots.delete(Number(motId))
        this._renderChips()
    }

    getMotCount() { return this._mots.size }

    showFeedback(type, msg)
    {
        if (!this._feedbackEl) return
        this._feedbackEl.textContent = msg
        this._feedbackEl.className   = `wb_detail_feedback wb_detail_feedback--${type}`
        if (type === 'success')
            setTimeout(() => this._hideFeedback(), 2500)
    }

    onAttach(fn) { this._onAttachFn = fn }
    onDetach(fn) { this._onDetachFn = fn }

    destroy()
    {
        clearTimeout(this._timer)
        this._onAttachFn = null
        this._onDetachFn = null
        this.element     = null
        this.bodyEl      = null
        this._feedbackEl = null
        this._chipsEl    = null
        this._inputEl    = null
        this._suggestEl  = null
        this._mots.clear()
    }

    // ── Construction DOM ──────────────────────────────────────────────────────

    _buildInfoSection(image)
    {
        this.bodyEl.appendChild(
            detail([
                { label: 'Fichier',    value: image.filename  },
                { label: 'Statut',     value: image.status    },
                { label: 'Dimensions', value: image.width && image.height
                    ? `${image.width} × ${image.height}`
                    : '—'
                },
            ])
        )
    }

    _buildChipsSection()
    {
        const section = create('div', { class: 'wb_tagger_chips_section' })
        section.appendChild(create('div', { class: 'wb_detail_label', text: 'Tags actuels' }))

        this._chipsEl = create('div', { class: 'wb_tagger_chips' })
        section.appendChild(this._chipsEl)
        this.bodyEl.appendChild(section)

        this._renderChips()
    }

    _buildAutocomplete()
    {
        const section = create('div', { class: 'wb_tagger_add_section' })
        section.appendChild(create('div', { class: 'wb_detail_label', text: 'Ajouter un tag' }))

        const wrapper = create('div', { class: 'wb_tagger_input_wrapper' })

        this._inputEl = create('input', {
            type        : 'text',
            class       : 'wb_detail_input wb_tagger_input',
            placeholder : 'Saisir un mot…',
            autocomplete: 'off',
        })

        this._suggestEl = create('ul', { class: 'wb_tagger_suggestions' })
        this._suggestEl.style.display = 'none'

        this._inputEl.addEventListener('input',  () => this._handleInput())
        this._inputEl.addEventListener('blur',   () =>
            setTimeout(() => this._hideSuggestions(), 150)
        )
        this._inputEl.addEventListener('keydown', (e) =>
        {
            if (e.key === 'Escape') { this._hideSuggestions(); this._inputEl.value = '' }
        })

        wrapper.append(this._inputEl, this._suggestEl)
        section.appendChild(wrapper)
        this.bodyEl.appendChild(section)
    }

    // ── Chips ─────────────────────────────────────────────────────────────────

    _renderChips()
    {
        if (!this._chipsEl) return
        clear(this._chipsEl)

        if (this._mots.size === 0)
        {
            this._chipsEl.appendChild(
                create('span', { class: 'wb_tagger_empty', text: 'Aucun tag pour l\'instant.' })
            )
            return
        }

        const sorted = [...this._mots.values()]
            .sort((a, b) => a.mot_lbl.localeCompare(b.mot_lbl, 'fr'))

        sorted.forEach(mot => this._chipsEl.appendChild(this._makeChip(mot)))
    }

    _makeChip(mot)
    {
        const chip = create('span', { class: 'wb_chip' })

        chip.appendChild(create('span', { class: 'wb_chip_label', text: mot.mot_lbl }))

        const btn = create('button', {
            type        : 'button',
            class       : 'wb_chip_remove',
            'aria-label': `Retirer ${mot.mot_lbl}`,
            text        : '×',
        })
        btn.addEventListener('click', () =>
        {
            // Mise à jour optimiste — revert si erreur (géré par Workbench)
            this.removeMot(Number(mot.mot_id))
            this._onDetachFn?.(this._imageId, Number(mot.mot_id), mot)
        })

        chip.appendChild(btn)
        return chip
    }

    // ── Autocomplete ──────────────────────────────────────────────────────────

    _handleInput()
    {
        const q = this._inputEl?.value.trim() ?? ''
        clearTimeout(this._timer)

        if (q.length < 1)
        {
            this._hideSuggestions()
            return
        }

        this._timer = setTimeout(() => this._suggest(q), 250)
    }

    async _suggest(q)
    {
        try
        {
            const items    = await fetchMotLike({ q, len: 8 })
            const filtered = items.filter(item => !this._mots.has(Number(item.mot_id)))
            this._showSuggestions(filtered)
        }
        catch { this._hideSuggestions() }
    }

    _showSuggestions(items)
    {
        if (!this._suggestEl) return
        clear(this._suggestEl)

        if (!items.length)
        {
            this._hideSuggestions()
            return
        }

        items.forEach(item =>
        {
            const li = create('li', { class: 'wb_suggest_item', text: item.mot_lbl })

            li.addEventListener('mousedown', (e) =>
            {
                e.preventDefault()   // évite le blur de l'input avant le click

                // Mise à jour optimiste — revert si erreur (géré par Workbench)
                this.addMot(item)
                this._onAttachFn?.(this._imageId, Number(item.mot_id), item)
                this._hideSuggestions()
                if (this._inputEl) this._inputEl.value = ''
            })

            this._suggestEl.appendChild(li)
        })

        this._suggestEl.style.display = ''
    }

    _hideSuggestions()
    {
        if (!this._suggestEl) return
        this._suggestEl.style.display = 'none'
        clear(this._suggestEl)
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    _hideFeedback()
    {
        if (!this._feedbackEl) return
        this._feedbackEl.textContent = ''
        this._feedbackEl.className   = 'wb_detail_feedback wb_detail_feedback--hidden'
    }
}

export default TaggerPanel
