# AdresseWorkbench

## Architecture

```
WorkbenchBase
    │  name, container, bus, init(), getElement(), destroy()
    ▼
AdresseWorkbench          ← orchestrateur (ce fichier)
    │
    ├── WorkbenchView     ← layout 3 zones (left / center / right)
    ├── AdresseListPanel
    ├── AdresseDetailPanel
    ├── MapPanel
    ├── RelationPickerDialog × 2  (CP, TypeVoie)
    └── services: fetchAdresse / saveAdresse / deleteAdresse / fetchCpLike / fetchTvLike
```

- assets/js/ui/shared/DialogManager.js
- assets/js/ui/shared/RelationPickerDialog.js


- assets/js/features/adresse/adresse.properties.js


### Dialogs relation

Deux instances de RelationPickerDialog, hors layout, rattachées au body :Dialog

Lien avec Form.js (type relation) :

Bouton 🔍  →  bus.publish('dialog:show', 'dialog_cp')
Dialog     →  recherche + sélection
           →  bus.publish('dialog:select', { sourceId, item })
Form       →  met à jour hidden FK + display
