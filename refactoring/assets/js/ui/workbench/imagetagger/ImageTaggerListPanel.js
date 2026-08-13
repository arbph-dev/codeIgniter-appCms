// assets/js/ui/workbench/imagetagger/ImageTaggerListPanel.js
// ─────────────────────────────────────────────────────────────────────────────
// Grille d'images avec :
//   - badge mot count par image (depuis mot_ids fourni par include=mot_ids)
//   - filtre statut (pending | validated | rejected)
//   - updateMotCount(imageId, count) — mise à jour badge sans rechargement
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { create, clear, pagination, notice } from '/assets/js/core/domhelper.js'
import { toolbar } from '/assets/js/ui/shared/templates/toolbar.template.js'

const STATUS_OPTIONS = [
    { value: '',          label: 'Tous'        },
    { value: 'pending',   label: 'En attente'  },
    { value: 'validated', label: 'Validée'     },
    { value: 'rejected',  label: 'Rejetée'     },
]

export class ImageTaggerListPanel extends PanelBase
{
    constructor()
    {
        super()
        this._onSearchFn = null   // fn({ q, status })
        this._onSelectFn = null
        this._onPageFn   = null

        this.element    = null
        this.inputEl    = null
        this.statusEl   = null
        this.gridEl     = null
        this.pagerEl    = null

        this._selectedId = null
        // Map imageId → badgeEl pour mise à jour en place
        this._badges     = new Map()
    }

    render()
    {
        this.element = create('section', { class: 'wb_image_list_panel' })

        const header = toolbar({ title: 'Images' })

        // ── Barre de recherche + filtre statut ────────────────────────────────
        const searchBar = create('div', { class: 'wb_mot_search' })

        this.inputEl = create('input', {
            type        : 'search',
            class       : 'wb_mot_search_input',
            placeholder : 'Rechercher…',
        })

        this.statusEl = create('select', { class: 'wb_tagger_status_select' })
        STATUS_OPTIONS.forEach(({ value, label }) =>
            this.statusEl.appendChild(create('option', { value, text: label }))
        )

        const searchBtn = create('button', { type: 'button', class: 'wb_mot_search_btn', text: 'OK' })

        const trigger = () => this._onSearchFn?.({
            q      : this.inputEl.value.trim(),
            status : this.statusEl.value,
        })

        searchBtn.addEventListener('click', trigger)
        this.inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') trigger() })
        this.statusEl.addEventListener('change', trigger)

        searchBar.append(this.inputEl, this.statusEl, searchBtn)

        this.gridEl  = create('div', { class: 'wb_image_grid' })
        this.pagerEl = create('div', { class: 'wb_mot_pager' })

        this.element.append(header, searchBar, this.gridEl, this.pagerEl)
        this.clear()
        return this.element
    }

    show(items, pager = null)
    {
        clear(this.gridEl)
        clear(this.pagerEl)
        this._badges.clear()

        if (!items?.length) { this.gridEl.appendChild(notice('empty')); return }

        items.forEach(image =>
        {
            const card = create('div', { class: 'wb_image_card' })
            if (String(image.id) === String(this._selectedId))
                card.classList.add('selected')

            // Vignette
            const thumb = create('div', { class: 'wb_image_thumb' })
            if (image.path)
            {
                const img = create('img', { src: image.path, alt: image.alt ?? '', class: 'wb_image_thumb_img' })
                img.loading = 'lazy'
                thumb.appendChild(img)
            }
            else
            {
                thumb.appendChild(create('span', { class: 'wb_image_no_thumb', text: '🖼' }))
            }

            // Badge mot count
            const motCount = Array.isArray(image.mot_ids) ? image.mot_ids.length : 0
            const badge    = create('span', {
                class : motCount > 0 ? 'wb_image_badge wb_image_badge--tagged' : 'wb_image_badge',
                text  : String(motCount),
            })
            thumb.appendChild(badge)
            this._badges.set(String(image.id), badge)

            // Méta
            const info = create('div', { class: 'wb_image_card_info' })
            info.appendChild(create('div', { class: 'wb_image_card_name', text: image.filename ?? `#${image.id}` }))
            info.appendChild(create('div', { class: 'wb_image_card_meta', text: image.status ?? '' }))

            card.append(thumb, info)
            card.addEventListener('click', () =>
            {
                this._selectedId = image.id
                this._highlight(card)
                this._onSelectFn?.(image)
            })

            this.gridEl.appendChild(card)
        })

        if (pager)
        {
            this.pagerEl.appendChild(
                pagination({ pager, busEvent: 'wb:tagger:page', style: 'compact', maxVisible: 5 })
            )
        }
    }

    /**
     * Met à jour le badge d'une image sans recharger la grille.
     * Appelé après chaque attach / detach réussi.
     */
    updateMotCount(imageId, count)
    {
        const badge = this._badges.get(String(imageId))
        if (!badge) return
        badge.textContent = String(count)
        badge.className   = count > 0
            ? 'wb_image_badge wb_image_badge--tagged'
            : 'wb_image_badge'
    }

    clear()
    {
        if (!this.gridEl) return
        clear(this.gridEl)
        clear(this.pagerEl)
        this._badges.clear()
        this._selectedId = null
        this.gridEl.appendChild(notice('empty'))
    }

    showLoading()  { if (!this.gridEl) return; clear(this.gridEl); clear(this.pagerEl); this.gridEl.appendChild(notice('loading')) }
    showError(msg) { if (!this.gridEl) return; clear(this.gridEl); clear(this.pagerEl); this.gridEl.appendChild(notice('error', msg)) }

    destroy()
    {
        this._onSearchFn = null; this._onSelectFn = null; this._onPageFn = null
        this.element = null; this.inputEl = null; this.statusEl = null
        this.gridEl = null; this.pagerEl = null
        this._badges.clear()
    }

    onSearch(fn) { this._onSearchFn = fn }
    onSelect(fn) { this._onSelectFn = fn }
    onPage(fn)   { this._onPageFn   = fn }

    _highlight(activeCard)
    {
        if (!this.gridEl) return
        this.gridEl.querySelectorAll('.wb_image_card').forEach(c => c.classList.remove('selected'))
        activeCard.classList.add('selected')
    }
}

export default ImageTaggerListPanel
