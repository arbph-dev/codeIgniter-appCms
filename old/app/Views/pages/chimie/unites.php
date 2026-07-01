

<!--
grandeurs
- valence
- concentration
- ou

unités
°f
eq/l
meq/l
mol/L
normalité de solution
vitesse de passage
débit température
pression athmosphérique





-->
<div id="Unites" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>grandeurs et unités du traitment d'eau</h1>
            <p>Le traitment d'eau utilise des unités liées à la chimie et à la physique</p>
        </header>

        <section>
            <h2>Les unités</h2>
            <div>
                <div>
                    <h3>Température</h3>   
                    La température, notée T est exprimé en degrés celcius °C ou en kelvin K<br>
                    La couleur qui est une radiation electromagnétique est une agitation frénatqiue de molécules lors de températures élevées
                    Les mouvements des especes et donc les échanges ioniques sont égalements influencés par la température.
                    <br>
                    
                    <h3>Pression</h3> 
                    La pression  relative , P , est exprimé en Bar, c'est l'unité des manomètres.
                    La notation en mètre de colonne d'eau, mCe, est employé pour les pompes et les pertes de charge<br> 
                    L'unité légale est le Pascal notée Pa, peu usitée en pratique on trouve souvent la presion exprimée en kPa <br>
                    <br>
                    Une pression stable permet de régler les débits efficacement. Les réglages, équilibrages et réglation de débit sont plus simples à réaliser.
                    <br>
                    
                    <h3>Debit</h3>
                    Les débits sont liés par la pression et limités par les pertes de charges, ils déterminement le dimensionnement et fonctionnement des équipements.                         
                    Le débit se note q : les débits sont données en m3/h<br>    
                    <br>
                    
                    <h3>Vitesse de passage</h3>
                    La vitesse de passage, Vp , s'exprime en m/h; nous reviendrons sur cette grandeurs.<br>
                    <br>
                    
                    <h3>Mole de matière</h3>
                    Le nombre d'Avogadro represente  le nombre d'especes : ions, atomes ou molécules dans une mole de matière.
                    <blockquote>
                        nombre d'Avogadro : 6,02214 x 10^23
                    </blockquote>
                    <br>
                    
                    <h3>Masse molaire</h3>
                    La masse molaire exprimé en g/mol inqiue la masse d'une mole de matière.
                    La masse molaire du CaCO3 est de 100 g/mol.<br>
                    <br>

                    <h3>Valence</h3>
                    La valence, V, est un paramètre sans unité, permet de mesurer les charges électroniques des ions.<br>
                    Les cations et anions s'associent selon leur valence pour former des molécules.                 
                    <br>

                    <h3>Equivalent</h3> 
                    Un équivalent noté eq est la quantité de matière qui réagit avec une mole d'électrons. 


                    <h3>Normalité</h3>
                    La normalité d'une solution est une mesure sans unité qui définit la concentration d'une espece dans une solution.
                    Une solution à 1N contient une mole de matière par litre, une solution à N/25 contient 1/25 de mole par L.
                    Lors des titrages on choisira une normalité élévée pour une detection ou une indication , pour des mesures précises son choisit des normalités faibles
                    
                    <h3>Concentration</h3>
                    La concentration d'une espece , [HCl] , en solution se note entre crochet et s'exprime en mol/L<br>
                    <br>

                    
                    <h3>pH ou potentiel d'hydrogène</h3>
                    Le pH indique l'acidité et la concentration des ions hydronium H3O+ dans une solution.<br>
                    L'échelle varie de : très acide pH = 0 ; pour passer par un pH neutre pH = 7 et finir très basique pH=14.<br>
                    <br>

                    <h3>Conductivité</h3>
                    Elle indique la concentration des especes et aussi la capacité à condruire le courant.<br>
                    Plus une eau est salée plus la concentration des sepeces est élevée.<br>
                    <br>
                    La conductivité est une indication plutot qu'une mesure, elle s'exmpirme en Siemens par mètre.<br>
                    En pratique les unités enployées sont le mmilli siemens mS et le micro siemens µS.<br>
<!-- 
                    TH                                        
                    TA
                    TAC

