# Guide — Composants CMS
## Bilan Iter007 + Implémentation des futurs composants

---

## 1. Bilan Iter007 — ce qui a changé

### Règle centrale
```
initXxx(root = document)
```
Chaque composant accepte un paramètre `root` optionnel.  
Sans argument → scan de `document` (comportement d'avant, compat descendante).  
Avec un pane → scan ciblé, les éléments déjà initialisés ailleurs sont ignorés.

### Appel depuis le Workbench

```js
// WorkbenchBase — deux méthodes coexistent

initRegisteredComponents()          // scan document  → mode plat, premier appel
initRegisteredComponentsIn(paneEl)  // scan pane      → fetchSection() Iter006
```

### Tableau de bord

| Composant | Classe CSS ciblée | Guard double-init | `root` | `_initialized` bus |
|-----------|-------------------|------------------|--------|--------------------|
| apex      | `.cp_apex`        | `instances` Map  | ✅     | ✅ |
| callout   | `.cp_callout`     | `data-callout-init` | ✅  | ✅ |
| codeval   | —                 | —                | ❌ (bus only) | ✅ |
| leaflet   | `.cp_leaflet`     | `instances` Map  | ✅     | ✅ |
| mermaid   | `.mermaid`        | `rendered` Set   | ✅     | ✅ |
| three     | `.cp_threejs`     | `data-threejs-init` | ✅ déjà là | — |
| wysedit   | `.cp_wysedit_zone`| `data-wysedit-init` | ✅ déjà là | — (namespaced) |

### Où est `window.eventBusPublish` ?
Déplacé de `bootstrap.js` → **`eventBus.js`**.  
Disponible dès l'import d'`eventBus.js`, sans dépendance au bootstrap CMS.

---

## 2. Trois types de composants

### Type A — Scan DOM + bus global
**Exemples :** apex, callout, leaflet, mermaid

```
bootstrapFromDOM(root)    ← découverte des éléments dans root
_initialized guard        ← bus subscriptions une seule fois
instances Map / attribut  ← évite double-init élément par élément
```

### Type B — Bus uniquement
**Exemple :** codeval

```
Pas de scan DOM           ← activé par onclick PHP → window.eventBusPublish
_initialized guard        ← bus subscriptions une seule fois
root accepté mais ignoré  ← uniformité API
```

### Type C — Scan DOM, pas de bus global
**Exemples :** three, wysedit

```
bootstrapFromDOM(root)    ← découverte des éléments dans root
attribut DOM guard        ← évite double-init élément par élément
Pas de _initialized       ← pas de bus global à protéger
                            (three : aucun bus / wysedit : bus namespaced par instance)
```

---

## 3. Les deux guards — choisir le bon

### Guard module : `instances` Map ou `rendered` Set
**Quand :** le composant crée et gère des instances (ApexCharts, Leaflet map, objets Three.js...).  
**Avantage :** l'objet de gestion existait déjà, pas de nouvel attribut DOM.

```js
const instances = new Map()

// Dans bootstrapFromDOM :
.filter(el => el.id && !instances.has(el.id))

// Après création :
instances.set(id, instance)
```

### Guard élément : `data-xxx-init`
**Quand :** le composant active un comportement (callout, wysedit) sans garder d'instance.  
**Avantage :** visible dans le DOM, facile à déboguer (inspect element).

```js
// Dans bootstrapFromDOM ou forEach :
.filter(el => !el.dataset.mycompInit)

// Après activation :
el.dataset.mycompInit = '1'
```

---

## 4. Template — nouveau composant

### Type A (le plus courant)

```js
// /assets/js/components/moncomposant.js
// =============================================================================
//  COMPONENT : MONCOMPOSANT
//    1. ENGINE   → logique pure
//    2. REGISTRY → catalogue (si plusieurs variantes)
//    3. RENDERER → gestion DOM + instances
//    4. BOOTSTRAP → découverte automatique du DOM
//    5. INDEX     → bus + init
// =============================================================================

import { bus }       from '/assets/js/core/eventBus.js'
import { byId, qsa } from '/assets/js/core/domhelper.js'


/* ── 1-3. ENGINE / REGISTRY / RENDERER ──────────────────────────────────────*/

const instances = new Map()   // guard + gestion instances

function activate(id, config) {
    const el = byId(id)
    if (!el) { console.warn(`[moncomp] #${id} introuvable`) ; return }

    destroy(id)               // recrée si appel explicite via bus

    // ... créer l'instance ...
    instances.set(id, instance)
}

