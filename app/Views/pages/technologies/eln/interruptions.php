<div id="index" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>Arduino</h1>
            <p>
                 Le projet Arduino permet de réaliser des prototypes, de se familiariser avec l'électronique numérique et la programmation temps réel.  
            </p>
        </header>

            <section>
                <h2>Interruptions</h2>
                <div>
                    <div>

                        <p>
                            Les interruptions sont exécutées de manière prioritaire, le programme est interrompu; la pile est sauvegardée et le microcontrôleur execute la fonction d'interuption ou ISR.<br/> 
                            Les interruptions , qui se classe par priorité, sont de deux types : <br/>
                            <ul>
                            <li>internes : déclenchées par logiciel</li>
                            <li>externes : déclenchées par un changement d'état en entrée</li>
                            </ul>
                        </p>        
                        <p>
                            Pour gérer les interruptions externes; on doit réserver une entrée pour détecter et déclencher l'interruption. Il faut configuer les registres du microcontrôleur.<br/>
                        </p>

                    </div>
                    <aside>
                        <a href="http://www.atmel.com/Images/Atmel-2549-8-bit-AVR-Microcontroller-ATmega640-1280-1281-2560-2561_datasheet.pdf" target="_blank">La documentation du microncontroleur</a>
                    </aside>                
                </div>
            </section>


            <section>
                <h2>Choix de l'entrée</h2>
                <div>
                    <div>
                        <p>
                            Dans un premier temps on va déterminer une entrée. Les broches du microcontroleur peuvent avoir plusieurs fonctions.<br/>
                            On évite d'utiliser les broches reservées à la communication et on choisit le niveau d'interuption adaptée au besoins.<br/>
                            Il faut se documenter, une recherche sur internet pourra vous aiguiller. La lecture de cette page vous aidera comprendre la méthode.<br/>
                            <br/>
                            La plateforme Arduino MEGA propose 54 broches, nous preferons employer une entrée analogique inutilisée.<br/>
                            Nous utiliserons la borne A8 de la carte.<br/>
                        <br/>
                        La section : Pin Configurations, la figure 1-1 , de la documentation du microcontroleur confirme les informations du site. La borne A8 de la carte Arduino Mega correspond a la broche 89 du microconteleur.<br/>
                        <br/>
                        La broche 89, identifié PK0 est associé au bit 0 du port d'entrees sorties K. Elle a les fonctions : <br/>
                        ADC8, entrée analogique<br/>
                        PCINT16, interuption externe.<br/>
                        <br/>
                        Le tableau 13-30 reprend les interruptions PCINT16 à PCINT23 associés au port K. Nous employons l'interruption de priorité la plus elevée sur ce port.<br/>
                        </p>
                    </div>
                    <aside>
                        On consulte la documentation sur le site Arduino <a href="https://docs.arduino.cc/hacking/hardware/PinMapping2560" target="_blank">AtMega 2560 </a>
                    </aside>                
                </div>
            </section>


            <section>
                <h2>Configuration des registres</h2>
                <div>
                    <div>
                        <p>
                            Par défaut l'interruption n'est pas activée, il faut utiliser un registre du microcontroleur pour l'activer.
                            Pour trouver le registre correspondant on recherche l'interruption PCINT16 dans la documentation.<br/>
                            
                            <br/>
                            <img src="/assets/img/technologies/eln/codeISR.png" width="800">

                            On met le bit 0, <b>PCINT16</b>, du registre <b>PCMSK2</b> à 1 pour activer l'interruption : PCMSK2 |= ( 1 &lt;&lt; PCINT16);<br/>
                            <br/>
                            En lisant attivement les informations sur le registre PCMSK2, on nous dit qu'il faut initialiser le bit 2 du registre PCICR<br/>
                            
                            On met le bit 2, <b>PCIE2</b> , du registre <b>PCICR</b> à 1 pour activer l'interruption : PCICR |= (1 &lt;&lt; PCIE2);
                        </p>
                    </div>
                    <aside>
                        <h3>PCMSK2</h3>
                        Pin Change Mask Register 2<br/>
                        Documentation section 15.2.7<br/>
                        <a href="/assets/img/technologies/eln/regPCMSK2.png" target="_blank">
                            <img src="/assets/img/technologies/eln/regPCMSK2_low.png" width="300">
                        </a>
                        <h3>PCICR</h3>
                        Pin Change Interrupt Control Register<br/>
                        Documentation section 15.2.7<br/>
                        <a href="/assets/img/technologies/eln/regPCICR.png" target="_blank">
                            <img src="/assets/img/technologies/eln/regPCICR_low.png" width="300">
                        </a>
                    </aside>                
                </div>
            </section>    

            <!-- Traitement de l'interruption -->  
            <section>
                <h2>Traitement de l'interruption</h2>
                <div>
                    <div>
                    <p>
                        Pour exploiter l'interruption on utilise une fonction ISR dans l'IDE arduino. ISR recoit le vecteur d'interruption.<br/>
                        On declare la routine d'interruption ou ISR en precisant le vecteur d'interruption ISR(PCINT2_vect).<br/>
                        ici on definit un flag ou variable ,change pour permettre un traitment ultérieur.<br/>
                        
                        <br/>
                        <b>ISR( PCINT2_vect ) { change = true; }</b>
                        <br/>

                        Le traitement d'une interruption externe déclenchée par un bouton poussoir ou un contact électrique nécessite un circuit RC anti rebond.<br/>
                        <br/>
                        Les interruptions peuvent gérer les signaux PWM
                    </p>
                    </div>
                    <aside>
                        On peut employer le registre PCIFR ( section 15.2.7 ) qui indique egalement l'interruption<br/>
                    </aside>                
                </div>
            </section> 

            


            <section>
                <h2>Signal PWM</h2>
                <div>
                    <div>
                        <p>
                            Le signal PWM est exploité en modelisme et robotique pour controler les servos et variateur.<br/>
                            <br/>
                            L'état haut à une durée variable de 1 à 2 ms<br/>
                            La période est d'environ 20ms.<br/>
                            <br/>
                            On déduit, de la durée del'état haut , une commande proportionnelle de 0% à 100%. <br/>
                            Ceci permet de réaliser une commande analogique avec des entrees et sortie numérique. Ce signal a aussi l'avantage de permettre une detection d'une coupure de ligne.<br/>
                            <br/>
                            Pour mesurer le signal de commande on doit detecter les fronts montant et descendants.<br/>
                            On détermine la durée du signal de commande entre un front montant et un front descendant.<br/>
                            On mesure l'interval entre les fronts montants pour determiner la période.<br/>
                        </p>
                        <img src="/assets/img/technologies/eln/pwm_principe.png" width="800">

                    </div>
                    <aside>
                        Un servo a trois positions à vérifier<br/>
                        une position correspond a un signal<br/>
                        <img src="/assets/img/technologies/eln/pwm_principe1.png" width="300">
                        <br/>
                        Les signaux<br/> 
                        0% ; à gauche soit - 90° <br/>
                        50% ; au neutre donc 0°<br/> 
                        100% ; à droite pour + 90°<br/>
                        <img src="/assets/img/technologies/eln/pwm_principe2.png" width="300">

                    </aside>                
                </div>
            </section>    

            <section>
                <h2>Lecture PWM</h2>
                <div>
                    <div>
                    <h3>Détection des fronts</h3>
                        <p>
                        A chaque changement d'état, le microncontroleur declenche une interruption.<br/>
                        Si l'état actuel est 0 et l'etat precedent 1 alors le front est descendant.<br/>
                        Si l'état actuel est 1 et l'etat precedent 0 alors le front est montant.<br/><br/>
                        On commence le cycle de mesure, seulement apres avoir detecter un front descendant suivi du front montant ceci pour synchroniser le processus de mesure.<br/>
                        Au second front montant on pourra determiner la mesure de duree et de la période.
                        </p>
                    <h3>Durée du signal de commande</h3>
                        <p>
                        La duree du signal de commande se mesure entre deux fronts montants.On sauvegarde le temps au debut du cycle sur le front montant.
                        On stocke le temps sur le front descendant qui suit le front descendant.
                        Lorsque l'on detecte le front du cycle suivant on calcule et stocke la duree du signal de commande
                        </p>
                    <h3>Période</h3>
                        <p>
                        La période se détermine elle aussi entre deux fronts montants, lorsque survient le front montant suivant le cycle écoulé.<br/>
                        Les conditions sont réunis pour indiquer au programme principale que la lecture de la commande et de la période est terminée.<br/><br/>
                        Le programme principale réalise les calculs et mesure le signal depuis les variables et exploite les resultats.
                        </p>

                    </div>
                    <aside>
                        <h3>Le code</h3>
                        <a href="/assets/img/technologies/eln/codePWM.png" target="_blank">
                            <img src="/assets/img/technologies/eln/codePWM_low.png">
                        </a>  
                    </aside>                
                </div>
            </section>  


            <section>
                <h2>Ecriture PWM</h2>
                <div>
                    <div>
                    Pour transmettre un signal PWM sur une sortie il est nécessaire de configurer le Timer
                    <h3>Timer</h3>
                    <p>
                        Nous avons abordé la lecture de signaux PWM issue par exemple d'un récepteur 2,4ghz. Le microcontrôleur gère des signaux en PWM en entrée et sortie<br/> 
                        Pour décharger le processeur et la mémoire le microcontrôleur comporte des compteurs permettant de générer des signaux PWM, ces compteurs utilisent l'horloge principale du microcontrôleur.<br/>
                        

                        Pour notre application nous utiliserons un signal PWM cadencé à 50Hz soit une période de 20ms sur la borne D5.<br/>
                        Nous allons utiliser le Timer 3 qui permet de commander indépendamment 3 sorties PWM au moyen de 3 comparateurs.<br/>
                        Les 3 sorties associés au comparateur du Timer 3 sont les bornes.<br/> 
                        <ul>
                            <li>D5 PWM associé à la broche PE3/OC3A/AIN1</li>
                            <li>D2 PWM associé à la broche PE4/OC3B/INT4</li>
                            <li>D3 PWM associé à la broche PE5/OC3C/INT5</li>
                        </ul>
                        Le fonctionnent des compteurs et les registres associés sont détaillées a partir de la page P133 chapitre 17 compteurs PWM 16bit de la documentation du microcontrôleur.<br/>
                    </p>

                    <h3>Les registres du Timer3</h3>
                    La mise en oeuvre des compteurs va nécessiter de manipuler les registres du microcontroleur. Nous utilsons une seule sortie D5.<br/>
                    Les registres 16 bits comme OCR3A sont répartis sur 2 octets OCR3AH et OCR3AL mais nous pouvons y accéder directement en utilisant, un mot (2 octets), OCR3A.<br/><br/> 
                    Voici la liste des registres que nous emploierons,  la section de la documentation est indiqué entre parenthèse.<br/>
                    <ul>
                        <li><b>TCCR3A</b> - Timer/Counter 3 Control Register A ( 17.11.2 )</li>
                        <li><b>TCCR3B</b> - Timer/Counter 3 Control Register B ( 17.11.6 )</li>
                        <li><b>OCR3</b> OCR3AH and OCR3AL - Output Compare Register 3 A ( 17.11.20 )</li>
                        <li><b>ICR3</b> ICR3H and ICR3L - Input Capture Register 3 ( 17.11.30 )</li>
                    </ul>
      
                    <h3>Configuration du du Timer3</h3>
                        <h4>Activation des sorties</h4>
                        <p>
                            Le registre <b>TCCR3A</b> permet de choisir les sorties qui renverront le signal PWM.<br/> 
                            On utilise la borne D5 on active le bit <b>COM3A1</b> : TCCR3A = _BV(COM3A1) ;<br/>
                            Pour utiliser les 3 sorties on utiliserait : <b>TCCR3A</b> = _BV(COM3A1) | _BV(COM3B1) | _BV(COM3C1);<br/>
                        </p>
                        <h4>Mode de fonctionnement</h4>
                        <p>
                            Le bit <b>WGM33</b> du registre <b>TCCR3B</b> permet de déterminer le mode de fonctionnement. Ici le mode 8, PWM frequence et phase correctes.<br/>
                            Voir 17.9.5 : phase and frequency correct Pulse Width Modulation, ce mode serait plus adapté au controle des moteurs.<br/>
                        </p>       
                        <p>
                            Le bit <b>CS31</b> du registre <b>TCCR3B</b> permet de régler le prédiviseur du compteur. Le rapport choisi est de 8.<br/>
                            Ce prediviseur permet de disposer d'une grande plage de fréquence. ce rapport interviendra dans le calcul de la fréquence.
                        </p>
                        <h4>reglage de la frequence PWM</h4>
                        <p>
                            On doit cadencé le signal à 20Hz, une formule est donnée pour la déterminer. La formule, Voir 17.9.5, est inversé pour retrouver la valeur du registre ICR3.<br/>
                            Le registre ICR3 comptient la valeur de fin comptage qui règle la frequence.<br/> 
                        </p>       
                        <p>
                            Pour calculer la valeur de fin comptage ICR3,  on doit connaitre :<br/> 
                            <ul>
                                <li>la fréquence d'horloge, <b>fc</b>, du microcontroleur, ici 16MHz donc 16 000 000 Hz.</li>
                                <li>le prédiviseur <b>CS3</b> = 8 réglé avec le seul bit CS31 à 1</li> 
                                <li>la frequence <b>f</b> de PWM : ici 50Hz </li>  
                            </ul>                        
                            L'inversion de la formule se fait avec un peu de mathématiques<br/>
                            on donne : f = fc / ( 2 x CS3 x ICR3) ; on écrit : f x ( 2 x CS3 x ICR3) = fc et pour finir : <b>ICR3 =  fc / ( f x 2 x CS3 )</b><br/><br/>
                            
                            Une application numérique pour f= 50hz , fc = 16 000 000 et CS3 = 8, on obtient ICR3 =  16 000 000 / ( 50 x 2 x 8) = 20 000<br/>
                            Pour une période de 15ms, lue sur un simulateur on aurait 66,7Hz et ICR3 = 16 000 000 / ( 66,7 x 2 x 8) = 14992<br/>                   
                           
                        </p>      
                        <h4>durée du signal de commande</h4>
                        <p>
                            <b>Avec ces réglages la durée de la période est réglée directement dans <b>OCR3A</b> et exprimée en microsecondes</b><br/><br/> 
                            Nous devons générer un signal de commande de 1ms à 2ms, la position neutre est obtenu pour une valuer de 1,5ms.<br/>
                            On règle cette durée, également en microseondes, soit 1000, 1500 ou 2000 µs et on l'écrit dans le registre <b>OCR3A</b><br/>
                        </p>       
                        
                        <p>
                        La sortie, ici la borne D5 de la carte, est configuré en sortie :  pinMode(5, OUTPUT);<br/>
                        La sortie D5 correpondant correspond à la broche PE3 / OCR3A, elle restera à 1 tant que TCNT3 &lt; OCR3A<br/>
                        <b>Par défaut on stocke une valeur de 1500 pour envoyer un signal neutre : OCR3A = 1500;</b>
                        </p>  


                    </div>
                    <aside>
                        Il est possible de connaitre la fréquence d'horloge en lisant la constante F_CPU.<br/>
                        <br/>
                        <h3>Timer</h3>
                        <a href="/assets/img/technologies/eln/bcounter16_block.png" target="_blank">
                            <img src="/assets/img/technologies/eln/bcounter16_block_low.png" width="300">
                        </a>
                        <h3>Timer3</h3>
                        <a href="/assets/img/technologies/eln/counterTiming.png" target="_blank">
                            <img src="/assets/img/technologies/eln/counterTiming_low.png" width="300">
                        </a>                        
                    
                        <h3>Registres du Timer3</h3>
                        <a href="/assets/img/technologies/eln/regPwmCS.png" target="_blank">
                            <img src="/assets/img/technologies/eln/regPwmCS_low.png" width="300">
                        </a>
                        <br/>
                        
                        <a href="/assets/img/technologies/eln/regTCCR3B.png" target="_blank">
                            <img src="/assets/img/technologies/eln/regTCCR3B_low.png" width="300">
                        </a>
                        <br/>
                        
                    </aside>                
                </div>
            </section>              


    </article>        

</div>
