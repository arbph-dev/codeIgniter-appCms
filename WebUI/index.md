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





