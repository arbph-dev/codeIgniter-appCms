// ============================================================================
// assets/js/ui/workbench/views/JsonPanel.js
//
// Panneau générique d'affichage JSON.
//
// Stage 1
// ============================================================================

import { create, clear } from '/assets/js/core/domhelper.js';

export class JsonPanel
{
    constructor()
    {
        this.element = create('div', {
            class: 'wb_json_panel'
        });

        this.pre = create('pre', {
            class: 'wb_json'
        });

        this.element.appendChild(this.pre);
    }

    getElement()
    {
        return this.element;
    }

    clear()
    {
        this.pre.textContent = '';
    }

    setData(data)
    {
        this.pre.textContent = JSON.stringify(
            data,
            null,
            4
        );
    }

    append(data)
    {
        this.pre.textContent +=
            JSON.stringify(data, null, 4) + '\n';
    }
}

export default JsonPanel;