-->


                </div>
                
                <aside>
                  
                </aside>
            </div>
        </section>

    <!-- pH -->
        <section>
            <h2>pH ou potentiel d'hydrogène</h2>
            <div>
                <div>
                    <p>
                        Le pH mesure l'alcalinité ou l'acidité d'une solution. Il varie de 0 à 14 à 20°C.<br>
                        En dessous de 7 : acide. À 7 : neutre. Au dessus de 7 : basique.<br>
                        <br>
                        On détermine le pH depuis une concentration d'ions hydronium H3O+<br>
                        <blockquote>
                            pH = -log[H3O+] 
                        </blockquote>

                        le pOH indique la concentration des ions hydroxides OH-<br>
                        <blockquote>
                            pOH = -log[OH-] 
                        </blockquote>

                        pH et pOH sont liés et peuvent se déterminer avec la constante d'équilibre et son pKe
                        <blockquote>
                            pKe = pH + pOH = 14
                        </blockquote>
                      
                    </p>

                    <h3>Constante d'équilibre Ke</h3>
                    <p>
                        La constante d'équilibre vaut 10⁻¹⁴<br>
                        La constante d'équilibre est le produit des concentrations<br>
                        <blockquote>
                            Ke = [H3O+] × [OH-] = 10⁻¹⁴
                        </blockquote>
                        
                        La notation pH , pOH et pKe sont faites pour simplier les calculs et leur interprétations
                        <blockquote>
                            pKe = pH + pOH = 14
                        </blockquote>
                        
                        Pour une solution très acide : pH=0 , pKe = 0 + pOH = 14 donc pOH=14.
                        Pour une solution très basique pH=14 , pKe = 14 donc pOH=0

                    </p>
                </div>
                <aside>
                    <!-- Codeval : concentration → pH -->
                    <div id="CODEVAL_pH1" class="cp_codeval">
                        <div id="CODEVAL_pH1_TITRE" class="titre">pH depuis la concentration [H3O+]</div>
                        <div id="CODEVAL_pH1_SCRIPTCODE" class="scriptcode">
                            <textarea rows="6" cols="40">
const CH3O = 0.0000001
const pH = -1 * Math.log10(CH3O)
"pH = " + pH
                            </textarea>
                            <button id="executeButton_pH1" name="executeButton" onclick="evaluateCode('pH1')">Exécuter</button>
                        </div>
                        <div id="CODEVAL_pH1_RESULT" class="result"></div>
                    </div>

                    <!-- Codeval : pH → concentration -->
                    <div id="CODEVAL_pH2" class="cp_codeval">
                        <div id="CODEVAL_pH2_TITRE" class="titre">Concentration [H3O+] depuis le pH</div>
                        <div id="CODEVAL_pH2_SCRIPTCODE" class="scriptcode">
                            <textarea rows="6" cols="40">
const pH = 7
const CH3O = Math.pow(10, -1 * pH)
"[H3O+] = " + CH3O + " mol/L"
                            </textarea>
                            <button id="executeButton_pH2" name="executeButton" onclick="evaluateCode('pH2')">Exécuter</button>
                        </div>
                        <div id="CODEVAL_pH2_RESULT" class="result"></div>
                    </div>
                </aside>
            </div>
        </section>


        <section>
            <h2>Concentration, quantité d'espèces et valence</h2>
            <div>
                <div>

                    Dans une solution de CaCO3 dont la concentration serait de 1 mol/L ; la quantité de matière serait de 1 mole pour un litre. 1 mole de CaCO3 à une masse de 100g.<br>
                    Avec 1 mol/L on a donc 1 x 100g pour un litre, la quantité de CaCO3 est donc de 100g/L.<br>            
                    <br>
                    Les concentrations se calculent depuis des mesures par titrage.<br>
                    Cette notion est importante, lors des titrages colorométriques on emploi des solutions de concentrations connues pour déterminer la contentration d'une autre espece.<br>
                    <br>
                

                    On utilise des unités différentes selon le spécialités, il faut savoir les exploiter.<br>
                    <br>
                    L'untié du traittment d'eau , le degré français °f , est la plus précise.<br>
                    <br>
                    Pour des raisons de simplicité les fournisseurs parlent en equivalent eq ou milli equivalent meq<br>
                    Cette grandeur impose de prendre en compte la valence V des especes.<br>
                    <blockquote>
                        Ca2+ a une valence V de 2; il faut 2 eq d'électrons pour réagir avec une mole de Ca2+
                    </blockquote>
                    <br>           

                    Enfin les chimistes emploie les unités normalisé du Système Internatiionnal en mole et mol/L<br>
                    <br>
                    Une petite synthèse permettra de retrouver les quantités selon les différentes unités de concentration
                    <table id="data-table" border="1">
                        <thead>
                            <tr>
                                <td>mol</td>
                                <td>eq</td>
                                <td>meq</td>
                                <td>°f</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>1 / V</td>
                                <td>1000 / V</td>
                                <td>5000 / V</td>
                            </tr>                    
                        </tbody>
                    </table>
                </div>
            
                <aside>

                    On peut comparer les unités de concentration<br>
                    <br>
                    Dans le cas du CaCO3<br>
                    Masse molaire 100g/mol<br>
                    Ca 2+ et CO3 2- , valence V=2<br>

                    <!-- Codeval : concentration → pH -->
                    <div id="CODEVAL_CE1" class="cp_codeval">
                        <div id="CODEVAL_CE1_TITRE" class="titre">masse et concentration en eq</div>
                        <div id="CODEVAL_CE1_SCRIPTCODE" class="scriptcode">
                            <textarea rows="6" cols="40">
