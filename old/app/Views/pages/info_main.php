//app/Views/pages/info_main.php

<?= $this->extend('layouts/layout_main') ?>

<?= $this->section('content') ?>

    <?= $this->include('pages/informatique/devlogs') ?>

    <?= $this->include('pages/informatique/langages', $langages ) ?>
          
<?= $this->endSection() ?>




