<div>

    <section>
        <h3>Pourquoi purger ?</h3>
        <div>
            <div>
                <p><?= esc($data['intro']) ?></p>
                <table border="1">
                    <thead>
                        <tr><th>Source d'eau</th><th>Teneur en sels</th></tr>
                    </thead>
                    <tbody>
                        <?php foreach ($data['teneurs'] as $row): ?>
                        <tr>
                            <td><?= esc($row['source']) ?></td>
                            <td><?= esc($row['teneur']) ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <aside>
                <p><?= esc($data['conclusion']) ?></p>
            </aside>
        </div>
    </section>

    <section>
        <h3>Calcul des purges</h3>
        <div>
            <div>
                <p>Formule : <strong>Purges (m³/h) = TAC eau brute × VA / 100</strong></p>
            </div>
            <aside>
                <div id="CODEVAL_purge1" class="cp_codeval">
                    <div id="CODEVAL_purge1_TITRE" class="titre">Calcul purge continue</div>
                    <div id="CODEVAL_purge1_SCRIPTCODE" class="scriptcode">
                        <textarea rows="8" cols="40">
const TAC_brute    = 33  // °f eau brute
const TAC_chaudiere = 100 // °f chaudière
const VA           = 2   // m³/h appoint
const purges = (TAC_brute * VA) / 100
"Purges = " + purges + " m³/h"
                        </textarea>
                        <button id="executeButton_purge1" name="executeButton" onclick="evaluateCode('purge1')">Exécuter</button>
                    </div>
                    <div id="CODEVAL_purge1_RESULT" class="result"></div>
                </div>
            </aside>
        </div>
    </section>

    <section>
        <h3>Types de purges</h3>
        <div>
            <div>
                <ul>
                    <?php foreach ($data['types'] as $t): ?>
                    <li>
                        <strong><?= esc($t['nom']) ?></strong> — <?= esc($t['description']) ?>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <aside>
                <p><?= esc($data['primage']) ?></p>
            </aside>
        </div>
    </section>

</div>
