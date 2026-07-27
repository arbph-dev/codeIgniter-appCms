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
 Iter007
    + scanAndRender(root)  — noyau DRY : scan sur n'importe quel élément racine
    ~ bootstrapDom()       → bootstrapDom(root = document) — utilise scanAndRender
    ~ runInArticle(id)     — utilise scanAndRender (plus de duplication)
    ~ initMermaid()        → initMermaid(root = document)
      + guard _initialized : mermaid.initialize() et bus souscrits une seule fois
      + appel scanAndRender(root) : ciblé sur le pane ou global selon l'appelant

 Compatibilité descendante :
    initMermaid()           → comportement identique à avant (scan document)
    bus 'nav:goto'          → portal : runInArticle(articleId)  inchangé
    bus 'tabs:switch'       → portal legacy                     inchangé
    window.mermaid_Run(id)  → API inline PHP                    inchangée
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

const rendered = new Set()   // ids déjà rendus — persiste entre les appels

/**
 * Iter007 — Noyau DRY partagé par toutes les voies d'init.
 *
 * Scanne root à la recherche de .mermaid non encore rendus,
 * les ajoute à `rendered` et lance mermaid.run().
 *
 * @param {Element|Document} root — conteneur cible (pane, article, document…)
 */
function scanAndRender(root = document)
{
    const nodes = [...root.querySelectorAll('.mermaid')]
        .filter(el => el.id && !rendered.has(el.id))

    if (!nodes.length) { return }

    nodes.forEach(el => rendered.add(el.id))
    mermaid.run({ nodes })
    console.log(`[mermaid] ${nodes.length} diagramme(s) rendus`)
}

/**
 * Init globale au chargement (ou sur un root fourni).
 * Iter007 : délègue à scanAndRender.
 *
 * @param {Element|Document} root
 */
function bootstrapDom(root = document)
{
    scanAndRender(root)
}

/**
 * Rendu différé déclenché par bus 'nav:goto' ou 'tabs:switch'.
 * Compatibilité portal : prend un id string, résout en élément, délègue.
 *
 * @param {string} articleId — id HTML de l'article ou de la section
 */
function runInArticle(articleId)
{
    const el = byId(articleId)
    if (!el) { return }
    scanAndRender(el)
}

/**
 * Re-render forcé d'un diagramme déjà rendu (reset du Set).
 *
 * @param {string} id
 */
function reRender(id)
{
    const el = byId(id)
    if (!el) {
        console.warn(`[mermaid] reRender : #${id} introuvable`)
        return
    }
    rendered.delete(id)
    rendered.add(id)
    mermaid.run({ nodes: [el] })
}

/**
 * Injection dynamique d'une définition puis rendu (ex: depuis codeval).
 *
 * @param {string} id
 * @param {string} definition
 */
async function setAndRender(id, definition)
{
    const el = byId(id)
    if (!el) {
        console.warn(`[mermaid] setAndRender : #${id} introuvable`)
        return
    }
    el.textContent = definition
    el.removeAttribute('data-processed')
    try {
        await mermaid.run({ nodes: [el] })
        rendered.add(id)
    } catch (err) {
        console.error(`[mermaid] erreur rendu #${id}`, err)
        el.textContent = `Erreur : ${err.message}`
    }
}


/* =============================================================================
   4. INDEX
   ========================================================================= */

let _initialized = false   // guard : initialize() et bus — une seule fois

/**
 * Iter007 — initMermaid(root = document)
 *
 * Première appel (root = document ou absent) :
 *   → mermaid.initialize() + bus subscriptions + scanAndRender(document)
 *
 * Appels suivants (root = pane TabSystem) :
 *   → scanAndRender(pane) uniquement
 *   Le Set `rendered` garantit qu'aucun diagramme déjà rendu n'est relancé.
 *
 * @param {Element|Document} root — document (défaut) ou pane ciblé
 */
export function initMermaid(root = document)
{
    if (!_initialized)
    {
        mermaid.initialize(CONFIG)

        // ── Bus : portal nav (par id) ──────────────────────────────────────
        bus.subscribe('tabs:switch',    ({ name })      => runInArticle(name))
        bus.subscribe('nav:goto',       ({ articleId }) => runInArticle(articleId))

        // ── Bus : API mermaid ──────────────────────────────────────────────
        bus.subscribe('mermaid:render', ({ id })              => reRender(id))
        bus.subscribe('mermaid:set',    ({ id, definition })  => setAndRender(id, definition))
        bus.subscribe('mermaid:preset', ({ id, type })        =>
        {
            const builder = DIAGRAMS[type]
            if (!builder) {
                console.warn(`[mermaid] preset inconnu "${type}"`)
                return
            }
            setAndRender(id, builder())
        })

        _initialized = true
        console.log('[mermaid] initialisé')
    }

    // Scan ciblé : document au premier appel global, pane aux appels suivants
    bootstrapDom(root)
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
