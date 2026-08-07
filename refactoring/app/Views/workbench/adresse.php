<?php
// app/Views/workbench/adresse.php
// Banc de test — AdresseWorkbench
// URL : /workbench/adresse
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workbench — Mot</title>

    <!-- Styles applicatifs existants -->
    <link rel="stylesheet" href="/assets/css/workbench/theme_one.css">
    <link rel="stylesheet" href="/assets/css/workbench/workbench.css">
    
    <!-- Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="/assets/css/components/leaflet.css">

</head>
<body>

    <div id="adresseWorkbench"></div>

    <script type="module">
        import AdressseWorkbench from '/assets/js/ui/workbench/adresse/AdresseWorkbench.js';
        const wb = new AdressseWorkbench();
        await wb.init('#adresseWorkbench');
    </script>

</body>
</html>
