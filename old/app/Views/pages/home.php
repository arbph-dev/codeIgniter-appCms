<?= $this->extend('layouts/layout_main') ?>  
  
<?= $this->section('content') ?>  
  
    <div id="Home" class="tabcontent cp_artanis-card" style="display: block;">
        <h1>Site en construction</h1>
        <h3>Architecture SPA en vue intégré</h3>
        <h3>Architecture SPA en layout/page</h3>
        <p>La route est bien géré par index.php mais une erreur 404 est renvoyé. Il faut un controller test pour cette route ou modifie htacess</p>
        <p>Edition du layout pour séparer script test_main.js et sytle : test_style.css, upload 3 fichiers</p>
    </div>
        <!-- ONGLET    --> 
    <div id="News" class="tabcontent">
        <article class="cp_soft-card">
            <header>
                <h1>Article 1</h1>
                <p>texte intro 1</p>
            </header>
        
            <!-- Article 1 Section 1 -->
            
            <section>
                <h2>Article 1 Section 1</h2>
                <div>

                    <div id="CODEVAL_1" class="cp_codeval">
                        <div id="CODEVAL_1_TITRE" class="titre">Eval 1</div>

                        <div id="CODEVAL_1_SCRIPTCODE" class="scriptcode">
                            <textarea rows="20" cols="40" placeholder="Entrez votre code JavaScript ici...">const u=12&#13;&#10;const r=20&#13;&#10;const i=u/r&#13;&#10;const z = 'Courant '+ i +' A'&#13;&#10;z&#13;&#10;
                            </textarea>
                            <!--  <button id="executeButton1" name="executeButton1">Exécuter</button> -->
                            <button id="executeButton1" name="executeButton" onclick="evaluateCode(1)">Exécuter</button>
                        </div>

                        <div id="CODEVAL_1_RESULT" class="result">

                        </div>

                    </div>
                    
                    <aside>
                        <ul>
                        <li><a href="#">Related link 1</a></li>
                        <li><a href="#">Related link 2</a></li>
                        </ul>
                    </aside>                

                </div>
            </section>

            <section>
                <h2>Threejs</h2>
                <div>
                    <div id="THREE_3" class="cp_threejs" data-scene="terrain" data-width="800" data-height="600"></div>
                    <aside>
                        <button onclick="threeStart('THREE_3')">Start</button>
                        <button onclick="threeStop('THREE_3')">Stop</button>
                    </aside>
                </div>
            </section>




        </article>
    </div>

    <!-- ONGLET    --> 
    <div id="Contact" class="tabcontent">
        <h3>Contact</h3>
        <p>Get in touch, or swing by for a cup of coffee.</p>
    </div>

    <!-- ONGLET    --> 
    <div id="About" class="tabcontent">
        <h3>About</h3>
        <p>Who we are and what we do.</p>

        <table id="data-table" border="1">
            <thead></thead>
            <tbody></tbody>
        </table>

    </div>
<?= $this->endSection() ?>