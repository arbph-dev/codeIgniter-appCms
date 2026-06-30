<?php
// app/Views/cms/section.php

/**
 * Variables attendues :
 *
 * $section
 * $content
 */

?>

<section
    id="<?= esc($section['slug'] ?? ('section-' . $section['id'])) ?>"
    class="cms_section">

    <header>

        <h2>
            <?= esc($section['title']) ?>
        </h2>

    </header>

    <div class="cms_section_content">

        <?= $content ?>

    </div>

</section>