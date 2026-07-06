/*

/assets/js/components/mermaid.js 

===============================================================================
 COMPONENT : MERMAID
 Architecture identique à apex.js :
    1. CONFIG   → options mermaid
    2. REGISTRY → définitions pré-câblées
    3. RENDERER → rendu DOM
    4. INDEX    → bus + bootstrap
===============================================================================
*/

import { bus } from '/assets/js/core/eventBus.js'
import { byId } from '/assets/js/core/domhelper.js'
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'


/* =============================================================================
   1. CONFIG
   ========================================================================= */

const CONFIG = {
    startOnLoad  : false,
    securityLevel: 'loose',   // requis pour les callbacks onclick dans gantt
    logLevel     : 'error'
}


/* =============================================================================
   2. REGISTRY
   ========================================================================= */

const DIAGRAMS = {

    sequenceMinimal: () => `
        sequenceDiagram
        autonumber
        participant A
        participant B
        A->>B: Hello
        B-->>A: World
    `,

    ganttEmpty: () => `
        gantt
        dateFormat YYYY-MM-DD
        section À définir
        Tâche exemple : 2025-01-01, 7d
    `
}


/* =============================================================================
   3. RENDERER
   ========================================================================= */

const rendered = new Set()

function runInArticle(articleId) {
    const article = byId(articleId)
    if (!article) return

    const nodes = [...article.querySelectorAll('.mermaid')]
        .filter(el => el.id && !rendered.has(el.id))

    if (!nodes.length) return

    nodes.forEach(el => rendered.add(el.id))
    mermaid.run({ nodes })
    console.log(`[mermaid] ${nodes.length} diagramme(s) rendu(s) dans #${articleId}`)
}

function reRender(id) {
    const el = byId(id)
    if (!el) {
        console.warn(`Mermaid: #${id} introuvable`)
        return
    }
    rendered.delete(id)
    rendered.add(id)
    mermaid.run({ nodes: [el] })
}

async function setAndRender(id, definition) {
    const el = byId(id)
    if (!el) {
        console.warn(`Mermaid: #${id} introuvable`)
        return
    }
    el.textContent = definition
    el.removeAttribute('data-processed')
    try {
        await mermaid.run({ nodes: [el] })
        rendered.add(id)
    } catch (err) {
        console.error(`Mermaid: erreur rendu #${id}`, err)
        el.textContent = `Erreur : ${err.message}`
    }
}


/* =============================================================================
   4. INDEX
   ========================================================================= */

export function initMermaid() {

    mermaid.initialize(CONFIG)

    // Rendu différé : un article devient visible
    bus.subscribe('tabs:switch', ({ name }) => runInArticle(name))
    bus.subscribe('nav:goto',    ({ articleId }) => runInArticle(articleId))

    // Re-rendu d'un diagramme existant
    bus.subscribe('mermaid:render', ({ id }) => reRender(id))

    // Injection dynamique (depuis codeval par exemple)
    bus.subscribe('mermaid:set', ({ id, definition }) => setAndRender(id, definition))

    // Chargement depuis le REGISTRY
    bus.subscribe('mermaid:preset', ({ id, type }) => {
        const builder = DIAGRAMS[type]
        if (!builder) {
            console.warn(`Mermaid: preset inconnu "${type}"`)
            return
        }
        setAndRender(id, builder())
    })
}


/* =============================================================================
   5. API globale (boutons inline dans les vues PHP)
   ========================================================================= */

window.mermaid_Run = (id) =>
    bus.publish('mermaid:render', { id })

window.mermaid_printArguments = (...args) =>
    console.log('[mermaid] args:', ...args)

window.mermaid_printTask = (task) =>
    console.log('[mermaid] task:', task)
