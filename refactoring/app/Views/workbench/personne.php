<?php
// app/Views/workbench/personne.php
// Banc de test — PersonneWorkbench
// URL : /workbench/personne
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workbench — Personne</title>

    <!-- Styles applicatifs existants -->
    <link rel="stylesheet" href="/assets/css/workbench/theme_one.css">
    <link rel="stylesheet" href="/assets/css/workbench/workbench.css">
    <link rel="stylesheet" href="/assets/css/workbench/organisation.css">
    <link rel="stylesheet" href="/assets/css/workbench/dialog.css">
    <link rel="stylesheet" href="/assets/css/workbench/forms.css">


</head>
<body>

    <div id="PersonneWorkbench"></div>

    <script type="module">
        import PersonneWorkbench from '/assets/js/ui/workbench//personne/PersonneWorkbench.js';
        const wb = new PersonneWorkbench();
        await wb.init('#PersonneWorkbench');
    </script>

</body>
</html>