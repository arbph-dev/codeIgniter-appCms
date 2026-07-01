<div id="devone" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1><?= esc( $title ) ?></h1>
            <p>
            Doit servir de base pour les tests    
            </p>
        </header>

        <section>
            <h2>CALLOUT</h2>
            <div>
                <div>
                    <h3>Description</h3>
                    Le bloc CALLOUT doit permettre la meme fonction que sous Obsidian
                </div>
                <aside>
                    <p>contenu section </p>

                    <div id="CALLOUT_1" class="cp_callout note">
                        <div id="CALLOUT1_TITRE" class="titre">Titre callout</div>
                        <div id="CALLOUT1_CONTENT" class="content">Content callout</div>
                    </div>
                    
                    
                </aside>             
            </div>
        </section>

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
    </article>        

</div>