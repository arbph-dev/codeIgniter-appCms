<div>
    <p><?= esc($data['intro']) ?></p>

    <?php foreach ($data['types'] as $type): ?>
    <section>
        <h3><?= esc($type['titre']) ?></h3>
        <div>
            <div>
                <p><?= esc($type['description']) ?></p>
            </div>
            <aside>
                <?php if (!empty($type['facteurs'])): ?>
                <ul>
                    <?php foreach ($type['facteurs'] as $f): ?>
                        <li><?= esc($f) ?></li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>
            </aside>
        </div>
    </section>
    <?php endforeach; ?>

    <!-- Mesures préventives -->
    <section>
        <h3>Mesures préventives</h3>
        <div>
            <div>
                <ul>
                    <?php foreach ($data['preventions'] as $p): ?>
                        <li><?= esc($p) ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <aside>
                <p class="cp_callout">
                    Les adoucisseurs résolvent l'entartrage mais peuvent aggraver la corrosion si mal rincés.
                </p>
            </aside>
        </div>
    </section>

</div>
