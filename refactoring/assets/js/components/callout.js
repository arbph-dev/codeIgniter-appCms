/*
/assets/js/components/callout.js

===============================================================================
 COMPONENT : CALLOUT
    1. CORE    → logique toggle
    2. INDEX   → bootstrap DOM + abonnements bus
===============================================================================
 Iter007
    ~ activateCallout(el)    : guard data-callout-init — évite le double
                               addEventListener si l'élément est scanné 2×
    ~ bootstrapCallouts()    → bootstrapCallouts(root = document)
                               scanne root au lieu de document
    ~ initCallout()          → initCallout(root = document)
                               + guard _initialized : bus souscrit une seule fois
                               + appel bootstrapCallouts(root)

 Compatibilité descendante :
    initCallout()               → comportement identique à avant (scan document)
    bus 'callout:init'          → re-scan global (dynamic injection)   inchangé
    bus 'callout:toggle'        → toggle par id                        inchangé
===============================================================================
*/

import { bus } from '/assets/js/core/eventBus.js'


/* =============================================================================
   1. CORE
   ========================================================================= */

/**
 * Active le comportement accordéon sur un élément .cp_callout.
 *
 * Iter007 : guard data-callout-init
 *   Sans ce guard, un appel double (ex: initCallout(pane) après un
 *   initCallout(document) qui incluait déjà ce pane) ajouterait un second
 *   listener sur le titre → double-toggle au clic.
 */
function activateCallout(el)
{
    if (el.dataset.calloutInit) { return }   // déjà initialisé → on passe

    const title   = el.querySelector('.cp_callout_title')
    const content = el.querySelector('.cp_callout_content')

    if (!title || !content) { return }

    content.style.display = 'none'
    title.style.cursor    = 'pointer'

    title.addEventListener('click', () => {
        const isOpen = content.style.display === 'block'
        content.style.display = isOpen ? 'none' : 'block'
    })

    el.dataset.calloutInit = '1'   // marquer : évite double-init
}

/**
 * Iter007 : bootstrapCallouts(root = document)
 * Scanne root.querySelectorAll('.cp_callout') au lieu de document.
 * Peut être appelé avec un pane TabSystem pour un scan ciblé.
 *
 * @param {Element|Document} root
 */
function bootstrapCallouts(root = document)
{
    const callouts = [...root.querySelectorAll('.cp_callout')]
    callouts.forEach(activateCallout)
    console.log(`[callout] ${callouts.length} callout(s) scanné(s)`)
}


/* =============================================================================
   2. INDEX
   ========================================================================= */

let _initialized = false   // guard : bus souscrit une seule fois

/**
 * Iter007 — initCallout(root = document)
 *
 * Premier appel (root = document ou absent) :
 *   → bus subscriptions + bootstrapCallouts(document)
 *
 * Appels suivants (root = pane TabSystem) :
 *   → bootstrapCallouts(pane) uniquement
 *   Le guard data-callout-init sur chaque élément empêche tout double-listener.
 *
 * @param {Element|Document} root — document (défaut) ou pane ciblé
 */
export function initCallout(root = document)
{
    if (!_initialized)
    {
        // Re-scan global après injection dynamique (portal / AJAX)
        // Pas de root ici : 'callout:init' cible tout le document
        bus.subscribe('callout:init', () => bootstrapCallouts())

        // Toggle ciblé par id — getElementById est toujours global, c'est correct
        bus.subscribe('callout:toggle', ({ id }) => {
            const callout = document.getElementById(id)
            if (!callout) { return }
            const content = callout.querySelector('.cp_callout_content')
            if (!content)  { return }
            content.style.display = content.style.display === 'block' ? 'none' : 'block'
        })

        _initialized = true
        console.log('[callout] initialisé')
    }

    bootstrapCallouts(root)
}
