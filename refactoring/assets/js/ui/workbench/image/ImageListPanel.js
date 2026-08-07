// assets/js/ui/workbench/image/ImageListPanel.js
// ─────────────────────────────────────────────────────────────────────────────
// Grille de vignettes — diffère de MotListPanel (table texte → grid images).
//
// API publique :
//   render()         → HTMLElement
//   show(items, pager)
//   clear()
//   showLoading()
//   showError(msg)
//   onSearch(fn)
//   onSelect(fn)
//   onNew(fn)
//   destroy()
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { create, clear, pagination, notice } from '/assets/js/core/domhelper.js'
import { toolbar } from '/assets/js/ui/shared/templates/toolbar.template.js'

export class ImageListPanel extends PanelBase
{
    constructor()
    {
        super()

        this._onSelectFn = null
        this._onSearchFn = null
        this._onNewFn    = null

        this.element     = null
        this.inputEl     = null
        this.gridEl      = null
        this.pagerEl     = null

        this._selectedId = null   // img_id de la carte active
    }

    // ── API publique ──────────────────────────────────────────────────────────

    render()
    {
        this.element = create('section', { class: 'wb_image_list_panel' })

        const header = toolbar({
            title  : 'Images',
            action : {
                label   : ' Nouveau',
                css     : 'wb-btn wb_mot_new_btn',
                onClick : () => this._onNewFn?.(),
            },
        })

        // Barre de recherche (même structure que MotListPanel)
        const searchBar = create('div', { class: 'wb_mot_search' })
        this.inputEl = create('input', {
            type        : 'search',
            class       : 'wb_mot_search_input',
            placeholder : 'Rechercher une image…',
        })
        const searchBtn = create('button', {
            type  : 'button',
            class : 'wb_mot_search_btn',
            text  : 'Rechercher',
        })
        searchBtn.addEventListener('click', () => this._triggerSearch())
        this.inputEl.addEventListener('keydown', e =>
        {
            if (e.key === 'Enter') this._triggerSearch()
        })
        searchBar.append(this.inputEl, searchBtn)

        // Grille + pagination
        this.gridEl  = create('div', { class: 'wb_image_grid' })
        this.pagerEl = create('div', { class: 'wb_mot_pager' })

        this.element.append(header, searchBar, this.gridEl, this.pagerEl)

        this.clear()
        return this.element
    }

    /**
     * Affiche les images en grille.
     *
     * @param {Object[]}    items  — [{img_id, filename, path, alt, status, …}]
     * @param {object|null} pager  — {currentPage, pageCount}
     */
    show(items, pager = null)
    {
        clear(this.gridEl)
        clear(this.pagerEl)

        if (!items?.length)
        {
            this.gridEl.appendChild(notice('empty'))
            return
        }

        items.forEach(image =>
        {
            const card = create('div', { class: 'wb_image_card' })

            if (image.img_id === this._selectedId)
            {
                card.classList.add('selected')
            }

            // ── Vignette ─────────────────────────────────────────────────────
            const thumb = create('div', { class: 'wb_image_thumb' })

            if (image.path)
            {
                const img = create('img', {
                    src   : image.path,
                    alt   : image.alt ?? '',
                    class : 'wb_image_thumb_img',
                })
                // Évite un layout shift si l'image met du temps à charger
                img.loading = 'lazy'
                thumb.appendChild(img)
            }
            else
            {
                thumb.appendChild(
                    create('span', { class: 'wb_image_no_thumb', text: '🖼' })
                )
            }

            // ── Méta ─────────────────────────────────────────────────────────
            const info = create('div', { class: 'wb_image_card_info' })
            info.appendChild(create('div', {
                class : 'wb_image_card_name',
                text  : image.filename ?? `#${image.img_id}`,
            }))
            info.appendChild(create('div', {
                class : 'wb_image_card_meta',
                text  : image.status ?? '',
            }))

            card.append(thumb, info)
            card.addEventListener('click', () =>
            {
                this._selectedId = image.img_id
                this._highlight(card)
                this._onSelectFn?.(image)
            })

            this.gridEl.appendChild(card)
        })

        if (pager)
        {
            this.pagerEl.appendChild(
                pagination({
                    pager,
                    busEvent   : 'wb:image:page',
                    style      : 'compact',
                    maxVisible : 5,
                })
            )
        }
    }

    clear()
    {
        if (!this.gridEl) return
        clear(this.gridEl)
        clear(this.pagerEl)
        this._selectedId = null
        this.gridEl.appendChild(notice('empty'))
    }

    showLoading()
    {
        if (!this.gridEl) return
        clear(this.gridEl)
        clear(this.pagerEl)
        this.gridEl.appendChild(notice('loading'))
    }

    showError(msg)
    {
        if (!this.gridEl) return
        clear(this.gridEl)
        clear(this.pagerEl)
        this.gridEl.appendChild(notice('error', msg))
    }

    destroy()
    {
        this._onSelectFn = null
        this._onSearchFn = null
        this._onNewFn    = null
        this.element     = null
        this.inputEl     = null
        this.gridEl      = null
        this.pagerEl     = null
    }

    // ── Callbacks ─────────────────────────────────────────────────────────────

    onSearch(fn) { this._onSearchFn = fn }
    onSelect(fn) { this._onSelectFn = fn }
    onNew(fn)    { this._onNewFn    = fn }

    // ── Privées ───────────────────────────────────────────────────────────────

    _triggerSearch()
    {
        this._onSearchFn?.(this.inputEl?.value.trim() ?? '')
    }

    /** Retire la surbrillance de toutes les cartes et l'applique à la carte active. */
    _highlight(activeCard)
    {
        if (!this.gridEl) return
        this.gridEl
            .querySelectorAll('.wb_image_card')
            .forEach(c => c.classList.remove('selected'))
        activeCard.classList.add('selected')
    }
}

export default ImageListPanel
