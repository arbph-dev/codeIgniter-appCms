<?= $this->extend('layouts/layout_nonav') ?>

<!-- ========================= NAV ========================= -->
<?= $this->section('nav') ?>
<nav id="sidebar">

    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">
        &times;
    </a>

    <?php foreach ($nav as $item): ?>
        <a href="<?= $item['url'] ?>">
            <?= esc($item['label']) ?>
        </a>
    <?php endforeach; ?>

</nav>
<?= $this->endSection() ?>

<!-- ========================= CONTENT ========================= -->
<?= $this->section('content') ?>



<div id="Technologies" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        
        <header>
            <h1>Technologies</h1>
            <p>
                Cette section regroupe les différentes rubriques techniques du portail :
                énergie, automatisme, mécanique, fluides, informatique industrielle.
                Les contenus sont organisés par rubriques puis par articles.
            </p>
        </header>

        <section>
            <h2>Organisation</h2>
            <div>
                <div>
                    Les contenus sont structurés selon trois niveaux :
                    <ul>
                        <li><b>Catégorie</b> : Technologies</li>
                        <li><b>Rubriques</b> : ACP, PLC, thermique, etc.</li>
                        <li><b>Articles</b> : contenus techniques détaillés</li>
                    </ul>

                    Les articles sont stockés sous forme de fichiers PHP contenant du HTML,
                    permettant une édition rapide et un versioning simple.
                </div>
                <aside>
                    <h3>Structure</h3>
                    <ul>
                        <li>pages/technologies/</li>
                        <li>→ une rubrique = un dossier</li>
                        <li>→ un article = un fichier PHP</li>
                    </ul>
                </aside>
            </div>
        </section>

        <section>
            <h2>Navigation</h2>
            <div>
                <div>
                    La navigation est générée dynamiquement par les contrôleurs :
                    <ul>
                        <li>Scan des dossiers pour les rubriques</li>
                        <li>Scan des fichiers pour les articles</li>
                        <li>Construction automatique des URLs</li>
                    </ul>

                    Cette approche permet d'ajouter du contenu sans modifier le code.
                </div>
                <aside>
                    <h3>Principe</h3>
                    <ul>
                        <li>0 lien en dur</li>
                        <li>100% basé sur le filesystem</li>
                        <li>Fallback automatique</li>
                    </ul>
                </aside>
            </div>
        </section>

        <section>
            <h2>Évolution</h2>
            <div>
                <div>
                    Cette architecture est conçue pour évoluer vers :
                    <ul>
                        <li>une base de données</li>
                        <li>un CMS léger</li>
                        <li>une structuration fine des contenus (sections)</li>
                    </ul>

                    Les fichiers actuels servent de base documentaire et de source primaire.
                </div>
                <aside>
                    <h3>TODO</h3>
                    <ul>
                        <li>Parser les sections HTML</li>
                        <li>Ajouter des métadonnées (titre, tags)</li>
                        <li>Uniformiser les rubriques</li>
                    </ul>
                </aside>
            </div>
        </section>

    </article>

</div>

<?= $this->endSection() ?>
