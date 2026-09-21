
- doc : [composant leaflet](/documentation/COMPOSANTS/INDEX.md#51-leaflet-carte)
- source : [/assets/js/components/leaflet.js](/assets/js/components/leaflet.js)

mise au point
```
    panelSections = qsa( "div.section-tab  > div.tab-content > h3" , panel )

 *  · qsa('.cp_leaflet', root)  — scan ciblé sur root (domhelper supporte déjà root)

initLeaflet( root )

window.leafletRender  = (id, payload = {}) => bus.publish('leaflet:render',  { id, type: 'osm', payload })
window.leafletUpdate  = (id, payload = {}) => bus.publish('leaflet:update',  { id, payload })
window.leafletDestroy = id                 => bus.publish('leaflet:destroy',  id)
window.leafletList    = ()                 => bus.publish('leaflet:list')

```

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

initLeaflet()   
```

## Html


```
        <div id="leaflet-0" class="tab-content">
            <h3>Leaflet</h3>
                <p>cartographie</p>
            
                <h4>carte 1</h4>
				<div id="MAP_1" class="cp_leaflet" data-lat="47.82" data-lng="-4.3" data-zoom="11"></div>

        </div>





        $id   = $descriptor->get('id', uniqid('MAP_'));
        $lat  = $descriptor->get('lat', 47.82);
        $lng  = $descriptor->get('lng', -4.30);
        $zoom = $descriptor->get('zoom', 11);

        return <<<HTML
<div
    id="{$id}"
    class="cp_leaflet"
    data-lat="{$lat}"
    data-lng="{$lng}"
    data-zoom="{$zoom}">
</div>

<div id="MAP_1" class="cp_leaflet" data-lat="47.82" data-lng="-4.3" data-zoom="11" tabindex="0" style="position: relative;">
<div id="MAP_1" class="cp_leaflet" data-lat="47.82" data-lng="-4.3" data-zoom="11" tabindex="0" style="position: relative;">

essai : https://zealot.fr/cms/article/test-art
on visualise le code
```html
<div class="cms_part_content">
        <div id="MAP_1" class="cp_leaflet" data-lat="47.82" data-lng="-4.3" data-zoom="11">
	</div>
</div>
```


                        // ── Leaflet ──────────────────────────────
                        [ //  section
                        'id'    => 24,
                        'title' => 'Leaflet',
                        'parts' => [
                            [
                                'id'      => 34,
                                'title'   => 'Leaflet',
                                'content' => '<div class="leafletContainer">
                                                <div id="leafletMap"></div>
                                                <div id="leafletInfo">Some text</div>
                                            </div>',

                                'aside'   => '<button id="testLeafelt" name="testLeafelt" onclick="testLeafelt()">testLeafelt</button>'
                            ] // end part
                        ] // end parts
                        ],  // end section
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