const mm = 100
const V = 2
const ceq = mm /  V
"1 eq => masse " + ceq + " g"
                            </textarea>
                            <button id="executeButton_CE1" name="executeButton" onclick="evaluateCode('CE1')">Exécuter</button>
                        </div>
                        <div id="CODEVAL_CE1_RESULT" class="result"></div>
                    </div>

                    
                    <!-- Codeval : concentration → pH -->
                    <div id="CODEVAL_CF1" class="cp_codeval">
                        <div id="CODEVAL_CF1_TITRE" class="titre">masse et concentration en °f</div>
                        <div id="CODEVAL_CF1_SCRIPTCODE" class="scriptcode">
                            <textarea rows="6" cols="40">
const mm = 100
const V = 2
const cgl = mm / ( V * 5000 )
"1°f => masse de " + cgl + " g"
                            </textarea>
                            <button id="executeButton_CF1" name="executeButton" onclick="evaluateCode('CF1')">Exécuter</button>
                        </div>
                        <div id="CODEVAL_CF1_RESULT" class="result"></div>
                    </div>
                </aside>

            </div>
        </section>







        <section>
        <h2>Débit et Vitesse de passage</h2>
        <div>
            <div>
            Les vitesse de passage de l'eau dans les couches de résines sont liés aux débits et donc aux pression d'alimentation.<br>
            Les échangeurs ioniques, généralement de forme cylindrique, ont un diamètre intérieur permettant de déterminer la section de passage<br>
            <br>
            La vitesse de passage s'exprime en m/h<br>
            Certains constructeurs indiqueront un Beads Volume per hour, BV/h, qui permet de faire abstraction des vitesses de passage.<br>
            Cependant c'est un indicateur à ne pas négliger, plus les vitesse ssont rduites meilleure seront les échanges.
            <br>
            La vitesse de passage se calcule en faisant le rapport du débit à la section de passage. 

                <blockquote>
                   Vp = q / S
                </blockquote>

             

            </div>
            
            <aside>
             Avec :<br>
             - un débit q de 75 m3/h<br> 
             - une section de 2 m2 <br>
             on obtient une vitesse de passage de 37,5 m/h.<br>        
                <!-- Codeval : concentration → pH -->
                <div id="CODEVAL_VP1" class="cp_codeval">
                    <div id="CODEVAL_VP1_TITRE" class="titre">vitesse de passage depuis le débit</div>
                    <div id="CODEVAL_VP1_SCRIPTCODE" class="scriptcode">
                        <textarea rows="6" cols="40">
const q = 75
const S = 2
const Vp = q / S
"Vitesse de passage Vp = " + Vp + " m/h"
                        </textarea>
                        <button id="executeButton_VP1" name="executeButton" onclick="evaluateCode('VP1')">Exécuter</button>
                    </div>
                    <div id="CODEVAL_VP1_RESULT" class="result"></div>
                </div>
            </aside>
        </div>
        </section>



<!--
Maintenant nous régénérons avec une concentration de (240 * 18,5) / (50 000 +240) = 0,0883758 mol/L.        

