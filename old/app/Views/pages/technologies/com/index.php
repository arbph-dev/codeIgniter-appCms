<!-- ==================================================================================================================================== -->

<div id="index" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>Télécommunications</h1>
            <p>
            Les réseaux présentés sont des réseaux d'automatisme, de supervision et de télégestion.
                <br>

            </p>
        </header>

    <!-- ==================================================================================================================================== 






    -->  
        <section>
            <h2>Réseaux industriels</h2>
            <div> 
                <div>
                Chaque réseau est constitué d'équipements communicants sur des liaisons et avec des protocoles différents.<br>
                Les automates, compteurs et régulateur sont connectés sur des supports : fibre ou cuivre; les équipements exploitent des liaisons Ethernet, CAN et RS485.<br>
                <h3>Site industriel</h3>
                Le site qui nous servira a illustrer ces articles est une centrale fluide sur un site classé Seveso 2<br>
                <br>
                Le réseau Ethernet exploite une boucle en fibre optique. La boucle en fibre optique s'impose de par la longueur des liaisons et du fait de la communication avec les équipements de la boucle Haute Tension.
                <br>
                Le client dispose d'un accès au réseau des superviseurs.<br>
                Les superviseurs PANORAMA, équipé de deux cartes réseaux, et les cartes APPLICOM assurent le rôle de passerelle entre les réseaux Ethernet supervision et le réseau d'automatisme.<br>
                <br>
                La télégestion est assuré par une carte relié au réseau d'automatisme et communicant avec la télésurveillance du site. Cette carte sert de passerelle entre les réseaux réseau d'automatisme et de télésurveillance<br>
                La carte transmet les alarmes et répond aux requêtes qui lui sont transmises par la ligne téléphonique dont les tests cycliques<br>
                <br>
                Les réseaux Ethernet sont représentés sur le synoptique ci contre.<br>
                Chaque équipement peut exploiter des liaisons RS485. Ces liaisons ne sont pas représentées ici pour ne pas surcharger le réseau<br>

                Le réseaux supervision comporte 3 postes, le poste client utilise HTTP.<br>
                <br>
                Les réseau d'automatisme regroupe, sur des plages IP spécifiques, les automates des stations vapeur, air comprimé, froid, traitement d'eau, sosu stations de chauffage, GTC et boucle haute tension.<br>
                <br>


                <h3>Equipements réseau</h3>
                Les équipements de communication des réseaux sont visibles ci contre<br>
                <br>
                De haut en bas :<br>
                - La baie fibre pour le client<br>
                Le serveur HTTP communique avec le réseau du client. La liaison Ethernet est converti pour être acheminé par fibre optique.<br>
                <br>
                - La baie télécom, avec les routeurs et les switchs<br>
                Tous les equipements du réseau d'automatisme sont interconnectés ici. Les convertisseurs de médias sont nécessaires pour exploiter les liaisons et la boucle en fibre optique.<br>
                Les switchs gérent les échanges entre les cartes APPLICOM et les automatismes<br>
                <br>
                - Les cartes de télésurveillance et leurs alimentations secourues<br>
                Elle servent à transmettre les alarmes des équipements à la télésurveillance<br>
                <br>
                Ci contre l'armoire électrique d'instrumentations avec ses équipements de communication.<br>
                <br>
                L'armoire instrumentation gère les productions de froid et d'air comprimé et une partie des auxiliaires de la chaufferie vapeur.<br>
                Cette automate exploite des signaux TOR, analogiques et bus de terrain<br>
                <br>
                Des entrées/sorties sont utilisées pour le controle commande, les entrées/sorties analogiques servent pour la mesure et la régulation.<br>
                Des régulateurs et des compteurs communiquent sur des liaisons RS485(Modbus).<br>
                <br>
                L'automate instrumentation sert de concentrateur, les données acquises sont disponibles dans une zone mémoire appelée table d'échange. Les cartes APPLICOM des superviseurs peuvent lire ou écrire dans la mémoire de l'automate.<br>
                On trouve les boites de jonction et les convertisseurs des bus RS485 en bas de l'armoire.<br>

                <h3>Carte APPLICOM</h3>
                Ces cartes disposent d'une CPU et des ports de communication, elle décharge l'ordinateur du traitement des transmissions<br>
                <br>
                L'application CONSOLE APPLICOM permet de configurer la carte et les équipements qui y sont y connectés.<br>
                Les équipements sont dits Serveurs lorsqu'ils contiennent des données et un équipement client accède aux données d'un serveur. Ici la carte est le client des équipements serveurs.<br>
                <br>
                La CONSOLE APPLICOM permet de détecter les équipements connectés au réseau. Les équipements qui ont été récemment raccordés peuvent être ajoutés à la configuration.<br>
                <br>
                On peut accéder à la configuration d'un équipement :<br>
                - nom<br>
                - numéro , les numéros d'équipements peuvent être liés aux adresses IP.<br>
                - adresse IP<br>
                - nombre de requêtes simultanées et timeout.<br>
                </div>
                <aside>
                    <h3>Site industriel</h3>
                    <a href="/assets/img/technologies/com/synrzo_h.png" target="_blank">
                        <img src="/assets/img/technologies/com/synrzo_l.png" width="350">
                    </a>
                    <br>
                    <h3>Equipements</h3>
                    <a href="/assets/img/technologies/com/telegestionspx_h.png" target="_blank">
                        <img src="/assets/img/technologies/com/telegestionspx_l.png" width="350">
                    </a>
                    <br>
                    <h3>Automatisme</h3>
                    <a href="/assets/img/technologies/com/apicommunsspx_h.png" target="_blank">
                        <img src="/assets/img/technologies/com/apicommunsspx_l.png" width="350">
                    </a>
                    <br>
                    <h3>Supervision</h3>
                    <a href="/assets/img/technologies/com/carteapplicom_h.png" target="_blank">
                        <img src="/assets/img/technologies/com/carteapplicom_l.png" width="350">
                    </a>
                    <br>
                   
                </aside>                
            </div>
        </section>


    </article>            



</div>