# Index des Composants — HTML/JS/CSS

## Vue d'ensemble

Ce document présente un index exhaustif des composants disponibles, avec références aux fichiers source, versions (old/advanced), et annotations des ressources HTML, JS, CSS.

### Structure générale

```
old/app/Controllers/Cms.php          ← Définitions des articles (HTML + structure)
old/app/Views/cms/index.php          ← Bootstrap et imports JS

old/public/assets/js/components/     ← Versions AVANCÉES (full EventBus)
old/public/assets/js/ihm/            ← Versions À AMÉLIORER
old/public/assets/js/core/           ← Noyau (eventBus, domhelper, etc.)
old/public/assets/js/features/       ← Métier (mot, image, adresse, etc.)
old/public/assets/js/plugins/        ← Externes (leaflet, apex, mermaid)
```

---

## 1. Composants UI (IHM)

### 1.1 Sidebar (Navigation)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `ihm/sidebar.js` | ✅ Simple | Initialisation de la navigation latérale |
| **CSS** | — | À chercher | Styles dans `layouts/cms.css` (probablement) |
| **HTML** | `index.php` ligne 243-250 | ✅ Basic | `<nav id="sidebar">` dans la vue |
| **EventBus** | — | Non | Pas d'events, DOM direct |

```javascript
// Import (index.php:44)
import { initSidebar } from '/assets/js/ihm/sidebar.js'

// Initialisation (index.php:155)
initSidebar()
```

---

### 1.2 Tabs (Onglets)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `ihm/tabspage.js` | ✅ Actif | Gestion de la navigation par onglets (articles) |
| **CSS** | — | À chercher | Styles des onglets (tab:nth-child, etc.) |
| **HTML** | `index.php` ligne 320-350 | ✅ Articles | Boucle sur `$articles`, chaque `<article id="tab{id}">` |
| **EventBus** | ✅ Publie | `tabs:switch` | Émis lors du changement d'onglet → consommé par Mermaid, etc. |

```javascript
// Import (index.php:45)
import { initTabs } from '/assets/js/ihm/tabspage.js'

// Initialisation (index.php:156)
initTabs()

// Événements
bus.subscribe('tabs:switch', ({ name }) => runInArticle(name))  // Mermaid.js:112
```

---

### 1.3 Dialog (Modales)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `ihm/dialog.js` | ✅ Actif | Gestion des éléments `<dialog>` HTML5 |
| **CSS** | `cp_dialog` | ✅ Classe | `.cp_dialog` (probablement dans css) |
| **HTML** | `index.php` ligne 365-393 | ✅ 2 dialogues | `DIALOG_1` et `DIALOG_2` + formulaire test |
| **EventBus** | ✅ | `dialog:show`, `dialog:close` | Publié via `window.showModal()`, `window.closeModal()` |

```javascript
// Import (index.php:123)
import { initDialog } from '/assets/js/ihm/dialog.js'

// API globales (index.php:148-149)
window.showModal = (id) => bus.publish('dialog:show', id)
window.closeModal = (id) => bus.publish('dialog:close', id)

// HTML (index.php:365)
<dialog id="DIALOG_1" class="cp_dialog">...</dialog>
```

---

### 1.4 Carousel (Diaporama)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `ihm/carousel.js` | ✅ Wrapper | Loader pour `CarouselManager.js` |
| **JS** | `ihm/carousel/CarouselManager.js` | ⚠️ À explorer | Logique complète du carousel |
| **CSS** | — | À chercher | Styles du carousel |
| **HTML** | — | À chercher | Structure des slides |
| **EventBus** | ✅ Publie | `carousel:glen`, `carousel:run`, `carousel:stop` | Événements de contrôle |

```javascript
// Import (index.php:117)
import { initCarousel } from '/assets/js/ihm/carousel.js'

// Initialisation (index.php:163)
initCarousel()

// Contrôle via bus (index.php:197-201)
bus.publish('carousel:glen', '1')    // Longueur
bus.publish('carousel:run', '1')     // Lancer carousel 1
bus.publish('carousel:stop', '2')    // Arrêter carousel 2
```

