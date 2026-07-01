<!DOCTYPE html>
<html>
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>
            <?= $this->renderSection('title') ?>
        </title>    

        <link 
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        >        
        
        <style type="text/css">
            /* ------------------------------------------------------------ 
            260502-001 : intégration cp_callout
            */
            
            /* Define variablesfor STRUCTURAL and  THEMING*/
            :root{
                --struct-header-h   : 8vh;
                --struct-main-h     : 84vh;
                --struct-footer-h   : 8vh;
                --struct-tab-h      : 80vh;

                --fontsize          : 18px;

                --bgcolor: lightblue;
                --textcolor: darkblue;
                --col-A : #eee236ff;
                --col-B : #ade456ff;
                --col-C : #efefef;
                --col-D : #000000;
                --col-E:  #ffffff;
                /* voir callout */
                --col-danger    :   #f01313ff; ;
                --col-info      :   #0000ff;; 
                --col-note      :   #0b9d14;
                --col-warning   :   #f79503ff;            
            }
            /* RESET CSS  ========================================== */
            * {
                box-sizing      :   border-box;
                margin          :   0;
            }
            body, html {
                min-height      :   100%; 
                margin          :   0;
                padding         :   0;
            }
            /* STRUCTURAL CSS  ========================================== */
            /* RWD MOBILE FIRST 
            chaque composant a sa regle rwd
            ========================================== */
            body{
                display         :   flex;
                flex-direction  :   column;
                min-height      :   100%;
                font-size       :   var(--fontsize);
            }
            /* ------------------------------------------------------------ */
            nav {
                position: fixed;
                inset: 0;
                transform: translateX(-100%);
                transition: transform .3s ease;
                display: flex;
                flex-direction: column;
                z-index: 2;
                overflow-y: auto;          /* FIX : scroll quand le TOC est long */
                overflow-x: hidden;
                background-color: var(--col-A);
            }

            nav.open {
                transform: translateX(0);
            }

            /* Lien de fermeture */
            nav a.closebtn {
                float: none;
                align-self: flex-end;
                font-size: 2rem;
                padding: 8px 16px;
                line-height: 1;
            }

            /* ── Entrée article ─────────────────────────────────────────────── */

            .nav-article {
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            /* Ligne [titre] [chevron] */
            .nav-header-row {
                display: flex;
                align-items: stretch;
                width: 100%;
            }

            /* Lien titre : prend tout l'espace dispo */
            .nav-article .nav-title {
                flex: 1 1 auto;
                padding: 12px 16px;
                text-decoration: none;
                font-size: 17px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* Bouton chevron accordion (mobile) */
            .nav-article .nav-toggle {
                flex: 0 0 auto;
                background: transparent;
                border: none;
                color: inherit;
                font-size: 0.75rem;
                padding: 0 14px;
                cursor: pointer;
                transition: transform 0.25s ease;
                line-height: 1;
            }
            .nav-article.open .nav-toggle {
                transform: rotate(90deg);
            }

            /* TOC : masqué par défaut, déroulé avec .open */
            .nav-article .nav-toc {
                display: none;
                padding: 0;
                margin: 0;
                list-style: none;
            }
            .nav-article.open .nav-toc {
                display: block;
            }

            /* Liens dans le TOC mobile */
            .nav-article .nav-toc a {
                display: block;
                padding: 6px 16px 6px 24px;
                font-size: 0.9em;
                text-decoration: none;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .nav-article .nav-toc ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }
            /* h3 */
            .nav-article .nav-toc ul a       { padding-left: 36px; font-size: 0.85em; }
            /* h4 */
            .nav-article .nav-toc ul ul a    { padding-left: 50px; font-size: 0.8em;  opacity: 0.85; }




            /* 2026-04-30
            PATCH CSS 
            * 1. header

            */
            
            /* ─── 1.  header  */
            header {
                position: relative;
                overflow: visible;          /* était hidden — doit laisser le dropdown auth dépasser */
                padding: 0;
                margin: 0;
                min-height: var(--struct-header-h);
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            /* Ligne principale du header : [hamburger] [titres] [auth] */
            .header-top {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 0 12px;
                min-height: var(--struct-header-h);
                width: 100%;
            }
            /* Titres au centre, flex grow */
            .header-titles {
                flex: 1 1 auto;
                min-width: 0;               /* permet le text-overflow sur les petits écrans */
            }
            
            .header-titles h1 {
                font-size: clamp(1rem, 3vw, 1.6rem);
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .header-titles p {
                margin: 0;
                font-size: 0.8em;
                opacity: 0.8;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            /* ─── 2. Bouton hamburger */
            .rwdnav {
                flex: 0 0 auto;
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: 1.6rem;
                padding: 6px 10px;
                line-height: 1;
                /* couleurs héritées du header */
                color: inherit;
            }
            
            .rwdnav:focus-visible {
                outline: 2px solid currentColor;
                border-radius: 4px;
            }
            
            /* Masqué sur PC (breakpoint identique à celui de sidebar.js) */
            @media (min-width: 768px) {
                .rwdnav { display: none; }
            }

            /*
            * ─── 3. Zone authentification dans le header ─────────────────────────────────
            */

            .header-auth {
                flex: 0 0 auto;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.85rem;
                /* color : var(--col-A) */
            }
            
            /* Pseudo-classe d'accessibilité : masquer les labels visuellement */
            .sr-only {
                position: absolute;
                width: 1px; height: 1px;
                padding: 0; margin: -1px;
                overflow: hidden;
                clip: rect(0,0,0,0);
                white-space: nowrap;
                border: 0;
            }
            
            /* ── Connecté ── */
            .auth-username {
                display: flex;
                align-items: center;
                gap: 4px;
                font-weight: 600;
                white-space: nowrap;
            }
            
            .auth-link {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                text-decoration: none;
                border-radius: 4px;
                white-space: nowrap;
                transition: opacity 0.2s;
            }
            .auth-link:hover { opacity: 0.75; }
            
            /* Sur mobile : masquer le texte, ne garder que l'icône */
            @media (max-width: 767px) {
                .auth-link span, .auth-username { display: none; }
                .auth-link { padding: 4px 6px; }
            }
            
            /* ── Formulaire de connexion ── */
            .auth-form {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-wrap: wrap;
            }
            
            .auth-form input {
                padding: 4px 8px;
                border: 1px solid rgba(255,255,255,0.4);
                border-radius: 4px;
                font-size: 0.85rem;
                background: rgba(255,255,255,0.15);
                color: inherit;
                min-width: 0;
                width: 130px;
            }
            
            .auth-form input::placeholder { opacity: 0.6; }
            
            .auth-form button {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 5px 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85rem;
                white-space: nowrap;
            }
            
            /* Sur mobile : champs et label cachés, seul le bouton icône reste */
            @media (max-width: 767px) {
                .auth-form input { display: none; }
                .auth-form button span { display: none; }
                .auth-form button { padding: 6px 8px; }
            }

            /* ------------------------------------------------------------ */
            main{
                flex            :   1   ;
                min-height      : var( --struct-main-h );
                width: 100%;            
            }
            /*  ARTICLES / SECTION   ---------  */
            article{  
                /*padding: 10px 20px;*/
                min-height: var( --struct-tab-h );
                display: none;                            
            }

            article > section > div{ 
                display         : flex;
                flex-direction  : column;  
            }
            article > section > div > aside {
                flex            : 1 1 auto;
                width           : 100%;
            }            
            /* ------------------------------------------------------------ */
            footer{
                min-height      : var( --struct-footer-h );
                width           : 100%;
            }
            







            /* COMPOSANTS ==========================================        */
            /*  decorateur ARTICLE Onglet tabs     ------------------------ */
            .cp_soft-card {
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                transition: transform 0.3s ease;
            }



            /* ══════════════════════════════════════════════════════════════════
                Composants CSS pour le module mot (et réutilisables ailleurs)
                Structure séparée du theming — RWD inclus dans chaque bloc cp_
            
                Sections :
                1. cp_module_container + cp_panel_*
                2. cp_btn
                3. cp_form  (motForm / motEditForm)
                4. cp_detail
                5. cp_form_actions
                6. cp_table          (déjà défini dans cms.php — référence)
                7. cp_pagination     (déjà défini dans cms.php — référence)
            ══════════════════════════════════════════════════════════════════ */
            
            /*            1. CONTENEUR PRINCIPAL + PANELS

                Structure :
                #motContainer (.cp_module_container)
                    #motButtonPanel     (.cp_panel_buttons)
                    #motFormPanel       (.cp_panel_form)
                    #motDetailPanel     (.cp_panel_detail)
                    #motTablePanel      (.cp_panel_table)
                    #motPaginationPanel (.cp_panel_pagination)
            */
            
            .cp_module_container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
            }
            
            /* --- Barre de boutons --- */
            .cp_panel_buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                padding: 6px 0;
            }
            
            /* --- Zone formulaire (recherche ou édition) --- */
            .cp_panel_form {
                padding: 10px 0;
            }
            
            /* --- Zone détail --- */
            .cp_panel_detail {
                padding: 10px 0;
            }
            
            /* --- Zone tableau --- */
            .cp_panel_table {
                overflow-x: auto;      /* scroll horizontal sur mobile */
                width: 100%;
            }
            
            /* --- Zone pagination --- */
            .cp_panel_pagination {
                padding: 4px 0;
            }
            
            
            /* ══════════════════════════════════════════════════════════════════
            2. BOUTONS  cp_btn
            ══════════════════════════════════════════════════════════════════ */
            
            /* ── STRUCTURE ── */
            .cp_btn {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 6px 12px;
                border: 1px solid transparent;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.875rem;
                line-height: 1.4;
                white-space: nowrap;
                transition: opacity 0.15s ease, background-color 0.15s ease;
            }
            
            .cp_btn:disabled {
                opacity: 0.45;
                cursor: not-allowed;
                pointer-events: none;
            }
            
            /* Icône tabler (ti) dans un bouton */
            .cp_btn .ti {
                font-size: 1em;
                flex-shrink: 0;
            }
            
            /* ── RWD : boutons pleine largeur sur très petit écran ── */
            @media (max-width: 480px) {
                .cp_panel_buttons {
                    flex-direction: column;
                }
                .cp_btn {
                    width: 100%;
                    justify-content: center;
                }
            }
            
            /* ── THEMING ── */
            .cp_btn {
                background-color: #e9e9e9;
                border-color: #bbb;
                color: #333;
            }
            .cp_btn:hover:not(:disabled) {
                background-color: #d5d5d5;
            }
            
            .cp_btn--primary {
                background-color: #0057b8;
                border-color: #004499;
                color: #fff;
            }
            .cp_btn--primary:hover:not(:disabled) {
                background-color: #004499;
            }
            
            .cp_btn--danger {
                background-color: #c0392b;
                border-color: #922b21;
                color: #fff;
            }
            .cp_btn--danger:hover:not(:disabled) {
                background-color: #922b21;
            }
            
            
            /* ══════════════════════════════════════════════════════════════════
            3. FORMULAIRES  cp_form  (motForm & motEditForm)
            ══════════════════════════════════════════════════════════════════
            On étend le style existant form.form_style1 avec une variante
            légère pour les formulaires générés dynamiquement.
            Les id #motForm / #motEditForm peuvent hériter de .cp_form ou
            de form.form_style1 selon le rendu HTML.
            */
            
            /* Conteneur générique pour les formulaires de composants */
            .cp_form,
            #motForm,
            #motEditForm {
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 12px;
                border-radius: 5px;
                width: 100%;
                box-sizing: border-box;
            }
            
            /* Labels */
            .cp_form label,
            #motForm label,
            #motEditForm label {
                font-size: 0.85rem;
                font-weight: 600;
                margin-bottom: 2px;
            }
            
            /* Champs texte / number */
            .cp_form input[type="text"],
            .cp_form input[type="number"],
            .cp_form input[type="email"],
            #motForm input[type="text"],
            #motForm input[type="number"],
            #motEditForm input[type="text"],
            #motEditForm input[type="number"],
            #motEditForm input[type="hidden"] + input {
                width: 100%;
                padding: 7px 10px;
                border: 1px solid #aaa;
                border-radius: 4px;
                font-size: 0.9rem;
                box-sizing: border-box;
                transition: border-color 0.2s ease;
            }
            
            .cp_form input:focus,
            #motForm input:focus,
            #motEditForm input:focus {
                outline: none;
                border-color: #0057b8;
                box-shadow: 0 0 0 2px rgba(0, 87, 184, 0.2);
            }
            
            .cp_form input:invalid,
            #motForm input:invalid,
            #motEditForm input:invalid {
                border-color: #c0392b;
            }
            
            /* ── RWD formulaire ── */
            @media (min-width: 480px) {
                /* Sur tablette/PC on peut passer en grille label + champ côte à côte */
                .cp_form {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    align-items: center;
                    column-gap: 12px;
                }
                /* Les actions (boutons) et les hidden fields occupent toute la largeur */
                .cp_form_actions,
                .cp_form input[type="hidden"],
                .cp_form button[type="submit"] {
                    grid-column: 1 / -1;
                }
            }
            
            /* ── THEMING formulaire ── */
            .cp_form,
            #motForm,
            #motEditForm {
                background-color: #f7f7f7;
                border: 1px solid #ddd;
            }
            
            .cp_form input[type="text"],
            .cp_form input[type="number"],
            #motForm input,
            #motEditForm input {
                background-color: #fff;
                color: #222;
            }
            
            
            /* ══════════════════════════════════════════════════════════════════
            4. DETAIL  cp_detail  (renderDetail)
            ══════════════════════════════════════════════════════════════════ */
            
            /* ── STRUCTURE ── */
            .cp_detail {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 4px 16px;
                padding: 10px 12px;
                border-radius: 5px;
                width: 100%;
                box-sizing: border-box;
            }
            
            .cp_detail dt {
                font-weight: 600;
                font-size: 0.85rem;
                padding: 4px 0;
                white-space: nowrap;
            }
            
            .cp_detail dd {
                margin: 0;
                padding: 4px 0;
                font-size: 0.9rem;
                word-break: break-word;
            }
            
            /* ── THEMING ── */
            .cp_detail {
                background-color: #f0f4ff;
                border: 1px solid #c0d0ee;
                color: #1a2a4a;
            }
            
            .cp_detail dt {
                color: #0057b8;
            }
            
            
            /* ══════════════════════════════════════════════════════════════════
            5. ACTIONS DE FORMULAIRE  cp_form_actions
            ══════════════════════════════════════════════════════════════════ */
            
            .cp_form_actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding-top: 8px;
                border-top: 1px solid #ddd;
                margin-top: 6px;
            }
            
            /* ── RWD : alignement à droite sur PC ── */
            @media (min-width: 480px) {
                .cp_form_actions {
                    justify-content: flex-end;
                }
            }
            
            
            /* ══════════════════════════════════════════════════════════════════
            6. TABLEAU  cp_table 
            ══════════════════════════════════════════════════════════════════
                cp_table
                260503-001 : intégration
            */
            .cp_table {  
                width: 100%;  
                border-collapse: collapse;  
                margin-top: 10px;  
            }  
            
            .cp_table th, .cp_table td {  
                border: 1px solid #ccc;  
                padding: 6px 10px;  
                text-align: left;  
            }  
            
            .cp_table th {  
                background: #f5f5f5;  
            }  
            
            .cp_table tr:hover {  
                background: #fafafa;  
            }  

            .cp_panel_table .cp_table tr.selected td {
                background-color: #dce8ff;
            }
            
            .cp_panel_table .cp_table tbody tr {
                cursor: pointer;
            }


            /* pagination pour tableau            */
            /*
            2026-05-03-002

            .cp_pagination {  
                margin-top: 10px;  
            }  
            */
            .cp_page_btn {  
                margin: 2px;  
                padding: 5px 10px;  
                cursor: pointer;  
            }  
            
            .cp_page_btn.active {  
                font-weight: bold;  
                background: #ddd;  
            }


            .cp_pagination        { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
            .cp_pagination_info   { padding: 4px 10px; font-size: 0.9rem; }
            .cp_pagination_ellipsis { padding: 4px 6px; color: #888; }
            .cp_notice            { padding: 12px; border-radius: 4px; font-size: 0.9rem; margin: 6px 0; }
            .cp_notice--loading   { background: #f0f4ff; color: #0057b8; }
            .cp_notice--error     { background: #fdd8d0; color: #c0392b; }
            .cp_notice--empty     { background: #f5f5f5; color: #666;    }


            /*-------------------------------------
            cp_ac autocmplete
            */
            .cp_ac_wrapper    { position: relative; width: 100%; }
            
            .cp_ac_list       {
                position: absolute;
                z-index: 500;
                top: 100%; left: 0;
                width: 100%;
                margin: 0; padding: 0;
                list-style: none;
                background: #fff;
                border: 1px solid #bbb;
                border-radius: 0 0 4px 4px;
                max-height: 220px;
                overflow-y: auto;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .cp_ac_item       { padding: 7px 12px; cursor: pointer; font-size: 0.9rem; }
            .cp_ac_item:hover,
            .cp_ac_item--focus { background: #eef3ff; color: #0057b8; }



            /* ------------------------------------------------------------ 
                cp_callout
                260502-001 : intégration
            */

            .cp_callout {
                border: 1px solid #5f5e5eff;
                margin: 1rem 0;
                padding: 0;
                border-radius: 5px;
                overflow: hidden;
                display:block;
            }
            .cp_callout .titre {
                padding: 10px;
                cursor: pointer;
                /* display: flex;*/
                justify-content: space-between;
                font-weight: bold;

            }
                /* Callout : titre coloré selon la variante du parent */
            .cp_callout.danger .titre {
                border-bottom    : 5px solid var(--col-danger);
                background-color : var(--col-danger);
                color            : #fdd8d0;
            }
            .cp_callout.danger .titre::before {
                content: '\1F537';
                padding-right: 5%;
            }
            .cp_callout.info .titre {
                border-bottom    : 5px solid var(--col-info);
                background-color : var(--col-info);
                color            : #d0d8fd;
            }
            .cp_callout.note .titre {
                border-bottom    : 5px solid var(--col-note);
                background-color : var(--col-note);
                color            : #d0f0da;
            }
            .cp_callout.warning .titre {
                border-bottom    : 5px solid var(--col-warning);
                background-color : var(--col-warning);
                color            : #fdf3d0;                
            }
            .cp_callout .content {
                display: none;
                padding: 10px;
                background-color    : #fff;
                max-height: 150px; /* Hauteur maximale du conteneur pour éviter que le contenu ne déborde */
                overflow-y: auto; /* Ajoute une barre de défilement si le texte dépasse la hauteur définie */
            } 
            .cp_callout.danger .content {
                background-color : #fdd8d0;
                color            : var(--col-danger);                
            }
            .cp_callout.info .content {
                background-color : #d0d8fd;
                color            : var(--col-info);                

            }
            .cp_callout.note .content {
                background-color : #d0f0da;
                color            : var(--col-note);                

            }
            .cp_callout.warning .content {
                background-color : #fdf3d0;
                color            : var(--col-warning);                

            }

            /*-------------------------------*/
            /* .cp_wysedit_article {
            styles généraux de l'article
            } 
            */

            .cp_wysedit_section {
                margin-bottom: 1em;
            }

            .cp_wysedit_h2 {
            font-size: 1.5em;
            margin-bottom: 0.5em;
            }

            .cp_wysedit_div {
            display: flex;
            gap: 1em;
            }

            .cp_wysedit_content {
            flex: 1;
            border: 1px solid #ccc;
            padding: 0.5em;
            min-height: 100px;
            background-color: #fff;
            }

            .cp_wysedit_aside {
            width: 150px;
            background-color: #f0f0f0;
            padding: 0.5em;
            }

            .cp_wysedit_textarea {
            width: 100%;
            min-height: 150px;
            font-family: monospace;
            font-size: 1em;
            margin-top: 1em;
            }

            .cp_wysedit_view {
            border: 1px solid #ccc;
            padding: 0.5em;
            min-height: 150px;
            background-color: #fafafa;
            }

            /*-------------------------------------------------*/
            .cp_voxzone_textarea {
            width: 100%;
            min-height: 150px;
            font-family: monospace;
            font-size: 1em;
            margin-top: 1em;
            }

            .cp_voxzone_textarea2 {
                background: rgba(255, 255, 255, 0.92);
                font-size: 1.1rem;
                line-height: 1.8;
                border-radius: 6px;
                padding: .8rem;
            }

            /* ---  */
            .cp_rvoxzone_listening{
                background: rgba(0, 0, 0, 0.65);
            }
            /*---*/


            .cp_scene {
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                min-height: 420px;
                background-size: cover;
                background-position: center;
                border-radius: 8px;
                overflow: hidden;
                padding: 1rem;
            }
            .cp_scene::before {
                content: '';
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.45);
                z-index: 0;
            }

            .cp_actor {
                position: relative;
                z-index: 1;
            }
            .cp_actor {
                display: flex;
                flex-direction: column;
                align-items: center;
                max-width: 220px;
            }

            .cp_actor img {
                max-height: 320px;
                object-fit: contain;
                filter: drop-shadow(2px 4px 8px rgba(0,0,0,.7));
            }

            .cp_actor__name {
                color: #fff;
                font-style: italic;
                text-shadow: 1px 1px 4px #000;
                margin-top: .4rem;
            }

            /* flip Juliette pour qu'elle "regarde" Roméo */
            .cp_actor--right img {
                transform: scaleX(-1);
            }
            /* Transition douce sur toutes les propriétés visuelles des acteurs */
            .cp_actor img { transition: filter 0.35s ease; }
            .cp_actor__name { transition: color 0.35s ease, text-shadow 0.35s ease, font-weight 0s; }
            /* ── Acteur en train de parler : géré par vox.renderer.js ─────────────────── */
            /*    bus event vox:start → setActorSpeaking(alias) → toggle .cp_actor--speaking */
            .cp_actor--speaking img {
                filter:
                    drop-shadow(0 0 18px rgba(255, 204, 0, 0.90))
                    drop-shadow(0 0  8px rgba(255, 160, 0, 0.60))
                    drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.70));
            }

            .cp_actor--speaking .cp_actor__name {
                color       : #ffcc00;
                font-weight : bold;
                text-shadow :
                    0 0 10px rgba(255, 204, 0, 0.70),
                    1px 1px 4px #000;
            }            
            .cp_scene__subtitles {
                position: absolute;
                bottom: 1rem;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                text-align: center;
                background: rgba(0, 0, 0, 0.65);
                color: #fff;
                font-size: 1.2rem;
                line-height: 1.8;
                padding: .5rem 1rem;
                border-radius: 6px;
                min-height: 2.5rem;
                z-index: 2;
            }

            /* le mot en cours mis en rouge par vox.js */
            .cp_scene__subtitles span {
                color: #ffcc00;
                font-weight: bold;
            }

            /* carousel ---------------------------------------------------------------- */
            .cp_carousel {
                position: relative;
                width: 100%;
                overflow: hidden;
                border-radius: 6px;
            }

            /* Ratio desktop 16/9 */
            .cp_carousel-ready {
                aspect-ratio: 16 / 9;
            }

            .cp_carousel img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .cp_slide {
                position: absolute;
                inset: 0;
                display: none;
            }

            .cp_slide.active {
                display: block;
            }
            /* leaflet ---------------------------------------------------------------- */
            .leafletContainer{  display: flex;  flex-direction: column; }

            #leafletMap{
                flex: 1 0 auto;
                padding: 5px;
                height: 40vh;
                box-shadow: 0 0 10px #999;
            }

            #leafletInfo{
                flex: 0 1 auto;
                padding: 1vw;
                height: 10vh;
            }


            


            /*---------------------- dialog et forms ---------------------------------------*/
            /* -------------------------------  */
            /* Formulaire */
            form.form_style1 {
            border-radius: 5px;
            background-color: #f2f2f2;
            padding: 20px;
            display:flex;
                flex-wrap: wrap;
            }


            form.form_style1 > label {
            /* display: block; */
            width: 40%;
            padding: 12px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #9be7b4;
            border-radius: 4px;
            box-sizing: border-box;
            }


            form.form_style1 select {
            width: 60%;
            padding: 12px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #9be7b4;
            border-radius: 4px;
            box-sizing: border-box;
            }

            form.form_style1 input[type="text"] , 
            form.form_style1 input[type="email"], 
            form.form_style1 input[type="number"], 
            form.form_style1 input[type="date"],
            form.form_style1 input[type="password"]
            {
            width: 60%;
            padding: 12px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #9be7b4;
            border-radius: 4px;
            box-sizing: border-box;
            }

            form.form_style1 input[type=text]:invalid {
                border: 4px solid #972e3c;
            }

            /* a conserver pour rwd ??
            form.form_style1 input[type="radio"] {
            width: 60%;
            padding: 12px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #9be7b4;
            border-radius: 4px;
            box-sizing: border-box;
            }
            form.form_style1 input[type="radio"]:checked {
            border: 6px solid black;
            box-shadow: 0 0 0 3px orange;

            }
            #form3 > label.radio > input[type=radio]

            #form3 > div.radio > label:nth-child(1)
            */

            div.radio {
            display: inline-flex;
            flex-direction: row;
            width: 100%;
            border: 1px solid #9be7b4;
            }

            div.radio > label{
            flex:1 0 auto;
            padding: 12px;
            /*margin: 8px 0;*/
            border-radius: 4px;
            }

            div.radio  > label > input[type="radio"]:checked {
            border: 6px solid black;
            box-shadow: 0 0 0 3px orange;

            }


            div.checkbox {
            display: inline-flex;
            flex-direction: row;
            width: 100%;
            border: 1px solid #9be7b4;
            }

            div.checkbox > label{
            flex:1 0 auto;
            padding: 12px;
            /*margin: 8px 0;*/
            border-radius: 4px;
            }

            div.checkbox  > label > input[type="checkbox"]:checked {
            border: 6px solid black;
            box-shadow: 0 0 0 3px orange;

            }



            form.form_style1 textarea {
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #9be7b4;
            border-radius: 4px;
            box-sizing: border-box;
            }
            

            form.form_style1 input[type=submit] {
            width: 60%;
            padding: 12px;
            margin: 8px auto;
            display: inline-block;
            border: 1px solid #45a049;;
            background-color: #9be7b4;;
            border-radius: 4px;
            box-sizing: border-box;
            }

            form.form_style1 input[type=submit]:hover {
            background-color: #45a049;
            }


            /*


            input[type=submit] {
            width: 100%;
            background-color: #4CAF50;
            color: white;
            padding: 14px;
            margin: 8px 0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            }


            */



            /* COMPOSANT dialog  */
            /* État ouvert du dialogue */
            dialog:open {
            opacity: 1;
            transform: scaleY(1);
            margin: auto;
            width: 80vw;
            min-height: 40vh;
            }

            /* État fermé du dialogue */
            dialog {
            opacity: 0;
            transform: scaleY(0);
            transition:
                opacity 0.7s ease-out,
                transform 0.7s ease-out,
                overlay 0.7s ease-out allow-discrete,
                display 0.7s ease-out allow-discrete;
            /* Equivalent to
            transition: all 0.7s allow-discrete; */
            }

            /* État avant ouverture */
            /* Doit se trouver après la règle dialog:open précédente pour prendre effet,
                car la spécificité est la même */
            @starting-style {
            dialog:open {
                opacity: 0;
                transform: scaleY(0);
            }
            }

            /* Transition du ::backdrop lorsque la boîte de dialogue modale est promue en couche supérieure */
            dialog::backdrop {
            background-color: transparent;
            transition:
                display 0.7s allow-discrete,
                overlay 0.7s allow-discrete,
                background-color 0.7s;
            /* Equivalent to
            transition: all 0.7s allow-discrete; */
            }

            dialog:open::backdrop {
            background-color: rgb(0 0 0 / 25%);
            }

            /* Cette règle @starting-style ne peut pas être imbriquée dans le sélecteur ci‑dessus
            car le sélecteur imbriqué ne peut pas représenter des pseudo-éléments. */

            @starting-style {
            dialog:open::backdrop {
                background-color: transparent;
            }
            }

            /*----------------------------------------------------------------------------------------*/




            /* RWD ONLY ========================================== */



            @media (min-width: 768px) {
                /* -------------------- nav pc ------------------------------------- */
                /* La nav redevient une barre horizontale */
                nav {
                    position: relative;
                    flex-direction: row;
                    align-items: stretch;
                    width: 100%;
                    transform: translateX(0);
                    overflow: visible;         /* FIX : laisser les dropdowns déborder */
                    z-index: 100;              /* FIX : passer au-dessus de main */
                }

                nav a.closebtn { display: none; }

                /* ── nav-article : cellule de menu ─────────────────────────── */

                .nav-article {
                    position: relative;   /* ancre le dropdown en absolu */
                    flex-direction: row;
                    align-items: stretch;
                }

                /* Pont invisible sous le titre pour éviter le gap de hover     */
                /* Sans lui, la souris quitte .nav-article avant d'atteindre    */
                /* le dropdown (qui est hors flux car position:absolute)         */
                .nav-article::after {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    height: 12px;         /* pont de 12 px entre titre et dropdown */
                    z-index: 101;
                }

                .nav-article .nav-header-row {
                    height: 100%;
                }

                .nav-article .nav-title {
                    white-space: nowrap;
                    height: 100%;
                }

                /* Masquer le chevron sur PC */
                .nav-article .nav-toggle {
                    display: none;
                }

                /* ── Dropdown ──────────────────────────────────────────────── */

                .nav-article .nav-toc {
                    display: none;
                    position: absolute;
                    top: calc(100% + 2px);  /* juste sous la barre, chevauchement avec le pont */
                    left: 0;
                    min-width: 260px;
                    max-height: 75vh;
                    overflow-y: auto;
                    z-index: 200;            /* FIX : au-dessus du header d'article */
                    box-shadow: 0 4px 16px rgba(0,0,0,0.35);
                    /*background-color: var(--col-A);*/
                }

                /* Affichage au survol de n'importe quelle partie de .nav-article */
                .nav-article:hover .nav-toc {
                    display: block;
                }

                /* Annuler la classe .open (gestion mobile) sur PC */
                .nav-article.open .nav-toc {
                    display: none;
                }
                .nav-article.open:hover .nav-toc,
                .nav-article:hover .nav-toc {
                    display: block;
                }

                /* Liens dropdown PC */
                .nav-article .nav-toc a     { padding: 7px 16px; font-size: 0.88em; }
                .nav-article .nav-toc ul a  { padding-left: 30px; }
                .nav-article .nav-toc ul ul a { padding-left: 46px; }

                /* ── article section reste en row sur PC (inchangé) ────────── */
                article > section > div            { flex-direction: row; }
                article > section > div > aside    { flex: 0 0 360px; height: auto; padding: 1vw; }
                article > section > div > div      { flex: 1 1 auto; width: auto; height: auto; padding: 1vw; }


                /* 
                .rwdnav{ display: none; } 
                deplacer dans section en tete sous header
                */

                /* -------------------- article pc ------------------------------------- */
                article > section > div{ 
                    display         : flex;
                    flex-direction  : row;
                }
                article > section > div > aside{
                    flex: 0 0 360px;
                    height: auto;
                    padding: 1vw;    
                }
                article > section > div > div{
                    flex: 1 1 auto;
                    width: auto;
                    height: auto;
                    padding:1vw;  
                }

            }  












            /* THEMING ZONE COLOR ONLY ========================================== */
            /* Use the variables */
            body {
                background-color: var(--bgcolor);
                color: var(--textcolor);
            }
            /* ------------------------------------------------------------
                --bgcolor: lightblue;
                --textcolor: darkblue;
                --col-A : #eee236ff; jaune
                --col-B : #ade456ff; vert
                --col-C : #efefef; gris
                --col-D : #000000; noir
                --col-E:  #ffffff; blanc           
             */

            nav { 
                background-color    :   var( --col-D );/* darkblue */
                color               :   var( --col-A ); 
            }
            nav a { 
                color               :   var(--col-E ); 
            }
            nav a:hover { /* Navbar links on mouse-over */
                background-color    :   var(--col-B);
                color               :   var(--col-D );
            }
            /* Current/active navbar link */
            nav a.active { 
                background-color    :   var(--col-A);
                color               :   var(--textcolor ); 
            }
            
            /* Current/active navbar  */
            /*
            .nav-article .active 
            {
                background-color    :   var(--col-A);
                color               :   var(--textcolor ); 
            }*/

            .nav-article{
                color               :   teal; 
            } 

            /* ------------------------------------------------------------ */
            header{
                background-color: var( --textcolor );
                color: var(--bgcolor); 
            }

            header > h1{  
                color: var( --col-A );
            }

            .header-auth {
                color : var(--col-A)
            }
            
            .auth-link {
                color : var(--col-B)
            }
            /*--------------------------------------------------------------- */
            .nav-article .nav-toc {
                background-color: var(--textcolor);
            }
            /* ------------------------------------------------------------ */        
            article > header > h1 {  
                color: var( --col-C );
            }
            
            article > section > h2::before {
                content: '\1F537';
            }
            article > section > div > div > h3::before {
                content: '\1F4D1';
            }
            article > section > div > div > h4::before {
                content: '\25C8';
            }
            


        </style>
        
        <?= $this->renderSection('head') ?>
        
    </head>

    <body>
        <?= $this->renderSection('header') ?>
        <?= $this->renderSection('nav') ?>
        <?= $this->renderSection('main') ?> 
        <?= $this->renderSection('footer') ?>
        <?= $this->include('cms/components/debug_overlay') ?>
    </body>
    
</html>