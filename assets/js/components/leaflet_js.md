
- [doc composant leaflet](/documentation/COMPOSANTS/INDEX.md#51-leaflet-carte)


dependances
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


css

```css
            /* leaflet ---------------------------------------------------------------- */
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
