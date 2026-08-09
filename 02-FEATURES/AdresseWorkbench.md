# AdresseWorkbench


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


### Panels
- listPanel   → left
- detailPanel → center
- mapPanel    → right

| Panel | Rôle attendu |
| --- | --- |
| List | Recherche, pagination, sélection, bouton « Nouveau » |
| Detail | Affichage / form (create & edit), save, delete, lock/unlock, feedback |
| Map | Affiche le point (lat/lng), clear, réagit à leaflet:* via le composant |


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
