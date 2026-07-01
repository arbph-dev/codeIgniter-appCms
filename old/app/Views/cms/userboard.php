<?= $this->extend('layouts/cms_w3c') ?> 

<?= $this->section('title') ?>
    User Board
<?= $this->endSection() ?>





<?= $this->section('main') ?>
    <div id="main" class="w3-content">

        <div class="w3-container w3-indigo">
            <p><a href="/">Accueil</a> | <a href="/logout">logout</a></p>
        </div>

        <h1>Userboard</h1>

        <p>Bienvenue <?= auth()->user()->username ?></p>

    </div>        
<?= $this->endSection() ?>
