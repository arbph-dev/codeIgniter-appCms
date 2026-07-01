<!-- ==================================================================================================================================== 
 
## Modbus TCP

Modbus est un protocole ouvert et documenté.
il est exploité en [[développement#Python]]
dans le projet [[Projets/PYTHON/Supervision]] 
dans le logiciel [[Freecad#Python et modbus TCP]]

un exemple [[développement#PHP]] est disponible ici [[ALL/TRIES/communications/modbustcp/source-exemplePHP]]
un autre source en C# ici [[ALL/TRIES/communications/modbustcp/ProjetModbus/source-form1]]

[[Zelio_ModbusTCP.mkv]]
[[Zelio_modbusTCP_python.mkv]]

un projet [[Arduino]] est disponible dans [[Applications]]]

-->

<div id="index" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>Ethernet</h1>
            <p>
            Ethernet et la stack TCP/IP se sont imposés comme des standards dans de nombreux secteurs d'activité
                <br>

            </p>
        </header>    

        <section>
            <h2>Transmission TCP/IP</h2>
            <div> 
                <div>
                L'évolution des composants électroniques à permis d'exploiter les liaisons Ethernet en informatique industrielle.<br>
                <br>
                Les systèmes informatiques utilisent des adresses IP réparties en classes, les réseaux d'automatismes et bureautique sont séparés pour des raisons de sécurité.<br>
                <br>
                Pour échanger des données on utilise des services TCP, les données sont échangées et empaquetés selon des protocoles de communication.<br>
                <br>
                Des passerelles et routeurs permettent l'interconnexion des postes de supervision sur les réseaux. Les postes disposent de deux cartes réseaux et leur accès est sécurisé.<br>
                Votre box internet sert de routeur entre votre réseau privé de la maison et internet.<br>
                Le routeur gère l'acheminement des paquets entre les équipements des différents réseaux.<br>
                <br>
                Les échanges de données sont parfois sécurisés, des logiciels permettent d'écouter et d'analyser les transmissions<br>
                <br>
                Ci contre vous trouverez un échange de données sur TCP/IP en texte. Il s'agit d'un protocole du constructeur Novar Trend (IQ3).
                </div>
                <aside>
                    <h3>Echange</h3>
                    SET le logiciel de programmation demande à l'automate Trend son type et son heure courante<br>
                    <a href="/assets/img/technologies/com/echangetcpip_detail.png" target="_blank">
                        <img src="/assets/img/technologies/com/echangetcpip_detail.png" width="350">
                    </a>
                    <h3>Initialisation des transmissions</h3>
                    Lorsuq'on établit la connexion, le logiciel récupére de sinformations sur le système puis acutalise les données de l'interface graphique du logiciel d eprogrammation<br>
                    Le protocle en texte clair fut un critère de choix, il permet d'interfacer simplement la télégestion.
                    <a href="/assets/img/technologies/com/echangetcpip.png" target="_blank">
                        <img src="/assets/img/technologies/com/echangetcpip.png" width="350">
                    </a>

                </aside>                
            </div>
        </section>                




        <section>
            <h2>Diagnostique défaut boucle fibre optique</h2>
            <div> 
                <div>
                    La maintenance de la liaison fibre faisant partie de nos prestations nous avons réalisé le diagnostique d'un défaut sur la boucle fibre optique du réseau SPONTEX<br>
                    Nous avons rencontré des problèmes de communications avec certaines sous stations de chauffage. Ce défaut impactait également les relevés automatiques du comptage haute tension
                    <br>
                    Pour déterminer l'origine du défaut nous avons utiliser l'application ping pour mesurer temps de réponse<br>
                    <br>
                    Depuis la baie informatique des locaux bureau nous avons émis une série de ping à destination des sous stations amont, chaufferie, et aval infirmerie<br>
                    La station amont chaufferie répondait normalement<br>
                    Le temps était plus long pour la station infirmerie et des paquets étaient perdus<br>
                    <br>
                    Les trames, émises depuis les bureaux ,devaient transiter du convertisseur bureau vers le convertisseur infirmerie<br>
                    Mais notre liaison bureau et infirmerie étant rompue, les trames devaient revenir par la chaufferie puis parcourir toute la boucle avant de parvenir à la sous station infirmerie. <br>
                    <br>
                    On détermine donc que la coupure a lieu entre les bureaux et l'infirmerie.<br>
                    En vérifiant le câblage fibre dans la baie infirmerie il est apparu qu'un un connecteur fibre avait son verrou défectueux<br>
                    <br>
                    Le cordon a été remplacé et nous avons contrôlé les transissions avec ping<br>
                </div>
                <aside>
                    Les commandes dos et linux : dir , ls , ipconfig et ping sont des outils à maitriser.<br>
                    On les exploite depuis une fenetre terminal 
                </aside>                
            </div>
        </section>


    </article>   

</div>