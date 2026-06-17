<?= $this->extend('layouts/cms') ?> 

<?= $this->section('title') ?>
    <?= esc($title) ?>
<?= $this->endSection() ?>


<!-- ================================================== 
260502-001
- [X] ajouter le callout dans aside de histoire vue index modifie pour le script , controller Cms ajout dans le code, layout/cms style )
260503-001
- [ ] intégrer features mots
    - css
    - js , import , init, window
 -->

<?= $this->section('head') ?>
    <!-- on importe ou on emploie ici la vue plutot que le template -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

    <!-- -------------------------------  leaflet ------------------------------------  -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <link rel="stylesheet" href="/assets/css/GpPluginLeaflet.css"/>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-tilelayer-wmts@1.0.0/dist/leaflet-tilelayer-wmts.js"></script>
    <!-- Extension Géoplateforme pour Leaflet -->
    <script src="/assets/js/plugins/GpPluginLeaflet.js"></script>

    <!-- -------------------------------  threejs ------------------------------------  -->
    <script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
    }
    </script>



    <script type="module">
        import { bus } from '/assets/js/core/eventBus.js'
        import { initSidebar } from '/assets/js/ihm/sidebar.js'
        import { initTabs } from '/assets/js/ihm/tabspage.js'
        import * as domhelper from '/assets/js/core/domhelper.js'

        import { probeClientCapabilities } from '/assets/js/core/clientinfo.js'
        /**
         * Sonde les capacités du navigateur et les publie sur le bus ('client:info').
         * Utile pour les décisions d'interface que le CSS ne peut pas prendre
         * (présence du tactile, permissions, speech synthesis, connexion réseau, etc.)
         *
         * Usage dans index.php :
         *   import { probeClientCapabilities } from '/assets/js/core/clientinfo.js'
         *   const info = await probeClientCapabilities()
         */        
        
        import { initCallout } from '/assets/js/ihm/callout.js'
        import { initWysedit } from '/assets/js/ihm/wysedit.js'
        //260503-001
        //import { initMotForm } from '/assets/js/features/mot/mot.form.js'  
        //import { initMotController } from '/assets/js/features/mot/mot.controller.js'  
        //import { initMotRenderer } from '/assets/js/features/mot/mot.renderer.js'  
        
        // ── Features — un import par feature ────────────────────────────────
        //2026-05-09-004
        import { 
                initMotController,
                initMotRenderer,
                initMotForm } from '/assets/js/features/mot/index.js'
        
        // image
        import { initImageController, initImageRenderer, initImageForm } from '/assets/js/features/image/index.js'

        // formejuridique
        import { initFjController, initFjRenderer, initFjForm } from '/assets/js/features/formejuridique/index.js'
        // code NAF
        import { initNafController, initNafRenderer, initNafForm } from '/assets/js/features/codenaf/index.js'
        
        // adresse / typevoie
        import { initTvController, initTvRenderer, initTvForm } from '/assets/js/features/typevoie/index.js'
        // adresse /codepostal
        import { initCpController, initCpRenderer, initCpForm } from '/assets/js/features/codepostal/index.js'
        // adresse
        import { initAdresseController, initAdresseRenderer, initAdresseForm } from '/assets/js/features/adresse/index.js'

        //20260510-001 PCG
        import { initPcgController, initPcgRenderer } from '/assets/js/features/pcg/index.js'
        // organisation
        import { initOrgController, initOrgRenderer, initOrgForm } from '/assets/js/features/organisation/index.js'
        // entreprise
        import { initEntController, initEntRenderer, initEntForm } from '/assets/js/features/entreprise/index.js'
        
        import { initAuthController, initAuthRenderer }  from '/assets/js/features/auth/index.js'        

        import { initVoxBus } from '/assets/js/core/vox.js'
        // 2026-05-16
        import { initVoxRenderer } from '/assets/js/core/vox.renderer.js'
        import { initVoxListen } from '/assets/js/core/vox.listen.js'
        import { initSceneBg }     from '/assets/js/ihm/cp_scene_bg.js'

        
        /* --------------  COMPONENTS -----------------------------------------*/
        //import { initCodeVal } from '/assets/js/ihm/codeval.js'
        // modif controller necessaire = faite
        import { initCodeVal } from '/assets/js/components/codeval.js'
        //import { initApex } from '/assets/js/plugins/apex.js'
        // modif controller necessaire = en cours
        import { initApex } from '/assets/js/components/apex.js'
        
        //import mermaid from '/assets/js/plugins/mermaid.js'
        import { initMermaid } from '/assets/js/components/mermaid.js'

        /* --------------  COMPONENTS -----------------------------------------*/

        import { initCarousel } from '/assets/js/ihm/carousel.js'        
        // ── Leafleet ──────────────────────────────────────────────────────
        import { initLeaflet } from '/assets/js/plugins/mapleaflet.js'
        // ── Leafleet ──────────────────────────────────────────────────────
        import { initThreejs } from '/assets/js/ihm/3js.js'
        //----     Dialog
        import { initDialog } from '/assets/js/ihm/dialog.js'
        import { initForms } from '/assets/js/ihm/formsManager.js'


        // ── Globals bus ──────────────────────────────────────────────────────
        //260503-001
        window.validateForm = (evt) => {
            //evt.preventDefault()
            bus.publish('forms:submit', evt)
            return false
        }

        window.eventBusPublish= (evt , EvtName  , Page )=> {
            bus.publish( EvtName, Page )
        }
        //window.testLeafelt = initLeaflet

        //--------------------------------------------
        // Threejs a utiliser **eventBusPublish**
        window.threeList = () => { bus.publish('threejs:list') }
        window.threeStart = (id ) => { bus.publish('threejs:start', id ) }
        window.threeStop = (id ) => { bus.publish('threejs:stop', id )  }

        //--------------------------------------------
        // dialog
        window.showModal = (id) => bus.publish('dialog:show', id)
        window.closeModal = (id) => bus.publish('dialog:close', id)


        // ── DOM ready ────────────────────────────────────────────────────────

        document.addEventListener("DOMContentLoaded", function () {
            initSidebar()
            initTabs()
            domhelper.init()
            initCallout()
            initWysedit()
            initCodeVal()
            initApex()
            initMermaid()
            initCarousel()
            initDialog()
            initForms()
        })

        window.addEventListener('load', () => {
            probeClientCapabilities()
            
            // Auth — en premier, les autres features en dépendent
            initAuthController()
            initAuthRenderer()
            
            //déclenche la vérification au démarrage            
            bus.publish('auth:check')

            // Features métier
            initMotForm() ; initMotController(); initMotRenderer() //mot

            initNafForm() ; initNafController() ; initNafRenderer() // code NAF

            initPcgController(); initPcgRenderer() // plan comptable général
            
            initImageForm() ; initImageController() ; initImageRenderer()
            
            initFjForm() ; initFjController(); initFjRenderer() // forme juridique des entreprises et organisation

            initOrgForm(); initOrgController();  initOrgRenderer() //organisation
            initEntForm();  initEntController();  initEntRenderer() // entreprise            
            
            initTvForm() ; initTvController() ; initTvRenderer() // adresse / typevoie
            initCpForm() ; initCpController() ; initCpRenderer() // adresse / codepostal
            initAdresseForm() ; initAdresseController() ; initAdresseRenderer()// adresse


            bus.publish('carousel:glen', '1') // Longueur d'un carousel (debug) voir js/ihm/carousel/CarouselManager.js
            bus.publish('carousel:run', '1')
            //bus.publish('carousel:run', '2')
            //bus.publish('carousel:run:all')
            //bus.publish('carousel:stop' , '2') // a tester avec bouton
            //bus.publish('carousel:colmin','1') // ??
            initVoxBus()
            initVoxRenderer()   // ← rendu UI vox (highlights, acteurs, voix)
            initVoxListen()
            initSceneBg()       // ← fond SVG animé pour .cp_scene
            
            initLeaflet()

            initThreejs()

            // ── Test autocomplete ────────────────────────────────────────────────
            const acField = document.getElementById('acTestField')
            if (acField) {
                const ac = domhelper.autocomplete({
                    id          : 'acMot',
                    name        : 'mot_id',
                    placeholder : 'Rechercher un mot…',
                    busRequest  : 'mot:ui:like',
                    busResponse : 'mot:ui:response',
                    labelKey    : 'mot_lbl',
                    valueKey    : 'mot_id',
                    onSelect    : (item) => {
                        document.getElementById('acTestValue').textContent = item.mot_lbl
                        document.getElementById('acTestId').textContent    = item.mot_id
                    }
                })
                acField.appendChild(ac.wrapper)
            }


        })

    </script>            