---

### 1.5 CallOut (Encadré d'information)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `ihm/callout.js` | ✅ Simple | Initialisation des callouts |
| **CSS** | `.callout` | ✅ Classe | Probablement dans styles |
| **HTML** | `Cms.php` Article 1 | ✅ Exemple | Utilisé pour les "callout" visuels |
| **EventBus** | ❌ Non | — | Pas d'événements |

```javascript
// Import (index.php:59)
import { initCallout } from '/assets/js/ihm/callout.js'

// Initialisation (index.php:158)
initCallout()
```

---

### 1.6 Forms Manager (Gestion des formulaires)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `ihm/formsManager.js` | ✅ Actif | Centralise validation, soumission |
| **CSS** | `.form_style1` | ✅ Classe | Classes de formulaires |
| **HTML** | `index.php` ligne 373-391 | ✅ Form test | `<form id="form10" class="form_style1">` |
| **EventBus** | ✅ Publie | `forms:submit` | Événement depuis `window.validateForm()` |
| **Validation** | ✅ HTML5 | `required`, `pattern`, `minlength` | Attributs standard |

```javascript
// Import (index.php:124)
import { initForms } from '/assets/js/ihm/formsManager.js'

// API globale (index.php:129-132)
window.validateForm = (evt) => {
    bus.publish('forms:submit', evt)
    return false
}

// HTML (index.php:373)
<form id="form10" class="form_style1" onsubmit="return validateForm(this)">
```

---

### 1.7 WYSEdit (Éditeur WYSIWYG)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `ihm/wysedit.js` | ⚠️ À explorer | Éditeur enrichi possible |
| **CSS** | `.wysedit` | À chercher | Styles de l'éditeur |
| **HTML** | À chercher | À chercher | `<div class="wysedit">` ou `<textarea>` |
| **EventBus** | À explorer | — | À documenter |

```javascript
// Import (index.php:60)
import { initWysedit } from '/assets/js/ihm/wysedit.js'

// Initialisation (index.php:159)
initWysedit()
```

---

### 1.8 Scene Background (Arrière-plan SVG animé)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `ihm/cp_scene_bg.js` | ✅ Actif | Animation SVG pour `.cp_scene` |
| **CSS** | `.cp_scene` | ✅ Classe | Conteneur de scène avec fond animé |
| **HTML** | À chercher | À chercher | `<section class="cp_scene">` |
| **EventBus** | À explorer | — | Probablement pour l'animation |
| **Type** | ✅ SVG animé | — | Code embarqué SVG + GSAP ou CSS3 |

```javascript
// Import (index.php:101)
import { initSceneBg } from '/assets/js/ihm/cp_scene_bg.js'

// Initialisation (index.php:206)
initSceneBg()
```

---

## 2. Composants Graphiques

### 2.1 CodeVal (Interpréteur JavaScript)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS (Simple)** | `ihm/codeval.js` | ⚠️ Ancien | Version simple, pas EventBus |
| **JS (Avancé)** | `components/codeval.js` | ✅ Recommandé | Version full EventBus |
| **CSS** | `.codeval`, `.result` | À chercher | Styles du bloc code |
| **HTML** | `Cms.php` Articles | ✅ Exemple | `<div id="CODEVAL_id" class="codeval">` |
| **EventBus** | ✅ Publie | `codeval:eval`, `codeval:toggle` | Événements d'exécution |

```javascript
// Import (index.php:107) — VERSION AVANCÉE
import { initCodeVal } from '/assets/js/components/codeval.js'

// Initialisation (index.php:160)
initCodeVal()

// API globales
window.codeval_toggle(id)   // Masquer/afficher code
window.codeval_run(id)      // Exécuter le code
```

