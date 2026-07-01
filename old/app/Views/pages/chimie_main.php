//app/Views/pageschimie_main.php

<?= $this->extend('layouts/layout_main') ?>

<?= $this->section('content') ?>

<div id="Chimie" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1><?= esc($title) ?></h1>
            <p><?= esc($intro) ?></p>
        </header>


            <?= $this->include('pages/chimie/unites', $unitesData ) ?>
            



    </article>

</div>

<?= $this->endSection() ?>
