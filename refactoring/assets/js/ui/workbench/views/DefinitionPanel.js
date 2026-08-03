// ============================================================================
// assets/js/ui/workbench/views/DefinitionPanel.js
// ============================================================================

import { create, clear } from '/assets/js/core/domhelper.js';

export class DefinitionPanel
{
    constructor(config = {})
    {
        this.element    = null;
        this.bodyEl     = null;
        this.definition = null;
    }

    /**
     * Crée et retourne l'élément racine du Panel.
     * @returns {HTMLElement}
     */
    render()
    {
        this.element = create('section', {
            class : 'wb_definition_panel'
        });

        const header = create('header', {
            class : 'wb_panel_header'
        });

        header.appendChild(
            create('h2', {
                text : 'Component Definition'
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
     * Affiche une définition de composant.
     * @param {Object|null} definition
     */
    show(definition)
    {
        if (!this.bodyEl) return;

        this.definition = definition;

        clear(this.bodyEl);

        if (!definition)
        {
            this._showEmpty();
            return;
        }

        this.bodyEl.append(
            this.field('Titre', definition.title),
            this.field('Type', definition.type),
            this.field('Catégorie', definition.category),
            this.field('Version', definition.version),
            this.field('Auteur', definition.author),
            this.field('Description', definition.description),
            this.field(
                'Tags',
                (definition.tags ?? []).join(', ')
            ),
            this.field(
                'Renderer',
                definition.renderer
            ),
            this.field(
                'AdminRenderer',
                definition.adminRenderer
            ),
            this.field(
                'Scripts',
                (definition.scripts ?? []).join(', ')
            ),
            this.field(
                'Styles',
                (definition.styles ?? []).join(', ')
            )
        );
    }

    /**
     * Revient à l'état vide.
     */
    clear()
    {
        this.show(null);
    }

    /**
     * Libère toutes les références.
     */
    destroy()
    {
        this.element    = null;
        this.bodyEl     = null;
        this.definition = null;
    }

    // ── Privées / helpers ─────────────────────────────────────────────────────

    /**
     * Affiche le message d'état vide.
     * @private
     */
    _showEmpty()
    {
        clear(this.bodyEl);
        this.bodyEl.appendChild(
            create('p', {
                class : 'wb-empty',
                text  : 'Aucun composant sélectionné.'
            })
        );
    }

    field(label, value)
    {
        const row = create('div', {
            class : 'wb_definition_row'
        });

        row.append(
            create('div', {
                class : 'wb_definition_label',
                text  : label
            }),
            create('div', {
                class : 'wb_definition_value',
                text  : value || '—'
            })
        );

        return row;
    }
}

export default DefinitionPanel;
