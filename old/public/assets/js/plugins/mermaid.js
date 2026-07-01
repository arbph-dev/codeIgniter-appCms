// /assets/js/plugins/mermaid.js
//
// ══════════════════════════════════════════════════════════════════════════════
// Wrapper Mermaid — rendu différé jusqu'à ce que le conteneur soit visible.
//
// Problème initial : mermaid.run() sur un <pre> dans un article masqué
// (display:none) génère un SVG de taille 0×0.
//
// Solution : souscription à tabs:switch.
// Quand un onglet devient visible, on rend tous les .mermaid non encore
// traités dans cet article.
//
// Chaque nœud n'est rendu qu'une seule fois (Set `rendered`).
// Le bouton "Exécuter" (mermaid_Run) reste disponible pour forcer un re-rendu.
// ══════════════════════════════════════════════════════════════════════════════

import { bus } from '/assets/js/core/eventBus.js'
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'

mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })

// Garde la trace des nœuds déjà rendus (par id)
const rendered = new Set()

// ── Rendu dans un article ─────────────────────────────────────────────────────

function runInArticle(articleId) {
    const article = document.getElementById(articleId)
    if (!article) return

    const nodes = [...article.querySelectorAll('.mermaid')]
        .filter(el => el.id && !rendered.has(el.id))

    if (nodes.length === 0) return

    nodes.forEach(el => rendered.add(el.id))
    mermaid.run({ nodes })
    console.log(`[mermaid] ${nodes.length} diagramme(s) rendu(s) dans #${articleId}`)
}

// ── Souscription au bus ───────────────────────────────────────────────────────

bus.subscribe('tabs:switch', ({ name }) => {
    runInArticle(name)
})

//bus.publish('nav:goto', { articleId, targetId: h.id })
bus.subscribe('nav:goto', ( o) => {

    runInArticle(o.articleId)
})


// ── API globale (bouton "Exécuter" dans le HTML) ──────────────────────────────

window.mermaid_Run = function(PreId) {
    const el = document.getElementById(PreId)
    if (!el) return
    // Force le re-rendu même si déjà rendu
    rendered.delete(PreId)
    rendered.add(PreId)
    mermaid.run({ nodes: [el] })
}

// ── Callbacks exposés aux graphes gantt / diagrammes ─────────────────────────

window.mermaid_printArguments = function(arg1, arg2, arg3) {
    console.log('[mermaid] printArguments:', arg1, arg2, arg3)
}

window.mermaid_printTask = function(taskId) {
    console.log('[mermaid] taskId:', taskId)
}

export default { mermaid }
