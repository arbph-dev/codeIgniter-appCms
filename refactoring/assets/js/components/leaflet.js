/* /assets/js/components/leaflet.js
===============================================================================
 COMPONENT : LEAFLET
    1. ENGINE    → génération des configurations
    2. REGISTRY  → catalogue des cartes
    3. RENDERER  → gestion des instances Leaflet
    4. BOOTSTRAP → découverte automatique du DOM
    5. INDEX     → abonnement au bus
    6. API       → fonctions de debug
===============================================================================
 Iter007
    ~ bootstrapFromDOM()  → bootstrapFromDOM(root = document)
        · qsa('.cp_leaflet', root) — qsa accepte déjà un root (domhelper)
        · guard instances.has(el.id) : si la carte existe déjà dans instances,
          on ne la détruit pas / recrée pas (contrairement à renderMap qui detruit)
          Le Map `instances` joue le même rôle que le Set `rendered` de mermaid
          — sans rien ajouter, il était déjà là.
    ~ initLeaflet()       → initLeaflet(root = document)
        · guard _initialized : bus souscrit une seule fois
        · appel bootstrapFromDOM(root)

 Compatibilité descendante :
    initLeaflet()              → comportement identique à avant (scan document)
    bus 'leaflet:render/update/destroy/list' → inchangés
    window.leafletRender/…     → API debug inchangée
===============================================================================
*/

import { bus }       from '/assets/js/core/eventBus.js'
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
    osm(payload) { return buildOsmConfig(payload) }
}


/* =============================================================================
   3. RENDERER
   ========================================================================= */

const instances = new Map()   // id → instance Leaflet — sert aussi de guard (Iter007)


function createMap(el, config)
{
    const map = L.map(el, { zoomControl: true, attributionControl: true })
    map.setView([config.lat, config.lng], config.zoom)
    return map
}

function createTileLayer(map)
{
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom    : 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(map)
}

function renderMap(id, config)
{
    const el = byId(id)
    if (!el) { console.warn(`[leaflet] container #${id} introuvable`) ; return }

    destroyMap(id)   // recrée proprement si déjà existant (appel explicite via bus)

    const map = createMap(el, config)
    createTileLayer(map)
    instances.set(id, map)

    setTimeout(() => map.invalidateSize(), 0)   // corrige le rendu si élément caché
}

function destroyMap(id)
{
    const map = instances.get(id)
    if (!map) { return }
    map.remove()
    instances.delete(id)
}

function updateMap(id, config)
{
    const map = instances.get(id)
    if (!map) { return }
    map.setView([config.lat, config.lng], config.zoom)
}

function listMaps()
{
    console.table([...instances.keys()])
}


/* =============================================================================
   4. BOOTSTRAP
   ========================================================================= */

/**
 * Iter007 : bootstrapFromDOM(root = document)
 *
 * Deux changements :
 *  · qsa('.cp_leaflet', root)  — scan ciblé sur root (domhelper supporte déjà root)
 *  · .filter(!instances.has)   — guard : si la carte est déjà dans instances,
 *    on ne publie pas leaflet:render (qui détruirait et recrée la carte).
 *    Utile quand initLeaflet(pane) est appelé sur un pane déjà rendu,
 *    ou si une carte a été créée manuellement via window.leafletRender().
 *
 * @param {Element|Document} root
 */
function bootstrapFromDOM(root = document)
{
    const found = qsa('.cp_leaflet', root)
        .filter(el => el.id && !instances.has(el.id))   // guard : déjà rendu

    found.forEach(el => {
        bus.publish('leaflet:render', {
            id      : el.id,
            type    : 'osm',
            payload : {
                lat  : Number(el.dataset.lat),
                lng  : Number(el.dataset.lng),
                zoom : Number(el.dataset.zoom)
            }
        })
    })

    if (found.length) {
        console.log(`[leaflet] ${found.length} carte(s) initialisée(s)`)
    }
}


/* =============================================================================
   5. INDEX
   ========================================================================= */

let _initialized = false   // guard : bus souscrit une seule fois

/**
 * Iter007 — initLeaflet(root = document)
 *
 * Premier appel (root = document ou absent) :
 *   → bus subscriptions + bootstrapFromDOM(document)
 *
 * Appels suivants (root = pane TabSystem) :
 *   → bootstrapFromDOM(pane) uniquement
 *   Les cartes déjà dans instances sont ignorées (guard .filter).
 *
 * @param {Element|Document} root — document (défaut) ou pane ciblé
 */
export function initLeaflet(root = document)
{
    if (!_initialized)
    {
        bus.subscribe('leaflet:render', ({ id, type, payload = {} }) => {
            const builder = MAPS[type]
            if (!builder) { console.warn(`[leaflet] type inconnu "${type}"`) ; return }
            renderMap(id, builder(payload))
        })

        bus.subscribe('leaflet:update',  ({ id, payload = {} }) => updateMap(id, buildOsmConfig(payload)))
        bus.subscribe('leaflet:destroy', id => destroyMap(id))
        bus.subscribe('leaflet:list',    () => listMaps())

        _initialized = true
        console.log('[leaflet] initialisé')
    }

    bootstrapFromDOM(root)
}


/* =============================================================================
   6. API Debug
   ========================================================================= */

window.leafletRender  = (id, payload = {}) => bus.publish('leaflet:render',  { id, type: 'osm', payload })
window.leafletUpdate  = (id, payload = {}) => bus.publish('leaflet:update',  { id, payload })
window.leafletDestroy = id                 => bus.publish('leaflet:destroy',  id)
window.leafletList    = ()                 => bus.publish('leaflet:list')
