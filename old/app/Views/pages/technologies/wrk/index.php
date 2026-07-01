<div id="index" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>Maintenance</h1>
            <p>
            Une maintenance rigoureuse, la maitrise des procédés et l'éxpérience préviennent de nombreux problèmes.<br/>
            La maintenance est géré selon une démarche qualité, la gestion de la documentation, les méthodes et indicateurs sont mis en place pour une organisation efficace.<br/>
            <br/>
            L'exploitation des énergies comprend la maintenance et les travaux dont certains sont réalisés en fonctionnement sans interruption des process. 
             </p>
        </header>

        <section>
            <h2>Délai d'intervention</h2>
            <div>
                <div>
                    <h3>Description</h3>
                    Une intervention d'amélioration nécessite des travaux électriques, cette intervention doit se réaliser sans impacter la production vapeur.<br/>
                    On doit préparer les taches et estimer les temps d'interruption sur le poste condensats, objet des travaux.<br/>
                    <br/>
                    Le process est une boucle d'eau alimentaire  avec un débit , Q utilisation , contractuel de  36 m3/h sur un réseau vapeur avec une réserve en bâche alimentaire de 30 m3.<br/>
                    <br/>
                    Pour compenser les pertes, le client dispose d'un poste d'osmose inverse produisant l eau d'appoint.<br/>
                    En lisant la documentation du poste d'osmose on releve qu'il peut fournir Q Appoint max 15 000l/h soit 15 m3/h<br/>
                    <br/>
                    Les condensats issus de la production sont retraités et renvoyés dans la bache de retour condesats avec 2 pompes<br/> 
                    P308A le debit de Q P308A atteint 10 m3/h<br/>
                    P308B dont le débit Q P308B maxi est 18 m3/h<br/>
                    <br/>
                    
                    <h3>Méthode</h3>
                    Pour intervenir sereinement il faudra remplir la bâche alimentaire au maximum soit 36 m3 avant chaque coupure<br/> 
                    On détermine la phase des travaux qui implique une coupure et on détermine le temps critique<br/>
                    <br/>
                    Dans notre cas on doit:<br/> 
                    <ul>
                        <li>couper l'alimentation, cabler une alimentation temporaire</li>
                        <li>tester et valider le nouveau coffret</li>
                        <li>fixer l'armoire validée en lieu et place de l'ancienne</li> 
                        <li>mettre en service le nouveau coffret validé</li>                            
                    </ul>       
                    <br/>
                    La derniere phase, la mise en service fut considéré comme la plus critique
                    <ul>                                       
                        <li>couper l'alimentation</li>
                        <li>décabler le cable dans l'anncienne armoire</li>
                        <li>reprendre les connexions au besoins</li>
                        <li>raccorder les cables dans la nouvelle</li>
                        <li>réaliser les mesures et essais</li>
                        <li>mettre sous tension</li>
                        <li>continuer les mesures et essais</li>
                        <li>mettre en service</li>
                        <li>valider le fonctionnement</li>
                    </ul>

                    <h3>Hypothèses</h3>
                    On introduite les notations : 
                    - V0 le volume initiale à t = 0<br/>
                    - dQ différence des débits de remplissage et de vidange.<br/>
                    - V1 volume restant au temps t1
                    <br/> 

                    En temps normal les débits sont équilibrés, on compte les adductions comme comme positives et négatif le débit à l'utilisation :<br/> 
                    <blockquote>
                        Q pompes + Q Appoint - Q utilisation = dQ = 0<br/> 
                    </blockquote>
                    <br/> 
                    
                    Le volume V1 stockée évolue ,selon le temps temps t, .<br/> 
                    La relation pour retrouver le volume :<br/> 
                    <blockquote>                    
                        V1  = V0 + dQ x  t1 <br/> 
                    </blockquote>


                    <h3>Temps critique</h3>

                    On estime les temps critique qui correspond au temps de vidange de la bâche alimentaire sans appoint et sans retour condensat, on considère la possibilité d'une défaillance de l'appoint

                    <h4>Temps de vidange sans appoint</h4>

                    On veut connaitre le temps t1 de vidange pour lequel le volume stockée V1 est nul (V1 = 0)<br/> 
                    Les pompes sont coupees, on a plus d'appoint dQ se simplifie et devient 
                    <blockquote>
                        dQ = - Q utilisation = -36 m3/h<br/> 
                    </blockquote>

                    On connait<br/> 
                    V0  volume de la bache alimentaire, remplie à 30 m3 avant chaque coupure<br/>
                    dQ  différence des débits entrant et sortants de la bache, on vidange sans appoint dQ = - 36 m3/h<br/>
                    V1 volume final  = 0 , la cuve est vide<br/>
                    <br/>  
                    On arrange la relation pour retrouver t1, on doit gérer les signes<br/> 
                    <blockquote>                    
                        t1 =  V0 / -dQ
                    </blockquote>

                    Pour une vidange sans appoint, pompe condensats a l'arrêt : t1 = 0,83 h soit 50 mn<br/> 

                    <h4>Temps de vidange avec appoint</h4>

                    Les pompes sont coupees, mais on conserve l'appoint. dQ devient 
                    <blockquote>
                        dQ = Q Appoint - Q utilisation = -21 m3/h<br/> 
                    </blockquote>
                    
                    On reprend la relation précédente pour retrouver t1<br/>
                    Pour une vidange avec appoint, pompe condensats a l'arrêt : t1 = 1,43 h soit 86 mn<br/>                  
                    
                    
                    <h3>Défaillance des pompes</h3>
                    On profite de ces travaux pour déterminer les temps maximaux pour intervenir en cas de défaillances d'une des pompes<br/>
                    <br/>
                    Les debit sont de 10 m3/h pour P308A et 18 m3/h pour P308B. Pour chaque défaut on détermine dQ, puis le temps de vidange t1<br/>

                    <h4>Défaillance d'une pompe : P308A </h4>
                    dQ  = Q pompes + Q Appoint + Q utilisation = 18 + 15 - 36 = -3 m3/h<br/>
                    <br/>
                    On détermine t1 pour une vidange avec appoint, pompe condensats P308A à l'arrêt et P308B en service : t1 = 10 h soit 600 mn<br/>         

                    <h4>Défaillance d'une pompe : P308B </h4>
                    dQ  = Q pompes + Q Appoint + Q utilisation = 10 + 15 - 36 = -11 m3/h<br/>
                    <br/>
                    On détermine t1 pour une vidange avec appoint, pompe condensats P308A en service et P308B à l'arrêt : t1 = 2,72 h soit 164 mn<br/>   


                    <h3>Taux de retour condensat</h4>
                    Le circuit vapeur est un cicruit fermé, avec des pertes. certains process dit à vapeur perdue implique des pertes qui sont compensés par appoint.<br/>
                    La vapeur condensée devient des condensats, cette eau dispose d'une chaleur sensible non néglieable.<br/>
                    <br/>
                    Les condensats sont exempts de calclaire et de carbonates. On contrôle cependnant la qualité des retours condensats par conductimétrie pour éviter de polluer la bache alimentaire<br/>
                    <br/>
                    Pour assurer le fonctionnement du reseau celui ci doit fournir un minimum de retour condensats que nous allons estimer simplement
                    <br/>
                    Les deux pompes P308A et P308B peuvent délivrer un débit de 33m3/h, cepednant ce débit dépend des retours condensats.<br/>
                    Avec le débit d'apppoint et le débit d'utilisation contractuel on détermine le débit minimum des retours condensats pour maintenir le niveau de la bache alimentaire.<br/>
                    <blockquote>
                        Q pompes = dQ - Q Appoint - Q utilisation<br/> 
                    </blockquote>

                    Le débit minimum des retours condensats est de 21 m3/h<br/> 
                    On détermine le taux de retour condensats<br/> 
                    <blockquote>
                        rc = Q pompes / - Q utilisation<br/> 
                    </blockquote>
                    Le taux de retour condensats minimal est de 58,33%, en deça les appoints ne compensent plus les pertes du réseau

                    


                </div>
                <aside>
                    <h4>Temps de vidange</h4>
                    Volume V0 = 30m3
                    Différence de débit dQ = -36 m3/h
                        <div id="CODEVAL_WRKTI1" class="cp_codeval">
                            <div id="CODEVAL_WRKTI1_TITRE" class="titre">Temps de vidange</div>
                            <div id="CODEVAL_WRKTI1_SCRIPTCODE" class="scriptcode">
                                <textarea rows="6" cols="40">