**Ressources HTML commentées** (Cms.php) :
```html
<!-- Bloc CodeVal (article, section) -->
<div id="CODEVAL_1" class="codeval">
  <textarea><!-- Code JavaScript utilisateur --></textarea>
  <button onclick="window.eventBusPublish(event, 'codeval:eval', 'CODEVAL_1')">
    Exécuter
  </button>
  <div class="scriptcode" style="display:none;"><!-- Code affiché --></div>
  <div class="result"><!-- Résultat ou erreur --></div>
</div>
```

---

### 2.2 Apex Charts (Graphiques)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS (Simple)** | `ihm/codeval.js` | ⚠️ Ancien | Limite |
| **JS (Avancé)** | `components/apex.js` | ✅ Recommandé | Full EventBus, registry de types |
| **CDN** | ApexCharts CDN | ✅ Externe | `https://cdn.jsdelivr.net/npm/apexcharts` (index.php:19) |
| **CSS** | ApexCharts default | ✅ CDN | Fourni par CDN |
| **HTML** | `Cms.php` Articles | ✅ Exemple | `<div id="apex_1" class="cp_apex" data-chart="line">` |
| **EventBus** | ✅ Publie | `apex:render`, `apex:update`, `apex:destroy`, `apex:list` | Full API |

```javascript
// Import (index.php:110)
import { initApex } from '/assets/js/components/apex.js'

// Initialisation (index.php:161)
initApex()

// API globales
window.apexRender(id, type, payload)   // Render chart
window.apexUpdate(id, series)          // Update data
window.apexDestroy(id)                 // Destroy
window.apexList()                      // List charts

// HTML (auto-instanciation)
<div id="apex_1" class="cp_apex" data-chart="line"></div>
```

**Types de graphiques** (components/apex.js registry) :
- `line` — courbe
- `bars` — barres
- `moteurCouple` — spécifique (Couple/RPM)

**Ressources HTML** (Cms.php) :
```html
<div id="APEX_LIGNE_1" class="cp_apex" data-chart="line"></div>
<div id="APEX_BARRES_1" class="cp_apex" data-chart="bars"></div>
```

---

### 2.3 Mermaid (Diagrammes)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS (Simple)** | `plugins/mermaid.js` | ⚠️ Ancien | À remplacer |
| **JS (Avancé)** | `components/mermaid.js` | ✅ Recommandé | Full EventBus |
| **CDN** | Mermaid ESM | ✅ Externe | `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs` |
| **CSS** | Mermaid default | ✅ CDN | Fourni par CDN |
| **HTML** | `.mermaid` blocks | ✅ Classe | `<pre class="mermaid">...</pre>` ou `<div class="mermaid">...</div>` |
| **EventBus** | ✅ Publie | `mermaid:render`, `mermaid:set`, `mermaid:preset` | Full API |
| **Rendu différé** | ✅ | Lors du `tabs:switch` | Optimise pour onglets |

```javascript
// Import (index.php:113)
import { initMermaid } from '/assets/js/components/mermaid.js'

// Initialisation (index.php:162)
initMermaid()

// API globales
window.mermaid_Run(id)                        // Re-render diagram
window.mermaid_printArguments(...args)        // Debug
window.mermaid_printTask(task)                // Debug

// HTML (statique)
<pre class="mermaid" id="diagram_1">
  sequenceDiagram
  participant A
  participant B
  A->>B: Hello
</pre>

<!-- Ou dynamique -->
<div id="diagram_2" class="mermaid"></div>
```

**Événements** (components/mermaid.js) :
```javascript
bus.subscribe('tabs:switch', ({ name }) => runInArticle(name))
bus.subscribe('mermaid:render', ({ id }) => reRender(id))
bus.subscribe('mermaid:set', ({ id, definition }) => setAndRender(id, definition))
bus.subscribe('mermaid:preset', ({ id, type }) => setAndRender(id, builder()))
```

