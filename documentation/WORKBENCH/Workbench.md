
# Workbench


## Principes

### Panel 
Contrat strict 
- pas d’API dans les panels, pas de side-effect dans le constructeur.  

### Form.js
contrat minimal
- render()
- fill()
- reset()
- extract().  

### Backend workbench 
minimal
- route
- Controller + méthode
- vue (css + lib js).  



## Arborescence
- [ ] Détailler les éléments clefs des Workbench
- [ ] Ajuster l'arboresnce

refactoring/assets/js
    - /core
        - /[domhelper.js](/refactoring/assets/js/core/domhelper.js) : [domhelper.md](/documentation/WORKBENCH/domhelper.md)
    - /ui
        - /shared
            - [Form.js](/refactoring/assets/js/ui/shared/Form.js) : [Form.md](/documentation/WORKBENCH/Form.md)






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

# Fichiers

## architecture
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/Form.md

- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/PropertySet.md
## service


## librairie
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/domhelper.md
