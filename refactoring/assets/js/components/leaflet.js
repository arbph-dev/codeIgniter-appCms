/*
===============================================================================
 COMPONENT : LEAFLET
 Architecture interne :
    1. ENGINE   → génération des configurations
    2. REGISTRY → catalogue des cartes
    3. RENDERER → gestion des instances Leaflet
    4. BOOTSTRAP → découverte automatique du DOM
    5. INDEX    → abonnement au bus
    6. API      → fonctions de debug
===============================================================================
*/

import { bus } from '/assets/js/core/eventBus.js'
import { byId, qsa } from '/assets/js/core/domhelper.js'

/* =============================================================================
   1. ENGINE
   ========================================================================= */

function buildOsmConfig(payload = {})
{
    return {

        lat  : payload.lat  ?? 47.82,

        lng  : payload.lng  ?? -4.30,

        zoom : payload.zoom ?? 11

    }
}


/* =============================================================================
   2. REGISTRY
   ========================================================================= */

const MAPS = {

    osm(payload)
    {
        return buildOsmConfig(payload)
    }

}


/* =============================================================================
   3. RENDERER
   ========================================================================= */

const instances = new Map()


function createMap(el, config)
{
    const map = L.map(el, {

        zoomControl: true,

        attributionControl: true

    })

    map.setView(

        [config.lat, config.lng],

        config.zoom

    )

    return map
}


function createTileLayer(map)
{
    L.tileLayer(

        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

        {

            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

        }

    ).addTo(map)
}


function renderMap(id, config)
{
    const el = byId(id)

    if (!el)
    {
        console.warn(`Leaflet : container ${id} introuvable`)
        return
    }

    destroyMap(id)

    const map = createMap(el, config)

    createTileLayer(map)

    instances.set(id, map)

    // utile si le composant vient d'être affiché
    setTimeout(() => map.invalidateSize(), 0)
}


function destroyMap(id)
{
    const map = instances.get(id)

    if (!map)
    {
        return
    }

    map.remove()

    instances.delete(id)
}


function updateMap(id, config)
{
    const map = instances.get(id)

    if (!map)
    {
        return
    }

    map.setView(

        [config.lat, config.lng],

        config.zoom

    )
}


function listMaps()
{
    console.table([...instances.keys()])
}


/* =============================================================================
   4. BOOTSTRAP
   ========================================================================= */

function bootstrapFromDOM()
{
    qsa('.cp_leaflet').forEach(el => {

        bus.publish('leaflet:render', {
            id:      el.id,
            type:    'osm',
            payload: { lat: Number(el.dataset.lat), lng: Number(el.dataset.lng), zoom: Number(el.dataset.zoom) }

        })

    })
}


/* =============================================================================
   5. INDEX
   ========================================================================= */

export function initLeaflet()
{

    bus.subscribe('leaflet:render', ({ id, type, payload = {} }) => {

        const builder = MAPS[type]

        if (!builder)
        {
            console.warn(`Leaflet : type inconnu "${type}"`) ; return
        }

        const config = builder(payload)
        renderMap(id, config)
    })


    bus.subscribe('leaflet:update', ({ id, payload = {} }) => {
        updateMap( id, buildOsmConfig(payload) )
    })


    bus.subscribe('leaflet:destroy', id => {
        destroyMap(id)
    })

    bus.subscribe('leaflet:list', () => {
        listMaps()
    })

    bootstrapFromDOM()

}


/* =============================================================================
   6. API Debug
   ========================================================================= */

window.leafletRender = (id, payload = {}) =>
    bus.publish('leaflet:render', { id, type: 'osm', payload })

window.leafletUpdate = (id, payload = {}) =>
    bus.publish('leaflet:update', { id, payload })

window.leafletDestroy = id =>
    bus.publish('leaflet:destroy', id)

window.leafletList = () =>
    bus.publish('leaflet:list')