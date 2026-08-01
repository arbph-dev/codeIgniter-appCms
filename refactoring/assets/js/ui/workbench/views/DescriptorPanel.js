// ============================================================================
// assets/js/ui/workbench/views/DescriptorPanel.js
// ============================================================================

import { create, clear } from '/assets/js/core/domhelper.js';

export class DescriptorPanel
{
    constructor()
    {
        this.element = null;
        this.bodyEl  = null;

        this.descriptor = null;
    }

    render()
    {
        this.element = create('section', {
            class : 'wb_descriptor_panel'
        });

        const header = create('header', {
            class : 'wb_panel_header'
        });

        header.appendChild(
            create('h2', {
                text : 'Descriptor'
            })
        );

        this.bodyEl = create('div', {
            class : 'wb_panel_body'
        });

        this.element.append(
            header,
            this.bodyEl
        );

        this.clear();

        return this.element;
    }

    /**
     * Affiche le descriptor.
     *
     * @param {Object|null} descriptor
     */
    show(descriptor)
    {
        this.descriptor = descriptor;

        clear(this.bodyEl);

        if (!descriptor)
        {
            this.bodyEl.appendChild(
                create('p', {
                    class : 'wb_empty',
                    text  : 'Aucun descriptor sélectionné.'
                })
            );
            return;
        }

        const table = create('table', {
            class : 'wb_descriptor_table'
        });

        const tbody = create('tbody');

        Object.entries(descriptor).forEach(([key, value]) => {

            const tr = create('tr');

            tr.appendChild(
                create('th', {
                    text : key
                })
            );

            tr.appendChild(
                create('td', {
                    text : this.formatValue(value)
                })
            );

            tbody.appendChild(tr);

        });

        table.appendChild(tbody);

        this.bodyEl.appendChild(table);
    }

    clear()
    {
        this.show(null);
    }

    /**
     * Formate les valeurs complexes.
     */
    formatValue(value)
    {
        if (value === null)
        {
            return 'null';
        }

        if (Array.isArray(value))
        {
            return `[ ${value.length} élément(s) ]`;
        }

        if (typeof value === 'object')
        {
            return JSON.stringify(value);
        }

        return String(value);
    }
}

export default DescriptorPanel;
