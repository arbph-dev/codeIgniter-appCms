# AdresseWorkbench

AdresseWorkbench est un orchestrateur mince et lisible :bootstrap ordonné (Leaflet → dialogs → view → panels → events → load)  
- 3 zones avec carte synchronisée  
- relations déléguées au bus + RelationPickerDialog  
- CRUD JSON via service  
- destroy complet (bus, dialogs, panels, vue)

Il valide le modèle « Mot comme référence » étendu aux 3 zones + composant carto + champs relation, sans grossir le core (WorkbenchBase / WorkbenchView inchangés).



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

### Fichiers back
- routes
- controller
- vue app/Views/workbench/adresse.php
    - Banc de test — AdresseWorkbench , URL : /workbench/adresse 
- API
    - app/Controllers/Api/Adesse.php
    - app/Controllers/Api/CodePostal.php
    - app/Controllers/Api/TypeVoie.php
    - app/Enums/IndiceRepetition.php
    - app/Enums/Charniere.php


### Fichiers front

url : https://zealot.fr/workbench/adresse



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
c’est le « contrat runtime » du workbench.
- listPanel   → left
- detailPanel → center
- mapPanel    → right


| Panel | Rôle attendu |
| --- | --- |
| List | Recherche, pagination, sélection, bouton « Nouveau » |
| Detail | Affichage / form (create & edit), save, delete, lock/unlock, feedback |
| Map | Affiche le point (lat/lng), clear, réagit à leaflet:* via le composant |

Le Workbench attend ces APIs : méthodes et callback

- AdresseListPanel
    - onSearch(fn)
    - onSelect(fn)
    - onNew(fn)
    - show(items, pager)
    - showLoading()
    - showError(msg)
    - (pagination) publish wb:adresse:page

- AdresseDetailPanel
    - show(adresse)
    - showNew()
    - clear()
    - onSave(fn(adr_id, data))
    - onDelete(fn(id))
    - lock()
    - unlock()
    - showFeedback(type, msg)

- MapPanel
    - show(adresse)
    - clear()
    - destroy() (→ leaflet:destroy)


### Evénements

Le Workbench est le contrôleur de l'IHM. Il n'a pas besoin du bus pour communiquer avec ses propres sous-composants

Un Panel qui est un **widget UI** proposera des callback

```js
catalogPanel.onSelect = (definition) => { definitionPanel.render(definition); }
```

plutôt que :
```
CatalogPanel -> bus.publish() -> Workbench -> bus.subscribe() ->DefinitionPanel
```

Le bus est a réservé aux échanges entre modules métier.

#### bus wb:adresse:pag
bus 'wb:adresse:page'
    → _page = page, load()


#### listPanel.onSearch

listPanel.onSearch(q)
    → _q = q, _page = 1
    → detail.clear(), map.clear()
    → load()

#### listPanel.onSelect

listPanel.onSelect(adresse)
    → detail.show(adresse)
    → map.show(adresse)          // sync immédiate

#### listPanel.onNew
listPanel.onNew()
    → map.clear()
    → detail.showNew()

#### detailPanel.onSave
detailPanel.onSave(adr_id, data)
    → lock()
    → saveAdresse({ adr_id, ...data })   // JSON pur
    → si création : _page = 1
    → load()
    → si result.data : detail.show + map.show
      sinon feedback success
    → unlock()  (finally)

#### detailPanel.onDelete
detailPanel.onDelete(id)
    → lock()
    → deleteAdresse(id)
    → detail.clear(), map.clear()
    → _page = 1, load()
    → unlock()

---

## Bilan

### Points à retenir
- j'ai testé l'ensemble, les dialogs apparaissent les valeurs sont bien renvoyées dans les champs du formulaire
    - l'ordre de schamps doit etre revu pour un ordre plus logique : numéro, indice de répétition, type de voie, nom de voie.

- Je n'ai pas bien géré : les sources à exploiter
    - la relecture du model aurait évité la confusion adr_id / id
    - la liaision avec les enums app/Enums/Charniere.php contenait les listes de choix. Elle est retranscrite dans le renderer du features ici : js/features/adresse/adresse.renderer.js

- La resélection après load() — après un save, la liste se recharge mais la ligne active n'est pas re-highlightée. AdresseListPanel pourrait exposer un highlight(id) que le Workbench appellerait après load().
    - Pas de resélection après load() — après save, si result.data est fourni, détail + map sont rafraîchis ; la liste est rechargée mais la ligne sélectionnée n’est pas explicitement re-highlightée (selon l’implémentation du ListPanel).

- Le result.data conditionnel — si l'API de save ne retourne pas la ressource complète (pas de coords géocodées), la map reste sur l'ancienne position. À voir selon ce que retourne Api/Adresse.php.

- le code du composant [/assets/js/components/leaflet.js](/refactoring/assets/js/components/leaflet.js) n'a pas été réemployé, on s'oriente peut etre vers une autre notion **widget**
    - initLeaflet() global — guard _initialized OK pour une page ; si un jour plusieurs workbenches Leaflet coexistent avec des configs différentes, le guard peut devenir trop strict.

- la précison de l'adresse n'est pas exploitée aujourd'hui

- DialogManager + RelationPickerDialog + Form.js v3 forment maintenant une infrastructure complète.
    - N'importe quel champ FK dans n'importe quel futur PropertySet s'écrit en 6 lignes avec type: 'relation'.
    - Dialogs hors WorkbenchView — volontaire (body + bus). Ils survivent au unmount des panels tant que destroy() du workbench n’est pas appelé.

- Pagination via bus
    - Le ListPanel publie probablement wb:adresse:page ; le Workbench s’y abonne. Alternative possible : listPanel.onPage(fn) pour rester 100 % callbacks panels — ici le bus est local au workbench, acceptable.
    - Pagination bus vs callback — léger écart au pattern « tout passe par onXxx des panels ». Fonctionne, mais moins uniforme.

- Erreurs 422
    - Message métier dédié (« invalide ou déjà existante ») ; le reste remonte err.message.

- Save JSON, pas FormData
    - Contrairement à Image (upload fichier). Cohérent avec une entité purement structurée.

- result.data après save — si l’API ne renvoie que { status } sans ressource, seule la feedback success s’affiche ; la map n’est pas mise à jour avec d’éventuelles coords géocodées côté serveur.
    - Carte doit toujours être alignée : Sélection → map ; save réussi avec ressource → map ; new/delete → clear.- 
