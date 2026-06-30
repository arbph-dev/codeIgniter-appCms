<li>

    <?= esc($node['node_icon']) ?>

    <?= esc($node['node_title']) ?>


    <?php if (!empty($node['_admin'])): ?>

        <?php foreach ($node['_admin'] as $action => $url): ?>

            <a href="<?= esc($url) ?>">
                [<?= esc($action) ?>]
            </a>

        <?php endforeach; ?>

    <?php endif; ?>


    <?php if (!empty($node['children'])): ?>

        <ul>

            <?php foreach ($node['children'] as $child): ?>

                <?= view(
                    'admin/cmstree/node',
                    [
                        'node' => $child
                    ]
                ) ?>

            <?php endforeach; ?>

        </ul>

    <?php endif; ?>

</li>