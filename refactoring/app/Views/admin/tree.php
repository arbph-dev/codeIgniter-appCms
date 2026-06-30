<?php
/**
 * app/Views/cms/tree.php
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
    <title>CMS Tree</title>
</head>

<body>

    <article>

        <header>
            <h1>CMS Tree</h1>
        </header>

        <main>
            <?= print_r($tree); ?>
        </main>

    </article>

    
</body>

</html>
