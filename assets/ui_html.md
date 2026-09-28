- **DOMAINE** [WebUI](/WebUI/README.md) - voir pour notes , évolutions et tâches
- **DEV** : [WebUI/ui.html](/WebUI/ui.html)
- **PATH** : `/ui.html`


# [`/ui.html`](/WebUI/ui.html)

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


|Zone|Contenu|
|---|---|
|.header-auth (guest)|email + password + Connexion + **Inscription**|
|.header-auth (register en cours)|bouton « Retour » minimal (optionnel)|


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

#### réserver 2 panels en tête de #stack dans 
- [`ui.html - ligne 68`](/WebUI/ui.html#L68)
- [`ui.html - ligne 82`](/WebUI/ui.html#L82)

```html
 <div class="panel-card hidden" data-role="admin" data-index="-2">
```
note :
- data-role pour eviter de les intégrer au menu
- data-index="-2"

modifier [`uiapp.js`](/WebUI/uiapp.js) 
- show/hide boards
- Modifier readPage() pour ignorer les panels auth :

|Zone|Rôle|Contrôle|
|---|---|---|
|div.panel-card[data-role="admin"]|Dashboard admin|bus board:admin / board:hide|
|div.panel-card[data-role="user"]|Dashboard user (+ form register temporaire)|bus board:user / board:register / board:hide|
|#user-board-body|formulaire register complet| | 

- `#user-board-body` sert pour register et les infos users


### structure
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



### css associé
- panel-card
- panel-title
- panel-description
- section-tab
- tab-headers
- tab-btn et tab-btn active
- tab-content et tab-content active
