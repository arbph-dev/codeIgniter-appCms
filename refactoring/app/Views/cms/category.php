<?php
/**
 * Variables :
 * $category
 */
?>

<section class="cms_category">

    <h1>
        <?= esc($category['title']) ?>
    </h1>

    <?php if (!empty($category['description'])) : ?>

        <p>
            <?= esc($category['description']) ?>
        </p>

    <?php endif; ?>

    <ul>

        <?php foreach ($category['articles'] as $article) : ?>

            <li>

            <a href="<?= site_url('cms/article/' . $article['slug']) ?>">
                <?= esc($article['title']) ?>
            </a>

            </li>

        <?php endforeach; ?>

    </ul>

</section>