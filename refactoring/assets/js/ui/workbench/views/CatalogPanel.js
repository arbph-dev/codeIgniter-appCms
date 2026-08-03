// ============================================================================
// assets/js/ui/workbench/views/CatalogPanel.js
// ============================================================================
//
// Catalogue de composants avec filtrage et tri.
//
// Iteration001 : conformité au contrat Panel (Stage 1)
//   - Ajout de destroy()
//   - render() initialise la structure complète
//   - show(items) remplace la logique existante
//   - clear() revient à état vide
//   - Callbacks onSelect() avec safe navigation
//   - Méthode refresh() renommée en _refresh() (privée)
//
// ============================================================================

import { create, clear } from '/assets/js/core/domhelper.js';

export class CatalogPanel
{
    constructor(config = {})
    {
        this.items    = [];
        this.filter   = '';
        this.sortBy   = 'title';

        this._onSelectFn = null;

        this.element  = null;
        this.listEl   = null;
        this.infoEl   = null;
        this.searchEl = null;
        this.sortEl   = null;
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
        this.element = create('div', {
            class: 'wb_catalog'
        });

        // ── Toolbar ──────────────────────────────────────────────────────

        const toolbar = create('div', {
            class: 'wb_catalog_toolbar'
        });

        this.searchEl = create('input', {
            class       : 'wb_catalog_search',
            type        : 'search',
            placeholder : 'Rechercher...'
        });

        this.searchEl.addEventListener('input', () => {
            this.filter = this.searchEl.value.toLowerCase();
            this._refresh();
        });

        this.sortEl = create('select', {
            class: 'wb_catalog_sort'
        });

        [
            ['title',       'Nom'],
            ['category',    'Catégorie'],
            ['type',        'Type']
        ].forEach(([value, label]) => {
            const option = create('option', { value, text: label });
            this.sortEl.appendChild(option);
        });

        this.sortEl.addEventListener('change', () => {
            this.sortBy = this.sortEl.value;
            this._refresh();
        });

        toolbar.append(this.searchEl, this.sortEl);

        // ── Liste ────────────────────────────────────────────────────────

        this.listEl = create('div', {
            class: 'wb_catalog_list'
        });

        // ── Footer ───────────────────────────────────────────────────────

        this.infoEl = create('div', {
            class: 'wb_catalog_footer'
        });

        this.element.append(toolbar, this.listEl, this.infoEl);

        this.clear();

        return this.element;
    }

    /**
     * Affiche un catalogue de composants.
     * @param {Array} items — [{type, title, category, ...}]
     */
    show(items)
    {
        if (!Array.isArray(items))
        {
            this._showEmpty();
            return;
        }

        this.items = items;
        this._refresh();
    }

    /**
     * Vide le contenu du Panel.
     */
    clear()
    {
        this.items = [];
        this.filter = '';
        this.sortBy = 'title';

        if (this.searchEl)
        {
            this.searchEl.value = '';
        }

        if (this.sortEl)
        {
            this.sortEl.value = 'title';
        }

        this._showEmpty();
    }

    /**
     * Libère toutes les ressources.
     */
    destroy()
    {
        this.items       = null;
        this._onSelectFn = null;

        this.element  = null;
        this.listEl   = null;
        this.infoEl   = null;
        this.searchEl = null;
        this.sortEl   = null;
    }

    // ──────────────────────────────────────────────────────────────────────
    // Callbacks
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Enregistre le callback de sélection.
     * @param {Function} fn — (item) => void
     * @returns {CatalogPanel} — chaînable
     */
    onSelect(fn)
    {
        this._onSelectFn = fn;
        return this;
    }

    // ──────────────────────────────────────────────────────────────────────
    // Privées
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Rafraîchit l'affichage selon le filtre et le tri.
     * @private
     */
    _refresh()
    {
        clear(this.listEl);

        let displayed = [...this.items];

        // ── Filtrage ─────────────────────────────────────────────────────

        if (this.filter.length)
        {
            displayed = displayed.filter(def =>
            {
                const q = this.filter;
                return (
                    (def.type ?? '').toLowerCase().includes(q)
                    || (def.title ?? '').toLowerCase().includes(q)
                    || (def.category ?? '').toLowerCase().includes(q)
                );
            });
        }

        // ── Tri ──────────────────────────────────────────────────────────

        displayed.sort((a, b) => {
            const av = (a[this.sortBy] ?? '').toString().toLowerCase();
            const bv = (b[this.sortBy] ?? '').toString().toLowerCase();
            return av.localeCompare(bv);
        });

        // ── Rendu ────────────────────────────────────────────────────────

        if (displayed.length === 0)
        {
            this._showEmpty();
            return;
        }

        for (const def of displayed)
        {
            const row = create('div', {
                class: 'wb_catalog_item'
            });

            row.innerHTML = `
                <div class="wb_catalog_item_title">${def.title ?? '—'}</div>
                <div class="wb_catalog_item_type">${def.type ?? '—'}</div>
                <div class="wb_catalog_item_category">${def.category ?? '—'}</div>
            `;

            row.addEventListener('click', () => {
                this._onSelectFn?.(def);
            });

            this.listEl.appendChild(row);
        }

        // ── Compteur ─────────────────────────────────────────────────────

        this.infoEl.textContent = `${displayed.length} composant(s)`;
    }

    /**
     * Affiche l'état vide.
     * @private
     */
    _showEmpty()
    {
        clear(this.listEl);
        this.listEl.appendChild(
            create('p', {
                class: 'wb_empty',
                text: 'Aucun composant disponible.'
            })
        );
        this.infoEl.textContent = '0 composant(s)';
    }
}

export default CatalogPanel;
