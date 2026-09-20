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



