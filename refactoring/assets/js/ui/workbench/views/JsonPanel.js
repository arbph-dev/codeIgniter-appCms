// ============================================================================
// assets/js/ui/workbench/views/JsonPanel.js
// ============================================================================
//
// Panneau générique d'affichage JSON.
// 
// Iteration001 : conformité au contrat Panel (Stage 1)
//   - render() crée et retourne l'élément racine
//   - show(data) remplace setData() + append()
//   - clear() vide le contenu
//   - destroy() nettoie les ressources
//   - Pas de getElement() (accès via render())
//
// Stage 1
// ============================================================================

import { create, clear } from '/assets/js/core/domhelper.js';

export class JsonPanel
{
    constructor(config = {})
    {
        this.element = null;
        this.pre     = null;
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
            class: 'wb_json_panel'
        });

        const header = create('header', {
            class: 'wb_panel_header'
        });
        header.appendChild(create('h2', {
            text: 'JSON'
        }));

        this.pre = create('pre', {
            class: 'wb_json'
        });

        this.element.append(header, this.pre);

        this.clear();

        return this.element;
    }

    /**
     * Affiche les données en JSON formaté.
     * @param {*} data — Donnée à afficher (objet, tableau, etc.)
     */
    show(data)
    {
        if (!this.pre) return;

        clear(this.pre);

        if (data === null || data === undefined)
        {
            this._showEmpty();
            return;
        }

        try
        {
            this.pre.textContent = JSON.stringify(data, null, 4);
        }
        catch (err)
        {
            this.pre.textContent = `Error: ${err.message}`;
        }
    }

    /**
     * Vide le contenu du Panel.
     */
    clear()
    {
        if (!this.pre) return;
        clear(this.pre);
        this._showEmpty();
    }

    /**
     * Libère toutes les ressources.
     */
    destroy()
    {
        this.element = null;
        this.pre     = null;
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
        if (!this.pre) return;
        clear(this.pre);
        this.pre.textContent = '{}';
    }
}

export default JsonPanel;