**Types de preset** (components/mermaid.js registry) :
- `sequenceMinimal` — diagramme de séquence simple
- `ganttEmpty` — gantt vide


#### Historique

**2026-07-07** - ajout de bootstrapDom()

- ajout de bootstrapDom() appelée à la fin de initMermaid(). 
    Elle scanne tous les .mermaid présents dans le DOM au chargement, les ajoute au Set rendered, et appelle mermaid.run().
  
- Les abonnements aux events existants (tabs:switch, nav:goto) restent intacts — quand les onglets arriveront, runInArticle() ignorera automatiquement les éléments déjà dans rendered.

---

## 3. Composants Métier (Features)

### 3.1 Mot (Dictionnaire)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `features/mot/index.js` | ✅ Actif | Import centralisant form/controller/renderer |
| **Controller** | `features/mot/mot.controller.js` | ✅ Actif | Orchestration métier |
| **Form** | `features/mot/mot.form.js` | ✅ Actif | Validation + soumission |
| **Renderer** | `features/mot/mot.renderer.js` | ✅ Actif | Rendu table/résultats |
| **EventBus** | ✅ Full | `mot:*`, `forms:submit` | Pattern Form/Controller/Renderer |
| **API** | Endpoint `/` | À chercher | Route métier |

```javascript
// Import (index.php:68-71)
import { 
    initMotController,
    initMotRenderer,
    initMotForm 
} from '/assets/js/features/mot/index.js'

// Initialisation (index.php:179)
initMotForm()
initMotController()
initMotRenderer()
```

---

### 3.2 Image

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `features/image/index.js` | ✅ Actif | Même pattern que MOT |
| **Controller** | `features/image/image.controller.js` | À explorer | |
| **Form** | `features/image/image.form.js` | À explorer | |
| **Renderer** | `features/image/image.renderer.js` | À explorer | |

```javascript
// Import (index.php:74)
import { initImageController, initImageRenderer, initImageForm } from '/assets/js/features/image/index.js'

// Initialisation (index.php:185)
initImageForm()
initImageController()
initImageRenderer()
```

---

### 3.3 Adresse & Composants (TypeVoie, CodePostal)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **TypeVoie** | `features/typevoie/index.js` | ✅ Actif | Rue, avenue, etc. |
| **CodePostal** | `features/codepostal/index.js` | ✅ Actif | Codes postaux |
| **Adresse complète** | `features/adresse/index.js` | ✅ Actif | Agrégation |

```javascript
// Imports (index.php:82-86)
import { initTvController, initTvRenderer, initTvForm } from '/assets/js/features/typevoie/index.js'
import { initCpController, initCpRenderer, initCpForm } from '/assets/js/features/codepostal/index.js'
import { initAdresseController, initAdresseRenderer, initAdresseForm } from '/assets/js/features/adresse/index.js'

// Initialisation (index.php:192-194)
initTvForm(); initTvController(); initTvRenderer()
initCpForm(); initCpController(); initCpRenderer()
initAdresseForm(); initAdresseController(); initAdresseRenderer()
```

---

### 3.4 Forme Juridique (FJ)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `features/formejuridique/index.js` | ✅ Actif | SARL, SAS, EIRL, etc. |
| **Pattern** | Form/Controller/Renderer | ✅ Oui | Standard du projet |

```javascript
// Import (index.php:77)
import { initFjController, initFjRenderer, initFjForm } from '/assets/js/features/formejuridique/index.js'

// Initialisation (index.php:187)
initFjForm(); initFjController(); initFjRenderer()
```

---

### 3.5 Code NAF

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `features/codenaf/index.js` | ✅ Actif | Codes d'activité INSEE |
| **Pattern** | Form/Controller/Renderer | ✅ Oui | Standard |

```javascript
// Import (index.php:79)
import { initNafController, initNafRenderer, initNafForm } from '/assets/js/features/codenaf/index.js'

// Initialisation (index.php:181)
initNafForm(); initNafController(); initNafRenderer()
```

