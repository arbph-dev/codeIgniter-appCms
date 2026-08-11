# WORKBENCH_CONTRACT.md
> Contrat d'architecture — WorkbenchBase / Workbench concret  
> Référence pour toute nouvelle implémentation

---

## 1. Séparation des responsabilités

```
WorkbenchBase (core — ne pas modifier)
    ├── cycle de vie  : init() → bootstrap() → destroy()
    ├── container     : this.container, getElement(selector)
    └── bus           : this.bus (référence à l'EventBus singleton)

Workbench concret (extension — 1 fichier par domaine)
    ├── layout        : LAYOUT = createDescriptor(...)  +  WorkbenchView
    ├── panels        : ListPanel, DetailPanel, ...      +  _createPanels()
    ├── dialogs       : RelationPickerDialog, ...        +  _createDialogs()
    ├── événements    : _bindEvents()
    └── API métier    : load(), service.js
```

**WorkbenchBase ne connaît ni les panels, ni les services, ni le layout.**  
**Le Workbench concret ne modifie jamais WorkbenchBase.**

---

## 2. Cycle de vie

```
new MonWorkbench()
    └── constructor()
          ├── super({ name, ... })          ← WorkbenchBase
          ├── this._q, this._page, ...      ← état de recherche / pagination
          ├── this._view = null             ← WorkbenchView (créé au bootstrap)
          ├── this.listPanel = null         ← Panels (créés au bootstrap)
          └── this._onPageFn = null         ← handlers bus (désabonnés au destroy)

await wb.init('#container')
    └── WorkbenchBase.init()
          ├── résout le container DOM
          ├── renderStructure()             ← injecte le squelette HTML
          └── bootstrap()                  ← point d'entrée du Workbench concret

bootstrap()  [async, concret]
    ├── 1. _createDialogs()               ← avant les panels (bus dialog:* déjà actif)
    ├── 2. WorkbenchView.build()          ← construit les zones DOM
    ├── 3. _createPanels()                ← instancie + monte les panels
    ├── 4. _bindEvents()                  ← câble callbacks + bus
    └── 5. load()                         ← premier chargement

destroy()  [concret, puis super]
    ├── bus.unsubscribe(tous les _onXxxFn)
    ├── dialogs?.destroy()
    ├── panels?.destroy()
    ├── view?.unmountPanels() + view?.destroy()
    └── super.destroy()                   ← WorkbenchBase nettoie container
```

### Règle : ordre dans bootstrap()

Les dialogs sont créés **avant** les panels.  
`RelationPickerDialog.render()` appelle `dialogManager.register()` → insère `<dialog>` dans `document.body`.  
Quand `_createPanels()` monte ensuite les Forms (qui souscrivent à `dialog:select`), les dialogs sont déjà enregistrés.

---

## 3. Méthodes du contrat WorkbenchBase

| Méthode | Qui l'implémente | Rôle |
|---|---|---|
| `constructor(config)` | Base + concret | Base : name, bus. Concret : état métier, refs panels |
| `init(selector)` | **Base** | Résout container, appelle renderStructure + bootstrap |
| `renderStructure()` | **Base** | Injecte le squelette HTML minimal (`.wb-content`) |
| `bootstrap()` | **Concret** | Layout + panels + dialogs + events + load |
| `load()` | **Concret** | Appelle le service, met à jour les panels |
| `getElement(sel)` | **Base** | Raccourci `this.container.querySelector(sel)` |
| `destroy()` | **Concret puis Base** | Concret : bus + panels + view. Base : container |

---

## 4. Règles événements — Bus vs Callback

### Principe général

```
Panels → Workbench   : CALLBACKS  (onSearch, onSelect, onNew, onSave, onDelete)
Workbench → Panels   : MÉTHODES   (panel.show(), panel.clear(), panel.showFeedback())
Infrastructure IHM   : BUS        (dialog:*, leaflet:*, wb:*:page)
```

### Tableau de décision

