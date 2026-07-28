/*
===============================================================================
 COMPONENT : APEX
    1. ENGINE   → logique pure (config Apex)
    2. REGISTRY → catalogue des graphiques
    3. RENDERER → gestion DOM + instances ApexCharts
    4. INDEX    → bus + bootstrap
===============================================================================
 Iter007 — même pattern que leaflet.js :
    ~ bootstrapFromDOM()  → bootstrapFromDOM(root = document)
        · qsa('.cp_apex', root)  — scan ciblé (qsa supporte root, domhelper)
        · guard instances.has(el.id) : évite destroy/recréation d'un graphique
          déjà rendu si bootstrapFromDOM est appelé une seconde fois sur document
          ou si le pane contient un graphique déjà dans instances.
    ~ initApex()          → initApex(root = document)
        · guard _initialized : bus souscrit une seule fois
        · appel bootstrapFromDOM(root)

 Compatibilité descendante :
    initApex()                       → comportement identique à avant
    bus 'apex:render/update/destroy/list' → inchangés
    window.apexRender/Destroy/List   → API debug inchangée
===============================================================================
*/

import { bus }       from '/assets/js/core/eventBus.js'
import { byId, qsa } from '/assets/js/core/domhelper.js'


/* =============================================================================
   1. DONNÉES DE DÉMONSTRATION
   ========================================================================= */

const SAMPLE_LINE = [ 12, 18, 15, 22, 20, 27, 24 ]

const SAMPLE_BARS = [ { name: 'Valeurs', data: [14, 9, 17, 12] } ]

const SAMPLE_CATEGORIES = [ 'A', 'B', 'C', 'D' ]

const SAMPLE_MOTEUR = [
    { vitesse:1000, couple:110 },
    { vitesse:1500, couple:145 },
    { vitesse:2000, couple:170 },
    { vitesse:2500, couple:182 },
    { vitesse:3000, couple:176 },
    { vitesse:3500, couple:160 },
    { vitesse:4000, couple:138 }
]


/* =============================================================================
   2. ENGINE
   ========================================================================= */

function buildLineConfig(data = [], options = {})
{
    return {
        chart      : { type: 'line', height: options.height ?? 350, zoom: { enabled: false } },
        series     : [ { name: options.name ?? 'Série', data } ],
        xaxis      : options.xaxis ?? {},
        yaxis      : options.yaxis ?? {},
        stroke     : { width: options.width ?? 3, curve: options.curve ?? 'straight' },
        markers    : { size: options.markerSize ?? 4 },
        grid       : { show: true },
        title      : { text: options.title ?? '', align: 'left' },
        dataLabels : { enabled: false }
    }
}

function buildBarConfig(series = [], categories = [], options = {})
{
    return {
        chart  : { type: 'bar', height: options.height ?? 350 },
        series,
        xaxis  : { categories },
        title  : { text: options.title ?? '', align: 'left' }
    }
}


/* =============================================================================
   3. REGISTRY
   ========================================================================= */

const CHARTS = {

    line(payload = {})
    {
        return buildLineConfig(
            payload.data    ?? SAMPLE_LINE,
            payload.options ?? {}
        )
    },

    bars(payload = {})
    {
        return buildBarConfig(
            payload.series      ?? SAMPLE_BARS,
            payload.categories  ?? SAMPLE_CATEGORIES,
            payload.options     ?? {}
        )
    },

    moteurCouple(payload = {})
    {
        const data = payload.data ?? SAMPLE_MOTEUR
        return buildLineConfig(
            data.map(p => p.couple),
            {
                name  : 'Couple',
                title : 'Courbe Couple / Vitesse',
                xaxis : { categories: data.map(p => p.vitesse), title: { text: 'Vitesse (RPM)' } },
                yaxis : { title: { text: 'Couple (Nm)' } }
            }
        )
    }
}


/* =============================================================================
   4. RENDERER
   ========================================================================= */

const instances = new Map()   // id → instance ApexCharts — sert aussi de guard (Iter007)

function renderChart(id, config)
{
    const el = byId(id)
    if (!el) { console.warn(`[apex] container #${id} introuvable`) ; return }

    destroyChart(id)   // recrée proprement si déjà existant (appel explicite via bus)

    try
    {
        const chart = new ApexCharts(el, config)
        chart.render()
        instances.set(id, chart)
    }
    catch (e)
    {
        console.error('[apex] Erreur ApexCharts', e)
        console.dir(config)
    }
}

function updateChart(id, series)
{
    instances.get(id)?.updateSeries(series)
}

function destroyChart(id)
{
    const chart = instances.get(id)
    if (!chart) return
    chart.destroy()
    instances.delete(id)
}

function listCharts()
{
    console.table([...instances.keys()])
}


/* =============================================================================
   5. BOOTSTRAP DOM
   ========================================================================= */

/**
 * Iter007 : bootstrapFromDOM(root = document)
 *
 * · qsa('.cp_apex', root)       — scan ciblé sur root
 * · guard instances.has(el.id)  — si le graphique est déjà dans instances,
 *   on ne publie pas apex:render (qui le détruirait et recrée).
 *   Même logique que leaflet : instances jouait déjà ce rôle, on l'exploite.
 *
 * @param {Element|Document} root
 */
function bootstrapFromDOM(root = document)
{
    const found = qsa('.cp_apex', root)
        .filter(el => {
            if (!el.id) { return false }
            if (instances.has(el.id)) { return false }   // guard : déjà rendu
            if (!el.dataset.chart)    { console.warn('[apex] data-chart absent', el) ; return false }
            if (!CHARTS[el.dataset.chart]) { console.warn(`[apex] type "${el.dataset.chart}" inconnu`) ; return false }
            return true
        })

    found.forEach(el => {
        bus.publish('apex:render', { id: el.id, type: el.dataset.chart, payload: {} })
    })

    if (found.length) {
        console.log(`[apex] ${found.length} graphique(s) initialisé(s)`)
    }
}


/* =============================================================================
   6. INDEX
   ========================================================================= */

let _initialized = false   // guard : bus souscrit une seule fois

/**
 * Iter007 — initApex(root = document)
 *
 * Premier appel (root = document ou absent) :
 *   → bus subscriptions + bootstrapFromDOM(document)
 *
 * Appels suivants (root = pane TabSystem) :
 *   → bootstrapFromDOM(pane) uniquement
 *   Les graphiques déjà dans instances sont ignorés (guard .filter).
 *
 * @param {Element|Document} root — document (défaut) ou pane ciblé
 */
export function initApex(root = document)
{
    if (!_initialized)
    {
        bus.subscribe('apex:render', ({ id, type, payload = {} }) => {
            const builder = CHARTS[type]
            if (!builder) { console.warn(`[apex] chart inconnu : "${type}"`) ; return }
            const config = builder(payload)
            if (!Array.isArray(config.series)) {
                console.warn('[apex] configuration invalide') ; console.dir(config) ; return
            }
            renderChart(id, config)
        })

        bus.subscribe('apex:update',   ({ id, series }) => updateChart(id, series))
        bus.subscribe('apex:destroy',  (id)             => destroyChart(id))
        bus.subscribe('apex:list',     ()               => listCharts())

        _initialized = true
        console.log('[apex] initialisé')
    }

    bootstrapFromDOM(root)
}


/* =============================================================================
   7. API DEBUG
   ========================================================================= */

window.apexRender  = (id, type, payload = {}) => bus.publish('apex:render',  { id, type, payload })
window.apexDestroy = (id)                      => bus.publish('apex:destroy', id)
window.apexList    = ()                        => bus.publish('apex:list')
