// /assets/js/plugins/mapleaflet.js
//
// ══════════════════════════════════════════════════════════════════════════════
// Wrapper Leaflet + IGN — rendu différé jusqu'à ce que le conteneur soit visible.
//
// Problème initial : L.map() sur un div masqué (display:none) calcule
// une taille 0×0 ; la carte s'affiche ensuite cassée.
//
// Solution : initLeaflet() s'appelle au chargement de la page.
//   1. Pré-charge la config IGN en background (getConfig)
//   2. Souscrit à tabs:switch
//   3. Quand l'article contenant #leafletMap devient visible → crée la carte
//
// La carte n'est créée qu'une seule fois (flag `mapCreated`).
// ══════════════════════════════════════════════════════════════════════════════

import { bus } from '/assets/js/core/eventBus.js'

let Gp          = null
let mapCreated  = false
let configReady = false

// ── Config IGN ────────────────────────────────────────────────────────────────

function preloadIgnConfig() {
    if (!Gp) return
    Gp.Services.getConfig({
        apiKey  : 'essentiels',
        onSuccess: () => {
            configReady = true
            console.log('[mapleaflet] config IGN chargée')
        },
        onFailure: (e) => console.error('[mapleaflet] config IGN error', e),
    })
}

// ── Création de la carte ──────────────────────────────────────────────────────

function createIgnMap() {
    if (mapCreated) return
    mapCreated = true

    console.log('[mapleaflet] création carte — Leaflet', L.version, '/ IGN', Gp?.leafletExtVersion)

    const map = L.map('leafletMap', {
        gestureHandling   : true,
        attributionControl: false,
    }).setView([47.82, -4.30], 11)

    // Couches
    const lyrOrtho    = L.geoportalLayer.WMTS({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS' })
    const lyrMaps     = L.geoportalLayer.WMTS({ layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' }, { opacity: 0.5 })
    const lyrCadastre = L.geoportalLayer.WMTS({ layer: 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS' }, { opacity: 1 })

    const lyrSHOM_Epave = L.tileLayer.wmts('https://services.data.shom.fr/INSPIRE/wmts', {
        layer        : 'EPAVES_PYR-PNG_WLD_3857_WMTS',
        tilematrixSet: '3857',
        format       : 'image/png',
        style        : 'normal',
    })

    const lyrSHOM_Raster = L.tileLayer.wmts('https://services.data.shom.fr/INSPIRE/wmts', {
        layer        : 'SCAN-LITTO_PYR-PNG_WLD_3857_WMTS',
        tilematrixSet: '3857',
        format       : 'image/png',
        style        : 'normal',
    })

    const lyrOSM = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>', opacity: 0.5 }
    )

    // Ajout des couches
    ;[lyrOrtho, lyrMaps, lyrOSM, lyrCadastre, lyrSHOM_Epave, lyrSHOM_Raster]
        .forEach(lyr => map.addLayer(lyr))

    // Marqueurs de test
    const points = [
        { name: 'Point A', cgps: [47.84, -4.35] },
        { name: 'Point B', cgps: [47.84, -4.25] },
        { name: 'Point C', cgps: [47.82, -4.30] },
        { name: 'Point D', cgps: [47.80, -4.25] },
        { name: 'Point E', cgps: [47.80, -4.35] },
    ]
    points.forEach(p => L.marker(p.cgps).addTo(map))

    // Sélecteur de couches IGN
    const layerSwitcher = L.geoportalControl.LayerSwitcher({
        layers: [
            { layer: lyrMaps,        config: { visibility: false } },
            { layer: lyrOSM,         config: { visibility: false, title: 'OSM' } },
            { layer: lyrCadastre,    config: { visibility: false } },
            { layer: lyrSHOM_Epave,  config: { visibility: false, title: 'ÉPAVES' } },
            { layer: lyrSHOM_Raster, config: { visibility: false, title: 'SHOM map' } },
            { layer: lyrOrtho,       config: { visibility: true,  title: 'PHOTOS' } },
        ],
    })
    map.addControl(layerSwitcher)

    // Info panel
    const infoEl = document.getElementById('leafletInfo')
    if (infoEl && Gp) {
        infoEl.innerHTML =
            `<p>Leaflet ${L.version} — IGN plugin ${Gp.leafletExtVersion} (${Gp.leafletExtDate})</p>`
    }
}

// ── Vérification : l'article contenant #leafletMap est-il celui qui vient d'être affiché ? ──

function tryCreateMap(articleId) {
    if (mapCreated) return
    const mapEl = document.getElementById('leafletMap')
    if (!mapEl) return

    const article = mapEl.closest('article')
    if (!article || article.id !== articleId) return

    // Si la config IGN n'est pas encore prête, on attend le callback
    if (configReady) {
        createIgnMap()
    } else {
        // Dernier recours : recharger la config puis créer
        Gp?.Services.getConfig({
            apiKey   : 'essentiels',
            onSuccess: () => { configReady = true; createIgnMap() },
            onFailure: (e) => console.error('[mapleaflet] config IGN error', e),
        })
    }
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initLeaflet() {
    Gp = window.Gp

    if (!Gp) {
        console.warn('[mapleaflet] window.Gp non disponible — plugin IGN absent ?')
        return
    }

    // Pré-charge la config dès l'init (sans attendre le clic)
    preloadIgnConfig()

    // Souscrit au bus : créera la carte quand l'onglet sera visible
    bus.subscribe('tabs:switch', ({ name }) => tryCreateMap(name))
    bus.subscribe('nav:goto', ( o) => tryCreateMap(o.articleId))

    console.log('[mapleaflet] init — en attente de tabs:switch')
}


window.testLeafelt = () => {console.log("/assets/js/plugins/mapleaflet.js :: a implementer")}