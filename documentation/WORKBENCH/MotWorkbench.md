**déscription** : 
- Workbench minimal (2 zones, CRUD simple).
- stable, un peu en retard sur les conventions récentes (pagination callback, naming, signature onSave).
- 
## Forces
- Structure la plus simple et lisible → excellent modèle pédagogique.
- Respect strict du cycle de vie CONTRACT (bootstrap → panels → events → load → destroy).
- destroy() propre (unsubscribe pagination + panels + view).
- Commentaire source utile : _« Step 3 : remplacer par fetchMot({ id }) pour l'objet enrichi »_ → conscience de l’évolution list vs detail.

## Dettes techniques

|Dette|Détail|Priorité|
|---|---|---|
|Pagination via bus|wb:mot:page — n’a pas basculé vers onPage(fn)|Haute (alignement)|
|Naming méthodes|createPanels / bindEvents (sans _) alors que les autres utilisent _createPanels / _bindEvents|Basse|
|onSave signature|onSave(id, lbl) — string direct, pas un objet data comme les Workbenches suivants|Moyenne|
|Pas de dialogs|Normal (pas de relation), mais le bootstrap n’a pas le slot _createDialogs() du template CONTRACT|Basse|
|Doc .md minimale|Structure fichiers seulement|Moyenne|

## Croisement sources / daily

- Aucune évolution récente dans les daily (Workbench stabilisé).
- Sert encore de référence implicite, mais n’est plus le modèle le plus avancé (Organisation et ImageTagger ont progressé).



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
