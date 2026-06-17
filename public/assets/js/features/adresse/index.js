// js/features/adresse/index.js
export { initAdresseController } from './adresse.controller.js'
export { initAdresseRenderer }   from './adresse.renderer.js'
export { initAdresseForm }       from './adresse.form.js'


/* ================================================================
   SNIPPETS D'INTÉGRATION
   ================================================================

   ── 1. index.php — import ────────────────────────────────────────
   import {
       initAdresseController,
       initAdresseRenderer,
       initAdresseForm
   } from '/assets/js/features/adresse/index.js'


   ── 2. index.php — window.addEventListener('load', ...) ─────────
   initAdresseForm()
   initAdresseController()
   initAdresseRenderer()


   ── 3. Cms.php — article ─────────────────────────────────────────
   [
       'id'    => 17,
       'title' => 'Adresses',
       'intro' => 'Gestion des adresses postales.',
       'sections' => [[
           'id'    => 35,
           'title' => 'Adresses',
           'parts' => [[
               'id'      => 55,
               'title'   => 'Gestion des adresses',
               'content' => '
                   <div id="adresseContainer" class="cp_module_container">
                       <div class="cp_panel_buttons"></div>
                       <div class="cp_panel_form"   style="display:none"></div>
                       <div class="cp_panel_detail" style="display:none"></div>
                       <div class="cp_panel_table"></div>
                       <div class="cp_panel_pagination"></div>
                   </div>',
               'aside' => '
                   <p>FK vers <strong>type_voies</strong> et <strong>codes_postaux</strong>.</p>
                   <p>L\'acheminement, les coordonnées et la ligne 5 sont
                      auto-remplis depuis le code postal sélectionné.</p>'
           ]]
       ]]
   ],


   ── 4. Routes.php (groupe api) ───────────────────────────────────
   $routes->get   ('adresse',        'Api\Adresse::index');
   $routes->get   ('adresse/like',   'Api\Adresse::like');      // ← avant (:num)
   $routes->get   ('adresse/(:num)', 'Api\Adresse::show/$1');
   $routes->post  ('adresse',        'Api\Adresse::create');
   $routes->put   ('adresse/(:num)', 'Api\Adresse::update/$1');
   $routes->delete('adresse/(:num)', 'Api\Adresse::delete/$1');


   ── 5. Enums PHP — copier dans app/Enums/ ────────────────────────
   app/Enums/IndiceRepetition.php
   app/Enums/GeocodePrecision.php
   app/Enums/Charniere.php

   ⚠ Vérifier que PHP >= 8.1 sur OVH (requis pour les enums natifs).
   ================================================================ */
