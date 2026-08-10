
# Workbench


## Principes

### Panel 
Contrat strict 
- pas d’API dans les panels, pas de side-effect dans le constructeur.  

### [Form](/documentation/WORKBENCH/ARCHITECTURE/Form.md)
contrat minimal
- render()
- fill()
- reset()
- extract().  




## Arborescence
- [ ] Détailler les éléments clefs des Workbench
- [ ] Ajuster l'arborescence

**refactoring/assets/js**
- /core
    - /[domhelper.js](/refactoring/assets/js/core/domhelper.js) : [domhelper.md](/documentation/WORKBENCH/ARCHITECTURE/domhelper.md)
- /ui
    - /shared
        - [Form.js](/refactoring/assets/js/ui/shared/Form.js) : [Form.md](/documentation/WORKBENCH/ARCHITECTURE/Form.md)
    - /workbench
        - /core/
            - [LayoutDescriptor.js](/refactoring/assets/js/ui/workbench/core/LayoutDescriptor.js)




## Cycle d’initialisation
Le serveur fournit la page avec le div et le script init 

WorkbenchBase.init() appelle renderStructure() puis bootstrap().

Le Workbench crée les dialogs ; le Form s’y connecte uniquement via le bus (dialogId dans le PropertySet).

Le Workbench ne touche pas au DOM interne des panels.


Ordre important : dialogs avant panels, sinon un clic relation trop tôt n’aurait pas de dialog dans le DOM.

```
bootstrap()
  │
  ├─ 1. initLeaflet()
  │     Guard _initialized dans leaflet.js → abonnements bus une seule fois
  │     (évite les doubles handlers si plusieurs workbenches / re-init)
  │
  ├─ 2. _createDialogs()
  │     RelationPickerDialog CP + TypeVoie → .render() → dans le body
  │     Avant le montage des panels : Form.js peut publier dialog:show
  │     dès le premier render() du détail
  │
  ├─ 3. WorkbenchView(LAYOUT, .wb-content).build()
  ├─ 4. _createPanels() + mountPanels
  ├─ 5. _bindEvents()
  └─ 6. load()   ← premier fetch
```

---
# [Backend](/documentation/WORKBENCH/BACKEND/index.md)
minimal
- route
- Controller + méthode
- vue (css + lib js).  


