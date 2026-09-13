**Notes** : button ajouter type button

Trois fichiers récents a revoir pour extraction


# Structure du document


```
header id="header"




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


## Panels / Onglets

le css associé
- panel-card
- panel-title
- panel-description
- section-tab
- tab-headers
- tab-btn et tab-btn active
- tab-content et tab-content active

```
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

# Améliorations
employer balises : H1/H2/H3