---

### 3.6 Plan Comptable Général (PCG)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `features/pcg/index.js` | ✅ Actif | Comptes comptables |
| **Pattern** | Controller/Renderer seulement | ⚠️ Pas de Form ? | À vérifier |

```javascript
// Import (index.php:89)
import { initPcgController, initPcgRenderer } from '/assets/js/features/pcg/index.js'

// Initialisation (index.php:183)
initPcgController(); initPcgRenderer()
```

---

### 3.7 Organisation & Entreprise

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **Organisation** | `features/organisation/index.js` | ✅ Actif | Structures |
| **Entreprise** | `features/entreprise/index.js` | ✅ Actif | Données entreprise |
| **Pattern** | Form/Controller/Renderer | ✅ Oui | Standard |

```javascript
// Imports (index.php:91, 93)
import { initOrgController, initOrgRenderer, initOrgForm } from '/assets/js/features/organisation/index.js'
import { initEntController, initEntRenderer, initEntForm } from '/assets/js/features/entreprise/index.js'

// Initialisation (index.php:189-190)
initOrgForm(); initOrgController(); initOrgRenderer()
initEntForm(); initEntController(); initEntRenderer()
```

---

### 3.8 Authentification (Auth)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `features/auth/index.js` | ✅ Actif | Login/Logout |
| **Pattern** | Controller/Renderer | ✅ Oui | Pas de Form |
| **Init** | **Première** (index.php:172) | ✅ Prioritaire | Les autres features en dépendent |

```javascript
// Import (index.php:95)
import { initAuthController, initAuthRenderer } from '/assets/js/features/auth/index.js'

// Initialisation — EN PREMIER (index.php:172-176)
initAuthController()
initAuthRenderer()
bus.publish('auth:check')

// Puis les autres features…
```

---

## 4. Composants Audio/Voix (Vox)

### 4.1 Vox (Synthèse vocale)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS (Synthèse)** | `core/vox.js` | ✅ Actif | Logique Web Speech API |
| **JS (Rendu UI)** | `core/vox.renderer.js` | ✅ Actif | DOM + highlights |
| **JS (Reconnaissance)** | `core/vox.listen.js` | ✅ Actif | Speech-to-Text (optionnel) |
| **HTML** | `Cms.php` Article 9 | ✅ Exemple | Dialogue « Juliette: … Romeo: … » |
| **EventBus** | ✅ Full | `vox:start`, `vox:pause`, `vox:highlight` | Voir flux ci-dessous |

```javascript
// Imports (index.php:97-100)
import { initVoxBus } from '/assets/js/core/vox.js'
import { initVoxRenderer } from '/assets/js/core/vox.renderer.js'
import { initVoxListen } from '/assets/js/core/vox.listen.js'

// Initialisation (index.php:203-205)
initVoxBus()
initVoxRenderer()   // ← rendu UI vox
initVoxListen()
```

**Ressources HTML** (Cms.php Article 9) :
```html
<textarea id="TXT_VOX_1" style="display:none;">
Juliette: Bonjour, je suis Juliette.
Romeo: Bonjour, je suis Roméo.
</textarea>

<div id="VOX_STATUS" class="vox-status">—</div>

<button onclick="window.eventBusPublish(event,'vox:start',
      { targetId:'TXT_VOX_1', statusId:'VOX_STATUS' })">
  ▶ Lire
</button>
```

**Événements** (vox.js) :
- `vox:start` → Lance lecture (avec text ou targetId)
- `vox:pause` → Met en pause
- `vox:resume` → Reprend
- `vox:stop` → Arrête
- `vox:boundary` → Limite de mot (interne)
- `vox:highlight` → Consommé par vox.renderer pour mettre en surbrillance

---

## 5. Composants Géographiques