-->

        <section>
        <h2>Débit et concentration</h2>
        <div>
            <div>
                En production on utilise des régénérants très actifs car fortmement concentrés: acide sulfurique, acide chlorydrque, soude<br>
                Ces régénérants sont injectés par des pompes dans de l'eau, la qualité de dcette eau influe évidmeent sur la qualité de régénération<br>
                <br>
                Nous allons déterminer la concentration de régénérant dans l'eau<br>
                on régénérée les résines avec un débit d'eau de 50m3/h 

                <h3>eau d'alimentation</h3>
                L'eau d'alimentation puisé et filtré : on mesure TH = 30°f<br>
                La valence des ions calcium Ca2+ et magnésium Mg2+ vaut 2 , on a donc 2 fois plus de charge électronique que de matière<br>
                On considère que [Ca2+] =4/5 du TH total soit [Ca2+] = 0,0024 mol/L

                <!--
                
                
                et 240 L/h avec une concentration de 18,5 mol/L.



Pour éviter la précipitation de CaSO4 il ne faudrait pas dépasser une concertation de SO42- tel que :<br>
[SO4 2-] = Ks / [ Ca 2+ ] = 0,000034 / 0,0024 = 0,014 mol/L


Dans l'eau brute on observe une concentration de [SO4 2-] de 30 mg/L soit une concentration de 0,03 /96 = 0,0003125 mol/L. 
Nous négligerons cette concentration. L'analyse n'ayant qu'une valeur indicative ne peut servir de mesure.                



            Les échangeurs ioniques, généralement de forme cylindrique, ont un diamètre intérieur permettant de déterminer la section de passage<br>
            <br>
            La vitesse de passage s'exprime en m/h<br>
            Certains constructeurs indiqueront un Beads Volume per hour, BV/h, qui permet de faire abstraction des vitesses de passage.<br>
            Cependant c'est un indicateur à ne pas négliger, plus les vitesse ssont rduites meilleure seront les échanges.
            <br>
            La vitesse de passage se calcule en faisant le rapport du débit à la section de passage. 

                <blockquote>
                   Vp = q / S
                </blockquote>

-->

            </div>
            
            <aside>
                <!-- Codeval : concentration de calcium [Ca2+] -->
                <div id="CODEVAL_CCA1" class="cp_codeval">
                    <div id="CODEVAL_CCA1_TITRE" class="titre">concentration de calcium [Ca2+]</div>
                    <div id="CODEVAL_CCA1_SCRIPTCODE" class="scriptcode">
                        <textarea rows="6" cols="40">
const TH = 30
const V = 2
const Rcamg = 0.8
const C = TH / (V * 5000)
const Cca = C * Rcamg *1000
const Cmg = C * (1- Rcamg)*1000
"[Ca2+] = " + Cca + " mmol/L"
                        </textarea>
                        <button id="executeButton_CCA1" name="executeButton" onclick="evaluateCode('CCA1')">Exécuter</button>
                    </div>
                    <div id="CODEVAL_CCA1_RESULT" class="result"></div>
                </div>
            </aside>
        </div>
        </section>

            <section>
                <h2>Risques chimiques</h2>
                <div>
                    <div>
                        Dans nos activités on emploie souvent des produits chimiques.<br>
                        Ces produits sont parfais très actfs et leur manipulations requiert quelques précautions.<br>
                        <br>
                        Le personnel d'entretien : ménage et maintenance s'expose à des risques que des formations adaptées permettent de maitriser.<br>
                        Outre la nature des produits il faut considérer églameemnt leurs intéractions lorsqu'ils sont employés ensemble ou stockés.<br>
                        <br>

                    </div>
                    <aside>
                        <div id="CAROUSEL_1" class="cp_carousel">
                            <img src="/assets/img/technologies/chimie/securite/pictogram-SGH01.png">
                            <img src="/assets/img/technologies/chimie/securite/pictogram-SGH02.png">
                            <img src="/assets/img/technologies/chimie/securite/pictogram-SGH03.png">
                            <img src="/assets/img/technologies/chimie/securite/pictogram-SGH04.png">
                            <img src="/assets/img/technologies/chimie/securite/pictogram-SGH05.png">
                            <img src="/assets/img/technologies/chimie/securite/pictogram-SGH06.png">
                            <img src="/assets/img/technologies/chimie/securite/pictogram-SGH07.png">
                            <img src="/assets/img/technologies/chimie/securite/pictogram-SGH08.png">
                            <img src="/assets/img/technologies/chimie/securite/pictogram-SGH09.png">
                        </div>
                        <button onclick="ihmCarouselPrev('1')">‹</button>
                        <button onclick="ihmCarouselNext('1')">›</button>
                    </aside>                
                </div>
            </section>











    </article>

</div>