function destroy(id) {
    const inst = instances.get(id)
    if (!inst) return
    // inst.destroy() / inst.remove() selon la lib
    instances.delete(id)
}


/* ── 4. BOOTSTRAP ────────────────────────────────────────────────────────────*/

function bootstrapFromDOM(root = document) {
    const found = qsa('.cp_moncomp', root)
        .filter(el => el.id && !instances.has(el.id))   // guard

    found.forEach(el => {
        bus.publish('moncomp:render', {
            id      : el.id,
            payload : { /* lire data-* */ }
        })
    })

    if (found.length) console.log(`[moncomp] ${found.length} élément(s) initialisé(s)`)
}


/* ── 5. INDEX ────────────────────────────────────────────────────────────────*/

let _initialized = false

export function initMonComp(root = document) {
    if (!_initialized) {
        bus.subscribe('moncomp:render',  ({ id, payload }) => activate(id, payload))
        bus.subscribe('moncomp:destroy', (id)             => destroy(id))
        // autres events...

        _initialized = true
        console.log('[moncomp] initialisé')
    }
    bootstrapFromDOM(root)
}


/* ── API debug (window.*) ────────────────────────────────────────────────────*/

window.moncompRender  = (id, payload = {}) => bus.publish('moncomp:render',  { id, payload })
window.moncompDestroy = (id)               => bus.publish('moncomp:destroy', id)
```

### Type B (bus only — PHP onclick)

```js
let _initialized = false

export function initMonComp(root = document) {   // root ignoré — noter dans JSDoc
    if (_initialized) return

    bus.subscribe('moncomp:action', (id) => { /* ... byId(id) ... */ })

    _initialized = true
    console.log('[moncomp] initialisé')
}
```

### Type C (scan DOM, pas de bus global)

```js
function activate(el) {
    if (el.dataset.moncompInit) return    // guard élément
    // ... logique ...
    el.dataset.moncompInit = '1'
}

export function initMonComp(root = document) {
    const elements = [...root.querySelectorAll('.cp_moncomp')]
        .filter(el => !el.dataset.moncompInit)   // guard

    elements.forEach(activate)

    if (elements.length) console.log(`[moncomp] ${elements.length} élément(s) initialisé(s)`)
}
```

---

## 5. Checklist — nouveau composant

```
□ Classe CSS : .cp_{nom}  (sauf mermaid : .mermaid — convention externe)
□ Import bus  : '/assets/js/core/eventBus.js'  (chemin absolu)
□ Import dom  : '/assets/js/core/domhelper.js' (qs, qsa, byId)

□ Choisir le guard :
    · instances Map/Set existante → l'utiliser directement
    · sinon → data-{nom}-init sur l'élément

□ bootstrapFromDOM(root = document) avec .filter(guard)
□ initXxx(root = document)
    · _initialized pour les bus subscriptions (Type A et B)
    · bootstrapFromDOM(root) en fin de fonction

□ Enregistrer dans le bon Workbench :
    · Composant public  → CmsArticleWorkbench.setupComponentRegistry()
    · Composant admin   → CmsViewWorkbench.setupComponentRegistry() (Iter008)

□ window.xxxRender / window.xxxDestroy pour le debug console
□ console.log('[nom] initialisé') en fin de _initialized block
```

---

## 6. Convention bus events

```
{nom}:render    → créer / afficher
{nom}:update    → mettre à jour (sans recréer)
{nom}:destroy   → détruire
{nom}:list      → debug — liste les instances actives

{nom}:{action}:{id}   → namespaced par instance (wysedit, futur form…)
```

---

## 7. Enregistrement dans le Workbench

```js
// CmsArticleWorkbench — composants publics (article CMS)
setupComponentRegistry() {
    this.register('apex',    initApex);
    this.register('callout', initCallout);
    this.register('leaflet', initLeaflet);
    this.register('mermaid', initMermaid);
    this.register('three',   initThree);
    this.register('codeval', initCodeVal);
    // this.register('moncomp', initMonComp);  ← ajouter ici
}

// L'ordre compte pour les dépendances :
// apex AVANT codeval (codeval publie apex:render via availableApi.plot)
```
