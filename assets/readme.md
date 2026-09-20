

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

### Intégration
intégration des composants dans [https://zealot.fr/ui.html](https://zealot.fr/ui.html)


#### template html
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



### codeval et apex
- [interaction](/assets/js/components/codeval_js.md#interaction)

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
- apex [/assets/js/components/apex_js.md](/assets/js/components/apex_js.md)
- codeval [/assets/js/components/apex_js.md](/assets/js/components/apex_js.md)
- codeval et apex [/assets/js/components/apex_js.md](/assets/js/components/apex_js.md)
- mermaid

