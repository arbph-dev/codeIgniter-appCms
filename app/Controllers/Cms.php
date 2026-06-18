<?php
/*
on ajoute des variables

*/
namespace App\Controllers;

use App\Controllers\BaseController;

class Cms extends BaseController
{
    public function index()
    {
        //publication
        $data = [

    'title' => 'Index du portail',
    'intro' => 'Présentation du portail.',
    'articles'  => [

                [   // ── Article 1 ──────────────────────────────────────────
                    'id'    => 1,
                    'title' => 'Accueil du portail',
                    'intro' => 'Présentation du portail. Quand, qui, quoi, où, comment, pourquoi.',
                    'sections' => [
 
                        [   // Section 1.1
                            'id'    => 1,
                            'title' => 'Bienvenue',
                            'parts' => [
                                [
                                    'id'      => 1,
                                    'title'   => 'But',
                                    'content' => 'Ce portail me permet de partager des informations sur des sujets variés, ces sujets sont relatifs à :<ul><li>mes passions</li><li>mon expérience</li><li>mes projets</li></ul>',
                                    'aside'   => '<a href="/technologies">Rubrique</a>',
                                ],
                                [
                                    'id'      => 2,
                                    'title'   => 'Présentation',
                                    'content' => 'Plutôt pragmatique, j\'ai une formation d\'électrotechnicien. Mon expérience se résumerait en 20 ans d\'exploitation et maintenance, près de 10 ans dans le service et les énergies, et 4 ans d\'enseignement.<br>

                                    
                                    ',
                                    'aside'   => '<a href="/cv">Parcours pro</a>',
                                ],
                                [
                                    'id'      => 3,
                                    'title'   => 'Motivations',
                                    'content' => 'L\'évolution de l\'intelligence artificielle m\'a permis de progresser dans la gestion de la stack web. Depuis 14 mois je me familiarise avec CodeIgniter et Laravel, deux frameworks PHP.',
                                    'aside'   => '',
                                ],
                            ],
                        ],
 
                        [   // Section 1.2
                            'id'    => 2,
                            'title' => 'Actualités',
                            'parts' => [
                                [
                                    'id'      => 4,
                                    'title'   => 'Architecture CMS',
                                    'content' => 'Le portail évolue, la rubrique technologies permet une intégration rapide de documents en production.',
                                    'aside'   => '<a href="/technologies">Rubrique</a>',
                                ],
                                [
                                    'id'      => 5,
                                    'title'   => 'Authentification',
                                    'content' => 'L\'authentification est configurée pour la partie front et les tokens pour API.',
                                    'aside'   => '<a href="/cv">Parcours pro</a>',
                                ],
                                [
                                    'id'      => 6,
                                    'title'   => 'Structure',
                                    'content' => 'Les pages devront employer la même structure mise en forme par CSS.',
                                    'aside'   => '',
                                ],
                            ],
                        ],
 
                        [   // Section 1.3
                            'id'    => 3,
                            'title' => 'Environnement',
                            'parts' => [
                                [
                                    'id'      => 7,
                                    'title'   => 'Hébergement',
                                    'content' => 'Le portail est hébergé sur un serveur mutualisé chez OVH.',
                                    'aside'   => '<a href="/technologies">Rubrique</a>',
                                ],
                                [
                                    'id'      => 8,
                                    'title'   => 'Stack',
                                    'content' => 'OVH fournit les services SSH, FTP, HTTPS ,PHP, messagerie et Base de données. J\'ai choisi Code Ingiter pour le backend, la partie front est réalisé en HTML,SVG et Javascript et CSS',
                                    'aside'   => '<a href="https://codeigniter.com" target="_blank">codeigniter.com</a>',
                                ],
                            ],
                        ],
 
                    ],
                ],
 
                // ── Article 2 ──────────────────────────────────────────────
                [
                    'id'    => 2,
                    'title' => 'Technologies',
                    'intro' => 'Nous sommes enchantés de vous accueillir dans cet espace dédié aux technologies qui nous passionnent, que nous maitrsions de part nos activités dans différents secteurs.',
                    'sections' => [
                        [
                            'id'    => 4,
                            'title' => 'Introduction',
                            'parts' => [
                                [
                                    'id'      => 9,
                                    'title'   => 'Contexte',
                                    'content' => 'A travers les différents articles et contenus que vous découvrirez ici, nous aspirons à vous fournir des informations quant à des solutions technologiques et procédés.<br>Après une formation de 7 années dans les sciences et technologies industrielles, nous avons acquis une expertise dans les domaines de l\'électrotechnique et des compétences complémentaires.<br>
                                    Nos 20 années d\'expérience, riches et variées, dans les secteurs industriels, résidentiels, tertiaires et hospitaliers, nous ont sensibilisés aux enjeux cruciaux de l\'exploitation, telle que la disponibilité, l\'organisation, la réactivité et la sécurité.<br>Cette diversité de parcours nous a permis d\'acquérir une vision globale du métier d\'électricien, mais également de nous spécialiser dans la maîtrise des énergies et de la maintenance.<br>
                                    Sur un site Seveso 2, dans le secteur médical, en industrie, dans le tertiaire, les salles informatiques et le bâtiment j\'ai exploité et mis en oeuvre des equipements nécessaires pour les activités et la sécurité.<br>Nous vous invitons à explorer notre portail pour découvrir des informations pertinentes, nos projets, et à nous apporter votre soutien et votre confiance.<br>N\'hésitez pas à nous contacter pour toute demande d\'information supplémentaire ou pour discuter de la manière dont nous pouvons vous aider à atteindre vos objectifs.<br>',
                                    'aside'   => '<a href="https://zealot.fr/technologies">https://zealot.fr/technologies</a><br>
                                    <ul>
                                        <li><a href="https://zealot.fr/technologies/acp/">📁 /acp</a>
                                        <ul>
                                            <li>
                                                <a href="https://zealot.fr/technologies/acp/presentation">📄 /acp/presentation</a>
                                            </li>
                                        </ul>    
                                        <li>
                                            <a href="https://zealot.fr/technologies/gaz">📁 /gaz</a>
                                        </li>
                                        <li>
                                            <a href="https://zealot.fr/technologies/aut">📁 /aut</a>
                                        </li>
                                        <li>
                                            <a href="https://zealot.fr/technologies/chf">📁 /chf</a>
                                            
                                            <ul>
                                                <li><a href="https://zealot.fr/technologies/chf/bois">📄 /bois</a>
                                                <li><a href="https://zealot.fr/technologies/chf/remeha">📄 /remeha</a>
                                                <li><a href="https://zealot.fr/technologies/chf/varblok">📄 /varblok</a>
                                                <li><a href="https://zealot.fr/technologies/chf/varmax">📄 /varmax</a>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="https://zealot.fr/technologies/eau">📁 /eau</a>
                                        </li>                                            
                                        <li>
                                            <a href="https://zealot.fr/technologies/ecs">📁 /ecs</a>
                                        </li>                                    
                                        <li>                                        
                                            <a href="https://zealot.fr/technologies/vap">📁 /vap</a>
                                            <ul>
                                                <li>
                                                    <a href="https://zealot.fr/technologies/vap/requalification">📄 /vap/requalification</a>
                                                </li>                                                    
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="https://zealot.fr/technologies/hyd">📁 /hyd</a>
                                        </li> 
                                        <li>
                                            <a href="https://zealot.fr/technologies/eln">📁 /eln</a>
                                        <ul>
                                            <li><a href="https://zealot.fr/technologies/eln/arduino">📄 /eln/arduino</a></li>                                     
                                            <li><a href="https://zealot.fr/technologies/eln/interruptions">📄 /eln/interruptions</a></li> 

                                        </ul>
                                        <li>
                                            <a href="https://zealot.fr/technologies/wrk">📁 /wrk</a>
                                        </li> 
                                        <li>
                                            <a href="https://zealot.fr/technologies/com">📁 /com</a>
                                            <ul>
                                                <li><a href="https://zealot.fr/technologies/com">📄 /com/rs485</a></li> 
                                                <li><a href="https://zealot.fr/technologies/com">📄 /com/ethernet</a></li> 
                                                <li><a href="https://zealot.fr/technologies/com">📄 /com/lora</a></li> 
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="https://zealot.fr/technologies/sec">📁 /sec</a>
                                        </li> 
                                    ',
                                ],
                            ],
                        ],
                    ],
                ],
                // ── Article 3 ──────────────────────────────────────────────
                [
                    'id'    => 3,
                    'title' => 'Histoire',
                    'intro' => 'Sans être spécialiste dans le domaine, je me passionne pour la chose à l\'occasion de découverte et de recherches.',
                    'sections' => [
                        [
                            'id'    => 5,
                            'title' => 'Introduction',
                            'parts' => [
                                [
                                    'id'      => 10,
                                    'title'   => 'Une passion',
                                    'content' => 'Natif de Picardie, j\'ai pu parcourir l\'histoire de France pendant quelques kilomètres. Dans mon enfance j\'ai eu la chance de pouvoir écouter le témoignage des anciens. Les randonnées en VTT comme la spéléologie me permirent de concilier sport et histoire.
                                    L\'histoire est un héritage parfois difficile à supporter mais il doit être assumer et pour assumer cet héritage faut il encore le connaitre.
                                    On dit que l\'on n\'est pas responsable des actes des ses anciens mais pourtant on est bien fier d\'avoir d\'illustres prédécesseurs; je pense sincèrement qu\'on ne peut être sage en ignorant comment nous sommes devenus contemporains de ce monde.
                                    Comprendre l\'histoire familiale vous démontre qu\'aucune vérité n\'est jamais unique. On peut rejeter les valeurs d\'une civilisation mais on ne peut aborder son passé sans essayer de comprendre son contexte culturel, social et politique
                                    
                                    Dans cette rubrique nous aborderons principalement des événements que j\'ai souvent découvert par le cinéma, au hasard de discussions passionnées ou à l\'occasion d\'un trajet.
                                    Certaines découvertes m\'ont particulièrement intéressé et je les ai complétées parfois par des recherches et des lectures.
                                    
                                    Enfin le projet de gérer ces évènements me permet de progresser notamment dans la gestion des relations entre les données',
                                    'aside'   => 'Rubrique a construire'
                                ],
                            ]
                        ],
                        [
                            'id'    => 6,
                            'title' => 'Saint Leau d\'Esserent',
                            'parts' => [
                                [
                                    'id'      => 11,
                                    'title'   => 'Transcriptions du rapport 1944-06-30-NAID-5555460',
                                    'content' => '<h4>Identité</h4>GOLKE, CLIFFORD G<br>Sergent-chef , matricule 16132121, 9e Groupe de Bombardement USAF
                                    <h4>Rapport</h4>
                                    Date, heure et lieu approximatif du crash ou de l\'atterrissage de l\'avion.<br> 
                                    10 AVRIL 1944 VERS 10H00 ENVIRON 4 KILOMÈTRES AU SUD-OUEST DE SAINT-VAAST-LES-MELLO. AU NORD DE PARIS.<br><br>
                                    Nature et étendue des dommages subis par l\'avion au moment de l\'éjection. L\'avion était-il en feu ?<br>
                                    Toute l\'aile droite était en feu, le moteur n° 1 était en train de s\'éteindre et l\'aile commençait à se détacher entre les moteurs n° 3 et 4.<br><br>
                                    À quelle altitude approximative l\'éjection a-t-elle eu lieu ?<br> Environ 6 100 m (20 000 pieds).<br><br>
                                    Des membres d\'équipage ont-ils été blessés ou tués avant le crash ?<br> Non.<br><br>
                                    Combien de membres d\'équipage ont sauté en parachute ? Leurs parachutes se sont-ils ouverts ?<br>
                                    Manahan, Justice, Hedlund, Dearing, Harnahan, Moedebeck, Hard, ont sauté en parachute. Thompson, Enstrom, je ne sais pas. J\'ai vu deux hommes tomber sans que leurs parachutes ne s\'ouvrent.<br><br>
                                    La source a-t-elle vu d\'autres membres de l\'équipage, morts ou vivants, après l\'atterrissage ?<br>
                                    J\'ai vu deux hommes tomber, seulement de loin, dont les parachutes ne se sont pas ouverts. J\'ai pris contact avec Cletus Hard le lendemain.<br><br>
                                    A-t-il reçu des informations d\'autres personnes quant au sort des autres membres de l\'équipage ? Si oui, veuillez fournir les détails fournis par son informateur et indiquer si les autres membres d\'équipage ont été identifiés par leur nom ou autrement.<br>Les Français ont apporté les noms de Thompson, Moedebeck et Harnahan comme étant morts. Ils ont donné une bonne description de Justice, qui a été capturé. Ils amenaient Hedlund et Dearing pour nous rejoindre, mais les Allemands les ont capturés en chemin. Un Français s\'est échappé.<br><br>
                                    La source a-t-elle examiné l\'épave de l\'avion ? Si oui, dans quel état était-elle ?<br> Non, je ne me suis pas approché suffisamment. Faible taux d\'oxygène dans le champ, train d\'atterrissage dans les bois et partie du fuselage dans le champ.<br><br>
                                    Si l\'avion s\'est abîmé en mer, à quelle distance se trouvait-il de la côte ?<br><br>
                                    Comment la source a-t-elle été secourue ? Quels radeaux de sauvetage, débris, etc., sont restés à la surface et auraient pu aider les autres membres d\'équipage à se maintenir à flot ?<br><br>
                                     Quel est l\'avis de la source quant au sort des autres membres d\'équipage et pourquoi ? <br>Ouvrir les parachutes trop tôt a peut-être permis aux Allemands de capturer deux membres d\'équipage dès le premier jour.
                                    ',
                                    'aside'   => '
                                    ref interne : 1944-06-30-NAID-5555460<br>
                                    Date du rapport : 30 JUIN 1944<br>
                                    Date évenement : 10 AVRIL 1944, vers 10:00<br>
                                    <br>
                                    Localisation : 4 KILOMÈTRES AU SUD-OUEST DE SAINT-VAAST-LES-MELLO. AU NORD DE PARIS.
                                    <br>

                                    Personnes<br>
                                    nom : GOLKE, CLIFFORD G.<br>
                                    qualité : Militaire (grade=S/Sgt) (ASN=16132121) (Unite: USAF 9FTH BOMB GP.)<br>
                                    Manahan<br>
                                    Justice<br>
                                    Hedlund<br>
                                    Dearing<br>
                                    Harnahan<br>
                                    Moedebeck<br>
                                    Hard<br>
                                    Thompson<br>
                                    Enstrom<br>

                                    <br>
                                    sources<br>
                                    <a href="https://catalog.archives.gov/id/5555460?objectPanel=transcription" target="_blank">reference NAID :5555460</a><br>
                                    Identifiant local :E & E 820<br>
                                    <div id="CALLOUT_1" class="cp_callout note">
                                        <div id="CALLOUT1_TITRE" class="titre">Titre callout</div>
                                        <div id="CALLOUT1_CONTENT" class="content">Content callout</div>
                                    </div>

                                    <p>contenu section </p>
                                   
                                    <div id="CALLOUT_2" class="cp_callout info">
                                        <div id="CALLOUT2_TITRE" class="titre">Titre callout</div>
                                        <div id="CALLOUT2_CONTENT" class="content">Content callout</div>
                                    </div>
                                    
                                    <p>contenu section </p>
                                    
                                    <div id="CALLOUT_3" class="cp_callout danger">
                                        <div id="CALLOUT3_TITRE" class="titre">Titre callout</div>
                                        <div id="CALLOUT3_CONTENT" class="content">Content callout</div>
                                    </div>
                                    
                                    <p>contenu section </p>
                                    
                                    <div id="CALLOUT_4" class="cp_callout warning">
                                        <div id="CALLOUT4_TITRE" class="titre">Titre callout</div>
                                        <div id="CALLOUT4_CONTENT" class="content">Content callout</div>
                                    </div>'
                                ],
                            ]                                    
                        ]
                    ]
                ],
                // ── Article 4 ──────────────────────────────────────────────

                [
                    'id'    => 4,
                    'title' => 'Informatique',
                    'intro' => 'Ce portail me permet de maitriser les technologies front HTML,CSS et Javascript et backend PHP/MySql.',
                    'sections' => [
                        [
                            'id'    => 5,
                            'title' => 'Architecture modulaire',
                            'parts' => [
                                [
                                    'id'      => 12,
                                    
                                    'title'   => 'Une nécessité',
                                    
                                    'content' => 'Pour ajouter des fonctionnalités sur la partie front comme les composants une organisation du code est à trouver.<br>
                                    Ceci de par le fait que l\'application SPA est servi par un framework MVC et que l\'on réparti les vues entre le template et la vue<br>
                                    <br>
                                    La structure est réalisé avec HTML et CSS, cette structure doit s\'adapter aux terminaux mobiles et ordinateurs.<br>
                                    <br>
                                    Le theming incombe à CSS, il faut séparer mise en forme de la structure du theming.<br>
                                    <br>
                                    Javascript gère les interactions.<br>Selon le niveau on gère directment l\'action dans le module ou dans les cas plus complexes on publie les evenements aux module et composants souscripteurs.<br>
                                    Les modules et composants doivent au maximum être indépendant de l\'interface. Il faut limiter les références DOM aux classes.<br>
                                    <br>
                                    La documentation est importante, il faut savoir prendre le temps de lire et d\'écrire. Obsidian peut être très utile pour gérer des projets',
                                    
                                    'aside'   => '
                                    <strong>CALLOUT</strong>
                                    <p>callout - note</p>
                                    <div id="CALLOUT_1" class="cp_callout note">
                                        <div id="CALLOUT1_TITRE" class="titre">Titre callout</div>
                                        <div id="CALLOUT1_CONTENT" class="content">Content callout</div>
                                    </div>
                                    <p>callout - note</p>
                                    
                                   
                                    <div id="CALLOUT_2" class="cp_callout info">
                                        <div id="CALLOUT2_TITRE" class="titre">Titre callout</div>
                                        <div id="CALLOUT2_CONTENT" class="content">Content callout</div>
                                    </div>
                                    
                                    <p>contenu section </p>
                                    
                                    <div id="CALLOUT_3" class="cp_callout danger">
                                        <div id="CALLOUT3_TITRE" class="titre">Titre callout</div>
                                        <div id="CALLOUT3_CONTENT" class="content">Content callout</div>
                                    </div>
                                    
                                    <p>contenu section </p>
                                    
                                    <div id="CALLOUT_4" class="cp_callout warning">
                                        <div id="CALLOUT4_TITRE" class="titre">Titre callout</div>
                                        <div id="CALLOUT4_CONTENT" class="content">Content callout</div>
                                    </div>                                    
                                    '
                                ], //end part
                                [
                                    'id'      => 13,

                                    'title'   => 'Composants',

                                    'content' => '<h4>Callout</h4>Ces blocs évoluent pour intégrer un contenu à mettre en évidence.<br/>
                                    <br/>
                                    <h5>Evolutions</h5>
                                    Theming, ajouter des icone splus adaptés sur les barres de titre<br/>
                                    <br/>
                                    Utilisation du bus d\'événements<br/>
                                    On peut imaginer un support de cours avec suivi d\'assiduité. Il faudrait emettre un evenement qui signale l\'ouverture, ceci permettant de vérifier que l\'utilisateur prenenle temps de bien ire les notions importantes<br/>
                                    <br/>
                                    <strong>callout - note</strong>
                                    <div id="CALLOUT_1" class="cp_callout note">
                                        <div id="CALLOUT1_TITRE" class="titre">Intégration</div>
                                        <div id="CALLOUT1_CONTENT" class="content">Le composant se réparti entre
                                            <ul>
                                                <li>La structure (php/html)</li>
                                                <li>La mise en forme (css)</li>
                                                <li>Le theming (css)</li>
                                                <li>L\'intéraction (javascript)</li>
                                            </ul>                                            
                                        </div>
                                    </div>
                                    <h4>A intégrer</h4>

                                    <div id="CALLOUT_4" class="cp_callout warning">
                                        <div id="CALLOUT4_TITRE" class="titre">Titre callout</div>
                                        <div id="CALLOUT4_CONTENT" class="content">
                                        <a href="/informatique/apex">apex</a><br/>
                                        <a href="/informatique/callout">callout</a><br/>
                                        <a href="/informatique/codeval">codeval</a><br/>
                                        <a href="/informatique/devlogs">devlogs</a><br/>                          
                                        <a href="/informatique/formdialog">formdialog</a><br/>
                                        <a href="/informatique/formfeatures">formfeatures</a><br/>
                                        <a href="/informatique/forms">forms</a><br/>                        
                                        <a href="/informatique/leaflet">leaflet</a><br/>                        
                                        <a href="/informatique/mermaid">mermaid</a><br/>
                                        <a href="/informatique/threejs">threejs</a><br/>
                                        <a href="/informatique/xhr">xhr</a><br/>                                        
                                        </div>
                                    </div>',

                                    'aside'   => 'Prochain travaux features et speech'
                                ]
                            ] //end parts                                   
                        ] //end section
                    ] // end section
                ],//end article

                // ── Article 5 ──────────────────────────────────────────────
                [
                    'id'    => 5,
                    'title' => 'Dictionnaire',
                    'intro' => 'Composant de données.',
                    'sections' => [
                        [
                            'id'    => 6,
                            'title' => 'Introduction',
                            'parts' => [
                                [
                                    'id'      => 14,
                                    'title'   => 'Recherche de mots',
                                    'content' => '<div id="motContainer" class="cp_module_container">
                                                    <div id="motButtonPanel" class="cp_panel_buttons"></div>
                                                    <div id="motFormPanel"   class="cp_panel_form"   style="display:none"></div>
                                                    <div id="motDetailPanel" class="cp_panel_detail" style="display:none"></div>
                                                    <div id="motTablePanel"  class="cp_panel_table"></div>
                                                    <div id="motPaginationPanel" class="cp_panel_pagination"></div>
                                                </div>',
                                    'aside'   => 'Essai en cours'

                                ]//end part
                            ] //end parts
                        ] //end section
                    ] // end section
                ],//end article
                // ── Article 6 ──────────────────────────────────────────────
                [
                    'id'    => 6,
                    'title' => 'Code Naf',
                    'intro' => 'Composant de données.',
                    'sections' => [
                        [
                            'id'    => 7,
                            'title' => 'Introduction',
                            'parts' => [
                                [
                                    'id'      => 15,
                                    'title'   => 'Recherche de code APE',
                                    'content' => '
                                        <form id="nafForm" onsubmit="return validateForm(this)">  
                                        <label for="nafCodeInput">Code NAF (optionnel) :</label><br />  
                                        <input type="text" id="nafCodeInput" name="nafcode" /><br />
                                        '. csrf_field() .'  
                                        <label for="nafQInput">Recherche (libellé) :</label><br />  
                                        <input type="text" id="nafQInput" name="nafq" /><br />  
                                        <input type="submit" value="Rechercher">  
                                        <hr>  
                                        <div id="nafSelected"></div>  
                                        <hr>  
                                        <div id="nafResult"></div>
                                        <hr>
                                        <div id="nafPagination"></div>  
                                        <hr>
                                        <div id="nafTree"></div>
                                        </form>',
                                'aside'   => 'Essai en cours'

                                ]//end part
                            ] //end parts
                        ] //end section
                    ] // end section
                ],//end article
                // ── Article 7 ──────────────────────────────────────────────
                [
                    'id'    => 7,
                    'title' => 'Compte PCG',
                    'intro' => 'Composant de données.',
                    'sections' => [
                        [
                            'id'    => 8,
                            'title' => 'Introduction',
                            'parts' => [
                                [
                                    'id'      => 16,
                                    'title'   => 'Recherche de compte PCG',
                                    'content' => '<form id="pcgSearchForm">
												    <input id="pcgSearchInput" type="search" placeholder="Numéro ou libellé…">'
												    . csrf_field() .
												    '<select id="pcgClasseSelect">
												        <option value="">Toutes classes</option>
												        <option value="1">Classe 1 — Capitaux</option>
												        <option value="2">Classe 2 — Immobilisations</option>
												        <option value="3">Classe 3 — Stocks</option>
												        <option value="4">Classe 4 — Tiers</option>
												        <option value="5">Classe 5 — Financiers</option>
												        <option value="6">Classe 6 — Charges</option>
												        <option value="7">Classe 7 — Produits</option>
												        <option value="8">Classe 8 — Spéciaux</option>
												    </select>
												    <button type="submit">Rechercher</button>
												    <button type="button" id="pcgResetBtn">Reset</button>
												</form>

												<table id="pcgResults">
												    <thead>
												        <tr><th>Numéro</th><th>Libellé</th><th>Classe</th></tr>
												    </thead>
												    <tbody id="pcgResultsBody"></tbody>
												</table>

												<div id="pcgPager"></div>

												<div id="pcgDetail"></div>',
                                'aside'   => 'Essai en cours'

                                ]//end part
                            ] //end parts
                        ] //end section
                    ] // end section
                ],//end article
                // ── Article 8 — WysEdit ──────────────────────────────────────────
                [
                    'id'    => 8,
                    'title' => 'WysEdit',
                    'intro' => 'Composant éditeur HTML simple.',
                    'sections' => [
                        [
                            'id'    => 9,
                            'title' => 'Éditeur',
                            'parts' => [
                                [
                                    'id'      => 17,
                                    'title'   => 'Zone d\'édition',
                                    'content' => '
                                        <p>
                                            Le composant <strong>WysEdit</strong> permet de saisir du HTML
                                            et de basculer entre le mode édition et la prévisualisation.<br>
                                            Réservé aux utilisateurs avertis — le contenu est rendu via <code>innerHTML</code>.
                                        </p>
                                        <p>Événements disponibles via le bus :</p>
                                        <ul>
                                            <li><code>wysedit:show:wysedit1</code> — passer en vue</li>
                                            <li><code>wysedit:edit:wysedit1</code> — passer en édition</li>
                                            <li><code>wysedit:set:wysedit1</code> — injecter du contenu</li>
                                            <li><code>wysedit:clear:wysedit1</code> — vider</li>
                                            <li><code>wysedit:get:wysedit1</code> — récupérer le contenu</li>
                                        </ul>
                                        <hr>
                                        <div class="cp_wysedit_zone" id="wysedit1">
                                            <textarea
                                                class="cp_wysedit_textarea"
                                                rows="10"
                                                placeholder="Saisir du HTML ici…"
                                            >&lt;h3&gt;Titre exemple&lt;/h3&gt;
    &lt;p&gt;Contenu &lt;strong&gt;formaté&lt;/strong&gt; en HTML.&lt;/p&gt;</textarea>
                                            <div class="cp_wysedit_view"></div>
                                            <button class="cp_wysedit_toggle">Aperçu</button>
                                        </div>                                        
                                        <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
                                        <button onclick="window.eventBusPublish(null, \'wysedit:clear:wysedit1\', null)">
                                            Vider
                                        </button>
                                        <button onclick="window.eventBusPublish(null, \'wysedit:set:wysedit1\',
                                            \'&lt;h3&gt;Contenu injecté&lt;/h3&gt;&lt;p&gt;Via le bus d\\\'événements.&lt;/p&gt;\')">
                                            Injecter contenu
                                        </button>
                                    </div>',
                                    'aside'   => '
'
                                ] // end part
                            ] // end parts
                        ] // end section
                    ] // end sections
                ], // end article
                // ── Article 9 — Vox ──────────────────────────────────────────
                [
                    'id'    => 9,
                    'title' => 'Vox',
                    'intro' => 'Synthèse vocale',
                    'sections' => [
                        [
                            'id'    => 10,
                            'title' => 'Composant vox',
                            'parts' => [
                                [
                                    'id'      => 18,
                                    'title'   => 'Synthèse vocale (event bus)',
                                    'content' => '<textarea class="cp_voxzone_textarea" id="TXT_VOX_1" rows="8">
Juliette: Bonjour, je suis Juliette.
Romeo: Bonjour, je suis Roméo.
											    </textarea>
											    <br/><br/>	
											    <div id="VOX_STATUS"></div>',
                                    'aside'   => '<button onclick="window.eventBusPublish(event, \'vox:speak\', { targetId:\'TXT_VOX_1\', statusId:\'VOX_STATUS\' })">Lire</button>
                                                <button onclick="window.eventBusPublish(event,\'vox:pause\')">Pause</button>
                                                <button onclick="window.eventBusPublish( event, \'vox:resume\' )">Resume</button>
                                                <button onclick="window.eventBusPublish( event, \'vox:stop\' )">Stop</button>
                                                <br/><br/>
                                                <label>Rate</label>
                                                <input type="range" min="0.5" max="2" step="0.1" value="0.9" onchange="window.eventBusPublish( event, \'vox:rate\',{value:this.value})">	
                                                <br/><br/>
                                                <label>Volume</label>
                                                <input type="range" min="0" max="1" step="0.1" value="1" onchange="window.eventBusPublish( event,\'vox:volume\',{ value:this.value })">	
                                                <br/><br/>
                                                <button onclick="window.eventBusPublish( event,\'vox:getVoices\')">Configurer les voix</button>
                                                <h3>Voix disponibles</h3>  
                                                <div id="VOX_VOICES_LIST"></div>
                                                '
                                ] // end part
                            ] // end parts
                        ] , // end section

                        [
                            'id'    => 25,
                            'title' => 'Composant vox',
                            'parts' => [
                                [
                                    'id'      => 35,
                                    'title'   => 'Reco vocale (event bus)',
                                    'content' => '<textarea class="cp_voxzone_textarea" id="TXT_RVOX_1" rows="8"></textarea>
											    <br/><br/>	
											    <div id="RVOX_STATUS_1"></div>',
                                    'aside'   => '<button onclick="window.eventBusPublish( event, \'listen:cmd:start\', { targetId:\'TXT_RVOX_1\' } )">▶ Lire</button>
                                                <button onclick="window.eventBusPublish(event, \'listen:cmd:stop\')">⏹ Stop</button>'
                                ] // end part
                            ] // end parts
                        ] // end section

                    ] // end sections
                ], // end article

                // ── Article 10 — Composants ──────────────────────────────────────────
                [
                    'id'    => 10,
                    'title' => 'Composants',
                    'intro' => 'Composants en cours d\'intégration cms',
                    'sections' => [
                        [ //  section
                            'id'    => 11,
                            'title' => 'mermaid',
                            'parts' => [
                                [
                                    'id'      => 19,
                                    'title'   => 'gantt',
                                    'content' => '<pre class="mermaid" id="mmG1">
	                    gantt
	                    dateFormat  YYYY-MM-DD
	
	                    section Clickable
	                    Visit mermaidjs, read documentation         :active, cl1, 2025-08-22, 2d
	                    Print arguments         :cl2, after cl1, 3d
	                    Print task              :cl3, after cl2, 3d
	
	                    click cl1 href "https://mermaidjs.github.io/"
	                    click cl2 call mermaid_printArguments("test1", "test2", 3)
	                    click cl3 call window.mermaid_printTask(cl3)
	                </pre>
	
	                    <button 
	                    id="executeButton"
	                    name="executeButton" 
	                    onclick="mermaid_Run(\'mmG1\')"
                    >	Exécuter
	                    </button>    ',
                                    'aside'   => 'mermaid en zone centrale'
                                ] , // end part

                                [
                                    'id'      => 32,
                                    'title'   => 'Diagramme de sequence',
                                    'content' => '<pre class="mermaid" id="mmG2">
    sequenceDiagram
    autonumber
    
    participant window.load
    participant eventBus.forms
    box Purple features mot
    participant mot.form.js
    participant mot.controller.js
    participant mot.service.js
    participant mot.renderer.js
    end
    participant window.validateForm
    participant ui
    
    rect rgb(191, 223, 255)
        window.load--)mot.form.js: initMotForm()
        mot.form.js->>eventBus.forms : souscrit a forms:submit
        note right of window.load: Initialisation.
        
        window.load--)mot.controller.js: initMotController()  
        mot.controller.js->>eventBus.forms : souscrit a forms:search
    
        window.load--)mot.renderer.js : initMotRenderer()
        mot.renderer.js->>eventBus.forms : souscrit a mot:loading
        mot.renderer.js->>eventBus.forms : souscrit a mot:loaded
        mot.renderer.js->>eventBus.forms : souscrit a mot:error
    end
    
    rect rgb(255, 223, 191)
        note left of ui: Validation formulaire
        ui--)window.validateForm: evt submit src motForm  
        window.validateForm->>eventBus.forms : publie forms:submit
        eventBus.forms->>+mot.form.js : forms:submit
        mot.form.js-->mot.form.js : validation
    end
    
    rect rgb(191, 223, 255)
        mot.form.js->>-eventBus.forms : publie forms:search
        eventBus.forms->>mot.controller.js: forms:search
    end
    
    rect rgb(255, 223, 191)
        mot.controller.js->>eventBus.forms : publie mot:loading 1
        eventBus.forms->>+mot.renderer.js : mot:loading
        mot.renderer.js--)-ui : affichage chargement
    end
    
    rect rgb(191, 223, 255)	
        note left of mot.service.js : requete
        mot.controller.js->>+mot.service.js : fetch()
        mot.service.js-->mot.service.js : response
        mot.service.js->>-mot.controller.js :result
        mot.controller.js->>eventBus.forms : publie mot:loaded
        eventBus.forms->>+mot.renderer.js: mot:loaded
        mot.controller.js->>eventBus.forms : publie mot:loading 0
    end
    
    rect rgb(255, 223, 191)
        mot.renderer.js--)-ui : affichage des données en tableau
    end
</pre>

                                <button id="executeButton" name="executeButton" onclick="mermaid_Run(\'mmG2\')">Exécuter</button>',
                                    'aside'   => 'mermaid en zone centrale'
                                ] // end part

                            ] // end parts
                        ], // end section

                        [ //  section
                            'id'    => 21,
                            'title' => 'codeval',
                            'parts' => [
                                [
                                    'id'      => 31,
                                    'title'   => 'Volume normal selon ISO 2533',
                                    'content' => '<div id="CODEVAL_CVG5" class="cp_codeval">
                                    <div id="CODEVAL_CVG5_TITRE" class="titre">Volume normal ISO 2533</div>
                                        <div id="CODEVAL_CVG5_SCRIPTCODE" class="scriptcode">
                                            <textarea rows="12" class="cp_wysedit_textarea">
const P2_rel_bar = 0.3
const P2_abs_bar = P2_rel_bar + 1
const P2_abs_pa = P2_abs_bar * 101325
const P1_abs_pa = 101325
const T2_degc = 20
const T1_K = 288.15
const T2_K = T2_degc + 273.15
const IDX1 = 2500420
const IDX2 = 2500620
const V2 = IDX2 - IDX1
const F = ( P2_abs_pa / P1_abs_pa ) * ( T1_K / T2_K)
const V1 = V2 * F
const result = " Volume corrige  = " + V1 + " Nm3 ; F = " + F
                                            </textarea>
                                        </div>
                                        <div id="CODEVAL_CVG5_RESULT" class="result"></div>
                                        <button onclick="window.eventBusPublish(event, \'codeval:toggle\', \'CVG5\')">hide/show</button>
                                        <button onclick="window.eventBusPublish(event, \'codeval:eval\', \'CVG5\')">Eval</button>                                        
                                    </div>',
                                    'aside'   => 'Déterminons le volume V1 normal du gaz dans des conditions normales (P1,T1) que represente le volume V2 dans les conditions d\'exploitation (P2,T2)<br/>
                                    - pression absolue P1 = 101 325 Pa<br/>
                                    - température T1 =  288,15 K<br/>'
                                ] // end part
                            ] // end parts
                        ] , // end section
                        /* APEX */
                        [ //  section
                            'id'    => 22,
                            'title' => 'Apex',
                            'parts' => [
                                [
                                    'id'      => 33,
                                    'title'   => 'Histogramme',
                                    'content' => '<div id="APEX_1" class="cp_apex" data-chart="moteurCouple"></div>',
                                    'aside'   => 'Apex zone centrale'
                                ] // end part
                            ] // end parts
                        ],  // end section
                        [ //  section
                            'id'    => 23,
                            'title' => 'Carousel',
                            'parts' => [
                                [
                                    'id'      => 33,
                                    'title'   => 'Carousel d\'images',
                                    'content' => '
                                        <div id="CAROUSEL_1" class="cp_carousel">
                                            <img src="/assets/img/technologies/chf/chbois/hargassner-classic-lambda-coupe-profil-653x761.jpg">
                                            <img src="/assets/img/technologies/chf/chbois/hargassner-classic-lambda-coupe-654x763.jpg">
                                            <img src="/assets/img/technologies/chf/chbois/Agro%20ECO%20HK%20150-200%201000x800.jpg">
                                        </div>
                                        <button onclick="ihmCarouselPrev(\'1\')">‹</button>
                                        <button onclick="ihmCarouselNext(\'1\')">›</button>
                                    ',

                                    'aside'   => '
                                    <div id="CAROUSEL_2" class="cp_carousel">
                                        <img src="/assets/img/technologies/chf/chbois/20240216_141203_h.jpg">
                                        <img src="/assets/img/technologies/chf/chbois/20240216_141222_h.jpg">
                                        <img src="/assets/img/technologies/chf/chbois/20240216_151927_h.jpg">
                                        <img src="/assets/img/technologies/chf/chbois/20240216_151945_h.jpg">                                                            
                                    </div>
                                    <button onclick="ihmCarouselPrev(\'2\')">‹</button>
                                    <button onclick="ihmCarouselNext(\'2\')">›</button>
                                    '
                                ] // end part
                            ] // end parts
                        ],  // end section

                        // ── Leaflet ──────────────────────────────
                        [ //  section
                        'id'    => 24,
                        'title' => 'Leaflet',
                        'parts' => [
                            [
                                'id'      => 34,
                                'title'   => 'Leaflet',
                                'content' => '<div class="leafletContainer">
                                                <div id="leafletMap"></div>
                                                <div id="leafletInfo">Some text</div>
                                            </div>',

                                'aside'   => '<button id="testLeafelt" name="testLeafelt" onclick="testLeafelt()">testLeafelt</button>'
                            ] // end part
                        ] // end parts
                        ],  // end section


                        // ── ThreeJs ──────────────────────────────
                        [ //  section
                        'id'    => 26,
                        'title' => 'ThreeJs',
                        'parts' => [
                            
                            [
                                'id'      => 36,
                                'title'   => 'cube',
                                'content' => '<div id="THREE_1" class="cp_threejs" data-scene="cube" data-width="800" data-height="600"></div>
                                            <button onclick="threeList()">List</button>
                                            <button onclick="threeStart(\'THREE_1\')">Start</button>
                                            <button onclick="threeStop(\'THREE_1\')">Stop</button>',
                                'aside'   => ''
                            ], // end part
                            [
                                'id'      => 37,
                                'title'   => 'galaxy',
                                'content' => '<div id="THREE_2" class="cp_threejs" data-scene="galaxy"  data-width="800" data-height="600"></div>
                                            <button onclick="threeStart(\'THREE_2\')">Start</button>
                                            <button onclick="threeStop(\'THREE_2\')">Stop</button>',
                                'aside'   => ''
                            ], // end part                            

                            [
                                'id'      => 38,
                                'title'   => 'terrain',
                                'content' => '<div id="THREE_3" class="cp_threejs" data-scene="terrain" data-width="800" data-height="600"></div>
                                            <button onclick="threeStart(\'THREE_3\')">Start</button>
                                            <button onclick="threeStop(\'THREE_3\')">Stop</button>
                                ',
                                'aside'   => ''
                            ], // end part                            

                            [
                                'id'      => 39,
                                'title'   => 'cube',
                                'content' => '<div id="THREE_4" class="cp_threejs" data-scene="model"   data-model="/assets/img/3js/model3d/avions/FW190.obj"></div>
                                            <button onclick="threeStart(\'THREE_4\')">Start</button>
                                            <button onclick="threeStop(\'THREE_4\')">Stop</button>
                                ',
                                'aside'   => ''
                            ], // end part                            
                        ] // end parts
                        ],  // end section                        


                        // ── Dialog ──────────────────────────────
                        [ //  section
                        'id'    => 27,
                        'title' => 'Dialog',
                        'parts' => [
                            [
                                'id'      => 40,
                                'title'   => 'Dialog',
                                'content' => '<button onclick="showModal(\'DIALOG_1\')">showModal DIALOG_1</button><button onclick="showModal(\'DIALOG_2\')">showModal DIALOG_2</button>',
                                'aside'   => ''
                            ] // end part
                        ] // end parts
                        ],  // end section




                    ] // end sections
                    
                ], // end article    

                // ── Article 11 — Roméo & Juliette ──────────────────────────────
                [
                    'id'    => 11,
                    'title' => 'Roméo & Juliette',
                    'intro' => 'Mise en scène vocale avec le composant Vox.',
                    'sections' => [
                
                        [   // Section — Scène
                            'id'    => 20,
                            'title' => 'La scène',
                            'parts' => [
                                [
                                    'id'      => 30,
                                    'title'   => 'Balcon de Vérone',
                                    'content' => '
                                        <div class="cp_scene"
                                             style="background-image: url(\'https://picsum.photos/seed/verona/1200/500\');">
                
                                            <div class="cp_actor cp_actor--left" data-alias="Romeo">
                                                <img
                                                    src="https://picsum.photos/seed/romeo/300/450"
                                                    alt="Roméo — Frank Dicksee 1884"
                                                />
                                                <span class="cp_actor__name">Roméo</span>
                                            </div>
                
                                            <div class="cp_actor cp_actor--right" data-alias="Juliette">
                                                <img
                                                    src="https://picsum.photos/seed/juliette/300/450"
                                                    alt="Juliette — Waterhouse 1898"
                                                />
                                                <span class="cp_actor__name">Juliette</span>
                                            </div>
                                            <div id="VOX_RJ_STATUS" class="cp_scene__subtitles"></div>
                                        </div>',
                                    'aside' => '
                                        <textarea class="cp_voxzone_textarea2" id="TXT_VOX_RJ" rows="10">
                Juliette: Roméo, Roméo, pourquoi es-tu Roméo ?
                Romeo: Mon nom, chère sainte, est une haine pour moi.
                Juliette: Ni murs ni profondeur ne sauraient m\'arrêter.
                Romeo: Je suis plus en danger de ton regard que de vingt épées.
                                        </textarea>
                                        <br/>
                                        <button onclick="window.eventBusPublish(event, \'vox:speak\', { targetId:\'TXT_VOX_RJ\', statusId:\'VOX_RJ_STATUS\' })">▶ Lire</button>
                                        <button onclick="window.eventBusPublish(event, \'vox:pause\')">⏸ Pause</button>
                                        <button onclick="window.eventBusPublish(event, \'vox:resume\')">▶▶ Resume</button>
                                        <button onclick="window.eventBusPublish(event, \'vox:stop\')">⏹ Stop</button>
                                        <br/><br/>
                                    '
                                ] // end part
                            ] // end parts
                        ], // end section scène
                
                    ] // end sections
                ], // end article 11                

                // ── Article test autocomplete ──────────────────────────────────────────
                [
                    'id'    => 12,
                    'title' => 'Test Autocomplete',
                    'intro' => 'Démonstration du composant autocomplete via bus.',
                    'sections' => [
                        [
                            'id'    => 30,
                            'title' => 'Recherche de mot',
                            'parts' => [
                                [
                                    'id'      => 50,
                                    'title'   => 'Autocomplete mot',
                                    'content' => '
                                        <div id="acTestContainer">
                                            <div id="acTestField"></div>
                                            <hr>
                                            <div id="acTestResult" style="margin-top:10px;padding:8px;background:#f0f4ff;border-radius:4px;min-height:2rem;">
                                                Sélection : <strong id="acTestValue">—</strong>
                                                (id : <span id="acTestId">—</span>)
                                            </div>
                                        </div>
                                    ',
                                    'aside' => '
                                        <p>Tapez au moins 2 caractères.</p>
                                        <p>Naviguez avec ↑ ↓ et validez avec Entrée.</p>
                                        <p>L\'id sélectionné est stocké dans le champ caché.</p>
                                    '
                                ]
                            ]
                        ]
                    ]
                ],
                // ── Article 13 — Images ────────────────────────────────────────────────────
                [
                    'id'    => 13,
                    'title' => 'Images',
                    'intro' => 'Gestion de la médiathèque.',
                    'sections' => [
                        [
                            'id'    => 31,
                            'title' => 'Médiathèque',
                            'parts' => [
                                [
                                    'id'      => 51,
                                    'title'   => 'Gestion des images',
                                    'content' => '
                                        <div id="imageContainer" class="cp_module_container">
                                            <div class="cp_panel_buttons"></div>
                                            <div class="cp_panel_form"   style="display:none"></div>
                                            <div class="cp_panel_detail" style="display:none"></div>
                                            <div class="cp_panel_table"></div>
                                            <div class="cp_panel_pagination"></div>
                                        </div>
                                    ',
                                    'aside' => '<p>Upload, recherche et validation des images.</p>'
                                ]
                            ]
                        ]
                    ]
                ],
                // ── Article 14 — Formes juridiques ────────────────────────────────────────────────────
                [
                    'id'    => 14,
                    'title' => 'Formes juridiques',
                    'intro' => 'Référentiel INSEE des formes juridiques (260 codes).',
                    'sections' => [
                        [
                            'id'    => 32,
                            'title' => 'Référentiel',
                            'parts' => [
                                [
                                    'id'      => 52,
                                    'title'   => 'Formes juridiques',
                                    'content' => '
                                        <div id="fjContainer" class="cp_module_container">
                                            <div class="cp_panel_buttons"></div>
                                            <div class="cp_panel_form"   style="display:none"></div>
                                            <div class="cp_panel_detail" style="display:none"></div>
                                            <div class="cp_panel_table"></div>
                                            <div class="cp_panel_pagination"></div>
                                        </div>
                                    ',
                                    'aside' => '
                                        <p>Source : INSEE catjurique2022</p>
                                        <p>260 codes de <code>0000</code> à <code>9970</code>.</p>
                                        <p>Utilisé par le module <strong>Entreprise</strong>.</p>
                                    '
                                ]
                            ]
                        ]
                    ]
                ],
                // adresse / typevoie
                [
                    'id'    => 15,
                    'title' => 'Types de voie',
                    'intro' => 'Référentiel des 63 types de voie.',
                    'sections' => [[
                        'id'    => 33,
                        'title' => 'Référentiel',
                        'parts' => [[
                            'id'      => 53,
                            'title'   => 'Types de voie',
                            'content' => '
                                <div id="tvContainer" class="cp_module_container">
                                    <div class="cp_panel_buttons"></div>
                                    <div class="cp_panel_form"   style="display:none"></div>
                                    <div class="cp_panel_detail" style="display:none"></div>
                                    <div class="cp_panel_table"></div>
                                    <div class="cp_panel_pagination"></div>
                                </div>',
                            'aside' => '<p>63 types — Rue, Avenue, Boulevard…</p>
                                        <p>Utilisé par le module <strong>Adresse</strong>.</p>'
                        ]]
                    ]]
                ],
                // adresse / codepostal
                [
                    'id'    => 16,
                    'title' => 'Codes postaux',
                    'intro' => '39 192 codes postaux France — source La Poste.',
                    'sections' => [[
                        'id'    => 34,
                        'title' => 'Recherche',
                        'parts' => [[
                            'id'      => 54,
                            'title'   => 'Codes postaux',
                            'content' => '
                                <div id="cpContainer" class="cp_module_container">
                                    <div class="cp_panel_form"   style="display:none"></div>
                                    <div class="cp_panel_detail" style="display:none"></div>
                                    <div class="cp_panel_table"></div>
                                    <div class="cp_panel_pagination"></div>
                                </div>',
                            'aside' => '
                                <p>Recherche par code postal, code INSEE ou nom de commune.</p>
                                <p>Cliquez sur une ligne pour voir le détail et le lien carte.</p>
                                <p>Utilisé par le module <strong>Adresse</strong>.</p>'
                        ]]
                    ]]
                ],
                // adresse 
                [
                    'id'    => 17,
                    'title' => 'Adresses',
                    'intro' => 'Gestion des adresses postales.',
                    'sections' => [[
                        'id'    => 35,
                        'title' => 'Adresses',
                        'parts' => [[
                            'id'      => 55,
                            'title'   => 'Gestion des adresses',
                            'content' => '
                                <div id="adresseContainer" class="cp_module_container">
                                    <div class="cp_panel_buttons"></div>
                                    <div class="cp_panel_form"   style="display:none"></div>
                                    <div class="cp_panel_detail" style="display:none"></div>
                                    <div class="cp_panel_table"></div>
                                    <div class="cp_panel_pagination"></div>
                                </div>',
                            'aside' => '
                                <p>FK vers <strong>type_voies</strong> et <strong>codes_postaux</strong>.</p>
                                <p>L\'acheminement, les coordonnées et la ligne 5 sont
                                   auto-remplis depuis le code postal sélectionné.</p>'
                        ]]
                    ]]
                ],
                // organisations 
                [
                    'id'    => 18,
                    'title' => 'Organisations',
                    'intro' => 'Gestion des organisations.',
                    'sections' => [[
                        'id'    => 36,
                        'title' => 'Organisation',
                        'parts' => [[
                            'id'      => 56,
                            'title'   => 'Gestion des organisations',
                            'content' => '
                                <div id="orgContainer" class="cp_module_container">
                                    <div class="cp_panel_buttons"></div>
                                    <div class="cp_panel_form" style="display:none"></div>
                                    <div class="cp_panel_detail" style="display:none"></div>
                                    <div class="cp_panel_table"></div>
                                    <div class="cp_panel_pagination"></div>
                                </div>',
                            'aside' => '<p>Organisation.</p>'
                        ]]
                    ]]
                ],

                // Entreprise 
                [
                    'id'    => 19,
                    'title' => 'Entreprise',
                    'intro' => 'Gestion des entreprise.',
                    'sections' => [[
                        'id'    => 37,
                        'title' => 'Entreprise',
                        'parts' => [[
                            'id'      => 57,
                            'title'   => 'Gestion des entreprise',
                            'content' => '
                                <div id="entContainer" class="cp_module_container">
                                    <div class="cp_panel_buttons"></div>
                                    <div class="cp_panel_form" style="display:none"></div>
                                    <div class="cp_panel_detail" style="display:none"></div>
                                    <div class="cp_panel_table"></div>
                                    <div class="cp_panel_pagination"></div>
                                </div>',
                            'aside' => '<p>Entreprise.</p>'
                        ]]
                    ]]
                ],


                

            ], //end articles
    ];

        return view('cms/index', $data);
    }
}

/*
260502-001
- [ ] ajouter le callout dans aside de histoire (TRAVAUX\OVH\www\app\Controllers\Cms.php)


*/