<!-- 20260520-001  
        $article['title']), $article['id']) , $article['intro']


-->                    
        <article id="tabRESERVED" class="cp_soft-card">

        <script>
        const cp_edit_articles = <?= json_encode($articles, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP); ?>;

        /*
        d : data ; f: filtre , c : champ
        */
        function filter(d , f  , c) {
            if (!d || !f || !c ) return d
            return d.filter( o => { return (o[c]  == f ) } )
        }



        function cp_edit_clog( event , msg ){
            event.stopPropagation()
            
            //const strTmp = cp_edit_articles.length 
            //console.log('app/Views/cms/components/cp_edit.php :: articles trouvés = ' + strTmp)
            
            console.log('app/Views/cms/components/cp_edit.php :: cp_edit_clog ' + msg)

            const test = filter( cp_edit_articles , msg.aid , 'id')
        }

        </script>



            <header>
                <h1>RESERVED</h1>
                <p>Zone de test composants composites</p>
            </header>

            <section>
                <h2>Composant articleZone</h2>
                    <div>
                        <div>
                            <h3>edit</h3>
                            Ce composant doit servir de base aux intégrations des components js dans le scomposant composites php
                            
                            <h3>articles</h3>

                            <ul>
                            <?php foreach ($articles as $artIdx => $article): ?>
                            
                                <li onclick="cp_edit_clog(event , { aid : <?= esc($article['id']) ?> } )" >
                                    <?= esc($article['id']) ?> - <?= esc($article['title']) ?>
                                    <ul>
                                    <?php foreach ($article['sections'] as $section): ?>

                                        <li onclick="cp_edit_clog( event ,'aid <?= esc($article['id']) ?>, sid <?= esc($section['id']) ?>')" >
                                            <?= esc($section['id']) ?> - <?= esc($section['title']) ?>
                                        </li>

                                    <?php endforeach; ?> 
                                    </ul>
    
                                </li>

                            <?php endforeach; ?> 
                            </ul>

                        </div>
                        <aside>
                            Composant de base
                        </aside>	            
                    </div>
            </section>
        </article>
