<div id="index" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>Eléctronique</h1>
            <p>
                L'électronique à permis l'essor de l'informatique. On distingue l'électronique analogique, numérique et l'électronique de puissance
            </p>
        </header>
            <section>
                <h2>Généralités</h2>
                <div>
                    <div>
                    
                        De nombreux concepts relatifs à l'éléctricité sont à maitriser:
                        <ul>  
                            <li>Les grandeurs</li>
                            <li>Loi d'ohm</li>
                            <!-- <a href="./electricite/cc1_polarisation.html">Application : polarisation de bus RS485</a> -->
                            <li>Puissance</li>
                            <li>Energie</li>
                            <li>Loi des noeuds</li>
                            <li>Loi des mailles</li>
                            <li>Association de récépteurs</li>
                            <li>Association de générateurs</li>
                            <li>Calcul matricielle</li>
                        <ul>




                    </div>
                    <aside>
                    </aside>                
                </div>
            </section>

            <section>
                <h2>Composants passifs</h2>
                <div>
                    <div>
                            Les principaux composants de l'électronique analogique
                            <ul>
                                <li>Résistance</li>
                                <li>Inductance</li>
                                <li>Condensateur</li>
                            </ul>  
                            Leur comportement dans le domaine continu, temporel et fréquentiel<br/>
                            Association série et parraléle<br/>

                            <h3>association de condensateurs</h3>

                            Les condensateurs s'associent en série et en dérivation (parallèle).<br/>

                            Les calculs peuvent être réalisés avec les outils en ligne : 
                            <a href="https://www.digikey.fr/fr/resources/conversion-calculators/conversion-calculator-series-and-parallel-capacitor" target="_blank">
                                digikey Calculateur de condensateurs série et parallèle
                            </a>
                            <br/>
                            
                            <h4>Association dérivation</h4>
                            Pour les condensateurs <strong>les capacités s'additionnent en dérivation</strong><br/>
                            Ainsi pour obtenir 32 μF il faut donc : <br/>
                            - 3 condensateurs de 10 μF <br/>
                            - 1 condensateur C de 2 μF<br/>

                            <h4>Association série</h4>
                            Lors qu'on associe les condensateurs en série les calculs impliquent de calculer les transmittances,  de les sommer et de retrouver l'impédance équivalente. On retrouve la méthode employé pour les associations dérivation des résistances, pour le **calcul des associations séries de condensateurs**<br/>

                            Pour obtenir 2 μF on associe 5 condensateurs de 10 μF en série.<br/>
                            <br/>

                            <div id="CALLOUT_1" class="cp_callout note">
                                <div id="CALLOUT1_TITRE" class="titre">Association série</div>
                                <div id="CALLOUT1_CONTENT" class="content">
                                On peut déterminer ,Ce, la capacité équivalente de l'association de condensateur<br/>
                                Ce =  1 / ( 1/10 + 1/10 + 1/10 + 1/10 + 1/10)<br/>
                                Ce = 1 / ( 5 /10) <br/>
                                Ce = 10 /5 = 2 μF<br/>
                                </div>
                            </div>                            



                    </div>
                    <aside>
  
                    </aside>                
                </div>
            </section>

            <section>
                <h2>Microcontrôleurs</h2>
                <div>
                    <div>
                    Les microcontrôleurs sont des composants électronique programmable, similaire au microprocesseur.
                    Ils sont dotés de ports d'entrées et de sorties, numériques et analogiques et de ports de communication.
                    Le projet Arduino permet de se familiariser avec l'électronique numérique. La communauté est active de nombreux "shields" permettent d'interfacer le microcontrôleur.
                    La flexibilité de ces solutions est impressionnante, leur limite tient principalement à la puissance de calcul et leur mémoire.
                    Notez qu'il existe un microcontrôleur 32 bits , l'Arduino Due.
                    L'Arduino s'est industrialisé vous pourrez trouver des automates sur la base Arduino
                    
                    voici un tableau comparatif des solutions dans une gamme de puissance croissante

                    <table class="cp_table">
                        <thead>
                            <tr>
                                <th><strong>Caractéristiques</strong></th>
                                <th><strong>8-bit AVR (Arduino)</strong></th>
                                <th><strong>32-bit ARM Cortex-M (STM32, ESP32)</strong></th>
                                <th><strong>Raspberry Pi (Pi 4, Pi Zero)</strong></th>
                            </tr>
                        </thead>
                        <tr>
                            <td><strong>Architecture</strong></td>
                            <td>8-bit</td>
                            <td>32-bit</td>
                            <td>64-bit ARM (Pi 4) / 32-bit (Zero)</td>
                        </tr>
                        <tr>
                            <td><strong>Vitesse d'horloge</strong></td>
                            <td>16 MHz (ex. ATmega328)</td>
                            <td>72 MHz - 240 MHz (ESP32, STM32)</td>
                            <td>1.5 GHz (Pi 4) / 1 GHz (Zero W)</td>
                        </tr>
                        <tr>
                            <td><strong>RAM</strong></td>
                            <td>2 KB - 8 KB</td>
                            <td>20 KB - 520 KB</td>
                            <td>1 GB - 8 GB (Pi 4) / 512 MB (Zero)</td>
                        </tr>
                        <tr>
                            <td><strong>Mémoire Flash</strong></td>
                            <td>32 KB - 256 KB</td>
                            <td>64 KB - 4 MB</td>
                            <td>16 GB - 32 GB (carte microSD)</td>
                        </tr>
                        <tr>
                            <td><strong>Interfaces de communication</strong></td>
                            <td>UART, SPI, I2C, GPIO</td>
                            <td>UART, SPI, I2C, CAN, Ethernet, Wi-Fi, Bluetooth</td>
                            <td>USB, SPI, I2C, UART, Ethernet, Wi-Fi, Bluetooth</td>
                        </tr>
                        <tr>
                            <td><strong>Possibilités d'extension</strong></td>
                            <td>Shields (Arduino)</td>
                            <td>Shields (STM32, ESP32), modules RF, Wi-Fi</td>
                            <td>HATs (Hardware Attached on Top)</td>
                        </tr>
                        <tr>
                            <td><strong>Disponibilité</strong></td>
                            <td>Bonne (courts délais)</td>
                            <td>Variables, bonne pour ESP32 et STM32</td>
                            <td>Délais plus longs pour certains modèles (ex: Pi 4, Pi Zero)</td>
                        </tr>
                        <tr>
                            <td><strong>Prix indicatif</strong></td>
                            <td>5€ - 20€</td>
                            <td>5€ - 30€</td>
                            <td>10€ (Zero) - 70€ (Pi 4 8 GB)</td>
                        </tr>
                        <tr>
                            <td><strong>Communauté/support</strong></td>
                            <td>Très large</td>
                            <td>Large (STM32) et très large (ESP32)</td>
                            <td>Très large (Raspberry Pi)</td>
                        </tr>
                        <tr>
                            <td><strong>Consommation</strong></td>
                            <td>Faible (30 mA)</td>
                            <td>Faible (STM32 : 20 mA, ESP32 : 100 mA)</td>
                            <td>Pi 4 (600-700 mA), Pi Zero (150-200 mA)</td>
                        </tr>
                        <tr>
                            <td><strong>Température de fonctionnement</strong></td>
                            <td>-40°C à +85°C</td>
                            <td>-40°C à +85°C</td>
                            <td>0°C à +70°C (Pi 4, Pi Zero)</td>
                        </tr>
                        <tr>
                            <td><strong>Extensions Wi-Fi/Bluetooth</strong></td>
                            <td>Non native (modules externes)</td>
                            <td>Wi-Fi, Bluetooth intégrés (ESP32), modules externes (STM32)</td>
                            <td>Wi-Fi, Bluetooth intégrés</td>
                        </tr>
                        <tr>
                            <td><strong>Précision des ADC</strong></td>
                            <td>10 bits</td>
                            <td>12-16 bits (STM32), 12 bits (ESP32)</td>
                            <td>Pas d'ADC intégré, besoin de module externe</td>
                        </tr>
                        <tr>
                            <td><strong>RTOS Support</strong></td>
                            <td>Limitée</td>
                            <td>Compatible avec FreeRTOS, Zephyr</td>
                            <td>Compatible avec Linux (Pi OS)</td>
                        </tr>
                        <tr>
                            <td><strong>Délais d'approvisionnement</strong></td>
                            <td>Généralement courts</td>
                            <td>Modérés (ESP32, STM32 généralement disponibles)</td>
                            <td>Délais modérés à longs, dépendant du modèle et de la région</td>
                        </tr>
                        <tr>
                            <td><strong>Type d'application</strong></td>
                            <td>Contrôle simple</td>
                            <td>Contrôle avancé avec connectivité (IoT)</td>
                            <td>Systèmes complexes, multitâche</td>
                        </tr>
                    </table>
                    </div>
                    <aside>
  
                    </aside>                
                </div>
            </section>

    
    </article>        

</div>








