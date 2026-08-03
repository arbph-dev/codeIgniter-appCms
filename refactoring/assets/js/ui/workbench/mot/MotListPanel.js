// ============================================================================
// assets/js/ui/workbench/mot/MotListPanel.js
// ============================================================================
//
// Affiche une liste de mots avec recherche et pagination.
//
// Iteration001 : conformité au contrat Panel (Stage 1)
//   - render() crée la structure complète
//   - show(items, pager) affiche la liste
//   - clear() revient à état vide
//   - showLoading() et showError() comme méthodes publiques
//   - destroy() nettoie toutes les ressources
//   - Callbacks onSearch() et onSelect()
//
// Contrat Panel :
//   constructor()
//   render()              → Node racine
//   show(items, pager)    → remplit table + pagination
//   clear()               → empty state
//   destroy()
//
// Callbacks :
//   onSearch(fn)          → (q: string) => void
//   onSelect(fn)          → (row: {mot_id, mot_lbl}) => void
//
// Pagination :
//   La factory pagination() publie sur busEvent 'wb:mot:page'.
//   MotWorkbench souscrit à cet événement et appelle load(page).
// ============================================================================

import { create, clear, table, pagination, notice }
    from '/assets/js/core/domhelper.js'

export class MotListPanel
{
    constructor(config = {})
    {
        this._onSelectFn = null
        this._onSearchFn = null

        this.element  = null
        this.inputEl  = null
        this.tableEl  = null
        this.pagerEl  = null
    }

    // ──────────────────────────────────────────────────────────────────────
    // API Publique
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Crée et retourne l'élément racine du Panel.
     * @returns {HTMLElement}
     */
    render()
    {
        this.element = create('section', { class: 'wb_mot_list_panel' })

        const header = create('header', { class: 'wb_panel_header' })
        header.appendChild(create('h2', { text: 'Words' }))

        // ── Barre de recherche ───────────────────────────────────────────

        const searchBar = create('div', { class: 'wb_mot_search' })

        this.inputEl = create('input', {
            type        : 'search',
            class       : 'wb_mot_search_input',
            placeholder : 'Search a word…',
        })

        const searchBtn = create('button', {
            type  : 'button',
            class : 'wb_mot_search_btn',
            text  : 'Search',
        })

        searchBtn.addEventListener('click', () => this._triggerSearch())
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this._triggerSearch()
        })

        searchBar.append(this.inputEl, searchBtn)

        // ── Zones table + pagination ─────────────────────────────────────

        this.tableEl = create('div', { class: 'wb_mot_table' })
        this.pagerEl = create('div', { class: 'wb_mot_pager' })

        this.element.append(header, searchBar, this.tableEl, this.pagerEl)

        this.clear()

        return this.element
    }

    /**
     * Affiche la liste et la pagination.
     * @param {Array}       items  — [{mot_id, mot_lbl, ...}]
     * @param {Object|null} pager  — objet pager CodeIgniter
     */
    show(items, pager = null)
    {
        clear(this.tableEl)
        clear(this.pagerEl)

        if (!Array.isArray(items) || items.length === 0)
        {
            this._showEmpty()
            return
        }

        this.tableEl.appendChild(
            table({
                id         : 'wbMotTable',
                data       : items,
                columns    : [
                    { key: 'mot_id',  label: 'ID'  },
                    { key: 'mot_lbl', label: 'Word' },
                ],
                attrs      : { class: 'cp_table' },
                onRowClick : (row) => this._onSelectFn?.(row),
            })
        )

        if (pager)
        {
            this.pagerEl.appendChild(
                pagination({
                    pager,
                    busEvent   : 'wb:mot:page',
                    style      : 'compact',
                    maxVisible : 5,
                })
            )
        }
    }

    /**
     * Vide le contenu du Panel.
     */
    clear()
    {
        if (!this.tableEl) return
        clear(this.tableEl)
        clear(this.pagerEl)
        this._showEmpty()
    }

    /**
     * Libère toutes les ressources.
     */
    destroy()
    {
        this._onSelectFn = null
        this._onSearchFn = null

        this.element  = null
        this.inputEl  = null
        this.tableEl  = null
        this.pagerEl  = null
    }

    // ── Helpers pour le Workbench ────────────────────────────────────────────

    /**
     * Affiche l'état de chargement.
     */
    showLoading()
    {
        if (!this.tableEl) return
        clear(this.tableEl)
        clear(this.pagerEl)
        this.tableEl.appendChild(notice('loading'))
    }

    /**
     * Affiche un message d'erreur.
     * @param {string} msg — Message d'erreur
     */
    showError(msg)
    {
        if (!this.tableEl) return
        clear(this.tableEl)
        clear(this.pagerEl)
        this.tableEl.appendChild(notice('error', msg))
    }

    // ──────────────────────────────────────────────────────────────────────
    // Callbacks
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Enregistre le callback de recherche.
     * @param {Function} fn — (q: string) => void
     * @returns {MotListPanel} — chaînable
     */
    onSearch(fn)
    {
        this._onSearchFn = fn
        return this
    }

    /**
     * Enregistre le callback de sélection.
     * @param {Function} fn — (row: {mot_id, mot_lbl}) => void
     * @returns {MotListPanel} — chaînable
     */
    onSelect(fn)
    {
        this._onSelectFn = fn
        return this
    }

    // ──────────────────────────────────────────────────────────────────────
    // Privées
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Affiche l'état vide.
     * @private
     */
    _showEmpty()
    {
        clear(this.tableEl)
        this.tableEl.appendChild(notice('empty'))
    }

    /**
     * Déclenche la recherche.
     * @private
     */
    _triggerSearch()
    {
        this._onSearchFn?.(this.inputEl?.value.trim() ?? '')
    }
}

export default MotListPanel
