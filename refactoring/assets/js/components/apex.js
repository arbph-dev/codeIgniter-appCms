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
   1. DONNEES DE DEMONSTRATION
   ========================================================================= */

const SAMPLE_LINE = [ 12, 18, 15, 22, 20, 27, 24 ]

const SAMPLE_BARS = [ { name: 'Valeurs', data: [14, 9, 17, 12] } ]

const SAMPLE_CATEGORIES = [ 'A' , 'B' , 'C', 'D' ]

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

        chart: { type: 'line', height: options.height ?? 350, zoom: { enabled:false } },

        series: [
            { name: options.name ?? 'Série', data }
        ],

        xaxis: options.xaxis ?? {},
        
        yaxis: options.yaxis ?? {},
        
        stroke: { width: options.width ?? 3, curve: options.curve ?? 'straight' },

        markers: { size: options.markerSize ?? 4 },

        grid: { show:true },

        title: { text: options.title ?? '', align:'left' },

        dataLabels:{ enabled:false }

    }
}

function buildBarConfig( series = [], categories = [], options = {} )
{
    return {

        chart:{ type:'bar', height: options.height ?? 350 },
        series,
        xaxis:{ categories },
        title:{ text: options.title ?? '', align:'left' }
    }
}

/* =============================================================================
   3. REGISTRY
   ========================================================================= */

const CHARTS = {

    line(payload = {})
    {
        return buildLineConfig(

            payload.data ?? SAMPLE_LINE,

            payload.options ?? {}

        )
    },

    bars(payload = {})
    {
        return buildBarConfig(

            payload.series ?? SAMPLE_BARS,

            payload.categories ?? SAMPLE_CATEGORIES,

            payload.options ?? {}

        )
    },

    moteurCouple(payload = {})
    {
        const data = payload.data ?? SAMPLE_MOTEUR

        return buildLineConfig(

            data.map(p => p.couple),

            {

                name:'Couple',

                title:'Courbe Couple / Vitesse',

                xaxis:{
                    categories:data.map(p => p.vitesse),
                    title:{
                        text:'Vitesse (RPM)'
                    }
                },

                yaxis:{
                    title:{
                        text:'Couple (Nm)'
                    }
                }

            }

        )
    }

}

/* =============================================================================
   4. RENDERER
   ========================================================================= */

const instances = new Map()

function renderChart(id, config)
{
    const el = byId(id)

    if (!el)
    {
        console.warn(`Apex : container ${id} introuvable`)
        return
    }

    destroyChart(id)

    try
    {
        const chart = new ApexCharts(el, config)

        chart.render()

        instances.set(id, chart)
    }
    catch(e)
    {
        console.error("Erreur ApexCharts")

        console.error(e)

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

function bootstrapFromDOM()
{
    qsa('.cp_apex').forEach(el => {

        const type = el.dataset.chart

        if (!type)
        {
            console.warn("Apex : data-chart absent", el)
            return
        }

        if (!CHARTS[type])
        {
            console.warn(`Apex : type "${type}" inconnu`)
            return
        }

        bus.publish('apex:render',{

            id:el.id,

            type,

            payload:{}

        })

    })
}

/* =============================================================================
   6. API PUBLIQUE
   ========================================================================= */

export function initApex()
{
    bus.subscribe('apex:render', ({id,type,payload={}})=>{

        const builder = CHARTS[type]

        if(!builder)
        {
            console.warn(`Apex chart inconnu : ${type}`)
            return
        }

        const config = builder(payload)

        if (!Array.isArray(config.series))
        {
            console.warn("Configuration Apex invalide")

            console.dir(config)

            return
        }

        renderChart(id,config)

    })

    bus.subscribe('apex:update',({id,series})=>{

        updateChart(id,series)

    })

    bus.subscribe('apex:destroy',(id)=>{

        destroyChart(id)

    })

    bus.subscribe('apex:list',()=>{

        listCharts()

    })

    bootstrapFromDOM()
}

/* =============================================================================
   7. API DEBUG
   ========================================================================= */

window.apexRender = (id,type,payload={}) =>
    bus.publish('apex:render',{id,type,payload})

window.apexDestroy = (id) =>
    bus.publish('apex:destroy',id)

window.apexList = () =>
    bus.publish('apex:list')
