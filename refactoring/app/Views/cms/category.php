<?php
/**
 * app/Views/cms/category.php
 *
 * Variables attendues :
 *  $category — array : title, slug, description, articles[]
 *
 * Champs article disponibles :
 *  title, slug, description, published_at
 */

$count = count($category['articles']);
?>

<style>
/* ── cms_category ─────────────────────────────────────────────────────────── */

.cms_category {
    padding: 1.5rem 1rem;
    max-width: 860px;
    margin: 0 auto;
}

.cms_category_header {
    margin-bottom: 1.5rem;
    border-bottom: 3px solid var(--col-A, #eee236);
    padding-bottom: 1rem;
}

.cms_category_header h1 {
    margin: 0 0 .4rem;
}

.cms_category_description {
    margin: .3rem 0 .8rem;
    opacity: .85;
}

.cms_category_count {
    font-size: .85rem;
    font-weight: 600;
    color: var(--textcolor, darkblue);
    opacity: .7;
}

/* ── liste articles ──────────────────────────────────────────────────────── */

.cms_article_list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: .8rem;
}

.cms_article_card {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: 1rem 1.2rem;
    border-radius: 6px;
    border-left: 5px solid var(--col-A, #eee236);
    background-color: var(--col-E, #fff);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .10);
    transition: box-shadow .2s ease;
}

.cms_article_card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, .18);
}

.cms_article_card_title {
    margin: 0;
    font-size: 1.1rem;
}

.cms_article_card_title a {
    color: var(--textcolor, darkblue);
    text-decoration: none;
}

.cms_article_card_title a:hover {
    text-decoration: underline;
}

.cms_article_card_description {
    margin: 0;
    font-size: .9rem;
    opacity: .8;
    line-height: 1.5;
}

.cms_article_card_footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .5rem;
    margin-top: .3rem;
}

.cms_article_card_date {
    font-size: .8rem;
    opacity: .6;
}

.cms_category_empty {
    font-style: italic;
    opacity: .7;
    padding: 1rem 0;
}

/* ── RWD ────────────────────────────────────────────────────────────────── */

@media (min-width: 600px) {
    .cms_article_card {
        flex-direction: row;
        align-items: center;
    }
    .cms_article_card_body {
        flex: 1 1 auto;
    }
    .cms_article_card_footer {
        flex: 0 0 auto;
        flex-direction: column;
        align-items: flex-end;
        margin-top: 0;
    }
}
</style>

<section class="cms_category">

    <header class="cms_category_header">

        <h1><?= esc($category['title']) ?></h1>

        <?php if (!empty($category['description'])) : ?>
            <p class="cms_category_description">
                <?= esc($category['description']) ?>
            </p>
        <?php endif; ?>

        <p class="cms_category_count">
            <?= $count ?> article<?= $count > 1 ? 's' : '' ?>
        </p>

    </header>

    <?php if ($count === 0) : ?>

        <p class="cms_category_empty">Aucun article publié dans cette catégorie.</p>

    <?php else : ?>

        <ul class="cms_article_list">

            <?php foreach ($category['articles'] as $article) : ?>

                <li class="cms_article_card">

                    <div class="cms_article_card_body">

                        <h2 class="cms_article_card_title">
                            <a href="<?= site_url('cms/article/' . $article['slug']) ?>">
                                <?= esc($article['title']) ?>
                            </a>
                        </h2>

                        <?php if (!empty($article['description'])) : ?>
                            <p class="cms_article_card_description">
                                <?= esc($article['description']) ?>
                            </p>
                        <?php endif; ?>

                    </div>

                    <footer class="cms_article_card_footer">

                        <?php if (!empty($article['published_at'])) : ?>
                            <time
                                class="cms_article_card_date"
                                datetime="<?= esc($article['published_at']) ?>">
                                <?= date('d/m/Y', strtotime($article['published_at'])) ?>
                            </time>
                        <?php endif; ?>

                        <a
                            class="cp_btn cp_btn--primary"
                            href="<?= site_url('cms/article/' . $article['slug']) ?>">
                            Lire &rarr;
                        </a>

                    </footer>

                </li>

            <?php endforeach; ?>

        </ul>

    <?php endif; ?>

</section>
