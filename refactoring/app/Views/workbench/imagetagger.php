<?php
// app/Views/workbench/imagetagger.php
// Banc de test — ImageTaggerWorkbench
// URL : /workbench/imagetagger
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workbench — ImageTagger</title>

    <!-- Styles applicatifs existants -->
    <link rel="stylesheet" href="/assets/css/workbench/theme_one.css">
    <link rel="stylesheet" href="/assets/css/workbench/workbench.css">
    <link rel="stylesheet" href="/assets/css/workbench/image.css">
    <link rel="stylesheet" href="/assets/css/workbench/tagger.css">    
</head>
<body>

    <div id="imagetaggerWorkbench"></div>

    <script type="module">
        import ImageTaggerWorkbench from '/assets/js/ui/workbench/imagetagger/ImageTaggerWorkbench.js';
        const wb = new ImageTaggerWorkbench();
        await wb.init('#imagetaggerWorkbench');
    </script>

</body>
</html>