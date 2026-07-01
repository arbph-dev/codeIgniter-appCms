<?= $this->extend('layouts/layout_main') ?>  
  
<?= $this->section('content') ?>  

<!-- 
Home /  News /  Contact /  About / Info / Techno



-->


    <div id="Home" class="tabcontent" style="display: block;">
        <article >

            <header>
                <h1>Bienvenue</h1>
                <p>Le site est en constuction, les fonctionnalités sont ajoutées réguilièrmeent dans la rubrique informatique</p>
            </header>

            <section>
                <h2>Pourquoi ce portail</h2>
                <div>
                    <div>
                        Ce portail me permet de compiler et prosposer mes compétences. Après de nombreuses éxpériences au sein de nombreuses organisations je veux me spécialiser.
                        <br/>
                        Sur ce portail je présente mes réalisations, projets et passions avec un souci du détail et de la précision.
                        <br/><br/>
                        Electricien de formation j'ai débuté la gestion de maintnenance seul en autonomie dans une PME du secteur pétrochimique.
                        <br/><br/>
                        Les équipes du groupe Dalkia m'a permis de progresser significativmeent tant sur les plans techniques qu'humains.
                        <br/>
                        Avec eux j'ai découvert la culutre des solutions à un problème dans des environnements contraints. Nos clients comme Spontex sont des sites sensibles; classés seveso 2 et icpe.
                        Je suis intervenu dans différents secteurs d'activité avec des obligations contractuelle : pénalités en cas de perte d'exploitation, optimisation énergétique.
                        <br/>
                        La maitrise des énergies et la maintenance dans les secteurs industriels, tertiaires, hospitaliers et résidentiles m'a permis de me familiriser avec de nombreuses technologies.
                        <br/>
                        Dans ces enrivonnements stimulants j'ai profité d'une émlulation entretenue pour progresser et transmettre mes compétences.
                        j'ai dévellopé des qualités indispensables pour le service et l'exploitation : rigueur,pugnacité, réactivité et faculté d'analyse comme de synthèse.<br/>
                        Mes métiers ne sont pas sans danger, j'ai travailler en sécurité autant que possible. Je suis convaincu que la maitrise des procédés et l'aptitude à gérer le stress sont des garants de la sécurité.<br/>
                        <br/>
                        <br/>
                        J'ai commis des erreurs qui m'ont permis de progresser, avec l'appui des mes collègues.<br/>
                        Certaines réalisations m'ont permis de prouver mes qualités et ma matirise des technologies:<br/> 
                        - Mise en conformité electrique, autocontrole, équipements sous pression et suivi réglementaire
                        - Optimisation de la production vapeur (54MW), le rendement global a augmenté de 1.5 point.<br/> 
                        - Validation technique des reports et transmissions d'alarmes sur la GTC (site classé seveso2)<br/>
                        - Diagnostic et solutionnement de la sulfatation des échangeurs ioniques<br/>
                        - Réalisation d'armoires et mise en service contraintes<br/>
                        - Programmation et modifications d'automatismes en production<br/>
                        - Régulation de température, pression, niveau; paramétrage , mise en service et suivi<br/>
                        - Gestion de la maintenance, déploiement de GMAO, préparation des arrêts techniques
                    </div>
                    <aside>
                        <a href="https://claude.ai/share/16d5819c-cd79-4c05-bd4b-afc20f3c3a88">
                            Estimation des gains (by Claude)
                        </a>                            

                    </aside>                
                </div>
            </section>

        </article>

    </div>
        <!-- ONGLET    --> 
    <div id="News" class="tabcontent">
        <article >

            <header>
                <h1>Actualités</h1>
                <p>Le site est en déploiement</p>
            </header>

            <section>
                <h2>2026-03-20</h2>
                <div>
                    <div>La gestion des vues a évolué vers une gestion modulaire. On emploie un layout principal, avec des composants header, nav, footer et des pages.
                        Les pages peuvent comporter des sections. Cette méthode me permet de préparer les contenus tout en poursuivant le dévellopement des strcutrure, presentation, logique front et backend.
                    </div>
                    <aside></aside>                
                </div>
            </section>

        </article>
    </div>

    <!-- ONGLET    --> 
    <div id="Contact" class="tabcontent">
            <?= $this->include('pages/portal/contact') ?>
    </div>

    <!-- ONGLET    --> 
    <div id="About" class="tabcontent">
        <article >

            <header>
                <h1>A propos</h1>
                <p>Dans cette rubrique nous présenterons nos compétences et notre parcours</p>
            </header>

            <section>
                <h2>Aujourd'hui</h2>
                <div>
                    <div>
                        Agent de maitrise sur un centre Thalasso et un hotel<br>
                        - exploitation de piscine<br>
                        - maintenance industrielle et tertiaire<br>
                        - mise en conformité ,suivi reglementaire et comission de sécurité<br>
                    </div>
                    <aside></aside>                
                </div>
            </section>

        </article>      

        
    <!--
        <table id="data-table" border="1">
            <thead></thead>
            <tbody></tbody>
        </table>
 --> 
    </div>
    <div id="Info" class="tabcontent">
        <article >

            <header>
                <h1>Informatique</h1>
                <p>Dans cette rubrique nous aborderons différentes langages et logiciels</p>
            </header>

            <section>
                <a href="/informatique"><h2>Informatique</h2></a>
                <div>
                    <div>
                        Pour réaliser ce portail j'utilise:<br>
                        - HTML<br>
                        - CSS<br>
                        - Javascript<br>
                        - PHP via Code Igniter<br>
                        
                        <h3>Javascript</h3>
                        Les scripts sont répartis entre
                        <ul>
                            <li>le script principal des pages, a adapté</li>
                            <li>les scripts core : gére un bus d'evenements, les referneces et fonctions DOM</li>
                            <li>Les composants ihm</li>
                        </ul>   

                    </div>
                    <aside>
                        <h3>composants</h3>
                        <a href="/informatique/apex">apex</a><br/>
                        <a href="/informatique/callout">callout</a><br/>
                        <a href="/informatique/carousel">carousel</a><br/>
                        <a href="/informatique/codeval">codeval</a><br/>
                        <a href="/informatique/devlogs">devlogs</a><br/>                          
                        <a href="/informatique/formdialog">formdialog</a><br/>
                        <a href="/informatique/formfeatures">formfeatures</a><br/>
                        <a href="/informatique/forms">forms</a><br/>                        
                        <a href="/informatique/leaflet">leaflet</a><br/>                        
                        <a href="/informatique/mermaid">mermaid</a><br/>
                        <a href="/informatique/threejs">threejs</a><br/>
                        <a href="/informatique/xhr">xhr</a><br/>
                        <!-- <a href="/informatique/langages">langages</a><br/> -->
                    </aside>                
                </div>
            </section>

        </article>         
    </div>   

    <div id="Techno" class="tabcontent">
        <article >

            <header>
                <h1>Technologies</h1>
                <p>Dans cette rubrique nous aborderons des technolgies et des détails techniiques y afferant</p>
            </header>

            <section>
                <a href="/chimie"><h2>Chimie</h2></a>
                <div>
                    <div>
                    La <a href="/chimie">chimie</a> est un vaste domaine qui concerne autant la femme de ménage que l'ingénieur.<br>
                    Des formations N1 et N2 sont dispensé pour former les personnels au risques chimiques, ceci pour reconnaitre les dangers , limiter les risques lors des manipulations et du stockage.<br>
                    Nous aborderons des notions de bases et la chimie du traitment d'eau                    
                    </div>
                    <aside></aside>                
                </div>
            </section>

        </article>   

                
    </div>    
<?= $this->endSection() ?>