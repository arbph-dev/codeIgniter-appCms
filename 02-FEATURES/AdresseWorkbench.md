# AdresseWorkbench

AdresseWorkbench est un orchestrateur mince et lisible :bootstrap ordonné (Leaflet → dialogs → view → panels → events → load)  
- 3 zones avec carte synchronisée  
- relations déléguées au bus + RelationPickerDialog  
- CRUD JSON via service  
- destroy complet (bus, dialogs, panels, vue)

Il valide le modèle « Mot comme référence » étendu aux 3 zones + composant carto + champs relation, sans grossir le core (WorkbenchBase / WorkbenchView inchangés).



Nommage PK — adr_id dans onSave vs éventuel id modèle/API (notes daily). À aligner partout (service, PropertySet, panel).

initLeaflet() global — guard _initialized OK pour une page ; si un jour plusieurs workbenches Leaflet coexistent avec des configs différentes, le guard peut devenir trop strict.

Dialogs hors WorkbenchView — volontaire (body + bus). Ils survivent au unmount des panels tant que destroy() du workbench n’est pas appelé.

Pas de resélection après load() — après save, si result.data est fourni, détail + map sont rafraîchis ; la liste est rechargée mais la ligne sélectionnée n’est pas explicitement re-highlightée (selon l’implémentation du ListPanel).

result.data après save — si l’API ne renvoie que { status } sans ressource, seule la feedback success s’affiche ; la map n’est pas mise à jour avec d’éventuelles coords géocodées côté serveur.

Pagination bus vs callback — léger écart au pattern « tout passe par onXxx des panels ». Fonctionne, mais moins uniforme.


- Carte toujours alignée
Sélection → map ; save réussi avec ressource → map ; new/delete → clear.

- Save JSON, pas FormData
Contrairement à Image (upload fichier). Cohérent avec une entité purement structurée.

- adr_id vs id
Le callback expose adr_id : à vérifier côté service/modèle (notes daily parlaient d’un passage à id). Si l’API attend id, il y a un risque de décalage de nommage.

- Pagination via bus
Le ListPanel publie probablement wb:adresse:page ; le Workbench s’y abonne. Alternative possible : listPanel.onPage(fn) pour rester 100 % callbacks panels — ici le bus est local au workbench, acceptable.

- Erreurs 422
Message métier dédié (« invalide ou déjà existante ») ; le reste remonte err.message.




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



### Fichiers

https://zealot.fr/workbench/adresse

#### assets/js/ui/shared/
[](/)
- assets/js/ui/shared/DialogManager.js
[](/)
- assets/js/ui/shared/RelationPickerDialog.js

#### features / API
- [/assets/js/features/adresse/adresse.properties.js](/refactoring/assets/js/features/adresse/adresse.properties.js)
- [/assets/js/features/adresse/adresse.service.js](/refactoring/assets/js/features/adresse/adresse.service.js)

#### shared
- [/assets/js/ui/shared/DialogManager.js](/refactoring/assets/js/ui/shared/DialogManager.js)
- [/assets/js/ui/shared/Form.js](/refactoring/assets/js/ui/shared/Form.js)
- [/assets/js/ui/shared/RelationPickerDialog.js](/refactoring/assets/js/ui/shared/RelationPickerDialog.js)

#### workbench
- [/assets/js/ui/workbench/adresse/AdresseDetailPanel.js](/refactoring/assets/js/ui/workbench/adresse/AdresseDetailPanel.js)
- [/assets/js/ui/workbench/adresse/AdresseListPanel.js](/refactoring/assets/js/ui/workbench/adresse/AdresseListPanel.js)
- [/assets/js/ui/workbench/adresse/AdresseWorkbench.js](/refactoring/assets/js/ui/workbench/adresse/AdresseWorkbench.js)
- [/assets/js/ui/workbench/adresse/MapPanel.js](/refactoring/assets/js/ui/workbench/adresse/MapPanel.js)



### Dialogs relation

Deux instances de RelationPickerDialog, hors layout, rattachées au body :Dialog

Lien avec Form.js (type relation) :

Bouton 🔍  →  bus.publish('dialog:show', 'dialog_cp')
Dialog     →  recherche + sélection
           →  bus.publish('dialog:select', { sourceId, item })
Form       →  met à jour hidden FK + display


### Panels
- listPanel   → left
- detailPanel → center
- mapPanel    → right

| Panel | Rôle attendu |
| --- | --- |
| List | Recherche, pagination, sélection, bouton « Nouveau » |
| Detail | Affichage / form (create & edit), save, delete, lock/unlock, feedback |
| Map | Affiche le point (lat/lng), clear, réagit à leaflet:* via le composant |

Le Workbench attend ces APIs :
- AdresseListPanel
    - onSearch(fn)
    - onSelect(fn)
    - onNew(fn)
    - show(items, pager)
    - showLoading()
    - showError(msg)
(pagination) publish wb:adresse:page

AdresseDetailPanelshow(adresse), showNew(), clear()
onSave(fn(adr_id, data)), onDelete(fn(id))
lock(), unlock(), showFeedback(type, msg)

MapPanelshow(adresse), clear(), destroy() (→ leaflet:destroy)

Si une de ces méthodes manque ou change de signature, le câblage casse — c’est le « contrat runtime » du workbench.




### Evénements

listPanel.onSearch(q)
    → _q = q, _page = 1
    → detail.clear(), map.clear()
    → load()

listPanel.onSelect(adresse)
    → detail.show(adresse)
    → map.show(adresse)          // sync immédiate

listPanel.onNew()
    → map.clear()
    → detail.showNew()

detailPanel.onSave(adr_id, data)
    → lock()
    → saveAdresse({ adr_id, ...data })   // JSON pur
    → si création : _page = 1
    → load()
    → si result.data : detail.show + map.show
      sinon feedback success
    → unlock()  (finally)

detailPanel.onDelete(id)
    → lock()
    → deleteAdresse(id)
    → detail.clear(), map.clear()
    → _page = 1, load()
    → unlock()

bus 'wb:adresse:page'
    → _page = page, load()