<?= $this->endSection() ?>




<!-- ========================= NAV ========================= -->
<?= $this->section('nav') ?>

    <nav id="sidebar">

        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">
            &times;
        </a>

                
    </nav>

<?= $this->endSection() ?>





<?= $this->section('header') ?>
    <header>
        <div class="header-top">
 
            <!-- Bouton hamburger — ouvre la nav mobile -->
            <button class="rwdnav" onclick="openNav()" aria-label="Ouvrir le menu">
                <i class="fa fa-bars" aria-hidden="true"></i>
            </button>
 
            <div class="header-titles">
                <h1><?= esc($title) ?></h1>
                <p><?= esc($intro) ?></p>
            </div>
 
            <!-- Zone authentification -->
            <div class="header-auth">
                <?php if (auth()->loggedIn()): ?>
                    <span class="auth-username">
                        <i class="fa fa-fw fa-user-circle-o" aria-hidden="true"></i>
                        <?= esc(auth()->user()->username) ?>
                    </span>
                    <a class="auth-link" href="/user">
                        <i class="fa fa-fw fa-th-large" aria-hidden="true"></i>
                        <span>Board</span>
                    </a>
                    <a class="auth-link" href="/admin">
                        <i class="fa fa-fw fa-cog" aria-hidden="true"></i>
                        <span>Admin</span>
                    </a>
                    <a class="auth-link auth-logout" href="/logout">
                        <i class="fa fa-fw fa-sign-out" aria-hidden="true"></i>
                        <span>Logout</span>
                    </a>
                <?php else: ?>
                    <form class="auth-form" action="/login" method="post">
                        <?= csrf_field() ?>
                        <label class="sr-only" for="auth-email">Email</label>
                        <input id="auth-email" type="email" name="email"
                               placeholder="Email" autocomplete="username">
                        <label class="sr-only" for="auth-password">Mot de passe</label>
                        <input id="auth-password" type="password" name="password"
                               placeholder="Mot de passe" autocomplete="current-password">
                        <button type="submit">
                            <i class="fa fa-fw fa-sign-in" aria-hidden="true"></i>
                            <span>Login</span>
                        </button>
                    </form>
                <?php endif; ?>
            </div>
 
        </div>
    </header>    
