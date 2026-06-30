<?php
/**
 * app/Views/cms/article.php
 *
 * Variables attendues :
 *  $article
 *  $content
 */
?>
<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="utf-8">

    <title><?= esc($article['title']) ?></title>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</head>

<body>

    <article>

        <header>

            <h1><?= esc($article['title']) ?></h1>

            <?php if (!empty($article['description'])) : ?>

                <p>
                    <?= esc($article['description']) ?>
                </p>

            <?php endif; ?>

        </header>

        <main>

            <?= $content ?>

        </main>

    </article>

    <script type="module">
    import { initCms }from '/assets/js/cms/bootstrap.js'
    import { bus } from '/assets/js/core/eventBus.js'        
    
    window.eventBusPublish= (evt , EvtName  , Page )=> { bus.publish( EvtName, Page ) }

    document.addEventListener(    'DOMContentLoaded',    () => initCms())
    </script>
    
</body>

</html>