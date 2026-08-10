# ImageWorkbench

- 3 zones sur WorkbenchView
- zéro modification du core.

- La pile complète :
  - service (CREATE FormData / UPDATE JSON)
  - deux PropertySet distincts
  - grille de vignettes
  - preview découplée
  - destroy propre sur les 3 panels.

## Structure

### /assets/css/workbench/
- [image.css](/refactoring/assets/css/workbench/image.css)


## fichiers
### assets/js/ui/workbench/image/
- [ImageDetailPanel.js](/refactoring/assets/js/ui/workbench/image/ImageDetailPanel.js)
- [ImageListPanel.js](/refactoring/assets/js/ui/workbench/image/ImageListPanel.js)
- [ImagePreviewPanel.js](/refactoring/assets/js/ui/workbench/image/ImagePreviewPanel.js)
- [ImageWorkbench.js](/refactoring/assets/js/ui/workbench/image/ImageWorkbench.js)

## api
### assets/js/features/image/
- [image.properties.js](/refactoring/assets/js/features/image/image.properties.js)
- [image.service.js](/refactoring/assets/js/features/image/image.service.js)

### image.service.js
Permet l'accès à l'API Image.

Deux modes de sauvegarde distincts (différence structurelle vs MotWorkbench) :
- CREATE (id = null) → POST multipart/form-data { file, alt, status, user_id }
- UPDATE (id > 0)    → PUT  application/json    { alt, status }

Champs read-only calculés à l'upload (jamais envoyés en update) :
- filename
- width
- height
- ratio
- extension
- size_ko
- path


## dépendances
- assets/js/ui/shared/Form.js

## Notes



3 fichiers back
routes
controller
vue


## Bilan de session

### Form.js
- deux types ajoutés sans casser l'existant.
  - select dispatch sur choices, skip la contrainte value === default qui ne s'applique pas aux listes.
  - file reçoit le File object dans validate(), Enter/Escape ignorés sur ces deux types.

### Points notables
- _destroyForm() extrait en méthode privée dans ImageDetailPanel pour éviter la fuite mémoire quand on enchaîne les modes
- img.loading = 'lazy' sur les vignettes pour ne pas saturer le réseau au chargement de la grille.

---