const V = 0
const V0 = 30
const dQ = -36
const th = ( V - V0 ) / dQ 
const t = 60 * th
"Temps de vidange t = " + th  + " h soit " + t + " min" 


                                </textarea>
                                <button id="executeButton_WRKTI1" name="executeButton" onclick="evaluateCode('WRKTI1')">Exécuter</button>
                            </div>
                            <div id="CODEVAL_WRKTI1_RESULT" class="result"></div>                
                        </div>    
                    <h4>Synthèse</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Qapp (m3/h)</th>
                                <th>Qppe (m3/h)</th>
                                <th>dQ (m3/h)</th>                            
                                <th>t (h)</th>
                                <th>t (mn)</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>0</td>
                                <td>0</td>
                                <td>-36</td>
                                <td>0.83</td>
                                <td>50</td>                            
                            </tr>
                            <tr>
                                <td>15</td>
                                <td>0</td>
                                <td>-21</td>
                                <td>1.43</td>
                                <td>86</td>                            
                            </tr>
                            <tr>
                                <td>15</td>
                                <td>10</td>
                                <td>-11</td>
                                <td>2.72</td>
                                <td>164</td>                            
                            </tr>
                            <tr>
                                <td>15</td>
                                <td>18</td>
                                <td>-3</td>
                                <td>10</td>
                                <td>600</td>                            
                            </tr>                                                                          
                        <tbody>

                    </table>

                </aside>                
            </div>
        </section>







    </article>        

