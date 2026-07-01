<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Welcome to CodeIgniter 4!</title>
        <meta name="description" content="The small framework with powerful features">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" type="image/png" href="/favicon.ico">
        
        <!-- STYLES 
        <style {csp-style-nonce}></style>
        -->

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="./assets/css/style.css">
        
        
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>        
        <script src="./assets/js/main.js" type="module"></script>        
        <!-- SCRIPTS 
        <script {csp-script-nonce}>
        </script>
        -->
        
        <!-- -------------------------------  leaflet ------------------------------------  -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <!-- 
        <script>
            console.log("Leaflet OK ?", window.L);
        </script>
        -->
        <script src="https://unpkg.com/leaflet-tilelayer-wmts@1.0.0/dist/leaflet-tilelayer-wmts.js"></script>
        <!-- Extension Géoplateforme pour Leaflet -->
        <script src="./assets/js/plugins/GpPluginLeaflet.js"></script>
	    <link rel="stylesheet" href="./assets/css/GpPluginLeaflet.css"/>
        
        <!-- -------------------------------  threejs ------------------------------------  -->
        <!--    Simplification des imports  -->
        <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
            }
        }
        </script>

    <!-- -->
    </head>

    <body>
        <!-- HEADER  -->
        <header class="blue">
<!-- 
            <svg class="bg-svg" viewBox="0 0 1000 100" preserveAspectRatio="none" style="z-index: 0;position: absolute;">
                <polygon points="500,0 1000,0 1000,50 0,50" fill="#0ff" opacity="0.8"/>
            </svg>

 -->
            <svg class="bg-svg" viewBox="0 0 1920 80" xmlns="http://www.w3.org/2000/svg" style="z-index: 0;position: absolute;">
                <defs>
                     <!-- Filtre pour l'effet de lueur -->
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <linearGradient id="backgroundGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="#0a0f25" />
                        <stop offset="50%" stop-color="#c0d8fb" />
                        <stop offset="100%" stop-color="#0a0f25" />
                    </linearGradient>

                </defs>
                <!-- Fond 
                 <rect width="1920" height="150" fill="url(#backgroundGradient)" />
                 -->
                <rect width="1920" height="80" fill="#0071b5" />
                <!-- Cercle central représentant le plasma -->

                <circle cx="960" cy="80" r="20" fill="#ffd700" filter="url(#glow)">
                    <animate attributeName="r" from="20" to="35" dur="8s" repeatCount="indefinite" />
                    <animate attributeName="fill" values="#ffd700;#ffffff" dur="4s" begin="0s" repeatCount="indefinite" />
                </circle>

                
                <!-- Arcs concentriques pour simuler le confinement magnétique -->
                <circle cx="960" cy="80" r="20" stroke="#ffd700" stroke-width="8" fill="none" opacity="0.5">
                    <animate attributeName="r" from="20" to="75" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="960" cy="80" r="20" stroke="#ffd700" stroke-width="12" fill="none" opacity="0.3">
                    <animate attributeName="r" from="20" to="75" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="960" cy="80" r="20" stroke="#ffd700" stroke-width="16" fill="none" opacity="0.1">
                    <animate attributeName="r" from="20" to="75" dur="8s" repeatCount="indefinite" />
                </circle>
                <!-- Path pour la courbe de Lissajous -->
                <path id="lissajous-path" fill="none" stroke="#ffd700" stroke-width="2" z-index="2"/>
            </svg>


            <!-- <h1>headerTitle</h1> -->
            <h1 class="protoss-title">⚡ Aiur Command Terminal</h1>              
            <div>
            headerContent
            </div>
            <div class="rwdnav" onclick="openNav()">open</div>



        </header>
        <!-- NAV  -->
        <nav id="sidebar">
            
            <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">
            &times;
            </a>

            <a class="active" href="javascript:void(0)" onclick="openPage('Home', this)">
            <i class="fa fa-fw fa-home"></i>
            Home
            </a>

            <a href="javascript:void(0)" onclick="openPage('News', this)">
            <i class="fa fa-fw fa-search"></i>
            News
            </a>
            
            <a href="javascript:void(0)" onclick="openPage('Contact', this)">
            <i class="fa fa-fw fa-envelope"></i>
            Contact
            </a>
            
            <a href="javascript:void(0)" onclick="openPage('About', this)">
                <i class="fa fa-fw fa-newspaper-o"></i>
                About
            </a>

            <a href="javascript:void(0)" onclick="openPage('Info', this)">
                <i class="fa fa-fw fa-desktop"></i>
                Info
            </a>
            <a href="javascript:void(0)" onclick="openPage('Techno', this)">
                <i class="fa fa-fw fa-wrench"></i>
                Techno
            </a>
        </nav>
        <!-- MAIN  -->
        <main>

            <!-- ONGLET    --> 
            <div id="Home" class="tabcontent cp_artanis-card" style="display: block;">
                <h3>My Brethren, hear me! For there is little time left.
                    All that remains of our race, our civilization, are those that stand beside you now, and those corrupted on the surface below.
                    Our kind once stood as stewards of a galaxy full of promise.
                    In our pride and division, we failed that sacred change and fell to ruin. The Khala, designed to bring unity, ultimately only aided those divisions.
                    Its hope was a lie.
                    Today, that lie must come to its end, and with it, our prejudice and arrogance must become a thing of the past.
                    For we now fight in the belief that our kind has not seen its end. That we protoss can stand bound by a belief in unity.
                    And that we protoss will forge a great and mighty new civilization! 
                    Trust in each other in the fight ahead. 
                    Strike as one will! 
                    Let our last stand burn a memory so bright that we will be known throughout eternity!</h3>
                

            </div>

            <!-- ONGLET    --> 
            <div id="News" class="tabcontent">
                <article class="cp_soft-card">
                    <header>
                        <h1>Article 1</h1>
                        <p>texte intro 1</p>
                    </header>
                
                    <!-- Article 1 Section 1 -->
                    
                    <section>
                        <h2>Article 1 Section 1</h2>
                        <div>

                            <div id="CODEVAL_1" class="cp_codeval">
                                <div id="CODEVAL_1_TITRE" class="titre">Eval 1</div>

                                <div id="CODEVAL_1_SCRIPTCODE" class="scriptcode">
                                    <textarea rows="20" cols="40" placeholder="Entrez votre code JavaScript ici...">const u=12&#13;&#10;const r=20&#13;&#10;const i=u/r&#13;&#10;const z = 'Courant '+ i +' A'&#13;&#10;z&#13;&#10;
                                    </textarea>
                                    <!--  <button id="executeButton1" name="executeButton1">Exécuter</button> -->
                                    <button id="executeButton1" name="executeButton" onclick="evaluateCode(1)">Exécuter</button>
                                </div>

                                <div id="CODEVAL_1_RESULT" class="result">

                                </div>

                            </div>
                            
                            <aside>
                                <ul>
                                <li><a href="#">Related link 1</a></li>
                                <li><a href="#">Related link 2</a></li>
                                </ul>
                            </aside>                

                        </div>
                    </section>

                    <!-- Article 1 Section 1 -->
                    <section>
                        <h2>Article 1 Section 1</h2>
                        <div>

                            <div>
                                <p>Article 1 Section 1 Content.
                                <img src="./assets/img/info/logo_svg_ARDUINO.svg" width="10%">
                                </p>
                            </div>
                            
                            <aside id="CODEVAL_2" class="cp_codeval">
                                <div id="CODEVAL2_TITRE" class="titre">Eval 2</div>

                                <div id="CODEVAL_2_SCRIPTCODE" class="scriptcode">
                                    <textarea rows="20" cols="40" placeholder="Entrez votre code JavaScript ici...">const u=12&#13;&#10;const r=20&#13;&#10;const i=u/r&#13;&#10;const z = 'Courant '+ i +' A'&#13;&#10;z&#13;&#10;</textarea>
                                <!--  <button id="executeButton1" name="executeButton1">Exécuter</button> -->
                                    <button id="executeButton2" name="executeButton" onclick="evaluateCode(2)">Exécuter</button>
                                </div>

                                <div id="CODEVAL_2_RESULT" class="result">

                                </div>
                            </aside>                

                        </div>
                    </section>

                    <!-- Article 1 Section 1 -->
                    <section>
                        <h2>titre section : principe</h2>
                        <div>
                            <div>
                                <p>contenu section </p>
                            </div>
                            <aside>
                            <div id="apex_grf1">
                            </div>  
                            </aside>
                        </div>
                    </section>
                    <!-- Article 1 Section 1 -->
                    <section>
                        <h2>titre section : principe</h2>
                        <div>
                            <div>
                                <p>contenu section </p>
                                <!--
                                aside id="CALLOUT_2" class="cp_callout-note"
	                                div id="CALLOUT2_TITRE" class="titre"
	                                div id="CALLOUT2_CONTENT" class="content"	
                                -->

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
                                </div>                                                                
                            </div>
                            <aside>
                                <div>
                                    <p><b>2026-03-14</b> : création</p>
                                    <p>Le callout permet de masquer des informations importantes mais qui distrairont ou renverraient vers d'autres sujets complexes</p>
                                </div>
                                <div>2026-03-15 : amélioration => revoir le style</div>  
                            </aside>
                        </div>
                    </section>
                    <!-- threejs -->
                    <section>
                        <h2>Threejs</h2>
                        <div>
                            <div id="THREE_1" class="cp_threejs" data-scene="cube"    data-width="800" data-height="600"></div>
                            <aside>
                                <button onclick="threeList()">List</button>
                                <button onclick="threeStart('THREE_1')">Start</button>
                                <button onclick="threeStop('THREE_1')">Stop</button>
                            </aside>
                        </div>
                    </section>

                    <section>
                        <h2>Threejs</h2>
                        <div>
                            <div id="THREE_2" class="cp_threejs" data-scene="galaxy"  data-width="800" data-height="600"></div>
                            <aside>
                                <button onclick="threeStart('THREE_2')">Start</button>
                                <button onclick="threeStop('THREE_2')">Stop</button>
                            </aside>
                        </div>
                    </section>

                    <section>
                        <h2>Threejs</h2>
                        <div>
                            <div id="THREE_3" class="cp_threejs" data-scene="terrain" data-width="800" data-height="600"></div>
                            <aside>
                                <button onclick="threeStart('THREE_3')">Start</button>
                                <button onclick="threeStop('THREE_3')">Stop</button>
                            </aside>
                        </div>
                    </section>



                    <section>
                        <h2>Threejs</h2>
                        <div>
                            <div id="THREE_4" class="cp_threejs" data-scene="model"   data-model="./assets/img/3js/model3d/avions/FW190.obj"></div>		
                            <aside>
                                <button onclick="threeStart('THREE_4')">Start</button>
                                <button onclick="threeStop('THREE_4')">Stop</button> 
                            </aside>
                        </div>
                    </section>


                </article>
            </div>

            <!-- ONGLET    --> 
            <div id="Contact" class="tabcontent">
                <h3>Contact</h3>
                <p>Get in touch, or swing by for a cup of coffee.</p>
            </div>

            <!-- ONGLET    --> 
            <div id="About" class="tabcontent">
                <h3>About</h3>
                <p>Who we are and what we do.</p>

                <table id="data-table" border="1">
                    <thead></thead>
                    <tbody></tbody>
                </table>

            </div>

            <!-- ONGLET    --> 
            <div id="Info" class="tabcontent">
                <h3>Computer science</h3>
                <p>What we knows</p>
                
                    <!-- <img src="./assets/img/info/LOGO.svg" width="10%"> -->
                    <img src="./assets/img/info/logo_svg_JS.svg" width="10%">
                    <img src="./assets/img/info/logo_svg_PYTHON.svg" width="10%">
                    <img src="./assets/img/info/logo_svg_VS.svg" width="10%">
                    <img src="./assets/img/info/logo_svg_ARDUINO.svg" width="10%">
                    <img src="./assets/img/info/logo_svg_DEBIAN.svg" width="10%">
            </div>

            <!-- ONGLET    -->             
            
            <div id="Techno" class="tabcontent">             
                <!-- ARTICLE  -->
                <article class="cp_soft-card">
                    <header>
                        <h1>Article 1</h1>
                        <p>texte intro 1</p>
                    </header>
                
                    <!-- Article 1 Section 1 -->
                    <section>
                        <h2>Article 1 Section 1</h2>
                        <div>

                            <div>
                                <p>Article 1 Section 1 Content.
                                <img src="./assets/img/info/logo_svg_ARDUINO.svg" width="10%">
                                </p>
                            </div>
                            
                            <aside>
                                <ul>
                                <li><a href="#">Related link 1</a></li>
                                <li><a href="#">Related link 2</a></li>
                                </ul>
                            </aside>                

                        </div>
                    </section>

                </article>
                <!-- ARTICLE  -->
                <article>
                    <header>
                        <h1>Article 2</h1>
                        <p>texte intro 2</p>
                    </header>
                
                    <!-- Article 1 Section 1 -->
                    <section>
                        <h2>Article 2 Section 1</h2>
                        <div>

                            <div>
                                <p>Article 2 Section 1 Content.
                                <img src="./assets/img/info/logo_svg_ARDUINO.svg" width="10%">
                                </p>
                            </div>
                            
                            <aside>
                                <ul>
                                <li><a href="#">Related link 1</a></li>
                                <li><a href="#">Related link 2</a></li>
                                </ul>
                            </aside>                

                        </div>
                    </section>

                </article>                
                <!-- ARTICLE  -->
                <article>
                    <header>
                        <h1>Article 3</h1>
                        <p>texte intro 3</p>
                    </header>
                
                    <!-- Article 1 Section 1 -->
                    <section>
                        <h2>Article 3 Section 1</h2>
                        <div>

                            <div class="cp_zealot-card">
                                <p>Article 3 Section 1 Content.</p>
                                <p>Article 3 Section 1 Content.</p>
                                <p>Article 3 Section 1 Content.</p>
                                <p>Article 3 Section 1 Content.</p>
                                <p>Article 3 Section 1 Content.</p>
                                <p>Article 3 Section 1 Content.</p>
                                <p>Article 3 Section 1 Content.</p>
                                <p>Article 3 Section 1 Content.</p>
                                <p>Article 3 Section 1 Content.</p>
                            </div>
                            
                            <aside>
                                <ul>
                                <li><a href="#">Related link 1</a></li>
                                <li><a href="#">Related link 2</a></li>
                                </ul>
                            </aside>                

                        </div>
                    </section>

                    <!-- Article 1 Section 1 -->
                    <section>
                        <h2>Carousel</h2>
                        <div>
                            <div>
                            text a agrémenter
                            </div>

                            <aside>
                            <div id="CAROUSEL_1" class="cp_carousel">
                                <img src="./assets/img/chimie/pictogram-SGH01.svg">
                                <img src="./assets/img/chimie/pictogram-SGH02.svg">
                                <img src="./assets/img/chimie/pictogram-SGH03.svg">
                                <img src="./assets/img/chimie/pictogram-SGH04.svg">
                                <img src="./assets/img/chimie/pictogram-SGH05.svg">
                                <img src="./assets/img/chimie/pictogram-SGH06.svg">
                                <img src="./assets/img/chimie/pictogram-SGH07.svg">
                                <img src="./assets/img/chimie/pictogram-SGH08.svg">
                                <img src="./assets/img/chimie/pictogram-SGH09.svg">
                            </div>
                            <button onclick="ihmCarouselPrev('1')">‹</button>
                            <button onclick="ihmCarouselNext('1')">›</button>
                            </aside>
                        </div>
                    </section>
                    <!-- MERMAID -->
                    <section>
                        <h2>titre section : principe</h2>
                        <div>
                            <div id="mermaid_grf1">
                            <pre class="mermaid" id="mmG1">
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
                                onclick="mermaid_Run('mmG1')"
                                >Exécuter
                                </button>                  
                            </div>
                            <aside>
                            mermaid en zone centrale
                            </aside>
                        </div>
                    </section>                    
                    <!-- LEAFLET -->
                    <section>
                        <h2>Leaflet</h2>
                        <div>
                            <div class="leafletContainer">
                            <div id="leafletMap"></div>
                            <div id="leafletInfo">
                                Some text
                            </div>
                            </div>
                            <aside>
                                <button id="testLeafelt" name="testLeafelt" onclick="testLeafelt()">testLeafelt</button>                               
                            <!-- 
                                <button 
                                id="listButton"
                                name="listButton" 
                                onclick="testLeafelt()"
                                >Exécuter
                                </button>   -->

                            leaflet, fonctionnel à améliorer. Gestion du css plutot que du style html
                            </aside>
                        </div>
                    </section>                     
                </article>                 
            </div>            

            <!-- -->            

        </main>

        <!-- FOOTER  -->
        <footer>
            Site powered by vanilla
        </footer>


    </body>
</html>
