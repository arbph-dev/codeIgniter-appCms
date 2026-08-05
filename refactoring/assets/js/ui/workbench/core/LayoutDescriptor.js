// assets/js/ui/workbench/core/LayoutDescriptor.js
// ─────────────────────────────────────────────────────────────────────────────
// Fabrique un descripteur de layout immuable.
//
// Un descripteur décrit uniquement la STRUCTURE : la classe CSS du conteneur
// et les zones qui le composent. Il ne contient jamais de Panels ni de HTML.
//
// Chaque Workbench définit son propre descripteur (une instance par Workbench).
//
// Forme :
//   {
//     css   : 'wb_mot_layout',            // classe du div conteneur
//     zones : [
//       { name: 'left',  css: 'wb_mot_left'  },
//       { name: 'right', css: 'wb_mot_right' },
//     ],
//   }
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crée un descripteur de layout validé et immuable.
 *
 * @param {object}   options
 * @param {string}   options.css    Classe CSS du div conteneur
 * @param {Array<{ name: string, css: string }>} options.zones  Zones du layout
 * @returns {Readonly<object>}
 */
export function createDescriptor({ css, zones = [] })
{
    if (!css)
    {
        throw new Error('[LayoutDescriptor] "css" est requis')
    }
    if (!zones.length)
    {
        throw new Error('[LayoutDescriptor] "zones" ne peut pas être vide')
    }

    return Object.freeze({
        css,
        zones : Object.freeze(zones.map(z => Object.freeze({ ...z }))),
    })
}
