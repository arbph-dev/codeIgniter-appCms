<?php
/**
 * app/Views/cms/libs.php
 *
 * Dépendances globales du CMS.
 * Lorsqu'un composant nécessite une bibliothèque ou un CSS,
 * c'est ici qu'elle est déclarée.
 */
?>

<!-- ===================================================================== -->
<!-- Bibliothèques externes -->
<!-- ===================================================================== -->

<!-- ApexCharts -->
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

<!-- Leaflet -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>


<!-- Three.js -->
<script type="importmap">
{
    "imports": {
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
}
</script>
<!-- ===================================================================== -->
<!-- Composants CMS -->
<!-- ===================================================================== -->

<link rel="stylesheet" href="/assets/css/components/callout.css">

<link rel="stylesheet" href="/assets/css/components/leaflet.css">

<link rel="stylesheet" href="/assets/css/components/threejs.css">
<!-- ===================================================================== -->
<!-- CMS -->
<!-- ===================================================================== -->

<link rel="stylesheet" href="/assets/css/cms/article.css">
<link rel="stylesheet" href="/assets/css/components/workbench.css">
