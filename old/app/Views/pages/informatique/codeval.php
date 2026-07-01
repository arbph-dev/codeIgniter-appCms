<div id="devone" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1><?= esc( $title ) ?></h1>
            <p>
            Doit servir de base pour les tests    
            </p>
        </header>

        <section>
            <h2>CODEVAL</h2>
            <div>
                <div>
                    <h3>Description</h3>
                    Le bloc CODEVAL permet d'executer le code javascript pour diverses applications, principalmeent les calculs présentés dans les articles.<br>
                    Il faudra importer la librairie javascript et initialiser la logique applicative.<br>

                    <h3>Exploitation</h3>
                    Le scripts selectionne tous les blocs de la classe cp_codeval et leur affectent evenements et le gestionnaire associé.<br>
                    Pour l'exploiter il faut l'intégrer dans le script principal de la page; on l'importe et on l'initialise.<br>
                    Ce composant ne publie ni n'ecoute sur le bus d'evenenements.
                    <pre>
                        import { initCodeVal } from './ihm/codeval.js'  
                        
                        initCodeVal()
                    </pre>                    
                    les blocs CODEVAL et leurs elements enfants  sont identifés par un  id CODEVAL_VP1, CODEVAL est le préfixe , VP1 l'identifiiant.<br>
                    La sctructure est à recopier en modifant l'identifant dans les elements enfants. Vous pouvez employer plusieurs blocs tant que vous identifierez bien les elments<br>
                    <br>
                    il y a 5 elements a identifier :<br>
                    - CODEVAL_VP1 : le bloc CODEVAL<br>
                    - CODEVAL_VP1_TITRE : le titre du bloc qui permet de le nommer et de modifier sa visibilité<br>
                    - CODEVAL_VP1_SCRIPTCODE : le conteneur de la zone de texte<br>
                    - l'identifiant est à changer dans l'evenement <b>onclick</b> du bouton : <b>onclick="evaluateCode('VP1')"</b><br>
                    - CODEVAL_VP1_RESULT :  la zone de sortie du résultat<br>

                    <h3>Evolution</h3>   
                    Proposer des fonctions pour les calculs<br>
                    Améliorer le style css<br>
                    prévoir une possible interaction avec l'eventBus<br>
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