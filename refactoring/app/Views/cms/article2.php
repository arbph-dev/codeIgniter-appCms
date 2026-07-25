<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= esc($article['title'] ?? 'Article') ?></title>
    
    <?= view('cms/libs') ?>
</head>
<body>

<div id="wb-container"></div>

<script type="module">
    import { createCmsArticleWorkbench } from '/assets/js/ui/workbench/layouts/CmsArticleWorkbench.js';

    document.addEventListener('DOMContentLoaded', () => {
        const wb = createCmsArticleWorkbench('#wb-container');
        
        // Respect du contrat original : $article + $content
        wb.loadFromPHP(
            <?= json_encode($article, JSON_UNESCAPED_UNICODE) ?>,
            <?= json_encode($content, JSON_UNESCAPED_UNICODE) ?>
        );
    });
</script>

</body>
</html>