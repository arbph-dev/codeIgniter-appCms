// assets/js/ui/shared/templates/toolbar.template.js
// ─────────────────────────────────────────────────────────────────────────────
// En-tête de Panel : titre + bouton d'action optionnel.
//
// Utilisé par tous les Panels — la signature est intentionnellement minimale.
// Ne pas étendre sans besoin démontré sur un deuxième Panel.
//
// Évolutions futures (quand le besoin est avéré) :
//   • actions multiples  → action: [ {label, onClick}, … ]
//   • icône              → action.icon
// ─────────────────────────────────────────────────────────────────────────────

import { create } from '/assets/js/core/domhelper.js'

/**
 * Construit l'en-tête d'un Panel.
 *
 * @param {object}   options
 * @param {string}   options.title            Titre affiché dans le <h2>
 * @param {object}   [options.action]         Bouton d'action unique (optionnel)
 * @param {string}   options.action.label     Texte du bouton
 * @param {string}   [options.action.css]     Classe CSS  (défaut : 'wb-btn')
 * @param {Function} options.action.onClick   Handler click
 *
 * @returns {HTMLElement}  <header class="wb_panel_header">
 */
export function toolbar({ title, action = null } = {})
{
    const header = create('header', { class: 'wb_panel_header' })
    header.appendChild(create('h2', { text: title }))

    if (action)
    {
        const btn = create('button', {
            type  : 'button',
            class : action.css ?? 'wb-btn',
            text  : action.label,
        })
        btn.addEventListener('click', action.onClick)
        header.appendChild(btn)
    }

    return header
}
