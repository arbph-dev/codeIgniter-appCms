/*
===============================================================================
 COMPONENT : APEX
 Architecture interne :
    1. ENGINE   → logique pure (config Apex)
    2. REGISTRY → catalogue des graphiques
    3. RENDERER → gestion DOM + instances ApexCharts
    4. INDEX    → bus + bootstrap
===============================================================================
*/

import { bus } from '/assets/js/core/eventBus.js'
import { byId, qsa } from '/assets/js/core/domhelper.js'

/* =============================================================================
   1. ENGINE
   ========================================================================= */

/**
 * Générateur config ligne simple
 */
function buildLineConfig(data, options = {}) {
    return {
        chart: {
            type: 'line',
            height: options.height || 350,
            zoom: { enabled: false }
        },

        series: [{
            name: options.name || 'Serie',
            data
        }],

        xaxis: options.xaxis || {},

        yaxis: options.yaxis || {},

        stroke: {
            curve: options.curve || 'straight'
        },

        title: {
            text: options.title || '',
            align: 'left'
        },

        dataLabels: {
            enabled: false
        }
    }
}

/**
 * Générateur config barres
 */
function buildBarConfig(series, categories = [], options = {}) {
    return {
        chart: {
            type: 'bar',
            height: options.height || 350
        },

        series,

        xaxis: {
            categories
        },

        title: {
            text: options.title || '',
            align: 'left'
        }
    }
}


/* =============================================================================
   2. REGISTRY
   Catalogue des types de graphiques


   yaxis: {
    logarithmic: true,
    logBase: 10,          // optionnel
    title: { text: 'Couple (Nm)' }
}


   ========================================================================= */

const CHARTS = {

    line(payload) {
        return buildLineConfig(payload.data, payload.options)
    },

    bars(payload) {
        return buildBarConfig(
            payload.series,
            payload.categories,
            payload.options
        )
    },

    moteurCouple(payload = {}) {

        const data = payload.data || []
    
        return buildLineConfig(
            data.map(p => p.couple),
            {
                name: 'Couple',
    
                title: 'Courbe Couple / Vitesse',
    
                xaxis: {
                    categories: data.map(p => p.vitesse),
                    title: { text: 'Vitesse (RPM)' }
                },
    
                yaxis: {
                    title: { text: 'Couple (Nm)' }
                }
            }
        )
    }
}


/* =============================================================================
   3. RENDERER
   Gestion des instances ApexCharts
   ========================================================================= */

const instances = new Map()

function renderChart(id, config) {

    const el = byId(id)

    if (!el) {
        console.warn(`Apex: container ${id} introuvable`)
        return
    }

    destroyChart(id)

    const chart = new ApexCharts(el, config)

    chart.render()

    instances.set(id, chart)
}

function updateChart(id, series) {
    instances.get(id)?.updateSeries(series)
}

function destroyChart(id) {
    const chart = instances.get(id)

    if (!chart) return

    chart.destroy()
    instances.delete(id)
}

function listCharts() {
    console.table([...instances.keys()])
}


/* =============================================================================
   4. BOOTSTRAP DOM
   Auto-instanciation depuis data-chart
   ========================================================================= */

function bootstrapFromDOM() {

    qsa('.cp_apex').forEach(el => {

        const type = el.dataset.chart

        if (!type || !CHARTS[type]) return

        bus.publish('apex:render', {
            id: el.id,
            type,
            payload: {}
        })
    })
}


/* =============================================================================
   5. INDEX
   API publique
   ========================================================================= */

export function initApex() {

    bus.subscribe('apex:render', ({ id, type, payload = {} }) => {

        const builder = CHARTS[type]

        if (!builder) {
            console.warn(`Apex chart type inconnu : ${type}`)
            return
        }

        const config = builder(payload)

        console.log('---------------------------------------------')
        console.log('---------------------------------------------')
        console.log(type)
        console.dir(config)
        console.log('---------------------------------------------')
        renderChart(id, config)
    })


    bus.subscribe('apex:update', ({ id, series }) => {
        updateChart(id, series)
    })


    bus.subscribe('apex:destroy', (id) => {
        destroyChart(id)
    })


    bus.subscribe('apex:list', () => {
        listCharts()
    })


    bootstrapFromDOM()
}


/* =============================================================================
   6. API exposée (CodeVal / debug console)
   ========================================================================= */

window.apexRender = (id, type, payload = {}) =>
    bus.publish('apex:render', { id, type, payload })

window.apexDestroy = (id) =>
    bus.publish('apex:destroy', id)

window.apexList = () =>
    bus.publish('apex:list')
