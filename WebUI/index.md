Le refactoring du projet touche a sa fin.
Pour séparer les parties frontend et backend on utilise le serveur pour
- les pages html, ressources images
- les apis

Trois fichiers sont les piliers de l'évolution 
- [/WebUI/ui.html](/WebUI/ui.html)
- [/WebUI/uiapp.js](/WebUI/uiapp.js) path serveur : (/public) /assets/js/uiapp.js
- [/WebUI/uistyle.css](/WebUI/uistyle.css) path serveur : (/public) /assets/css/uistyle.css

[Orbis](/Orbis/index.md) reste en soutien pour réaliser des jeux de données via d'autres sources

**Important**
On va préparer la version final du repository pour un backup serveur et un nettoyage avant publication

méthode
- chaque fichier employé est listé dans une note annexe [/assets/ressources.md](/assets/ressources.md)
- chaque fonction importé doit être répertorié et expliqué si besoin
  - exemple `/assets/js/uiapp.js` => [/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)


# Travaux
## a faire 
lister les ressources serveur : (/public)
```
/ui.html
/assets/css/uistyle.css
/assets/js/uiapp.js

/assets/js/components/apex.js
  import { initApex } from '/assets/js/components/apex.js'


/assets/js/components/codeval.js
  import { initCodeVal } from '/assets/js/components/codeval.js'
[/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)

/assets/js/components/mermaid.js
  import { initMermaid } from '/assets/js/components/mermaid.js'
[/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)
/assets/js/core/domhelper.js
  import { byId, byName , qs , qsa , create } from '/assets/js/core/domhelper.js'
[/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)
/assets/js/core/eventBus.js
[/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)
```





## en cours

repértorier besoin ui
- voir [améliorations](#besoin_ui)
intégration des composants
- codeval et apex
[/assets/js/components/apex_js.md](/assets/js/components/apex_js.md)

### codeval et apex
- old/public/assets/js/plugins/apex.js


### Améliorations
#### employer balises : H1/H2/H3

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

#### besoin_ui
- login
- icone
- auth
- api workbench


## terminé
interface ui (base)

intégration composants
- apex
- mermaid
- codeval



---
a revoir
---

# Structure du document

```
header id="header"
nav id="sidebar"

```
## Headers

- title-layout
- appTitle
- appSubtitle
- header-actions

```
header#header
    div.title-layout
        h1.appTitle
        span.appSubtitle
        
    div.header-actions
        button.rwdnav
            i.fa fa-bars
        button#themeBtn
        button#fullscreenBtn
```

## Sidebar

Sidebar doit etre généré par script
- button.nav-toggle => button caché sur pc

### Classes css 
- closebtn
- nav-article
- nav-header-row
- nav-title
- nav-toggle
- nav-toc

### Elements css 

```css
  .nav-article.open .nav-toc {
    display: block;
  }
```

```
  nav#sidebar 
    > a.closebtn 
    > div.nav-article
      > div.nav-header-row 
        > a.nav-title 
        > button.nav-toggle
      > ul.nav-toc
        > li
          > a ( panel / tab 0 )
          > ul
            > li
              > a ( panel / tab 0 - Sub tab 0 )
              > ul
```

## Panels / Onglets

le css associé
- panel-card
- panel-title
- panel-description
- section-tab
- tab-headers
- tab-btn et tab-btn active
- tab-content et tab-content active

```html
<div class="panel-card">
    <h2 class="panel-title">...</h2>

    <p class="panel-description">.....</p>

    <div class="section-tab">
        <div class="tab-headers">
          <button class="tab-btn active">...</button>
          <button class="tab-btn" data-tab="info-0">Informations</button>
        </div>


        <div id="..." class="tab-content active">
        </div>

        <div id="..." class="tab-content">
        </div>
    </div>

</div>   
```



