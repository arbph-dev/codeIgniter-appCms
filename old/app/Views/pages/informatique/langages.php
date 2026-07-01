<div id="Langages" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1><?= esc( $title ) ?></h1>
            <p><?= esc( $intro ) ?></p>
        </header>

        <?php foreach ( $langages as $l): ?>

            <section>
                <h2><?= esc( $l['name'] ) ?></h2>
                <div>
                    <div><?= esc( $l['description'] ) ?></div>
                    <aside>
                        <img width="60%" src="<?= esc( $l['icon'] ) ?>">
                    </aside>                
                </div>
            </section>

        <?php endforeach; ?>
    
    </article>        

</div>