| Situation | Mécanisme | Raison |
|---|---|---|
| ListPanel signale une sélection | `onSelect(fn)` callback | Local au Workbench, pas d'autres abonnés |
| ListPanel signale une recherche | `onSearch(fn)` callback | Idem |
| ListPanel signale création | `onNew(fn)` callback | Idem |
| DetailPanel signale un save | `onSave(fn)` callback | Idem |
| DetailPanel signale un delete | `onDelete(fn)` callback | Idem |
| **Pagination** | **`bus.subscribe('wb:xxx:page')`** | `domhelper.pagination()` publie sur bus — limitation actuelle à faire évoluer |
| Ouverture d'un dialog | `bus.publish('dialog:show', id)` | L'émetteur (Form) ne connaît pas le dialog |
| Retour sélection dialog | `bus.subscribe('dialog:select')` | Plusieurs champs relation peuvent écouter |
| Carte Leaflet | `bus.publish('leaflet:render')` | Composant externe indépendant |
| Tab change (TabSystem) | `tabs.onTabChange(fn)` callback | Depuis iter007 — remplace busEvent |

### Bus réservé à l'infrastructure partagée

```
dialog:show     →  DialogManager.show(id)
dialog:close    →  DialogManager.close(id)
dialog:select   →  Form.js champs relation, souscription filtrée par dialogId
leaflet:render  →  MapPanel / Leaflet component
leaflet:update  →  MapPanel
leaflet:destroy →  MapPanel / Workbench.destroy()
wb:xxx:page     →  pagination (limitation — voir §5)
```

**Le bus ne véhicule pas de données métier** (pas de `org:save`, `org:loaded`…).  
Ceux-ci étaient des patterns old-portal (bus-everything). Le Workbench concret orchestre via callbacks et méthodes directes.

---

## 5. Limitation actuelle — Pagination

`domhelper.pagination()` publie toujours sur `bus` via `busEvent`.  
Conséquence : les Workbenches souscrivent à `wb:xxx:page` dans `_bindEvents()`.

```javascript
// Pattern actuel (tous les Workbenches)
this._onPageFn = (page) => { this._page = page; this.load() }
this.bus.subscribe('wb:org:page', this._onPageFn)

// destroy() — OBLIGATOIRE
this.bus.unsubscribe('wb:org:page', this._onPageFn)
this._onPageFn = null
```

**Évolution souhaitée** : `domhelper.pagination()` expose un `onClick` callback en alternative à `busEvent`.  
Quand ce changement sera fait, les ListPanels pourront exposer `onPage(fn)` et les Workbenches n'auront plus de bus pour la pagination.

---

## 6. Contrat Panel (PanelBase)

Chaque Panel expose deux surfaces :

### Surface Workbench → Panel (méthodes directes)
```
render()           → HTMLElement    obligatoire
show(data, pager?) → void           obligatoire
clear()            → void           obligatoire
showLoading()      → void           obligatoire (ListPanel)
showError(msg)     → void           obligatoire (ListPanel)
showFeedback(t, m) → void           obligatoire (DetailPanel)
lock() / unlock()  → void           obligatoire (DetailPanel)
destroy()          → void           obligatoire
```

### Surface Panel → Workbench (callbacks enregistrés)
```
onSearch(fn)   ListPanel   fn(q: string)
onSelect(fn)   ListPanel   fn(item: object)
onNew(fn)      ListPanel   fn()
onSave(fn)     DetailPanel fn(id: number|null, data: object)
onDelete(fn)   DetailPanel fn(id: number)
onTabChange(fn) TabSystem  fn(tabId: string)   [iter007]
```

**Si une méthode ou signature change, le câblage Workbench casse — c'est le « contrat runtime ».**

---

## 7. Template Workbench concret

