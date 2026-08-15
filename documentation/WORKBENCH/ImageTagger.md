# ImageTagger

> url : https://zealot.fr/workbench/imagetagger


## Architecture

### Frontend

/assets/
- /css
  - /workbench/

- /js
  - /features
    - /image/
      - [image.service.js](/refactoring/assets/js/features/image/image.service.js)
    - /mot/
      - [mot.service.js](/refactoring/assets/js/features/mot/mot.service.js)
  - /ui
    - /shared/
      - [Form.js](/refactoring/assets/js/ui/shared/Form.js)
      - /templates/
        - [toolbar.template.js](/refactoring/assets/js/ui/shared/templates/toolbar.template.js)
    - /workbench/
      - /core/
        - [domhelper.js](/refactoring/assets/js/ui/workbench/core/domhelper.js)
        - [LayoutDescriptor.js](/refactoring/assets/js/ui/workbench/core/LayoutDescriptor.js)
        - [PanelBase.js](/refactoring/assets/js/ui/workbench/core/PanelBase.js)
        - [WorkbenchBase.js](/refactoring/assets/js/ui/workbench/core/WorkbenchBase.js)
        - [WorkbenchView.js](/refactoring/assets/js/ui/workbench/core/WorkbenchView.js)
      - /image/
        - [ImagePreviewPanel.js](/refactoring/assets/js/ui/workbench/image/ImagePreviewPanel.js)
      - /imagetagger/
        - [ImageTaggerListPanel.js](/refactoring/assets/js/ui/workbench/imagetagger/ImageTaggerListPanel.js)
        - [TaggerPanel.js](/refactoring/assets/js/ui/workbench/imagetagger/TaggerPanel.js)

### Backend

---

## [ImageTaggerListPanel.js](/refactoring/assets/js/ui/workbench/imagetagger/ImageTaggerListPanel.js)
Grille d'images avec :
  - badge mot count par image (depuis mot_ids fourni par include=mot_ids)
  - filtre statut (pending | validated | rejected)
  - updateMotCount(imageId, count) — mise à jour badge sans rechargement

dépendances : 
- [PanelBase.js](/refactoring/assets/js/ui/workbench/core/PanelBase.js)
- [domhelper.js](/refactoring/assets/js/ui/workbench/core/domhelper.js)
- [toolbar.template.js](/refactoring/assets/js/ui/shared/templates/toolbar.template.js)

---
## [ImageTaggerWorkbench.js](/refactoring/assets/js/ui/workbench/imagetagger/ImageTaggerWorkbench.js)

Orchestre :
- ImageTaggerListPanel
- TaggerPanel
- ImagePreviewPanel

Pattern mises à jour optimistes :
  - attach → taggerPanel.addMot (immédiat) → API 
    - succès: badge++
    - erreur: taggerPanel.removeMot + feedback
  -  detach → taggerPanel.removeMot (immédiat) → API
    - succès: badge--
    - erreur: taggerPanel.addMot + feedback

Pas de dialogs, l'autocomplete inline du TaggerPanel suffit.

**dépendances** 
- [WorkbenchBase.js](/refactoring/assets/js/ui/workbench/core/WorkbenchBase.js)
- [WorkbenchView.js](/refactoring/assets/js/ui/workbench/core/WorkbenchView.js)
- [LayoutDescriptor.js](/refactoring/assets/js/ui/workbench/core/LayoutDescriptor.js)
- [ImagePreviewPanel.js](/refactoring/assets/js/ui/workbench/image/ImagePreviewPanel.js)
- [ImageTaggerListPanel.js](/refactoring/assets/js/ui/workbench/imagetagger/ImageTaggerListPanel.js)
- [TaggerPanel.js](/refactoring/assets/js/ui/workbench/imagetagger/TaggerPanel.js)
- [image.service.js](/refactoring/assets/js/features/image/image.service.js)
- [imagemot.service.js](/refactoring/assets/js/features/image/imagemot.service.js)
- [mot.service.js](/refactoring/assets/js/features/mot/mot.service.js)

----

## [TaggerPanel.js](/refactoring/assets/js/ui/workbench/imagetagger/TaggerPanel.js)
Gestion des mots-tags d'une image.
- Mises à jour optimistes : chip ajouté/retiré immédiatement,
- revert sur erreur API (géré par le Workbench via addMot/removeMot).

API publique :
- render() -> HTMLElement
- show(image, mots) -> affiche image info + chips
- clear()
- addMot(mot) -> ajoute chip (optimiste ou confirm)
- removeMot(motId) -> retire chip (optimiste ou revert)
- getMotCount() -> number (pour badge liste)
- showFeedback(type, msg)
- onAttach(fn) -> fn(imageId, motId, motObj)
- onDetach(fn) -> fn(imageId, motId, motObj)
- destroy()


- [PanelBase.js](/refactoring/assets/js/ui/workbench/core/PanelBase.js)
- [domhelper.js](/refactoring/assets/js/ui/workbench/core/domhelper.js)
- [toolbar.template.js](/refactoring/assets/js/ui/shared/templates/toolbar.template.js)
- [mot.service.js](/refactoring/assets/js/features/mot/mot.service.js)

---

## [ImagePreviewPanel.js](/refactoring/assets/js/ui/workbench/image/ImagePreviewPanel.js)