</div>



<!--

0.8333333333333334 h soit 50 min
1.4285714285714286 h soit 85.71428571428572 min
2.727272727272727 h soit 163.63636363636363 min









### Déterminer le temps de vidange sur défaillance d'une pompe

La bâche à un volume V0 de 30m3
Le débit d'utilisation est constant -36 m3/h
Les appoint ont un débit max de15 m3/h  
Les pompes Q P308A et Q P308B ont des débits respectif de  10 m3/h et de  18 m3/h

On doit déterminer l'autonomie de la bâche en cas de défaut d'une pompe

#### autonomie sur défaut P308A

On détermine le débit dQ
> [!success]
>dQ  = Q pompes + Q Appoint + Q utilisation = 18 + 15 - 36 = -3 m3/h


Puis on applique la relation trouvée précédemment
> [!success]
> ( V - V0 ) / dQ = t


```python
V = 0
V0 = 30
dQ = -3
th = ( V - V0 ) / dQ 
t = 60 * th
print("Temps de vidange t2 = " + str(t)) 
```

#### autonomie sur défaut P308B
On détermine le débit dQ
> [!success]
>dQ  = Q pompes + Q Appoint + Q utilisation = 10 + 15 - 36 = -11 m3/h


Puis on applique la relation trouvée précédemment
> [!success]
> ( V - V0 ) / dQ = t


