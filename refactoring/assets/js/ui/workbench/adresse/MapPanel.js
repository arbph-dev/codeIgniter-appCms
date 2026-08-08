// assets/js/ui/workbench/adresse/MapPanel.js
// ─────────────────────────────────────────────────────────────────────────────
// Wrapper Panel autour du composant Leaflet existant.
//
// Stratégie bus :
//   • Premier show() → leaflet:render  (crée la carte, _mapReady = true)
//   • Appels suivants → leaflet:update (pan sans destruction — UX fluide)
//   • clear()        → leaflet:update  (retour au centre par défaut)
//   • destroy()      → leaflet:destroy (libère l'instance Leaflet)
//
// Prérequis : initLeaflet() doit avoir été appelé une fois avant le premier
// show(), pour que les bus subscriptions soient enregistrées.
// AdresseWorkbench.bootstrap() s'en charge.
//
// Coordonnées par défaut : centre Bretagne (cohérent avec leaflet.js : 47.82 / -4.30)
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { create, clear } from '/assets/js/core/domhelper.js'
import { toolbar }       from '/assets/js/ui/shared/templates/toolbar.template.js'
import { bus }           from '/assets/js/core/eventBus.js'

const MAP_ID      = 'wb_adresse_map'
const DEFAULT_LAT =  47.82
const DEFAULT_LNG =  -4.30
const DEFAULT_ZOOM = 10
const DETAIL_ZOOM  = 14

export class MapPanel extends PanelBase
{
    constructor()
    {
        super()
        this.element   = null
        this.bodyEl    = null
        this._mapReady = false   // true dès que leaflet:render a été publié
    }

    // ── API publique ──────────────────────────────────────────────────────────

    render()
    {
        this.element = create('section', { class: 'wb_map_panel' })

        const header = toolbar({ title: 'Carte' })

        this.bodyEl = create('div', { class: 'wb_panel_body wb_map_body' })

        // Conteneur Leaflet — ID fixe, dimensions définies en CSS
        const mapContainer = create('div', {
            id    : MAP_ID,
            class : 'wb_map_container',
        })

        this.bodyEl.appendChild(mapContainer)
        this.element.append(header, this.bodyEl)

        return this.element
    }

    /**
     * Centre la carte sur l'adresse.
     * Crée la carte au premier appel, la fait pivoter ensuite.
     *
     * @param {object|null} adresse  — {adr_lat, adr_lng, …}
     */
    show(adresse)
    {
        const lat  = parseFloat(adresse?.adr_lat)  || DEFAULT_LAT
        const lng  = parseFloat(adresse?.adr_lng)  || DEFAULT_LNG
        const zoom = (adresse?.adr_lat) ? DETAIL_ZOOM : DEFAULT_ZOOM

        if (!this._mapReady)
        {
            // Création initiale — leaflet:render détruit l'instance existante
            // si elle existe (appels répétés à show() avant la fin du render)
            bus.publish('leaflet:render', {
                id      : MAP_ID,
                type    : 'osm',
                payload : { lat, lng, zoom },
            })
            this._mapReady = true
        }
        else
        {
            // Pan fluide — pas de destruction / recréation
            bus.publish('leaflet:update', {
                id      : MAP_ID,
                payload : { lat, lng, zoom },
            })
        }
    }

    /**
     * Retour au centre par défaut (pas de destruction de carte).
     */
    clear()
    {
        if (!this._mapReady) return

        bus.publish('leaflet:update', {
            id      : MAP_ID,
            payload : { lat: DEFAULT_LAT, lng: DEFAULT_LNG, zoom: DEFAULT_ZOOM },
        })
    }

    /**
     * Libère l'instance Leaflet et les références DOM.
     */
    destroy()
    {
        if (this._mapReady)
        {
            bus.publish('leaflet:destroy', MAP_ID)
            this._mapReady = false
        }

        this.element = null
        this.bodyEl  = null
    }
}

export default MapPanel
