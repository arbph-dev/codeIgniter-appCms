<!DOCTYPE html>  
<html lang="en">  
  
    <head>  
  
        <meta charset="UTF-8">  
        <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    
        <title><?= $title ?? 'Zealot' ?></title>  
    
        <!-- =====================================================  
        CSS : structure du site  
        ===================================================== -->  
        <link rel="stylesheet" href="/assets/css/test_style.css">  
        <link rel="stylesheet" href="/assets/css/test_themeA.css"> 
        <!--  <link rel="stylesheet" href="/assets/css/test_themeB.css"> --> 
        
        <!-- icones -->  
        <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">  
        <!-- =====================================================  
        # SCRIPT 
        - VOIR <script {csp-script-nonce}></script>
         2026-03-19 : Edition du layout pour séparer script test_main.js et sytle : test_style.css</p>
        ===================================================== -->    
        <script src="/assets/js/test_main.js" type="module"></script>  
        
        <!-- -------------------------------  apex ------------------------------------  -->
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>        
        
        <!-- -------------------------------  leaflet ------------------------------------  -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-tilelayer-wmts@1.0.0/dist/leaflet-tilelayer-wmts.js"></script>
            <!-- Extension Géoplateforme pour Leaflet -->
        <script src="/assets/js/plugins/GpPluginLeaflet.js"></script>
        <link rel="stylesheet" href="/assets/css/GpPluginLeaflet.css"/>
        
        <!-- -------------------------------  threejs ------------------------------------  -->
        <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
            }
        }
        </script>

    </head>  
  
<body>  
  
<?= $this->include('layouts/header') ?>  
  
<?= $this->renderSection('nav') ?>  
  
<main>  
  
<?= $this->renderSection('content') ?>  
  
</main>  
  
<?= $this->include('layouts/footer') ?>  
  
</body>  
  
</html>