### Workbench
Le Workbench crée les dialogs ; le Form s’y connecte uniquement via le bus (dialogId dans le PropertySet).

Le Workbench ne touche pas au DOM interne des panels.

#### Cycle d’initialisation

WorkbenchBase.init() appelle typiquement renderStructure() puis bootstrap().

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
