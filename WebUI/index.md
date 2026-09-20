Le refactoring du projet touche a sa fin.
Pour séparer les parties frontend et backend on utilise le serveur pour
- les pages html, ressources images
- les apis

Trois fichiers sont les piliers de l'évolution 
- [/WebUI/ui.html](/WebUI/ui.html)
- [/WebUI/uiapp.js](/WebUI/uiapp.js) path serveur : (/public) /assets/js/uiapp.js
- [/WebUI/uistyle.css](/WebUI/uistyle.css)

# Travaux
## en cours

repértorier besoin ui
- voir [améliorations](#besoin_ui]
intégration des composants
- codeval et apex


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



