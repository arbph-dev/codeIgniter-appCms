<!-- HEADER 
 
<path id="lissajous-path" est exploite par script main.js et ihm/svg.js

<header class="blue">
-->
        <header>

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
                        <stop offset="0%" stop-color="#0000ff" />
                        <stop offset="50%" stop-color="#0071b5" />
                        <stop offset="100%" stop-color="#0000ff" />
                    </linearGradient>

                </defs>
                <!-- Fond 
                <rect width="1920" height="80" fill="#0071b5" />
                 -->
                
                <rect width="1920" height="150" fill="url(#backgroundGradient)" />
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
            <h1 class="protoss-title">🏗️ Zealot - en construction 🏗️</h1>              
            <div>
            headerContent
            </div>
            <div class="rwdnav" onclick="openNav()">open</div>



        </header>