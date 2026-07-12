<?php
/**
 * app/Views/cms/article.php
 *
 * Variables :
 *  $article
 *  $content
 */
?>
<!DOCTYPE html>

<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title><?= esc($article['title']) ?></title>

    <!-- Bibliothèques externes -->
    <?= view('cms/libs') ?>
</head>

<body>

<div class="cms_article_wrap">

    <header class="cms_article_header">

        <h1><?= esc($article['title']) ?></h1>

        <?php if (!empty($article['description'])) : ?>

            <p><?= esc($article['description']) ?></p>

        <?php endif; ?>


        <?php if (!empty($article['published_at'])) : ?>

            <p class="cms_article_meta">

                Publié le

                <time datetime="<?= esc($article['published_at']) ?>">

                    <?= date('d/m/Y', strtotime($article['published_at'])) ?>

                </time>

            </p>

        <?php endif; ?>

    </header>


    <main class="cms_article_body">

        <?= $content ?>

    </main>

</div>


<script type="module">

    import { initCms } from '/assets/js/cms/bootstrap.js'

    import { bus } from '/assets/js/core/eventBus.js'

    window.eventBusPublish = (evt, evtName, page) =>
        bus.publish(evtName, page)

    document.addEventListener('DOMContentLoaded', initCms)

</script>

</body>

</html>
