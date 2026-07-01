<?= $this->extend('layouts/layout_nonav') ?>

<?= $this->section('nav') ?>
<nav>

<a href="/technologies/">technologies</a> - <a href="/technologies/<?= $rubrique ?>"><?= $rubrique ?></a>

    <?php foreach ($nav as $item): ?>
        <a href="<?= $item['url'] ?>"><?= $item['label'] ?></a>
    <?php endforeach; ?>
</nav>
<?= $this->endSection() ?>

<?= $this->section('content') ?>
    <?= $this->include($content) ?>
<?= $this->endSection() ?>