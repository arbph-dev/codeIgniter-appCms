**Description** : premier Workbench de relation N-N + mises à jour optimistes.

### Forces

- Pattern optimiste clairement documenté dans les commentaires source (attach/detach + revert sur erreur).
- include=mot_ids + fetchMotBatch → badge sans charger les labels (lazy intelligent).
- Fallback fetchImageMots si mot_ids absent.
- Pas de dialogs : autocomplete inline dans TaggerPanel (choix architectural assumé).
- Réutilisation de ImagePreviewPanel (pas de duplication).
- API TaggerPanel riche (addMot / removeMot / getMotCount / onAttach / onDetach).

### Dettes techniques

|Dette|Détail|Priorité|
|---|---|---|
|Pagination via bus|wb:tagger:page — pas encore basculé|Haute|
|Pattern optimiste non formalisé|Absent du CONTRACT et de DATA_CONTRACT|Haute (doc)|
|Deux patterns de sélection|RelationPicker (Adresse/Org) vs autocomplete inline (Tagger) — pas de guideline|Moyenne|
|Relation N-N|Non encore dans DATA_CONTRACT (daily 12/08)|Haute|

### Croisement daily 12/08

- Daily très long et précis sur le pivot image_mot, ImageMotService, attach/detach/sync, include.
- Le Workbench implémente déjà le cœur de ces décisions.
- Manque la consolidation documentaire (DATA_CONTRACT + éventuel « Relation Contract »).

**Verdict** : Dettes principales = documentation du pattern optimiste et de la relation N-N, + pagination bus.


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
```
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
```

**dépendances** 
- [PanelBase.js](/refactoring/assets/js/ui/workbench/core/PanelBase.js)
- [domhelper.js](/refactoring/assets/js/ui/workbench/core/domhelper.js)
- [toolbar.template.js](/refactoring/assets/js/ui/shared/templates/toolbar.template.js)
- [mot.service.js](/refactoring/assets/js/features/mot/mot.service.js)

---

## [ImagePreviewPanel.js](/refactoring/assets/js/ui/workbench/image/ImagePreviewPanel.js)



