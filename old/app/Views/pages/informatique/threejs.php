<div id="devone" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1><?= esc( $title ) ?></h1>
            <p>
            Doit servir de base pour les tests    
            </p>
        </header>

        <section>
            <h2>THREEJS</h2>
            <div>
                <div>
                    <h3>Description</h3>
                    Le bloc THREEJS doit permettre la representation et l'animation 3D<br>
                    Path a revoir
                </div>
                <aside>



                </aside>             
            </div>
        </section>

        <section>
            <h2>THREE_1</h2>
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
            <h2>THREE_2</h2>
            <div>
                <div id="THREE_2" class="cp_threejs" data-scene="galaxy"  data-width="800" data-height="600"></div>
                <aside>
                    <button onclick="threeStart('THREE_2')">Start</button>
                    <button onclick="threeStop('THREE_2')">Stop</button>
                </aside>
            </div>
        </section>

        <section>
            <h2>THREE_3</h2>
            <div>
                <div id="THREE_3" class="cp_threejs" data-scene="terrain" data-width="800" data-height="600"></div>
                <aside>
                    <button onclick="threeStart('THREE_3')">Start</button>
                    <button onclick="threeStop('THREE_3')">Stop</button>
                </aside>
            </div>
        </section>



        <section>
            <h2>THREE_4</h2>
            <div>
                <div id="THREE_4" class="cp_threejs" data-scene="model"   data-model="/assets/img/3js/model3d/avions/FW190.obj"></div>		
                <aside>
                    <button onclick="threeStart('THREE_4')">Start</button>
                    <button onclick="threeStop('THREE_4')">Stop</button> 
                </aside>
            </div>
        </section>

    </article>        

</div>