### 5.1 Leaflet (Carte)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `plugins/mapleaflet.js` | ✅ Actif | Wrapper Leaflet |
| **CDN Leaflet** | CDN officiel | ✅ Externe | https://unpkg.com/leaflet@1.9.4 (index.php:22, 25) |
| **CSS** | `assets/css/GpPluginLeaflet.css` | ✅ Custom | Styles Géoplateforme |
| **Plugin** | GpPluginLeaflet.js | ✅ Actif | Extension Géoplateforme (index.php:28) |
| **HTML** | À chercher | À chercher | `<div id="map">` ou `<div class="leaflet-map">` |

```javascript
// Import (index.php:119)
import { initLeaflet } from '/assets/js/plugins/mapleaflet.js'

// Initialisation (index.php:208)
initLeaflet()
```

---

## 6. Composants 3D

### 6.1 Three.js

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `ihm/3js.js` | ✅ Wrapper | Loader pour Three.js |
| **ImportMap** | index.php:31-37 | ✅ Actif | Import mapping pour modules Three |
| **CDN** | Unpkg CDN | ✅ Externe | https://unpkg.com/three@0.160.0 |
| **HTML** | À chercher | À chercher | `<canvas id="3js_1">` ou `<div id="three_scene">` |
| **EventBus** | ✅ | `threejs:list`, `threejs:start`, `threejs:stop` | API globale (index.php:142-144) |

```javascript
// Import (index.php:121)
import { initThreejs } from '/assets/js/ihm/3js.js'

// API globales (index.php:142-144)
window.threeList = () => bus.publish('threejs:list')
window.threeStart = (id) => bus.publish('threejs:start', id)
window.threeStop = (id) => bus.publish('threejs:stop', id)

// Initialisation (index.php:210)
initThreejs()
```

---

## 7. Noyau & Utilitaires

### 7.1 EventBus (Bus d'événements)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `core/eventBus.js` | ✅ Critique | Colonne vertébrale |
| **Pattern** | Pub/Sub | ✅ Oui | `bus.publish()`, `bus.subscribe()` |
| **Import** | Partout | ✅ Oui | Utilisé par tous les composants |

```javascript
import { bus } from '/assets/js/core/eventBus.js'

bus.publish('mon:event', { data: 'valeur' })
bus.subscribe('mon:event', (payload) => { ... })
```

---

### 7.2 DomHelper (Utilitaires DOM)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `core/domhelper.js` | ✅ Utilitaire | `byId()`, `qs()`, `qsa()`, `autocomplete()` |
| **Import** | `index.php:46` | ✅ Oui | Utilisé pour manipulation DOM |
| **Init** | `index.php:157` | ✅ Oui | `domhelper.init()` |

```javascript
import * as domhelper from '/assets/js/core/domhelper.js'

const el = domhelper.byId('myId')          // getElementById
const el = domhelper.qs('selector', parent)  // querySelector
const els = domhelper.qsa('selector', parent)  // querySelectorAll
const ac = domhelper.autocomplete({...})   // Autocomplete widget
```

---

### 7.3 ClientInfo (Détection capacités)

| Aspect | Fichier | Statut | Notes |
|--------|---------|--------|-------|
| **JS** | `core/clientinfo.js` | ✅ Actif | Détecte: tactile, Web Speech, géoloc, etc. |
| **Fonction** | `probeClientCapabilities()` | ✅ Async | Publie `client:info` |
| **Init** | `index.php:169` | ✅ À window.load | Appelée après DOMContentLoaded |

```javascript
// Import (index.php:48)
import { probeClientCapabilities } from '/assets/js/core/clientinfo.js'

// Initialisation (index.php:169)
probeClientCapabilities()  // Publie 'client:info'
```

---

## 8. Tableau récapitulatif général

