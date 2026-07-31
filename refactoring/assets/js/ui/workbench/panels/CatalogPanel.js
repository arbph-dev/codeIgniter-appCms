// ============================================================
// assets/js/ui/workbench/panels/CatalogPanel.js
// ============================================================

import { create, clear } from '/assets/js/core/domhelper.js';

export class CatalogPanel
{
    /**
     * @param {HTMLElement} container
     */
    constructor(container)
    {
        this.container = container;

        this.onSelect = null;

        this.selectedType = null;
    }

    //------------------------------------------------------------------
    // rendu
    //------------------------------------------------------------------

    /**
     * @param {ComponentDefinition[]} definitions
     */
    render(definitions = [])
    {
        clear(this.container);

        const root = create('div', {
            class: 'wb_catalog_panel'
        });

        definitions.forEach(definition =>
        {
            root.appendChild(
                this.createItem(definition)
            );
        });

        this.container.appendChild(root);
    }

    //------------------------------------------------------------------

    createItem(definition)
    {
        const item = create('div', {
            class: 'wb_catalog_item'
        });

        item.dataset.type = definition.type;

        //------------------------------------------------------

        const icon = create('i', {
            class: `fa ${definition.icon}`
        });

        const label = create('span', {
            class : 'wb_catalog_label',
            text  : definition.label
        });

        item.append(icon);
        item.append(label);

        //------------------------------------------------------

        item.addEventListener('click', () =>
        {
            this.select(definition.type);

            if (this.onSelect)
            {
                this.onSelect(definition);
            }
        });

        //------------------------------------------------------

        if (definition.type === this.selectedType)
        {
            item.classList.add('selected');
        }

        return item;
    }

    //------------------------------------------------------------------

    select(type)
    {
        this.selectedType = type;

        this.container
            .querySelectorAll('.wb_catalog_item')
            .forEach(el =>
            {
                el.classList.toggle(
                    'selected',
                    el.dataset.type === type
                );
            });
    }

    //------------------------------------------------------------------

    clear()
    {
        clear(this.container);
    }

    //------------------------------------------------------------------

    destroy()
    {
        this.clear();

        this.onSelect = null;
    }
}

export default CatalogPanel;
