<!-- ==================================================================================================================================== -->

<div id="index" class="tabcontent" style="display: block;">



    <!-- ==================================================================================================================================== 

## Polarisation simple
Les équipements sont concentrés sur une distance assez courte pour nous permettre de négliger les résistances des fils.
[[ALL/TRIES/communications/RS485/Polarisation de ligne (simple)]]

-->  
       


    <article class="cp_soft-card">
        <header>
            <h1>Liaison série</h1>
            <p>
            La liaision série a évoluer depuis les débuts de l'informatique du port COM1 à l'USB
                <br>

            </p>
        </header>    

        <section>
            <h2>Principe</h2>
            <div> 
                <div>
                    La Liaison série présente l'avantage de réduire les conducteurs, les données sont transmises en série. ces liaisons sont réalisé sur différents support, fils, fibre optique, antenne.<br>
                    Les standards les plus répandus sont l'USB, CAN, RS232, RS485 et RS422.<br>
                    Ces liaisons sont caractérisés par leur mode de transmission, leur vitesse, le nombre d'équipements communicants.<br>
                    <br>
                    Le mode de transmission est unidirectionnelle ou half duplex, lorsque les données sont envoyées dans un seul sens à la fois. Un équipement transmet, les autres écoutent.<br>
                    Dans une liaison bidirectionnelle, les données peuvent transiter dans les deux direction simultanément. Un ordinateur transfert un fichier, le périphérique renvoie des informations pour confirmer les échanges tout au long du transfert.<br>
                    <br>
                    La vitesse dépend des besoins, une température évoluent lentement, d'autres applications nécessitent des débits plus importants. La distance limite le débit de transmission.<br>
                    <br>
                    Certaines liaisons sont réalisées en point à point, deux équipements interconnectés communiquent entre eux.<br> 
                    D'autres liaisons permettent de relier plusieurs équipements, on trouve un maitre et des esclaves. Ces liaisons utilisent un système d'adressage pour identifier les équipements.<br>
                    <br>
                    <h3>RS485</h3>
                    La liaison RS485 est une liaison half duplex. Les signaux différentiels permettent d'assurer la qualité des transmissions. La liaison peut atteindre le kilomètre mais le débit reste limité.<br>
                    <br>
                    Le support de liaison est généralement un câble en paire torsadée blindée. Selon les équipements la liaison peut être assurée avec 2 ou 3 fils.
                    <br>
                    Modbus RTU et Modbus ASCII sont des protocoles exploitant la liaison série RS485.<br>
                    <br>
                    Les données sont transmises sur deux lignes A et B. La tension Vab entre A et B défini :<br>
                    - le bus en attente pour une tension de 200 mV<br>
                    - un état haut pour Vab > 200 mV<br>
                    - un état bas pour Vab < - 200 mV<br>
                    <br>
                    Le bus doit être polarisé et une résistance de terminaison, de 120 Ω,  est raccordée entre A et B sur le dernier équipement du bus. La polarisation peut être réalisé par le maitre ou par un conditionneur de bus .<br>
                    <br>
                    La polarisation ne doit pas être négligé, elle impacte directement la qualité des transmissions. On peut la mesurer avec un voltmètre<br>
                </div>
                <aside>
                    <a href="/assets/img/technologies/com/rs485/reqA.png" target="_blank">
                        <img src="/assets/img/technologies/com/rs485/reqA.png" width="350">
                    </a>
                    <br>

                    <a href="/assets/img/technologies/com/rs485/reqB.png" target="_blank">
                        <img src="/assets/img/technologies/com/rs485/reqB.png" width="350">
                    </a>
                    <br>

                    <a href="/assets/img/technologies/com/rs485/schema_complet.png" target="_blank">
                        <img src="/assets/img/technologies/com/rs485/schema_complet_low.png" width="350">
                    </a>
                    <br>

                    Transmission correctement polarisé<br>
                    <a href="/assets/img/technologies/com/rs485/polarisation.png" target="_blank">
                        <img src="/assets/img/technologies/com/rs485/polarisation.png" width="350">
                    </a>
                    <br>
                    Polarisation incorrecte les trames de l'esclave sont ignorés.<br>
                    <a href="/assets/img/technologies/com/rs485/polarisationrtfaible.png" target="_blank">
                        <img src="/assets/img/technologies/com/rs485/polarisationrtfaible.png" width="350">
                    </a>
                    <br>

                </aside>                
            </div>
        </section>


    </article>   

</div>