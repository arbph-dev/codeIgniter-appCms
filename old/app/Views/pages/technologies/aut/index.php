<!-- 

gestion des alarmes 
transmission sur site telegestion ==lora== telecommunications
pec
acquittement
Alarmes avec réarmement automatique ou manuel.  Pec apparition       

logique positive 
cycle de vie d une alarmes. 

gtc spontex
### TREND
I:\VAE\AUTOMATISME\TREND\Automates TREND.docx
"G:\WWW\PROJET\ALL\aut\PLC\plcTRENDIQ3_materiel.html"
"G:\WWW\PROJET\ALL\aut\PLC\plcTRENDIQ3_alarmes.html"
"G:\WWW\PROJET\ALL\aut\PLC\plcTRENDIQ3_logiciel.html"
"G:\WWW\PROJET\ALL\aut\PLC\plcTRENDIQ3_comm.html"
"G:\WWW\PROJET\ALL\aut\PLC\plcTRENDIQ3_blocs.html"
"G:\WWW\PROJET\ALL\aut\PLC\plcTRENDIQ3_detailbloc.html"




### Automatismes / Crouzet
[[ALL/TRIES/aut/m3crouzet/m3crouzet]]

### Automatismes / Schneider
[[ALL/TRIES/aut/schneider/telefast/Entrées Sorties déportées]]
### Automatismes / Trend

