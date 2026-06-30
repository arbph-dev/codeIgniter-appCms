<h1>CMS Tree</h1>

<ul>

<?php foreach ($tree as $node): ?>

    <?= view(
        'admin/cmstree/node',
        [
            'node' => $node
        ]
    ) ?>

<?php endforeach ?>

</ul>
