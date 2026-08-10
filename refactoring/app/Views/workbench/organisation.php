<?php
// app/Views/workbench/organisation.php
// Banc de test — OrganisationWorkbench
// URL : /workbench/organisation
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workbench — Organisation</title>

    <!-- Styles applicatifs existants -->
    <link rel="stylesheet" href="/assets/css/workbench/theme_one.css">
    <link rel="stylesheet" href="/assets/css/workbench/workbench.css">
    <link rel="stylesheet" href="/assets/css/workbench/organisation.css">
    <link rel="stylesheet" href="/assets/css/workbench/dialog.css">
    <link rel="stylesheet" href="/assets/css/workbench/forms.css">


    <!-- Leaflet 
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="/assets/css/components/leaflet.css">
    -->
</head>
<body>

    <div id="organisationWorkbench"></div>

    <script type="module">
        import OrganisationWorkbench from '/assets/js/ui/workbench/organisation/OrganisationWorkbench.js';
        const wb = new OrganisationWorkbench();
        await wb.init('#organisationWorkbench');
    </script>

</body>
</html>