```javascript
// assets/js/ui/workbench/mon-domaine/MonWorkbench.js

import WorkbenchBase          from '/assets/js/ui/workbench/core/WorkbenchBase.js'
import { WorkbenchView }      from '/assets/js/ui/workbench/core/WorkbenchView.js'
import { createDescriptor }   from '/assets/js/ui/workbench/core/LayoutDescriptor.js'
import { RelationPickerDialog } from '/assets/js/ui/shared/RelationPickerDialog.js'

import MonListPanel   from './MonListPanel.js'
import MonDetailPanel from './MonDetailPanel.js'

import { fetchMon, saveMon, deleteMon } from '/assets/js/features/mon-domaine/mon.service.js'

const LAYOUT = createDescriptor({
    css   : 'wb_mon_layout',
    zones : [
        { name: 'left',   css: 'wb_mon_left'   },
        { name: 'center', css: 'wb_mon_center'  },
    ],
})

export class MonWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({ name: 'Mon Workbench', ...config })

        // État métier
        this._q         = ''
        this._page      = 1
        this._onPageFn  = null   // ← handler bus pagination

        // Références
        this._view       = null
        this.listPanel   = null
        this.detailPanel = null
    }

    async bootstrap()
    {
        this._createDialogs()                                    // 1. dialogs avant panels
        this._view = new WorkbenchView(LAYOUT, this.getElement('.wb-content'))
        this._view.build()                                       // 2. zones DOM
        this._createPanels()                                     // 3. panels
        this._bindEvents()                                       // 4. câblage
        this.load()                                              // 5. premier chargement
    }

    _createDialogs() { /* new RelationPickerDialog(...).render() */ }

    _createPanels()
    {
        this.listPanel   = new MonListPanel()
        this.detailPanel = new MonDetailPanel()
        this._view.mountPanels({ left: this.listPanel, center: this.detailPanel })
    }

    _bindEvents()
    {
        // Callbacks panels → Workbench
        this.listPanel.onSearch(q   => { this._q = q; this._page = 1; this.detailPanel.clear(); this.load() })
        this.listPanel.onSelect(item => this.detailPanel.show(item))
        this.listPanel.onNew(()      => this.detailPanel.showNew())

        // Pagination — bus (limitation domhelper.pagination)
        this._onPageFn = (page) => { this._page = page; this.load() }
        this.bus.subscribe('wb:mon:page', this._onPageFn)

        // Sauvegarde
        this.detailPanel.onSave(async (id, data) =>
        {
            this.detailPanel.lock()
            try {
                const result = await saveMon({ id, ...data })
                if (!id) this._page = 1
                await this.load()
                result.data ? this.detailPanel.show(result.data)
                            : this.detailPanel.showFeedback('success', 'Enregistré.')
            } catch (err) {
                this.detailPanel.showFeedback('error', err.message)
            } finally {
                this.detailPanel.unlock()
            }
        })

        // Suppression
        this.detailPanel.onDelete(async (id) =>
        {
            this.detailPanel.lock()
            try {
                await deleteMon(id)
                this.detailPanel.clear()
                this._page = 1
                await this.load()
            } catch (err) {
                this.detailPanel.showFeedback('error', err.message)
            } finally {
                this.detailPanel.unlock()
            }
        })
    }

    async load()
    {
        this.listPanel.showLoading()
        try {
            const result = await fetchMon({ q: this._q || undefined, page: this._page, perPage: 20 })
            const items  = Array.isArray(result.data) ? result.data : (result.data ? [result.data] : [])
            this.listPanel.show(items, result.pager ?? null)
        } catch (err) {
            this.listPanel.showError(err.message)
        }
    }

    destroy()
    {
        this.bus.unsubscribe('wb:mon:page', this._onPageFn)  // ← désabonnement bus
        this._onPageFn = null
        // dialogs, panels, view...
        this.listPanel?.destroy()
        this.detailPanel?.destroy()
        this._view?.unmountPanels()
        this._view?.destroy()
        this._view = null
        super.destroy()
    }
}

export default MonWorkbench
```

---

## 8. Checklist nouvelle implémentation

```
□ constructor   : super() + état métier + this._onPageFn = null
□ bootstrap()   : dialogs → view.build → panels → bindEvents → load
□ _createDialogs() : avant _createPanels()
□ _bindEvents() : callbacks (onSearch/Select/New/Save/Delete)
                  + bus.subscribe('wb:xxx:page', this._onPageFn)
□ load()        : showLoading → fetch → show(items, pager)
□ destroy()     : bus.unsubscribe avant panels.destroy()
                  + super.destroy() en dernier
□ CSS           : workbench_xxx.css chargé après workbench.css
□ Vue PHP       : lien CSS + import JS du Workbench
```
