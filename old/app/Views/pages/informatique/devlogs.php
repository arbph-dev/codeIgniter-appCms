<div id="Langages" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>Travaux</h1>
            <p>
                Le site évolue vers une architecture full stack , HTML, JS, PHP avec Code Igniter. Cette article servira de TODO list.</p>
        </header>

            <section>
                <h2>2026-04-06</h2>
                <div>
                    <div>
                        <h3>features</h3>
                        la structure technique doit évoluer vers une une architecture module métier:<br/>
                        <br/>    
                        dossier : js/features/mot/<br/>  
                        fichiers :<br/>   
                        <ul>
                            <li>mot.form.js</li>
                            <li>mot.service.js</li>
                            <li>mot.store.js</li>
                            <li>mot.renderer.js</li>
                            <li>mot.controller.js</li>                                                                                                                
                        </ul>  
          
                        <h3>Intégration</h3>    
                        on prévoit une page app/Views/pages/informatique/formfeatures.php
                        sur la base de app/Views/pages/informatique/formdialog.php
                        on copie public/assets/js/test_main.js 
                        on modifie public/assets/js/test_main.js
                        import lignes 34-36 repere 2026-04-06
                        init ligne 160

                        <h4>mot.form.js</h4>      
                            bus.subscribe 'forms:submit'<br/>
                            <br/>
                            bus.publish 'mot:error'<br/>
                            bus.publish 'mot:search'<br/> 

                        <!-- 

                        - Pour récupérer un mot par id :  `GET /api/mot?id=123`
                        - Pour rechercher des mots par label partiel :  `GET /api/mot?q=exemple`
                        - Pour récupérer un prénom par id :  `GET /api/prenom?id=456`
                        - Pour récupérer tous les prénoms liés à un mot :  `GET /api/prenom?mot_id=123`


                        <h2>Recherche Mot API</h2>

                        -->
                    </div>
                    <aside>
                    </aside>                
                </div>
            </section>

            <section>
                <h2>2026-03-26</h2>
                <div>
                    <div>
                        <h3>Méthodes</h3>

                        Pour préparer les contenus il est nécessaire de proposer des pages html tout en préparant la structure db.<br/>
                        Les Controller délivreront du contenu selon trois vecteurs<br/>
                        <ul>
                            <li>inclusion de fichiers, le contrôleur gère le segment d'url et recherche un fichier</li>
                            <li>rendering de contenu depuis data et vue (layout page)</li>
                            <li>MVC classique</li>
                        </ul>
                        
                        L'intégration des scripts js et l'amélioration du style doit être terminée en priorité, les composants doivent être documenté.<br/>
                        <br/>
                        Les projets doivent être documentés : gestion de navigation, quizz, cv, threejs
                    </div>
                    <aside>
                    </aside>                
                </div>
            </section>


            <section>
                <h2>2026-03-25</h2>
                <div>
                    <div>
                        <h3>Création de la rubrique informatique</h3>

                        Ajout
                        <ul>
                            <li><b>contrôleur</b> : app/Controllers/Informatique.php</li>
                            <li><b>page principale</b> : app/Views/pages/info_main.php</li>
                            <li><b>devlogs ( sous pages à inclure) </b> : app/Views/pages/informatique/devlogs.php</li>
                            <li><b>langages ( sous pages à inclure) </b> : app/Views/pages/informatique/langages.php</li>
                            <li><b>routes</b> : informatique est associé à la méthode index du contrôleur Informatique</li>                            
                            <li><b>Svg</b> : intégration en element de navigation à réaliser</li>   
                        </ul>




                        <svg  class="mnu-svg" id="pjx-poles" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <defs>
                            <style>
                                text {
                                    font-family: Polly, sans-serif;
                                    font-size: .875rem;
                                    font-weight: 600;
                                    text-transform: uppercase;
                                    text-anchor: middle;
                                }

                                #moex&gt;g,
                                #environnement&gt;g,
                                #ingenierie&gt;g,
                                #conseil&gt;g,
                                #bim&gt;g {
                                    transition: transform .15s cubic-bezier(.4, 0, .2, 1);
                                }

                                #moex:focus&gt;g,
                                #environnement:focus&gt;g,
                                #ingenierie:focus&gt;g,
                                #conseil:focus&gt;g,
                                #bim:focus&gt;g,
                                #moex:hover&gt;g,
                                #environnement:hover&gt;g,
                                #ingenierie:hover&gt;g,
                                #conseil:hover&gt;g,
                                #bim:hover&gt;g {
                                    transform: scale(.9);
                                }

                                #moex&gt;g {
                                    transform-origin: 304px 110px;
                                }

                                #environnement&gt;g {
                                    transform-origin: 304px 232px;
                                }

                                #ingenierie&gt;g {
                                    transform-origin: 197px 171px;
                                }

                                #conseil&gt;g {
                                    transform-origin: 197px 293px;
                                }

                                #bim&gt;g {
                                    transform-origin: 90px 232px;
                                }

                                #moex text,
                                .cls-1 {
                                    fill: #bea670;
                                }

                                .cls-1,
                                .cls-2,
                                .cls-3,
                                .cls-4,
                                .cls-5 {
                                    stroke-linecap: round;
                                }

                                .cls-1,
                                .cls-2,
                                .cls-3,
                                .cls-4,
                                .cls-5,
                                .cls-6 {
                                    stroke: #fff;
                                    stroke-width: 2px;
                                }
                                .cls-19 {
                                    stroke: #fff;
                                    stroke-width:0.75px;
                                    fill:#f5971b;
                                }
                                .cls-20 {
                                    stroke: #fff;
                                    stroke-width:0.75px;
                                    fill:none;
                                }

                                .cls-1,
                                .cls-3 {
                                    stroke-linejoin: round;
                                }

                                #conseil text,
                                .cls-7,
                                .cls-5 {
                                    fill: #3fb1c9;
                                }

                                .cls-8 {
                                    fill: #fff;
                                }

                                .cls-9 {
                                    stroke: #009c3e;
                                }

                                .cls-9,
                                .cls-3,
                                .cls-10,
                                .cls-11,
                                .cls-12,
                                .cls-4,
                                .cls-13,
                                .cls-6 {
                                    fill: none;
                                }

                                .cls-9,
                                .cls-10,
                                .cls-11,
                                .cls-12,
                                .cls-4,
                                .cls-13 {
                                    stroke-miterlimit: 10;
                                }

                                #bim text,
                                .cls-14 {
                                    fill: #f5971b;
                                }

                                .cls-15 {
                                    fill: #1e1e40;
                                }

                                #ingenierie text,
                                .cls-2,
                                .cls-16 {
                                    fill: #b7011a;
                                }

                                #environnement text,
                                .cls-17 {
                                    fill: #009c3e;
                                }

                                .cls-10 {
                                    stroke: #3fb1c9;
                                }

                                .cls-11 {
                                    stroke: #f5971b;
                                }

                                .cls-12 {
                                    stroke: #b7011a;
                                }

                                .cls-13 {
                                    stroke: #c5b280;
                                }

                                .cls-18 {
                                    fill: #c5b280;
                                }
                                </style>
                                </defs>
                                <g id="bg">
                                    <polygon id="bg-2" class="cls-15" points="283 89 151 89 85 202 151 315 283 315 349 202 283 89"></polygon>
                                    <line class="cls-13" x1="301.5" y1="65" x2="301.5" y2="35"></line>
                                <g>
                                    <polygon class="cls-8" points="299.28 34.5 296.58 30 299.28 25.5 303.72 25.5 306.42 30 303.72 34.5 299.28 34.5"></polygon>
                                    <path class="cls-18" d="M303.43,26l2.4,4-2.4,4h-3.87l-2.4-4,2.4-4h3.87m.57-1h-5l-3,5,3,5h5l3-5-3-5h0Z"></path>
                                </g>
                                <line class="cls-9" x1="332.8" y1="260" x2="332.8" y2="307"></line>
                                <g>
                                    <polygon class="cls-8" points="330.59 316.35 327.89 311.85 330.59 307.35 335.02 307.35 337.72 311.85 335.02 316.35 330.59 316.35"></polygon>
                                    <path class="cls-17" d="M334.74,307.85l2.4,4-2.4,4h-3.87l-2.4-4,2.4-4h3.87m.57-1h-5l-3,5,3,5h5l3-5-3-5h0Z"></path>
                                </g>
                                
                                <line class="cls-10" x1="198.89" y1="330" x2="198.89" y2="370"></line>
                                <g>
                                    <polygon class="cls-8" points="196.67 377.7 193.97 373.2 196.67 368.7 201.11 368.7 203.81 373.2 201.11 377.7 196.67 377.7"></polygon>
                                    <path class="cls-7" d="M200.82,369.2l2.4,4-2.4,4h-3.87l-2.4-4,2.4-4h3.87m.57-1h-5l-3,5,3,5h5l3-5-3-5h0Z"></path>
                                </g>
                                
                                <line class="cls-12" x1="195.77" y1="130" x2="195.77" y2="95"></line>
                                <g>
                                    <polygon class="cls-8" points="193.55 95.28 190.85 90.78 193.55 86.28 197.98 86.28 200.68 90.78 197.98 95.28 193.55 95.28"></polygon>
                                    <path class="cls-16" d="M197.7,86.78l2.4,4-2.4,4h-3.87l-2.4-4,2.4-4h3.87m.57-1h-5l-3,5,3,5h5l3-5-3-5h0Z"></path>
                                </g>
                                
                                <line class="cls-11" x1="60.77" y1="190" x2="60.77" y2="155"></line>
                                <g>
                                    <polygon class="cls-8" points="58.55 156.28 55.85 151.78 58.55 147.28 62.98 147.28 65.68 151.78 62.98 156.28 58.55 156.28"></polygon>
                                    <path class="cls-14" d="M62.7,147.78l2.4,4-2.4,4h-3.87l-2.4-4,2.4-4h3.87m.57-1h-5l-3,5,3,5h5l3-5-3-5h0Z"></path>
                                </g>
                                </g>

                                <a id="ingenierie" href="../technologies.html">
                                <text x="196" y="80">Ingénierie</text>
                                <g>
                                    <g>
                                    <polygon class="cls-16" points="232 111 162 111 127 171 162 231 232 231 267 171 232 111"></polygon>
                                    <polygon class="cls-6" points="227 119 167 119 137 171 167 223 227 223 257 171 227 119"></polygon>
                                    </g>
                                    <g>
                                    <rect class="cls-16" x="203.56" y="142.3" width="1" height="4"></rect>
                                    <path class="cls-8" d="M204.06,142.8v0m1-1h-2v5h2v-5h0Z"></path>
                                    </g>
                                    <circle class="cls-2" cx="204.06" cy="149.8" r="3"></circle>
                                    <rect class="cls-2" x="198.06" y="150.3" width="12" height="7" rx="3" ry="3"></rect>
                                    <rect class="cls-2" x="196.06" y="154.8" width="16" height="34" rx="1.94" ry="1.94"></rect>
                                    <rect class="cls-2" x="191.06" y="161.8" width="13" height="35"></rect>
                                    <rect class="cls-2" x="173.06" y="179.8" width="18" height="17"></rect>
                                    <rect class="cls-2" x="177.06" y="158.8" width="8" height="21"></rect>
                                    <g>
                                    <path class="cls-2" d="M204.06,192.8h12.27c.95,0,1.73,.77,1.73,1.73v.54c0,.95-.77,1.73-1.73,1.73h-12.27v-4h0Z"></path>
                                    <path class="cls-2" d="M204.06,188.8h12.27c.95,0,1.73,.77,1.73,1.73v.54c0,.95-.77,1.73-1.73,1.73h-12.27v-4h0Z"></path>
                                    <path class="cls-2" d="M204.06,184.8h12.27c.95,0,1.73,.77,1.73,1.73v.54c0,.95-.77,1.73-1.73,1.73h-12.27v-4h0Z"></path>
                                    <path class="cls-2" d="M204.06,180.8h12.27c.95,0,1.73,.77,1.73,1.73v.54c0,.95-.77,1.73-1.73,1.73h-12.27v-4h0Z"></path>
                                    <path class="cls-2" d="M204.06,176.8h12.27c.95,0,1.73,.77,1.73,1.73v.54c0,.95-.77,1.73-1.73,1.73h-12.27v-4h0Z"></path>
                                    </g>
                                    <g>
                                    <circle class="cls-2" cx="164.06" cy="190.8" r="3"></circle>
                                    <circle class="cls-2" cx="164.06" cy="185.8" r="2"></circle>
                                    <g>
                                        <rect class="cls-16" x="163.56" y="194.3" width="1" height="2"></rect>
                                        <path class="cls-8" d="M164.06,194.8v0m1-1h-2v3h2v-3h0Z"></path>
                                    </g>
                                    </g>
                                    <g>
                                    <rect class="cls-16" x="161.56" y="196.3" width="68" height="1"></rect>
                                    <polygon class="cls-8" points="230.06 195.8 161.06 195.8 161.06 197.8 230.06 197.8 230.06 195.8 230.06 195.8"></polygon>
                                    </g>
                                    <g>
                                    <circle class="cls-2" cx="227.06" cy="190.8" r="3"></circle>
                                    <circle class="cls-2" cx="227.06" cy="185.8" r="2"></circle>
                                    <g>
                                        <rect class="cls-16" x="226.56" y="194.3" width="1" height="2"></rect>
                                        <path class="cls-8" d="M227.06,194.8v0m1-1h-2v3h2v-3h0Z"></path>
                                    </g>
                                    </g>
                                </g>
                                </a>

                            <a id="bim" href="/metiers/bim-nouvelles-technologies">
                                <text x="60" y="140">BIM-Synthèse</text>
                                <g>
                                    <g>
                                        <polygon class="cls-14" points="125 172 55 172 20 232 55 292 125 292 160 232 125 172"></polygon>
                                        <polygon class="cls-6" points="120 180 60 180 30 232 60 284 120 284 150 232 120 180"></polygon>
                                    </g>
                                    <rect class="cls-4" x="60.92" y="204.55" width="58" height="49" rx="4" ry="4"></rect>
                                    <line class="cls-4" x1="60.92" y1="214.55" x2="118.92" y2="214.55"></line>
                                    <line class="cls-4" x1="60.92" y1="243.55" x2="118.92" y2="243.55"></line>
                                    <line class="cls-4" x1="75.92" y1="262.55" x2="103.92" y2="262.55"></line>
                                    <line class="cls-4" x1="84.92" y1="253.55" x2="84.92" y2="262.55"></line>
                                    <line class="cls-4" x1="94.92" y1="262.55" x2="94.92" y2="254.55"></line>
                                    <line class="cls-3" x1="86.92" y1="209.55" x2="92.92" y2="209.55"></line>
                                    <line class="cls-3" x1="86.92" y1="248.55" x2="92.92" y2="248.55"></line>
                                    <g id="bim-3d">
                                        <circle class="cls-19" cx="89.92" cy="228.77" r="10.23"></circle>
                                        <circle class="cls-19" cx="82.95" cy="221.7" r="1.59"></circle>
                                        <circle class="cls-19" cx="96.95" cy="235.84" r="1.59"></circle>
                                        <polygon class="cls-19" points="97.53 233 89.95 235.91 82.78 233 82.78 224.36 90.15 221.46 97.53 224.36 97.53 233"></polygon>
                                        <polyline class="cls-20" points="82.78 224.36 89.95 227.26 97.53 224.36"></polyline>
                                        <polyline class="cls-20" points="82.78 233 90.15 230.1 97.53 233"></polyline>
                                        <line class="cls-20" x1="89.95" y1="227.26" x2="89.95" y2="227.76"></line>
                                        <line class="cls-20" x1="89.95" y1="228.82" x2="89.95" y2="230.32"></line>
                                        <line class="cls-20" x1="89.95" y1="232.61" x2="89.95" y2="234.61"></line>
                                        <line class="cls-20" x1="89.95" y1="235.14" x2="89.95" y2="235.64"></line>
                                    </g>
                                </g>
                            </a>
                            
                            <a id="environnement" href="/metiers/environnement">
                                <text x="332" y="334">Environnement</text>
                                <g>
                                    <g>
                                        <polygon class="cls-17" points="339 172 269 172 234 232 269 292 339 292 374 232 339 172"></polygon>
                                        <polygon class="cls-6" points="334 180 274 180 244 232 274 284 334 284 364 232 334 180"></polygon>
                                    </g>
                                    <path class="cls-3" d="M270,233c5.8-9.07,4.49-17.99,8.6-24.58"></path>
                                    <path class="cls-3" d="M290.77,200.67c4.07-1.72,8.54-2.67,13.23-2.67,18.78,0,34,15.22,34,34s-15.22,34-34,34-34-15.22-34-34"></path>
                                    <path class="cls-3" d="M270,233c-3.66-10.02-4.4-12.81-1.83-17.99,4.39-8.86,9.29-7.2,12.08-15.74,5.5,8.11,7.14,15.48,4.3,21.43-2.75,5.78-8.82,9.76-14.55,12.3Z"></path>
                                    <path class="cls-3" d="M275.18,222.35c2.43-2.03,5.78-3.88,5.78-3.88"></path>
                                    <path class="cls-3" d="M272.2,216.14c1.4,1.7,2.7,3.81,2.09,6.22"></path>
                                    <path class="cls-3" d="M322.05,203.18l-4.78,2.97-9.92,2.27-2.73,4.51-8.09,.92s-6.49,8.91-2.34,13.87c2.16,0,14.04-1.98,14.04-1.98l10.13,8.02,11.9-.62,7.57,3.96,.18-.09"></path>
                                    <path class="cls-3" d="M292.27,234.84l4.29-2.1,10.69-.74,6.31,9.15-1.31,7.53s-4.41,3.28-5.17,4.99-3.76-.78-4.03-3.41-.19-4.2-.19-4.2l-5.99-2.96-4.59-8.25Z"></path>
                                    <polyline class="cls-3" points="272.33 244.82 275.73 240.62 287.8 244.82 290.06 255.38 306.72 262.17 309 266"></polyline>
                                </g>
                            </a>

                            <a id="moex" href="/metiers/moex-cle-en-main">
                                <text x="302" y="19">Moex</text>
                                <g>
                                    <g>
                                        <polygon class="cls-18" points="339 50 269 50 234 110 269 170 339 170 374 110 339 50"></polygon>
                                        <polygon class="cls-6" points="334 58 274 58 244 110 274 162 334 162 364 110 334 58"></polygon>
                                    </g>
                                    <path class="cls-3" d="M329.99,106.5c0,4.31-.15,7.04,0,9.94,.16,3.14-8.07,9.34-21.97,9.62-11.2,.22-25.21-1.56-31.4-8.64-2.35-2.68-2.54-6.67-2.54-10.91,0-14.43,9.99-27.27,25.41-27.96,16.89-.75,30.5,12.52,30.5,27.96Z"></path><path class="cls-3" d="M274.12,108.97c-4.9,3.81-5.94,11.51,4.89,15.62,10.84,4.11,17.72,9.94,23.02,11.66s21.23,.93,29-3.29c6.46-3.5,9.72-6.88-1.05-16.52"></path>
                                    <path class="cls-3" d="M298.83,102.53c0-11.72-5.72-14.25-12.69-19.25"></path>
                                    <path class="cls-3" d="M318,99c0-12.31-8.98-20.9-19.17-20.9"></path>
                                    <path class="cls-1" d="M304.07,106.17c1.31-12.34-4.46-21.49-15.06-25.4-2.74-1.28,9.03-3.86,10.83-2.67,5.74,3.82,13.87,8.11,13.87,26.23,0,3.63-9.83,3.74-9.63,1.84Z"></path>
                                </g>
                            </a>
                            
                            <a id="conseil" href="/metiers/conseil">
                                <text x="200" y="395">Conseil</text>
                                <g>
                                    <g>
                                        <polygon class="cls-7" points="232 233 162 233 127 293 162 353 232 353 267 293 232 233"></polygon>
                                        <polygon class="cls-6" points="227 241 167 241 137 293 167 345 227 345 257 293 227 241"></polygon>
                                    </g>
                                    <polygon class="cls-4" points="192.92 315.55 211.92 315.55 221.92 326.55 221.92 315.55 228.92 315.55 228.92 288.55 192.92 288.55 192.92 315.55"></polygon>
                                    <polygon class="cls-5" points="214.92 305.55 185.92 305.55 171.92 319.55 171.92 305.55 164.92 305.55 164.92 267.55 214.92 267.55 214.92 305.55"></polygon>
                                    <rect class="cls-8" x="175.92" y="279.55" width="29" height="1.98"></rect>
                                    <rect class="cls-8" x="175.92" y="285.55" width="5" height="2"></rect>
                                    <rect class="cls-8" x="199.92" y="285.55" width="5" height="2"></rect>
                                    <rect class="cls-8" x="183.92" y="285.55" width="5" height="2"></rect>
                                    <rect class="cls-8" x="191.92" y="285.55" width="5" height="2"></rect>
                                    <rect class="cls-8" x="175.92" y="291.55" width="21" height="2"></rect>
                                </g>
                            </a>
                        </svg>                        



                    </div>
                    <aside>
                        <h3>Todo</h3>    
                        <ul>
                            <li>Bilan menu de navigation</li>
                            <li>css : les images ne sont pas contrainte dans les éléments aside</li>
                            <li>css : les articles sont placés dans les éléments div de classe tabcontent</li>
                        </ul>                            

                    </aside>                
                </div>
            </section>

    
    </article>        

</div>