| Composant | Type | Fichier | Version | Statut | Bus |
|-----------|------|---------|---------|--------|-----|
| **Sidebar** | IHM | `ihm/sidebar.js` | Simple | ✅ | ❌ |
| **Tabs** | IHM | `ihm/tabspage.js` | Simple | ✅ | ✅ |
| **Dialog** | IHM | `ihm/dialog.js` | Simple | ✅ | ✅ |
| **Carousel** | IHM | `ihm/carousel.js` | Simple | ✅ | ✅ |
| **CallOut** | IHM | `ihm/callout.js` | Simple | ✅ | ❌ |
| **Forms** | IHM | `ihm/formsManager.js` | Simple | ✅ | ✅ |
| **WYSEdit** | IHM | `ihm/wysedit.js` | ? | ⚠️ | ? |
| **SceneBg** | IHM | `ihm/cp_scene_bg.js` | Avancée | ✅ | ? |
| **CodeVal** | Graphique | `components/codeval.js` | Avancée | ✅ | ✅ |
| **Apex** | Graphique | `components/apex.js` | Avancée | ✅ | ✅ |
| **Mermaid** | Graphique | `components/mermaid.js` | Avancée | ✅ | ✅ |
| **Mot** | Métier | `features/mot/index.js` | Avancée | ✅ | ✅ |
| **Image** | Métier | `features/image/index.js` | Avancée | ✅ | ✅ |
| **TypeVoie** | Métier | `features/typevoie/index.js` | Avancée | ✅ | ✅ |
| **CodePostal** | Métier | `features/codepostal/index.js` | Avancée | ✅ | ✅ |
| **Adresse** | Métier | `features/adresse/index.js` | Avancée | ✅ | ✅ |
| **FormJuridique** | Métier | `features/formejuridique/index.js` | Avancée | ✅ | ✅ |
| **CodeNAF** | Métier | `features/codenaf/index.js` | Avancée | ✅ | ✅ |
| **PCG** | Métier | `features/pcg/index.js` | Avancée | ✅ | ✅ |
| **Organisation** | Métier | `features/organisation/index.js` | Avancée | ✅ | ✅ |
| **Entreprise** | Métier | `features/entreprise/index.js` | Avancée | ✅ | ✅ |
| **Auth** | Métier | `features/auth/index.js` | Avancée | ✅ | ✅ |
| **Vox** | Audio | `core/vox.js` + `core/vox.renderer.js` | Avancée | ✅ | ✅ |
| **Leaflet** | Géo | `plugins/mapleaflet.js` | Avancée | ✅ | ? |
| **Three.js** | 3D | `ihm/3js.js` | Avancée | ✅ | ✅ |

---

## 9. Notes & Recommandations

### Versions à privilégier

✅ **Toujours préférer** :
- `components/` → versions avancées avec EventBus
- `features/{nom}/index.js` → loader centralisé

⚠️ **À remplacer progressivement** :
- `ihm/codeval.js` → remplacer par `components/codeval.js`
- `plugins/mermaid.js` → remplacer par `components/mermaid.js`

### Améliorations possibles

- [ ] **WYSEdit** — à documenter + améliorer (version ihm vs features)
- [ ] **Carousel** — explorer `CarouselManager.js` pour la logique complète
- [ ] **3js.js** — explorer le contenu complet du wrapper
- [ ] **Leaflet** — documenter les cas d'usage (cartes, couches, etc.)

### Architecture recommandée pour nouveaux composants

Suivre le pattern **Form/Controller/Renderer** utilisé par les métiers :

```
features/moncomponent/
  ├── index.js                    # Loader
  ├── moncomponent.form.js        # Validation + soumission
  ├── moncomponent.controller.js  # Orchestration
  └── moncomponent.renderer.js    # DOM + affichage
```

Publier/souscrire sur l'EventBus pour découpler.

---

**Statut** : Documentation complète des composants (v0.4)  
**Date** : 2026-07-02  
**Référence** : `old/app/Views/cms/index.php` (bootstrap) + `old/app/Controllers/Cms.php` (données)
