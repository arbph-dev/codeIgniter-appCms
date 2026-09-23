
- doc : [composant leaflet](/documentation/COMPOSANTS/INDEX.md#51-leaflet-carte)
- source : [/assets/js/components/leaflet.js](/assets/js/components/leaflet.js)

## Historique


# 2026-09-20
## Leaflet
Le composant est fontionnel et intégré, l'ajout de AdresseWorkbench interfere

```html
<div class="panel-card" data-index="0">
               <div id="leaflet-0" class="tab-content">
                    <h3>Leaflet</h3>
                        <p>cartographie</p>
                        <h4>carte 1</h4>
                        <div id="MAP_1" class="cp_leaflet" data-lat="47.82" data-lng="-4.3" data-zoom="14"></div>
```
- AdresseWorkbench.js - ligne 69 appel initLeaflet
- AdresseListPanel.js utilise le bus (a détailler) sur un clic dans la liste des adresses

```js
  //AdresseWorkbench.js - ligne 69
  async bootstrap()
    {
        // 1. Leaflet — guard _initialized empêche le double abonnement
        initLeaflet()
```



### 2026-09-23 : Modifier leaflet.js et AdresseWorkbench.js
- [project/daily/2026-09-22-002.md](/project/daily/2026-09-22-002.md)
- '/assets/js/components/leaflet.js'
- '/assets/js/ui/workbench/adresse/AdresseWorkbench.js'

On extrait les bus.subscribe(...) dans initLeafletEngine() et on ajoute ensureLeaflet().
```js
/* ====  5. INDEX	===== */
let _initialized = false   // guard : bus souscrit une seule fois
/**
 * Initialise uniquement le moteur Leaflet :
 * - abonnement aux événements du bus
 * - aucune recherche dans le DOM
 * - aucune création de carte
 * Utile pour les Workbench dont les cartes sont créées explicitement via leaflet:render.
 */
function initLeafletEngine()
{
    if (_initialized) return

    bus.subscribe('leaflet:render', ({ id, type, payload = {} }) => {
        const builder = MAPS[type]
        if (!builder) {
            console.warn(`[leaflet] type inconnu "${type}"`)
            return
        }
        renderMap(id, builder(payload))
    })

    bus.subscribe('leaflet:update', ({ id, payload = {} }) =>
        updateMap(id, buildOsmConfig(payload))
    )

    bus.subscribe('leaflet:destroy', id =>
        destroyMap(id)
    )

    bus.subscribe('leaflet:list', () =>
        listMaps()
    )

    _initialized = true
    console.log('[leaflet] initialisé')
}


/**
 * Garantit que le moteur Leaflet est initialisé.
 *
 * IMPORTANT :
 * cette fonction ne scanne pas le DOM et ne crée aucune carte.
 */
export function ensureLeaflet()
{
    initLeafletEngine()
}


/**
 * Initialise Leaflet puis découvre les cartes statiques
 * présentes dans root.
 *
 * Compatibilité descendante :
 * initLeaflet() continue donc à fonctionner comme auparavant.
 */
export function initLeaflet(root = document)
{
    initLeafletEngine()
    bootstrapFromDOM(root)
}
```

Avant : 
- initLeaflet() provoquait :abonnement bus + scan DOM + création éventuelle des cartes

Maintenant : 
- `ensureLeaflet()` provoque uniquement : abonnement bus 
- `initLeaflet(section)` continue de provoquer : abonnement bus si nécessaire + scan de section + rendu des .cp_leaflet

Aucune modification nécessaire dans uiapp.js.

Dans AdresseWorkbench.js, on pourra temporairement remplacer : `import { initLeaflet } from '/assets/js/components/leaflet.js'` / `initLeaflet()`

par : `import { ensureLeaflet } from '/assets/js/components/leaflet.js'` / `ensureLeaflet()`

Le Workbench pourra alors s'initialiser sans demander à Leaflet de créer une carte dans un conteneur caché.

Les cartes statiques doivent, elles, continuer à passer par : `initLeaflet(panel_Sections[index])`







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