scinder en plusieurs articles
[[ALL/TRIES/communications/Communications#Ethernet]]


http://192.168.1.74/w3d5/technologies/automatismes/PLC/plcTRENDIQ3_materiel.html
synacc.JPG
I:\VAE\AUTOMATISME\TREND\Doc1.doc
=> et dossier dont mail sodefa
 + incorporer note 2024-04-16

http://192.168.1.74/w3d5/technologies/automatismes/PLC/plcTRENDIQ3_materiel.html






-->

<!-- ==================================================================================================================================== -->

<div id="index" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>Trend IQ3</h1>
            <p>
            <br>
             </p>
        </header>
        <!-- ==================================================================================================================================== 
          <img src="./iq3excite.jpg" width="250">
          <img src="./iq3base.gif" width="250">
          <img src="./regulinf.jpg" width="250">
        -->
        <section>
            <h2>Présentation</h2>
            <div>
                <div>
                    <p>
                        Ils existent plusieurs versions des contrôleurs TREND IQ3, les IQ3 Xcite, LAN et XNC ; ces automates disposent d’une interface Ethernet, ils embarquent un serveur web et peuvent supporter la technologie XML.<br>
                        <br>
                        Selon les versions on peut atteindre 128 points numériques ou analogiques avec des modules d’extensions.<br>
                        Les points analogiques sont des signaux tensions courants ou résistances.<br>
                        Le module de base propose 10 entrées et 8 sorties.<br>
                        La version XNC propose des liaisons RS232 et RS485 supportant les protocoles Mobus, Mnus et Bacnet.<br><br> 
                        Nous avons déployés ces solutions dans des applications chauffage et GTC. Nous avons utilisés le superviseur TREND 963, une passerelle XTEND et des modems TMNH pour la GTC.
                        Les services HTTP et les données XML ont permit d’interfacer la technologie TREND avec le superviseur PANORMA de la centrale d’énergie.<br> 
                        <br> 
                        Dans la section suivante nous allons nous intéresser aux entrées et sorties.<br> 
                        Nous aborderons ensuite les blocs fonctions et logiques qui permettent d’implémenter un programme.<br>  
                        Dans une troisième partie nous présenterons des exemples tirées de programme.<br>  
                        Nous présenterons rapidement le logiciel de programmation et la configuration des liaisons .<br> 
                        Enfin nous verrons quelles sont les possibilités offertes par les services HTTP et XML des contrôleurs TREND IQ3<br> 
                    </p>                    
                </div>
                <aside>
                    <a href="/assets/img/technologies/aut/trend/set/iq3excite_h.jpg" target="_blank">
                        <img src="/assets/img/technologies/aut/trend/set/iq3excite_l.jpg" width="350">
                    </a>
                    <br>                    
                    <img src="/assets/img/technologies/aut/trend/set/iq3base.gif" width="350">
                </aside>                
            </div>
        </section>


        <!-- ==================================================================================================================================== 
         
    
          <img src="./entree.jpg" width="250">
          <img src="./sorties.jpg" width="250">
          <img src="./iq3_entreeconn.jpg" width="250">  


        
         -->
        <section>
            <h2>Entrées et sorties</h2>
            <div>
                <div>
                    <p>
                        Les entrées se configurent en fonction des signaux a traiter : 
                        <ul>
                        <li>Digitale TOR</li>
                        <li>Tension U</li>
                        <li>Courant I</li>
                        <li>Résitance R (sauf pt100)</li>
                        </ul>
                        La configuration des entrées se fait par l’intermédiaire de cavaliers.<br> 
                        <br>                         
                        Les sorties sont uniquement configurable de manière logicielle.<br> 
                        Elles peuvent renvoyer un signal analogique ou alimenter des relais d’automatisme.<br>
                        <br> 
                        
                        La masse commune des entrées et sorties peut être séparée de la terre.<br><br>

                        Une entrée ou une sortie dispose d’un numéro de module, 0 pour la base de 1 à 15 pour une extension et un numéro de voie ou canal.<br><br> 

                        Les entrées TOR utilisent des contacts libres de potentiel, l’automate alimente le contact NO ou NF.<br>
                        Dans ce mode une diode signale l’état de l’entrée, allumée contact fermée, éteinte contact ouvert.<br>
                        On raccorde les contacts entres les bornes 0 et celles portant les numéros de l’entrée<br>
                        Exemple :<br>
                        le contact LSH se branche en entree 1 (module 0 voie 1) sur les bornes 2 et 3<br>
                        un contact LSL (module 0, voie 2) se branche entre 5 et 6<br>
                        <br> 

                        Les tensions analogiques 2/10V et 0-10V se raccordent de manière similaire aux entrées TOR, entre les bornes portant le numéro de voie du module  et les borne 0<br>
                        Prêter la plus grande attention aux polarités<br><br>

                        Pour les entrées courant 4/20 et 0/20 mA, le câblage varie selon les technologies de capteurs : 2 ou 3 fils.<br>
                        L’IQ3 dispose d’une source de tension 24V que l’on peut utiliser pour alimenter les capteurs.<br> 
                        Dans le cas d’un capteur deux fils on branche le + du capteur sur la borne 24Vcc et le – du capteur sur la borne portant le numéro de l’entrée, les masses de l’alimentation 24V et celle des entrées étant commune le courant circule. <br>
                        On peut renvoyer le 24Vcc sur les bornes + des entrées. Il faut réaliser un pont entre les bornes 24V et P du bornier A<br><br>

                        Les entrées Résistance fonctionnent avec des résistances de 1 à 100K mais pas avec des PT100.<br>
                        <br> 
                        Pour les grandeurs analogiques on peut définir une mise à l’échelle de la mesure ou utiliser des echelles prédéfinis pour les capteurs.<br>  
                        Un groupe froid délivre un signal de charge sous forme d'une tension 0-10V nous définirons une échelle de 0 à 100%. <br>
                    

                    </p>                    
                </div>
                <aside>
                    <img src="/assets/img/technologies/aut/trend/set/entree.jpg" width="350">
                    <br>
                            
                    <img src="/assets/img/technologies/aut/trend/set/sorties.jpg" width="350">
                    <br>

                    <img src="/assets/img/technologies/aut/trend/set/iq3_entreeconn.jpg  " width="350">
                    <br>
                </aside>                
            </div>
        </section>
        <!-- ==================================================================================================================================== 
               <h3 class="w3-teal w3-center">Outils logiciel</h3>
        <img src="./download_l.jpg" width="250">SET permet de programmer les automates.
        <img src="./iptool_l.jpg" width="250">IPTOOL sert à configurer la communication
        -->
        <section>
            <h2>Logiciels</h2>
            <div>
                <div>
                    <p>
                    Les automates IQ3 XNC sont exploitables directement via un navigateur et gère les accès.<br> 
                    Pour les programmer nous avons exploiter set et iptools<br>
                    <br>
                    Set est le logiciel de programmation. Il permet de réaliser les programmes graphiques en utilisant des blocs répartis sur des pages.<br>
                    <br>
                    IP tools sert à configurer la liaison à la mise en service.<br>
                    On attribue notamment une adresse ip et une adresse vcnc pour la programmation.<br>
                    <br>      
                    Le superviseur 963 permet de présenter les points des automates du réseau et de site distants pour une gestion plus efficace.<br>
                    Elle présentent des pages avec des liens pour naviguer.<br><br>
                    Elle affiche un panneau lors du déclenchement d alarmes, imprime les etats au fil de l eau.<br>
                    Les alarmes sont géré dans des pages dédiés.<br><br>
                    Selon les droits on peut modifier les pages, acquiter ou inhiber les alarmes et tester les communications<br><br>
                    Le logiciel de supervision 963, sera présenté plus en détail. 
                    <br>                         
                    </p>
                </div>
                <aside>

                </aside>                
            </div>
        </section>                

        <!-- ==================================================================================================================================== 
          <img src="./xnc.jpg" width="250">Configuration de la liason MBus<br>
          <img src="./com_regcompteur_l.jpg" width="250">Les registres du compteur d'énergie
         -->


        <section>
            <h2>Communication</h2>
            <div>
                <div>
                    <p>
                        Les automates iq3 xnc supportent différents protocoles sur des liaisons rs232 et rs485.<br>
                        <br>
                        La configuration est relativement aisée.<br> 
                        Sur la copie d écran vous pourrez visualiser la configuration d une liaison mbus rs485.<br><br>
                        En bas à gauche on paramètre la liaison<br> 
                        A droite en haut on trouve les donnés à transmettre.<br>
                        En bas à droite les données reçues sont associées aux variables du programme.<br> 
                        <br>
                        Le compteur d énergie sappel renvoie principalement des mesures, nous n avions pas d information à transmettre. 
                        <br>
                        Pour connecter le réseau à la télésurveillance nous avons employer une tmnh.<br>
                        Celle ci permettant le routage des alarmes vers le client et la télésurveillance
                    </p>                    
                </div>
                <aside>

                </aside>                
            </div>
        </section>

        <!-- ==================================================================================================================================== 
         Programmation

        <h3 class="w3-teal w3-center">Programmation</h3>
            <img src="./set_prog1.jpg" width="250">Demande de chauffe
            <img src="./set_prog_ldc.jpg" width="250">Loi de chauffe 4 points<br>
            <img src="./set_prog_occ.jpg" width="250">Gestion occupation<br>
         -->
        <section>
            <h2>Programmation</h2>
            <div>
                <div>
                    <p>
                        Les programmes des automates sont réalisés en langage graphique.<br>
                        On connecte des blocs par des fils . Les blocs ont des fonctions et traitent des signaux analogique et numérique.<br> 
                        <br>
                        Les blocs sont à découvrir et à maîtriser,  une période de prise en main , l exercice et la pratique permettent de réussir.<br> 
                        Les blocs se combinent pour former les fonctions de contrôle et de commande.<br>
                        Les signaux numériques se connecte sur les broches carrée des blocs.<br>
                        Les blocs entrées et sorties assurent l interface avec la partie operative et les systèmes.<br>
                        Des blocs logique permettent de gérer les automatisme.<br>
                        Des blocs compteurs, temporisation et planning complète les possibilités des automatismes.<br><br>

                        Les signaux analogiques peuvent être traités avec des blocs fonctions.<br>
                        Des blocs réalisent des traitements mathématiques qui permettent d aborder la régulation notamment avec des blocs loop assurant la fonction de régulateur pid.<br>

                        Les signaux analogique et numérique peuvent s interface entre eux grâce à des blocs dedies, comparateur CNA et CAN<br>
                        <br>
                        D autres blocs sont destinés à la gestion des alarmes et à la communication<br> 
                        <br>                         
                    </p>                    
                </div>
                <aside>

                </aside>                
            </div>
        </section>    
        <!-- ==================================================================================================================================== 
            Blocs
"G:\WWW\PROJET\ALL\TRIES\aut\trend\iq3.docx"
        -->
        <section>
            <h2>Blocs</h2>
            <div>
                <div>
                    <p>
                        External Sensor<br> 
                        Internal Sensor<br> 
                        External Digital Sensor<br> 
                        Internal Digital Sensor<br>  
                        Switch<br> 
                        External Digital Input<br> 
                        Internal Digital Input<br> 
                        Knob<br> 
                        Switch<br> 
                        Plot<br> 
                        Loop<br>
                        Blocs fonctions analogiques<br>
                        Blocs fonctions logiques<br> 
                    </p>                    
                </div>
                <aside>
                    Entrée analogique
                    <br>
                    <img src="/assets/img/technologies/aut/trend/set/bloc_sensor.jpg" width="350">
                    <img src="/assets/img/technologies/aut/trend/set/sensor_type.jpg" width="350">
                    
                    <br>
                
                    Sortie analogique
                    <br>
                    <img src="/assets/img/technologies/aut/trend/set/bloc_drvana.jpg" width="350">
                    <br>


                    Loop - PID
                    <br>
                    <img src="/assets/img/technologies/aut/trend/set/bloc_pid.jpg" width="350">
                    <br>

                    fonctions analogiques
                    <br>
                    <img src="/assets/img/technologies/aut/trend/set/bloc_addscl.jpg" width="350">
                    <br>
                    <img src="/assets/img/technologies/aut/trend/set/bloc_rsclfr.jpg" width="350">
                    <br>
                    <img src="/assets/img/technologies/aut/trend/set/bloc_rsclto.jpg" width="350">
                    <br>                    
                    fonctions logiques
                    <br>
                    <img src="/assets/img/technologies/aut/trend/set/bloc_comb.jpg" width="350">
                    <br>                    

                </aside>                
            </div>
        </section>   
        


    </article>
    

<!-- 
/assets/img/technologies/aut/trend/set/iq32.JPG

    
```    
                    
                    

-->
    <article>     
        <header>
            <h1>Automatisme</h1>
            <p>
            <br>
             </p>
        </header>
        <!-- ==================================================================================================================================== -->
        <section>
            <h2>Logique câblée</h2>
            <div>
                <div>

                La logique câblée reste indissociables des sécurités, les automates disposent d'un chien de garde à cet effet.
                Les transmetteurs, retournant des mesures peuvent lever des alarmes mais ne sont pas apte a fonctions de sécurité.
                
                <h3>sécurité positive</h3>
                La logique positive est indissociable de la sécurité, même si la surveillance de ligne permet de s'en affranchir elle reste une convetion<br/> 
                <br/> 
                Pour traiter une information on dispose de capteurs qui sont livrés avec des inverseurs ou avec deux contacts.<br/>
                <br/>  
                Le circuit électrique est une boucle le capteur ferme la boucle et l'automatisme voit l'état logique haut.<br/>  
                <br/> 
                Un thermostat de surchauffe dispose de deux contacts :<br/> 
                contact à fermeture (se ferme) , ouvert sans action mécanique donc normalement ouvert NO<br/> 
                contact à ouverture (s'ouvre) , fermé sans action mécanique donc normalement clos NC<br/> 
                <br/> 
                L'un est ouvert dans un état normal, il se ferme si la température est excessive, c'est parfait pour allumer une lampe de défaut et activer une sirène. Sauf qu'il suffit que le fil soit débranché pour que le moteur surchauffe et soit endommagé.<br/> 
                <br/> 
                L'un est clos dans un état normal, il s'ouvre si la température est excessive. cela déclenche l'alarme. On débranche, ou coupe, le fil l'alarme est renvoyée.<br/>  


                
                <h3>chien de garde</h3>
                L'évolution des automatimses les rend indissociable des chaines de séscurité.<br>
                Pour détecter toute défaillance des automates on met en oeuvre un circuit interne dit de chien de garde.<br>
                En pratique il peut etre ralisé avec une temporisation, l'automate doit la réinitialiser régulierment sinon une alarme est levé et les actions de sécurité sont mises en oeuvre




                </div>
                <aside>
                <br/> 
                    Les capteurs (sensor) sont destinés à l'automatisme et les indicateurs (indicator) aux techniciens.<br/> 
                    Dans le cas présent un thermostat (TS temperature Switch) doit être employé et reste indissociable d'un thermomètre.
                    Ceci lors d'une alarme pour distinguer immédiatement:<br/>
                    - la surchauffe<br/>
                    - une anomalie du câblage<br/>
                </aside>                
            </div>
        </section>
        <!-- ==================================================================================================================================== -->
        <section>
            <h2>Logique programmée</h2>
            <div>
                <div>
                    Les progrès de l'électronique on augmenté la puissance de traitement et permis l'exploitation de signaux analogiques et numériques.
                    Selon les systèmes et le saffinités on emploie des langages comme le ladder qui n'est que la transcription du schéma électrique en programme.
                    Les langages des automates sont normalisés. Des constructeurs ont dévellopés des solutions graphique.



                </div>
                <aside>

                </aside>                
            </div>
        </section>
    </article>        

</div>
