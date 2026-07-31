// assets/js/ui/workbench/views/CatalogPanel.js

import { create, clear } from '/assets/js/core/domhelper.js';

export class CatalogPanel
{
    constructor({
        catalog = null,
        onSelect = null,
    } = {})
    {
        this.catalog  = catalog;
        this.onSelect = onSelect;

        this.filter = '';
        this.sortBy = 'title';

        this.element = null;
        this.listEl  = null;
        this.infoEl  = null;
    }

    render()
    {
        this.element = create('div', {
            class : 'wb_catalog'
        });

        //──────────────────────────────────────────────────────────────
        // Toolbar
        //──────────────────────────────────────────────────────────────

        const toolbar = create('div', {
            class : 'wb_catalog_toolbar'
        });

        const search = create('input', {
            class       : 'wb_catalog_search',
            type        : 'search',
            placeholder : 'Rechercher...'
        });

        search.addEventListener('input', () => {
            this.filter = search.value.toLowerCase();
            this.refresh();
        });

        const sort = create('select', {
            class : 'wb_catalog_sort'
        });

        [
            ['title',    'Nom'],
            ['category', 'Catégorie'],
            ['type',     'Type']
        ].forEach(([value,label]) => {

            const option = create('option', {
                value,
                text : label
            });

            sort.appendChild(option);

        });

        sort.addEventListener('change', () => {

            this.sortBy = sort.value;
            this.refresh();

        });

        toolbar.append(search, sort);

        //──────────────────────────────────────────────────────────────
        // Liste
        //──────────────────────────────────────────────────────────────

        this.listEl = create('div', {
            class : 'wb_catalog_list'
        });

        //──────────────────────────────────────────────────────────────
        // Footer
        //──────────────────────────────────────────────────────────────

        this.infoEl = create('div', {
            class : 'wb_catalog_footer'
        });

        this.element.append(
            toolbar,
            this.listEl,
            this.infoEl
        );

        this.refresh();

        return this.element;
    }

    refresh()
    {
        clear(this.listEl);

        if (!this.catalog) {
            return;
        }

        let items = this.catalog.list();

        //----------------------------------------------------------
        // filtre
        //----------------------------------------------------------

        if (this.filter.length) {

            items = items.filter(def => {

                return (
                    def.type.toLowerCase().includes(this.filter)
                    || def.title.toLowerCase().includes(this.filter)
                    || (def.category ?? '').toLowerCase().includes(this.filter)
                );

            });

        }

        //----------------------------------------------------------
        // tri
        //----------------------------------------------------------

        items.sort((a,b)=>{

            const av = (a[this.sortBy] ?? '').toLowerCase();
            const bv = (b[this.sortBy] ?? '').toLowerCase();

            return av.localeCompare(bv);

        });

        //----------------------------------------------------------
        // rendu
        //----------------------------------------------------------

        for (const def of items)
        {
            const row = create('div', {
                class : 'wb_catalog_item'
            });

            row.innerHTML = `
                <div class="wb_catalog_item_title">${def.title}</div>
                <div class="wb_catalog_item_type">${def.type}</div>
                <div class="wb_catalog_item_category">${def.category ?? ''}</div>
            `;

            row.addEventListener('click', () => {

                if (this.onSelect) {
                    this.onSelect(def);
                }

            });

            this.listEl.appendChild(row);
        }

        this.infoEl.textContent =
            `${items.length} composant(s)`;
    }
}
