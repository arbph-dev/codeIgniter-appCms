<!-- app/Views/admin/component_types/edit.php -->

<?= $this->extend('layout/default') ?>

<?= $this->section('content') ?>

<h1>Modifier un type de composant</h1>

<form method="post" action="<?= site_url("/admin/component-types/update/{$componentType['id']}") ?>">

    <?= csrf_field() ?>

    <?= $this->include('admin/component_types/form') ?>

    <button type="submit" class="btn btn-primary">
        Enregistrer
    </button>

    <a href="<?= site_url('/admin/component-types') ?>" class="btn btn-secondary">
        Retour
    </a>

</form>

<?= $this->endSection() ?>
