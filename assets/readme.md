

# ressources serveur : (/public)

[`assets/ressources.md`](/assets/ressources.md)




# Travaux

## méthode
- chaque fichier employé est listé dans une note annexe [/assets/ressources.md](/assets/ressources.md)
- chaque fonction importé doit être répertorié et expliqué si besoin
- lister les ressources serveur : (/public) voir [/assets/readme.md](/assets/readme.md)

## en cours

repértorier besoin ui 
- voir [améliorations](#besoin_ui)

# Intégration
intégration des composants dans [https://zealot.fr/ui.html](https://zealot.fr/ui.html)




## wysedit
- [ ] [wysedit.js](/assets/js/components/wysedit_js.md) 

```js
import { initWysedit } from '/assets/js/ihm/wysedit.js'
```
## vox

- [X] vox
- [X] cp_scene_bg
voir https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/COMPOSANTS/vox.md

```js
//2026-09-23-001 ajout de vox
import { initVoxBus } from '/assets/js/core/vox.js'
import { initVoxRenderer } from '/assets/js/core/vox.renderer.js'
```

```js
//2026-09-23-002 ajout de vox
import { initSceneBg }     from '/assets/js/ihm/cp_scene_bg.js'
```

Le fichier de vue génère l'HTML suivant (exemple) :

```html
<div class="vox-component" data-lang="<?= $lang ?>" data-rate="<?= $rate ?>"
     data-pitch="<?= $pitch ?>" data-volume="<?= $volume ?>">
  <textarea id="VOX_TEXT" style="display:none;"><?= esc($text) ?></textarea>
  <div id="<?= esc($statusId) ?>" class="vox-status">—</div>
  <button class="vox-play-btn" onclick="window.eventBusPublish(event,'vox:start',
        { targetId:'VOX_TEXT', statusId:'<?= esc($statusId) ?>' })">
    ▶ Écouter
  </button>
</div>
```
On garde :
- un <textarea> caché (display:none) contenant le texte (pour qu'il soit présent dans le DOM)
- un <div> avec l'id=$statusId pour afficher le retour de Vox (initialement un tiret « — »)
- Un bouton Écouter qui publie vox:start sur le bus, ciblant VOX_TEXT et statusId.

Cette vue minimale permet au JS client de fonctionner comme avant. 

on stylise ou classe les éléments selon besoin (CSS vox-component, vox-status etc.). 

Si le texte doit être indexé pour le SEO, on peut également le placer en clair dans la page
```html
<section>
     <h2 id="tab9--composant-vox">Composant vox</h2>
     <div>
          <div>
             <h3 id="tab9--synthse-vocale-event-bus">Synthèse vocale (event bus)</h3>
             <textarea class="cp_voxzone_textarea" id="TXT_VOX_1" rows="8">
               Juliette: Bonjour, je suis Juliette.
               Romeo: Bonjour, je suis Roméo.
             </textarea>
             <br><br>	
             <div id="VOX_STATUS">—</div>			
          </div>
          <aside>
               <button onclick="window.eventBusPublish(event, 'vox:speak', { targetId:'TXT_VOX_1', statusId:'VOX_STATUS' })">Lire</button>
               <button onclick="window.eventBusPublish(event,'vox:pause')">Pause</button>
               <button onclick="window.eventBusPublish( event, 'vox:resume' )">Resume</button>
               <button onclick="window.eventBusPublish( event, 'vox:stop' )">Stop</button>
               <br><br>
               <label>Rate</label><input type="range" min="0.5" max="2" step="0.1" value="0.9" onchange="window.eventBusPublish( event, 'vox:rate',{value:this.value})">	
               <br><br>
               <label>Volume</label><input type="range" min="0" max="1" step="0.1" value="1" onchange="window.eventBusPublish( event,'vox:volume',{ value:this.value })">	
               <br><br>
               <button onclick="window.eventBusPublish( event,'vox:getVoices')">Configurer les voix</button>
               <h3 id="tab9--voix-disponibles">Voix disponibles</h3>  
               <div id="VOX_VOICES_LIST"></div>
          </aside>	            
     </div>
</section>
```


| Fichier/Source | Responsabilité | État actuel | Nouveau livrable |
|---|---|---|---|
| Cms.php (article Vox) | Prototype de dialogue vocal et contrôles UI | Texte en dur, boutons JS | Vu comme référence, ne sera plus utilisé directement |
| old/public/js/core/vox.js | Logique de synthèse : parse, queue, utterance | Ancien module monolithique | Réinjectée partiellement dans JS modernisé |
| old/public/js/core/vox.renderer.js | Mise à jour du DOM (statu texte, surlignage) | Existant, réutilisable | Migré et adapté |
| old/public/js/core/vox.listen.js | Reconnaissance vocale | Indépendant | Documenté, peut être réutilisé ultérieurement |
| app/Views/components/vox.php | À créer : template HTML du composant | — | HTML du composant (textarea caché, div status, bouton) |
| VoxRenderer.php | À créer : classe Renderer côté serveur | — | Lit le descriptor, rend la vue vox.php |
| ComponentRegistry | Enregistrement du composant | Contient (probablement) référence | Ajouter l'entrée 'vox'=>VoxComponent |





# template html
on definit le template html

a modifier 
- div class="panel-card" data-index="0"
- h2 class="panel-title" TITRE


```html
<!-- ====  0 - COMPOSANTS JAVASCRIPT ===================== -->
<div class="panel-card" data-index="0">

    <h2 class="panel-title">Composants javascipt</h2>

    <p class="panel-description"></p>

    <div class="section-tab">
        <div class="tab-headers"></div>

        <div id="mermaid-0" class="tab-content active">
            <h3>Mermaid</h3>
                <p></p>

                <h4>test-0</h4>
                <div id="mermaid_grf1"></div>                    
        </div>

        <div id="apex-0" class="tab-content">
            <h3>Apex</h3>
                <p></p>
            
                <h4>line</h4>
                <div id="APEX_LIGNE_1" class="cp_apex" data-chart="line"></div>

        </div>
    
    </div>

</div>
```





# Améliorations
## employer balises : H1/H2/H3

Pour créer un lien d'ancrage ciblant un élément `<h1>` 
- attribuez un id unique à la balise `<h1>` (ou au conteneur `<div>`) 
- utilisez un lien hypertexte avec un hachereau `#` suivi de cet identifiant. 

Exemple de code :

```html
<a href="#section-titre">Aller au titre</a>

<div>
  <h1 id="section-titre">Mon Titre</h1>
</div>
```

## besoin_ui
- icone

- api workbench


# terminé

## interface ui (base)

## intégration composants
- [apex](/assets/js/components/apex_js.md)
- [codeval](/assets/js/components/apex_js.md)
- [codeval et apex](/assets/js/components/codeval_js.md#interaction)
- [mermaid](/assets/js/components/mermaid_js.md)
- [callout](/assets/js/components/callout_js.md)
- [leaflet](/assets/js/components/leaflet_js.md)

## intégration workbench
- [X] [auth](/assets/js/auth.md)
- [X] [AdresseWorkbench.js](/assets/js/ui/workbench/adresse/AdresseWorkbench_js.md)

