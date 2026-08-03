// ============================================================================
// assets/js/ui/workbench/views/DescriptorPanel.js
// ============================================================================
//
// Affiche le descriptor d'un composant (structure de données).
//
// Iteration001 : conformité au contrat Panel (Stage 1)
//   - Standardisation des noms d'attributs
//   - Destruction complète des ressources
//   - Méthode formatValue() privée
//   - JSDoc amélioré
//
// ============================================================================

import { create, clear } from '/assets/js/core/domhelper.js';

export class DescriptorPanel
{
    constructor(config = {})
    {
        this.element   = null;
        this.bodyEl    = null;
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
        this.element = create('section', {
            class: 'wb_descriptor_panel'
        });

        const header = create('header', {
            class: 'wb_panel_header'
        });

        header.appendChild(
            create('h2', {
                text: 'Descriptor'
            })
        );

        this.bodyEl = create('div', {
            class: 'wb_panel_body'
        });

        this.element.append(
            header,
            this.bodyEl
        );

        this.clear();

        return this.element;
    }

    /**
     * Affiche le descriptor d'un composant.
     * @param {Object|null} descriptor — Dictionnaire de propriétés
     */
    show(descriptor)
    {
        clear(this.bodyEl);

        if (!descriptor || typeof descriptor !== 'object')
        {
            this._showEmpty();
            return;
        }

        const table = create('table', {
            class: 'wb_descriptor_table'
        });

        const tbody = create('tbody');

        Object.entries(descriptor).forEach(([key, value]) => {

            const tr = create('tr');

            tr.appendChild(
                create('th', {
                    text: key
                })
            );

            tr.appendChild(
                create('td', {
                    text: this._formatValue(value)
                })
            );

            tbody.appendChild(tr);

        });

        table.appendChild(tbody);

        this.bodyEl.appendChild(table);
    }

    /**
     * Vide le contenu du Panel.
     */
    clear()
    {
        if (!this.bodyEl) return;
        this._showEmpty();
    }

    /**
     * Libère toutes les ressources.
     */
    destroy()
    {
        this.element = null;
        this.bodyEl  = null;
    }

    // ──────────────────────────────────────────────────────────────────────
    // Privées
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Formate une valeur pour l'affichage.
     * @private
     */
    _formatValue(value)
    {
        if (value === null)
        {
            return 'null';
        }

        if (value === undefined)
        {
            return 'undefined';
        }

        if (Array.isArray(value))
        {
            return `[ ${value.length} item(s) ]`;
        }

        if (typeof value === 'object')
        {
            return JSON.stringify(value);
        }

        return String(value);
    }

    /**
     * Affiche l'état vide.
     * @private
     */
    _showEmpty()
    {
        clear(this.bodyEl);
        this.bodyEl.appendChild(
            create('p', {
                class: 'wb_empty',
                text: 'No descriptor selected.'
            })
        );
    }
}

export default DescriptorPanel;
