/*
/assets/js/components/callout.js

===============================================================================
 COMPONENT : CALLOUT
 Architecture alignée sur apex.js / mermaid.js :
    1. CORE    → logique toggle
    2. INDEX   → bootstrap DOM + abonnements bus
===============================================================================
*/

import { bus } from '/assets/js/core/eventBus.js'


/* =============================================================================
   1. CORE
   ========================================================================= */

/**
 * Active le comportement accordéon sur un élément .cp_callout.
 * Cherche .cp_callout_title (déclencheur) et .cp_callout_content (panneau).
 */
function activateCallout(el)
{
    const title   = el.querySelector('.cp_callout_title')
    const content = el.querySelector('.cp_callout_content')

    if (!title || !content) { return }

    // État initial : contenu masqué
    content.style.display = 'none'
    title.style.cursor    = 'pointer'

    title.addEventListener('click', () => {
        const isOpen = content.style.display === 'block'
        content.style.display = isOpen ? 'none' : 'block'
    })
}

/**
 * Scan du DOM — tous les .cp_callout présents.
 * Peut être rappelé après injection dynamique de contenu.
 */
function bootstrapCallouts()
{
    document.querySelectorAll('.cp_callout').forEach(activateCallout)
    console.log(`[callout] ${document.querySelectorAll('.cp_callout').length} callout(s) initialisé(s)`)
}


/* =============================================================================
   2. INDEX
   ========================================================================= */

export function initCallout()
{
    bootstrapCallouts()

    // Re-scan après injection dynamique (ex. : chargement AJAX d'une section)
    bus.subscribe('callout:init', () => bootstrapCallouts())

    // Toggle ciblé par id
    bus.subscribe('callout:toggle', ({ id }) => {
        const callout = document.getElementById(id)
        if (!callout) { return }

        const content = callout.querySelector('.cp_callout_content')
        if (!content)  { return }

        content.style.display = content.style.display === 'block' ? 'none' : 'block'
    })
}
