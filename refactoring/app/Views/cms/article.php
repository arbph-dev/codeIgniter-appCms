<?php
/**
 * app/Views/cms/article.php
 *
 * Variables attendues :
 *  $article — array : title, description, slug, published_at
 *  $content  — string HTML rendu par CmsService::renderArticle()
 */
?>
<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title><?= esc($article['title']) ?></title>

    <!-- ApexCharts : chargé en global (requis avant le module ES) -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

    <style>
    /* ── cms/article standalone ────────────────────────────────────────────── */

    *, *::before, *::after { box-sizing: border-box; margin: 0; }

    body {
        font-family: system-ui, sans-serif;
        font-size: 1rem;
        line-height: 1.6;
        background: #f4f7fb;
        color: #1a2a4a;
        padding: 1.5rem 1rem;
    }

    /* ── Conteneur article ─────────────────────────────────────────────────── */

    .cms_article_wrap {
        max-width: 820px;
        margin: 0 auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, .10);
        overflow: hidden;
    }

    /* ── En-tête ───────────────────────────────────────────────────────────── */

    .cms_article_header {
        padding: 2rem 2rem 1.2rem;
        border-bottom: 4px solid #eee236;
        background: #1a2a4a;
        color: #fff;
    }

    .cms_article_header h1 {
        font-size: clamp(1.3rem, 3vw, 2rem);
        line-height: 1.25;
        color: #eee236;
        margin-bottom: .5rem;
    }

    .cms_article_header p {
        font-size: .95rem;
        opacity: .85;
        margin: 0;
    }

    .cms_article_meta {
        margin-top: .8rem;
        font-size: .8rem;
        opacity: .6;
    }

    /* ── Corps ─────────────────────────────────────────────────────────────── */

    .cms_article_body {
        padding: 1.5rem 2rem 2rem;
    }

    /* ── Sections / Parts produits par CmsService::renderArticle() ─────────── */

    .cms_part {
        margin-bottom: 1.8rem;
    }

    .cms_part_header h3 {
        font-size: 1.1rem;
        margin-bottom: .5rem;
        color: #0057b8;
    }

    .cms_part_content {
        margin-bottom: .5rem;
    }

    .cms_part_aside {
        font-size: .85rem;
        color: #555;
        border-left: 3px solid #eee236;
        padding-left: .8rem;
        margin-top: .5rem;
    }

    /* ── cp_callout intégré ────────────────────────────────────────────────── */
    /* Repris depuis layouts/cms.php pour que la vue standalone soit autonome  */

    :root {
        --col-danger  : #f01313;
        --col-info    : #0000ff;
        --col-note    : #0b9d14;
        --col-warning : #f79503;
    }

    .cp_callout {
        border: 1px solid #5f5e5e;
        margin: 1rem 0;
        border-radius: 5px;
        overflow: hidden;
    }

    .cp_callout_title {
        display: block;
        padding: 8px 12px;
        font-weight: bold;
    }

    .cp_callout_content {
        padding: 10px 12px;
    }

    .cp_callout--info    { border-color: var(--col-info); }
    .cp_callout--info    .cp_callout_title  { background: var(--col-info);    color: #d0d8fd; }
    .cp_callout--info    .cp_callout_content { background: #d0d8fd; color: var(--col-info); }

    .cp_callout--warning { border-color: var(--col-warning); }
    .cp_callout--warning .cp_callout_title  { background: var(--col-warning); color: #fdf3d0; }
    .cp_callout--warning .cp_callout_content { background: #fdf3d0; color: var(--col-warning); }

    .cp_callout--danger  { border-color: var(--col-danger); }
    .cp_callout--danger  .cp_callout_title  { background: var(--col-danger);  color: #fdd8d0; }
    .cp_callout--danger  .cp_callout_content { background: #fdd8d0; color: var(--col-danger); }

    .cp_callout--tip     { border-color: var(--col-note); }
    .cp_callout--tip     .cp_callout_title  { background: var(--col-note);    color: #d0f0da; }
    .cp_callout--tip     .cp_callout_content { background: #d0f0da; color: var(--col-note); }

    /* ── RWD ────────────────────────────────────────────────────────────────── */

    @media (max-width: 600px) {
        .cms_article_header,
        .cms_article_body { padding-left: 1rem; padding-right: 1rem; }
    }
    </style>

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
        import { initCms }    from '/assets/js/cms/bootstrap.js'
        import { bus }        from '/assets/js/core/eventBus.js'

        window.eventBusPublish = (evt, evtName, page) => bus.publish(evtName, page)

        document.addEventListener('DOMContentLoaded', () => {
            initCms()
        })
    </script>

</body>

</html>
