<div id="devone" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1><?= esc( $title ) ?></h1>
            <p>
            Doit servir de base pour les tests    
            </p>
        </header>

        <section>
            <h2>Leaflet</h2>
            <div>
                <div>
                    <h3>Description</h3>
                    Le bloc Leaflet doit permettre la meme fonction que sous Obsidian
                </div>
                <aside>
                    <p>contenu section </p>

                    <div id="CALLOUT_1" class="cp_callout note">
                        <div id="CALLOUT1_TITRE" class="titre">Titre callout</div>
                        <div id="CALLOUT1_CONTENT" class="content">Le bloc Leaflet doit permettre la meme fonction que sous Obsidian</div>
                    </div>
                                         
                </aside>             
            </div>
        </section>
        
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