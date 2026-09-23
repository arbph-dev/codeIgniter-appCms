
- doc : [composant leaflet](/documentation/COMPOSANTS/INDEX.md#51-leaflet-carte)
- source : [/assets/js/components/leaflet.js](/assets/js/components/leaflet.js)

## Historique
2026-09-23 : Modifier leaflet.js et AdresseWorkbench.js
- '/assets/js/components/leaflet.js'
- '/assets/js/ui/workbench/adresse/AdresseWorkbench.js'

## dependances
- [app/Views/cms/index.php - ligne21](/old/app/Views/cms/index.php)

a inclure dans 

```html
    <!-- -------------------------------  leaflet ------------------------------------  -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <link rel="stylesheet" href="/assets/css/GpPluginLeaflet.css"/>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-tilelayer-wmts@1.0.0/dist/leaflet-tilelayer-wmts.js"></script>
    <!-- Extension Géoplateforme pour Leaflet -->
    <script src="/assets/js/plugins/GpPluginLeaflet.js"></script>
```

## js
```
import { initLeaflet }  from '/assets/js/components/leaflet.js'

// initLeaflet()
/*non il faut que le container soit visible */
```

**mise au point**
Leaflet doit être initialise lorsque le container est visible sinon il bug

dans uiapp.js
```js
function switchSection(index) {
	...
  panel_Sections[index].classList.add("active")
  panel_header_Buttons[index].classList.add("active")
  // passe element a afficher, si il contient une carte leaflet elle est initialisée a l'affichage sinon leaflet plante
  initLeaflet(panel_Sections[index])
	...
```

```
window.leafletRender  = (id, payload = {}) => bus.publish('leaflet:render',  { id, type: 'osm', payload })
window.leafletUpdate  = (id, payload = {}) => bus.publish('leaflet:update',  { id, payload })
window.leafletDestroy = id                 => bus.publish('leaflet:destroy',  id)
window.leafletList    = ()                 => bus.publish('leaflet:list')
```




## Html


```html
        <div id="leaflet-0" class="tab-content">
            <h3>Leaflet</h3>
                <p>cartographie</p>
            
                <h4>carte 1</h4>
				<div id="MAP_1" class="cp_leaflet" data-lat="47.82" data-lng="-4.3" data-zoom="11"></div>

        </div>
```

```
<div class="cms_part_content">
        <div id="MAP_1" class="cp_leaflet" data-lat="47.82" data-lng="-4.3" data-zoom="11">
	</div>
</div>
```


## css

```css

/* /refactoring/assets/css/components/leaflet.css ------------------------------------------------ */

.cp_leaflet { width:100%; height:400px; }
/* autre ?? ------------------------------------------------ */
            .leafletContainer{  display: flex;  flex-direction: column; }

            #leafletMap{
                flex: 1 0 auto;
                padding: 5px;
                height: 40vh;
                box-shadow: 0 0 10px #999;
            }

            #leafletInfo{
                flex: 0 1 auto;
                padding: 1vw;
                height: 10vh;
            }
```

# Code

a voir markers
```

    this.markers = []
    // API Publique
    addMarker(lat, lng, options = {}) {
        const marker = window.L.marker([lat, lng])
        
        if (options.popup) {
            marker.bindPopup(options.popup)
        }
        
        marker.addTo(this.map)
        this.markers.push(marker)
        
        return marker
    }
    
    clearMarkers() {
        this.markers.forEach(marker => marker.remove())
        this.markers = []
    }
    
    fitBounds(markers) {
        if (markers.length > 0) {
            const group = window.L.featureGroup(markers)
            this.map.fitBounds(group.getBounds())
        }
    }
```




Pour éviter la bidouille on a modifier uiapp.js, ce code pourra servir

```
/*  ======================================================================================================================  
Pour éviter la bidouille on a ajouter : ligne 55
  function switchSection(index) {
  ...
    initLeaflet(panel_Sections[index])
  ...    


 function LeafTestbus(){

  const MAP_ID       = 'MAP_1'
  const DEFAULT_LAT  = 47.82
  const DEFAULT_LNG  = -4.30
  const DEFAULT_ZOOM = 10
  const DETAIL_ZOOM  = 14

  bus.publish('leaflet:render', {
      id      : MAP_ID,
      type    : 'osm',
      payload : {
          lat  : DEFAULT_LAT,
          lng  : DEFAULT_LNG,
          //lng  : parseFloat(adresse.longitude) || DEFAULT_LNG,
          zoom : DEFAULT_ZOOM,
      }
  })
  //window.leafletRender  = (id, payload = {})
}

window.LeafTest = LeafTestbus
*/
```
