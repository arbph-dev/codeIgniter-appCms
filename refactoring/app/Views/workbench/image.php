<?php
// app/Views/workbench/image.php
// Banc de test — ImageWorkbench
// URL : /workbench/image
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
    <link rel="stylesheet" href="/assets/css/workbench/image.css">
</head>
<body>

    <div id="imageWorkbench"></div>

    <script type="module">
        import ImageWorkbench from '/assets/js/ui/workbench/image/ImageWorkbench.js';
        const wb = new ImageWorkbench();
        await wb.init('#imageWorkbench');
    </script>

</body>
</html>