```python
V = 0
V0 = 30
dQ = -11
th = ( V - V0 ) / dQ 
t = 60 * th
print("Temps de vidange t2 = " + str(t)) 
```








        <section>
            <h2>Equipements gaz obligatoires</h2>            
            <div>
                <div>

                    <ul>

                    <li>Détection de gaz.</li>
                    <ul>
                        <li>Obligatoire à partir de 70 kW (avec alarme sonore et visuelle).</li>
                        <li>Raccordement des alarmes</li>
                        <ul>
                        <li>Installations de gaz dans des ERP (établissements recevant du public) de catégories 1 à 3.</li>
                        <li>Bâtiments sensibles (hôpitaux, établissements scolaires).</li>
                        <li>Chaufferies de puissance supérieure à 2 MW</li>
                        </ul>  
                    </ul>
                    
                        <h4>Volume normal selon ISO 2533</h4>
                        Déterminons le volume V1 normal du gaz dans des conditions normales (P1,T1) que represente le volume V2 dans les conditions d'exploitation (P2,T2)<br/>
                        - pression absolue P1 = 101 325 Pa<br/>
                        - température T1 =  288,15 K<br/>


                        <div id="CODEVAL_CVG5" class="cp_codeval">
                            <div id="CODEVAL_CVG5_TITRE" class="titre">Volume normal ISO 2533</div>
                            <div id="CODEVAL_CVG5_SCRIPTCODE" class="scriptcode">
                                <textarea rows="6" cols="40">
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
" Volume corrige  = " + V1 + " Nm3 ; F = " + F

                                </textarea>
                                <button id="executeButton_CVG5" name="executeButton" onclick="evaluateCode('CVG5')">Exécuter</button>
                            </div>
                            <div id="CODEVAL_CVG5_RESULT" class="result"></div>                
                        </div>                        
                </div>
                <aside>

                </aside>                
            </div>
        </section>   


                    <div id="CALLOUT_1" class="cp_callout note">
                        <div id="CALLOUT1_TITRE" class="titre">Arrêté du 23 Février 2018</div>
                        <div id="CALLOUT1_CONTENT" class="content">
                            <h4>Arrêté du 23 Février 2018</h4>
                            <p>
                            L'arrêté du 23 Février 2018 interdit dorénavant l'emploi du téflon comme suit : "La réalisation d'étanchéité par filasse et par rubans d'étanchéité est interdite" pour la réalisation de l'étanchéité des canalisations.<br/>
                            Les matériaux réalisant l'étanchéité pour les raccords filetés doivent respecter les normes : NF EN 751-1 et NF EN 751-2 (matériaux de type résine, colle).<br/> 
                            Le fil joint est donc interdit.<br/>
                            Dans tous les cas les produits utilisés pour réaliser l'étanchéité des raccords filetés doivent respecter ces deux normes:<br/>
                            • NF EN 751-1<br/>
                            • NF EN 751-2<br/>
                            source : <a href="https://www.copraudit.com/nouvelle-reglementation-gaz-interdiction-teflon/">copraudit</a>
                            </p>                              
                        </div>
                    </div>



        <section>
            <h2>Equipements gaz obligatoires</h2>            
            <div>
                <div>

                    <ul>

                    <li>Détection de gaz.</li>
                    <ul>
                        <li>Obligatoire à partir de 70 kW (avec alarme sonore et visuelle).</li>
                        <li>Raccordement des alarmes</li>
                        <ul>
                        <li>Installations de gaz dans des ERP (établissements recevant du public) de catégories 1 à 3.</li>
                        <li>Bâtiments sensibles (hôpitaux, établissements scolaires).</li>
                        <li>Chaufferies de puissance supérieure à 2 MW</li>
                        </ul>  
                    </ul>

                        <h4>Volume normal selon ISO 2533</h4>
                        Déterminons le volume V1 normal du gaz dans des conditions normales (P1,T1) que represente le volume V2 dans les conditions d'exploitation (P2,T2)<br/>
                        - pression absolue P1 = 101 325 Pa<br/>
                        - température T1 =  288,15 K<br/>


                        <div id="CODEVAL_CVG5" class="cp_codeval">
                            <div id="CODEVAL_CVG5_TITRE" class="titre">Volume normal ISO 2533</div>
                            <div id="CODEVAL_CVG5_SCRIPTCODE" class="scriptcode">
                                <textarea rows="6" cols="40">
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
" Volume corrige  = " + V1 + " Nm3 ; F = " + F

                                </textarea>
                                <button id="executeButton_CVG5" name="executeButton" onclick="evaluateCode('CVG5')">Exécuter</button>
                            </div>
                            <div id="CODEVAL_CVG5_RESULT" class="result"></div>                
                        </div>                        
                </div>
                <aside>

                </aside>                
            </div>
        </section>   
-->
