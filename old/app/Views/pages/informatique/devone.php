<div id="devone" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>doc template</h1>
            <p>
            Doit servir de base pour les tests    
            </p>
        </header>

        <section>
            <h2>2026-03-25</h2>
            <div>
                <div>
                    Bloc CODEVAL
                </div>
                <aside>
                Avec :<br>
                - un débit q de 75 m3/h<br> 
                - une section de 2 m2 <br>
                on obtient une vitesse de passage de 37,5 m/h.<br>        
                    <div id="CODEVAL_VP1" class="cp_codeval">
                        <div id="CODEVAL_VP1_TITRE" class="titre">vitesse de passage depuis le débit</div>
                        <div id="CODEVAL_VP1_SCRIPTCODE" class="scriptcode">
                            <textarea rows="6" cols="40">
    const q = 75
    const S = 2
    const Vp = q / S
    "Vp = " + Vp + " m/h"
                            </textarea>
                            <button id="executeButton_VP1" name="executeButton" onclick="evaluateCode('VP1')">Exécuter</button>
                        </div>
                        <div id="CODEVAL_VP1_RESULT" class="result"></div>
                    </div>
                </aside>             
            </div>
        </section>

    
    </article>        

</div>