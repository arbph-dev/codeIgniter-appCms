


- [`/ui.html`](/assets/ui_html.md) on utilise [/ui.html](/WebUI/index.md) pour les travaux en cours
- /assets/css/
  - uistyle.css
- /assets/js/
  - [/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)
- /assets/js/components/
  - [apex.js](/assets/js/components/apex_js.md)
  - [codeval.js](/assets/js/components/codeval_js.md)
  - [mermaid.js](/assets/js/components/mermaid_js.md)
- /assets/js/core/
  - domhelper.js


méthode
- chaque fichier employé est listé dans une note annexe [/assets/ressources.md](/assets/ressources.md)
- chaque fonction importé doit être répertorié et expliqué si besoin
  - exemple `/assets/js/uiapp.js` => [/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)


# Travaux
## a faire 
lister les ressources serveur : (/public) voir [/assets/readme.md](/assets/readme.md)

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