<?= $this->endSection() ?>


<?= $this->section('main') ?>
    
    <main>

        <?php foreach ($articles as $artIdx => $article): ?>
        <!-- ── Article : <?= esc($article['title']) ?> ── -->
        <article
            id="tab<?= $article['id'] ?>"
            class="cp_soft-card"
            <?= $artIdx === 0 ? 'style="display: block;"' : '' ?>
        >
            <header>
                <h1><?= esc($article['title']) ?></h1>
                <p><?= esc($article['intro'] ?? '') ?></p>
                <div id="tab<?= $article['id'] ?>_menu"></div>
            </header>

            <?php foreach ($article['sections'] as $section): ?>
            <section>
                <h2><?= esc($section['title']) ?></h2>
                <?php foreach ($section['parts'] as $part): ?>
                    <div>
                        <div>
                            <h3><?= esc($part['title']) ?></h3>
                            <?= $part['content'] /* HTML autorisé : pas de esc() */ ?>			
                        </div>
                        <?php if (!empty($part['aside'])): ?>
                            <aside>
                                <?= $part['aside'] ?>
                            </aside>	            
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </section>
            <?php endforeach; ?>

        </article>
        <?php endforeach; ?>

        <?= view('cms/components/cp_edit' , ['articles' => $articles] ) ?>
    </main>


<?= $this->endSection() ?>


<?= $this->section('footer') ?>
    <footer>
        En cours de modification version 0.4 - CodeIgniter 4.7
    </footer>


    <dialog id="DIALOG_1" class="cp_dialog">
        <button autofocus onclick="closeModal('DIALOG_1')">Fermer</button>
        <p>Cette boîte de dialogue modale a un arrière-plan festif&nbsp;!</p>
    </dialog>

    <dialog id="DIALOG_2" class="cp_dialog">
        <button autofocus onclick="closeModal('DIALOG_2')">Fermer</button>
        <p>Cette seconde boîte de dialogue modale n'est pas indépendante&nbsp;</p>
        <form id="form10" class="form_style1"  onsubmit="return validateForm(this)">

            <label>First Name</label>
            <input type="text" name="firstname" value="" pattern="[a-zA-Z]{2,50}" placeholder="Saisir le prénom" required minlength="2" maxlength="50"/>

            <label>Last Name</label>
            <input type="text" name="lastname" placeholder="Your last name..">

            <label>Country</label>
            <select name="country">
            <option value="australia">Australia</option>
            <option value="canada">Canada</option>
            <option value="usa">USA</option>
            </select>
            
            <textarea name="message">Some text...</textarea>
            
            <input type="submit" value="Submit">

        </form>        
    </dialog>

<?= $this->endSection() ?>
