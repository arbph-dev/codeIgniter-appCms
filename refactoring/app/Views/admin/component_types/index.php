<!-- app/Views/admin/component_types/index.php -->

<?= $this->extend('layout/default') ?>

<?= $this->section('content') ?>

<h1>Types de composants</h1>

<p>
    <a
        href="<?= site_url('/admin/component-types/create') ?>"
        class="btn btn-primary">
        Nouveau type
    </a>
</p>

<table class="table table-striped table-hover">

    <thead>
        <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Actif</th>
            <th width="180">Actions</th>
        </tr>
    </thead>

    <tbody>

    <?php foreach ($componentTypes as $type): ?>

        <tr>

            <td><?= esc($type['id']) ?></td>

            <td><?= esc($type['name']) ?></td>

            <td><?= esc($type['description']) ?></td>

            <td>
                <?= $type['is_active'] ? '✅' : '❌' ?>
            </td>

            <td>

                <a
                    href="<?= site_url('/admin/component-types/edit/' . $type['id']) ?>"
                    class="btn btn-sm btn-primary">
                    Modifier
                </a>

                <a
                    href="<?= site_url('/admin/component-types/delete/' . $type['id']) ?>"
                    class="btn btn-sm btn-danger"
                    onclick="return confirm('Supprimer ce type de composant ?');">
                    Supprimer
                </a>

            </td>

        </tr>

    <?php endforeach; ?>

    </tbody>

</table>

<?= $this->endSection() ?>
