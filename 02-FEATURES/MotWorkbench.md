

# Structure

## fichiers
### /assets/js/ui/workbench/mot/
- [MotDetailPanel.js](/refactoring/assets/js/ui/workbench/mot/MotDetailPanel.js)
- [MotListPanel.js](/refactoring/assets/js/ui/workbench/mot/MotListPanel.js)
- [MotWorkbench.js](/refactoring/assets/js/ui/workbench/mot/MotWorkbench.js)


## api
- [mot.service.js](/refactoring/assets/js/features/mot/mot.service.js)
  - fetchMot
  - saveMot
  - deleteMot
- [mot.properties.js](/refactoring/assets/js/features/mot/mot.properties.js)
  - Contient le schéma déclaratif du formulaire Mot.



## dépendances

### /assets/js/ui/workbench/core/
- [LayoutDescriptor.js](/refactoring/assets/js/ui/workbench/core/LayoutDescriptor.js)
  - function createDescriptor
- [WorkbenchBase.js](/refactoring/assets/js/ui/workbench/core/WorkbenchBase.js)
- [WorkbenchView.js](/refactoring/assets/js/ui/workbench/core/WorkbenchView.js)

---

# Notes

Le schéma déclaratif du formulaire Mot est Séparé de la logique Panel, il peut être réutilisé (ex. autocomplete, filtres).
