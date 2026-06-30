<?php
// app/Views/cms/part.php

/**
 * Variables attendues :
 *
 * $part
 * $content
 */

?>

<article
    class="cms_part"
    data-part-id="<?= esc($part['id']) ?>">

    <?php if (!empty($part['title'])) : ?>

        <header class="cms_part_header">

            <h3>
                <?= esc($part['title']) ?>
            </h3>

        </header>

    <?php endif; ?>

    <div class="cms_part_content">

        <?= $content ?>

    </div>

    <?php if (!empty($part['aside'])) : ?>

        <aside class="cms_part_aside">

            <?= $part['aside'] ?>

        </aside>

    <?php endif; ?>

</article>
