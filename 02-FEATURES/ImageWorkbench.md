# ImageWorkbench

- assets/js/ui/shared/Form.js

- assets/js/features/image/image.service.js
- assets/js/features/image/image.properties.js

- assets/js/ui/workbench/image/ImageListPanel.js
- assets/js/ui/workbench/image/ImagePreviewPanel.js
- assets/js/ui/workbench/image/ImageDetailPanel.js

- /assets/css/workbench/image.css

assets/js/ui/workbench/image/ImageWorkbench.js


3 fichiers back
routes
controller
vue


## Bilan de session

Validé.

Form.js
- deux types ajoutés sans casser l'existant.
  - select dispatch sur choices, skip la contrainte value === default qui ne s'applique pas aux listes.
  - file reçoit le File object dans validate(), Enter/Escape ignorés sur ces deux types.

ImageWorkbench 
- 3 zones sur WorkbenchView, zéro modification du core.
- La pile complète : service (CREATE FormData / UPDATE JSON), deux PropertySet distincts, grille de vignettes, preview découplée, destroy propre sur les 3 panels.

Points notables qui ont émergé en cours de route :
- _destroyForm() extrait en méthode privée dans ImageDetailPanel pour éviter la fuite mémoire quand on enchaîne les modes
- img.loading = 'lazy' sur les vignettes pour ne pas saturer le réseau au chargement de la grille.

---
