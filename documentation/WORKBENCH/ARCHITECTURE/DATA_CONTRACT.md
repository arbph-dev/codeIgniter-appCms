# DATA_CONTRACT.md
> Contrat de données — comment les données circulent entre toutes les couches  
> Client ↔ Serveur · Service → Workbench → Panel · Panel → Form · Form → Dialog · Workbench → Composant

---

## 1. Enveloppe API standard (Serveur → Client)

Toutes les réponses JSON de l'API respectent cette structure :

```json
{
  "status"  : 200,
  "data"    : {} ,
  "pager"   : { "currentPage": 1, "perPage": 20, "total": 150 },
  "message" : "Opération réussie."
}
```

| Champ | Type | Présent | Contenu |
|---|---|---|---|
| `status` | int | toujours | Code HTTP miroir |
| `data` | object \| array | toujours | Ressource ou liste |
| `pager` | object \| null | liste paginée seulement | `currentPage`, `perPage`, `total` (± `pageCount`) |
| `message` | string \| null | optionnel | Confirmation ou erreur lisible |

### Codes et comportement attendu côté service

```
200  → ok        → retourne result.data
201  → created   → retourne result.data (ressource créée)
404  → not found → throw new Error(result.message)
422  → invalid   → throw new Error(result.message)  — erreurs de validation
4xx/5xx          → throw new Error('HTTP ' + res.status)
```

---

## 2. Types des données en transit

### Règle générale : tout est sérialisable JSON

Aucun objet JavaScript ne traverse la frontière client ↔ serveur.

| Champ | Type API (JSON) | Type JS après parse | Remarque |
|---|---|---|---|
| PK / FK entier | `number` | `number` | `id`, `adresse_id`, `codepostal_id`… |
| Texte court | `string` | `string` | Peut être `null` si optionnel |
| Date | `string` `YYYY-MM-DD` | `string` | **Jamais** un objet `Date` en transit |
| DateTime | `string` ISO 8601 | `string` | `created_at`, `updated_at` |
| Booléen | `0\|1` (MySQL) ou `true\|false` | `boolean` | Normaliser côté API |
| Enum / code | `string` | `string` | `'B'`, `'ENTREPRISE'`… |
| Null | `null` | `null` | Champ optionnel absent = `null`, jamais `""` |

### Règle null vs chaîne vide

```
Côté DB       : NULL         ← champ absent
Côté JSON/API : null         ← champ absent
Côté Form.js  : ''           ← input vide (text)
Côté service  : convertir '' → null avant POST/PUT pour les FK optionnels
```

Le service est responsable de cette conversion :

```javascript
// adresse.service.js — exemple
const body = { ...fields }
if (!body.voiecharniere) body.voiecharniere = null   // '' → null
```

---

## 3. Flux Client → Serveur (service.js)

### 3a. Requête GET (liste / recherche)

```javascript
const params = new URLSearchParams()
if (q)      params.set('q',        q)        // string — recherche texte
if (typeId) params.set('type',     typeId)   // int string — filtre FK
params.set('page',     page)                 // int — pagination
params.set('per_page', perPage)              // int — taille page

const res = await apiFetch(`/api/organisation?${params}`)
```

**Règle :** URLSearchParams pour GET. Pas de body.

### 3b. Requête POST / PUT (création / mise à jour)

```javascript
// Toujours JSON pur sauf upload fichier
const res = await apiFetch(url, {
    method : 'PUT',
    body   : JSON.stringify(fields),   // fields = résultat Form.extract()
})

// Upload fichier uniquement → FormData (pas de Content-Type manuel)
const body = new FormData()
body.append('file', file)             // File object de type 'file'
body.append('alt',  alt)
```

**Règle :** JSON.stringify pour tout sauf File. apiFetch ne pose pas de Content-Type sur FormData (boundary auto).

### 3c. Signature des fonctions service

```javascript
// Lecture
fetchXxx({ q, page, perPage, ...filtres })     → Promise<{ data: [], pager: {} }>
fetchXxxById(id)                               → Promise<{ data: {} }>
fetchXxxLike({ q, len })                       → Promise<object[]>  // tableau plat

// Écriture — id distingue POST vs PUT
saveXxx({ id = null, ...fields })              → Promise<{ data: {} }>
deleteXxx(id)                                  → Promise<{ message: string }>
```

**`fetchXxxLike` retourne un tableau plat** (pas d'enveloppe `{ data: [] }`) pour être directement compatible avec `RelationPickerDialog.fetchFn` et les champs autocomplete.

---

## 4. Flux Serveur → Client — ce que les panels reçoivent

### 4a. Objet item (list ou detail)

```javascript
// list — partiel (jointures limitées à withRelations())
{
    id                   : 1,
    nom                  : "Entreprise ACME",
    organisation_type_id : 1,
    type_label           : "Entreprise",     // ← dénormalisé JOIN
    siren                : "123456789",
    adresse_id           : 5,               // FK seule — pas de sub-objet
}

// detail — enrichi (show/:id peut avoir des sub-objets)
{
    id                   : 1,
    nom                  : "Entreprise ACME",
    organisation_type_id : 1,
    type_label           : "Entreprise",
    adresse_id           : 5,
    adresse              : {               // ← sub-objet si API enrichie
        id         : 5,
        voienom    : "Lilas",
        cp_commune : "Pont-l'Abbé",
    },
}
```

### 4b. Convention de nommage des clés

| Motif | Exemple | Source |
|---|---|---|
| PK | `id` | Toujours `id` en sortie API (même si modèle PHP a une autre PK) |
| FK | `adresse_id` | Suffixe `_id` |
| JOIN dénormalisé | `type_label`, `voietype_nom`, `cp_commune` | Préfixe table source |
| Sub-objet enrichi | `adresse`, `type`, `logo` | Objet complet imbriqué |

**Règle PK :** L'API normalise toujours en `id`. Les anciennes PK (`mot_id`, `img_id`) sont alias en `id` dans le contrôleur ou la requête SQL.

---

## 5. Service → Workbench → Panel

```
service.fetchXxx()
    └── result.data   → Array<item>     → listPanel.show(items, pager)
    └── result.pager  → pager object    → listPanel.show(items, pager)

listPanel.onSelect(item)              item brut issu de la liste
    └── Workbench
          └── detailPanel.show(item)  même item brut transmis tel quel

detailPanel.onSave(id, data)
    id   : number | null              PK de l'item (null = création)
    data : object                     résultat de Form.extract()
    └── Workbench
          └── service.saveXxx({ id, ...data })
                └── result.data → detailPanel.show(saved)  si API retourne la ressource
```

### Règle de transmission

**Le Workbench ne transforme pas les données.** Il est un tuyau :

```javascript
// ✅ Correct — transmission directe
this.listPanel.onSelect(item => this.detailPanel.show(item))

// ❌ Incorrect — le Workbench ne filtre ni ne transforme
this.listPanel.onSelect(item => this.detailPanel.show({ ...item, extra: 'valeur' }))
```

Si une transformation est nécessaire, elle appartient au service (normalisation) ou au Panel/Form (présentation).

---

## 6. Panel → Form.js — cycle fill / extract

### 6a. fill(data) — API → Formulaire

`fill(data)` mappe les clés de `data` aux champs du PropertySet via `prop.name`.

```javascript
// data reçu de l'API
const data = { id: 5, voienom: 'Lilas', codepostal_id: 42, cp_codepostal: '29120', cp_commune: "Pont-l'Abbé" }

// PropertySet
{ name: 'voienom',      type: 'text'     }  → field.value = 'Lilas'
{ name: 'codepostal_id', type: 'relation' }  → hidden.value = '42'
                                              + displayFn(data) = '29120 Pont-l\'Abbé'
```

**Règle :** `prop.name` doit correspondre **exactement** à la clé de l'objet API.  
Si l'API retourne `organisation_type_id`, le PropertySet doit avoir `name: 'organisation_type_id'`.

### 6b. extract() — Formulaire → Service

```javascript
// Résultat de Form.extract() selon les types
type: 'text'     → string (peut être '')
type: 'email'    → string
type: 'url'      → string
type: 'number'   → parseInt(value, 10)
type: 'date'     → string 'YYYY-MM-DD' | null
type: 'select'   → string (valeur de l'option sélectionnée)
type: 'radio'    → string (valeur du radio coché) | null
type: 'checkbox' → boolean
type: 'relation' → number (parseInt) | string | null
type: 'file'     → File object | null
```

**Règle date :** `type: 'date'` retourne `field.value` (string YYYY-MM-DD natif du browser).  
Jamais un objet `Date` — il ne passe pas dans JSON.stringify correctement.

### 6c. displayFn vs itemDisplay (champs relation)

Deux fonctions distinctes dans les options d'un champ `type: 'relation'` :

```javascript
{
    name : 'codepostal_id',
    type : 'relation',
    options : {
        // Après sélection dans le picker
        // item = objet brut retourné par fetchFn (suggest())
        itemDisplay : (item) => `${item.codepostal} ${item.commune}`,

        // En mode fill() — reconstruire le label depuis les données de l'API parente
        // data = objet complet reçu de l'API (avec JOINs)
        displayFn   : (data) => `${data.cp_codepostal} ${data.cp_commune}`,
    }
}
```

| | Source de `data` | Quand |
|---|---|---|
| `itemDisplay(item)` | item retourné par `fetchFn` du picker | Après sélection dialog |
| `displayFn(data)` | objet API parent (avec champs JOIN) | Au `fill()` (mode édition) |

**Règle :** `displayFn` doit être tolérant aux champs manquants (API partielle) :

```javascript
displayFn: (data) => [data.cp_codepostal, data.cp_commune].filter(Boolean).join(' ')
// ↑ filter(Boolean) protège si JOIN absent (list vs detail)
```

---

## 7. Form.js → Dialog (champs relation)

```
Form (type: 'relation')
    │
    ├── btn click
    │     └── bus.publish('dialog:show', dialogId)
    │
    └── bus.subscribe('dialog:select', handler)
          ← handler filtre { sourceId === dialogId }
          ← item = objet brut retourné par fetchFn

RelationPickerDialog
    │
    ├── fetchFn(q)  → items[]    tableau plat (fetchXxxLike)
    │
    └── onRowClick(item)
          └── dialogManager.select(dialogId, item)
                └── bus.publish('dialog:select', { sourceId: dialogId, item })
```

### Ce que `item` contient

`item` est l'objet **brut** retourné par `fetchFn` — aucune transformation dans `RelationPickerDialog`.

```javascript
// Exemple CodePostal (suggest() AdresseModel)
item = { id: 42, codepostal: '29120', commune: "Pont-l'Abbé" }

// Le champ relation extrait :
hidden.value  = item['id']                           // valueKey: 'id'
display.value = `${item.codepostal} ${item.commune}` // itemDisplay(item)
```

**Règle :** `valueKey` doit exister dans tous les items retournés par `fetchFn`.  
Si `fetchFn` retourne des items sans `id`, le champ relation recevra `undefined`.

---

## 8. Workbench → Composant

Un **composant** est une librairie externe intégrée via un Panel spécialisé.  
Le composant ne connaît pas le Workbench — il reçoit ses données via le bus ou via des méthodes du Panel.

### 8a. Leaflet (MapPanel)

```javascript
// Workbench → MapPanel
mapPanel.show(adresse)     // adresse = objet brut de l'API

// MapPanel → Leaflet (via bus)
bus.publish('leaflet:render', {
    id      : 'wb_adresse_map',
    type    : 'osm',
    payload : {
        lat  : parseFloat(adresse.latitude)  || DEFAULT_LAT,
        lng  : parseFloat(adresse.longitude) || DEFAULT_LNG,
        zoom : adresse.latitude ? 14 : 10,
    }
})
```

Le Panel est responsable de la **normalisation** : il extrait `latitude`/`longitude` de l'objet adresse et construit le payload Leaflet. Le Workbench passe l'objet brut, le Panel adapte.

**Données attendues par le composant Leaflet :**

```javascript
{ lat: number, lng: number, zoom: number }   // tous required
```

**Règle :** Si `latitude` est null (non géocodé), le Panel utilise des coordonnées par défaut — il ne publie pas avec `lat: null`.

### 8b. Dialog (RelationPickerDialog)

```javascript
// Workbench → Dialog (configuration à la création, pas au runtime)
new RelationPickerDialog({
    id      : 'dialog_cp',
    fetchFn : (q) => fetchCpLike({ q }),    // fonction, pas données
    columns : [{ key: 'codepostal', label: 'CP' }],
})

// Dialog → Form (via bus — runtime)
bus.publish('dialog:select', { sourceId: 'dialog_cp', item: { id: 42, ... } })
```

Le Dialog reçoit une **fonction** (`fetchFn`), pas des données. Il récupère les données au moment de la recherche.

---

## 9. Données entre Panels

Les Panels ne se parlent **jamais directement**.

```
listPanel.onSelect(item)
    → Workbench reçoit item
    → Workbench appelle detailPanel.show(item)
    → Workbench appelle mapPanel.show(item)    (si applicable)
```

```
detailPanel.onSave(id, data)
    → Workbench sauvegarde
    → Workbench appelle load()
    → Workbench appelle detailPanel.show(savedItem)
    → Workbench appelle mapPanel.show(savedItem)
```

**Règle :** Si deux panels ont besoin des mêmes données, le Workbench les envoie aux deux. Pas de référence croisée entre panels.

---

## 10. Récapitulatif — qui transforme quoi

| Couche | Reçoit | Retourne | Transforme |
|---|---|---|---|
| **API PHP** | body JSON | objet + JOINs | normalise PK en `id`, calcule `type_label`… |
| **service.js** | params JS | `{ data, pager }` | URLSearchParams, JSON.stringify, null-cleaning |
| **Workbench** | `{ data, pager }` | item brut | **rien** — tuyau pur |
| **ListPanel** | items + pager | événement `onSelect(item)` | rendu HTML uniquement |
| **DetailPanel** | item brut | `onSave(id, data)` | `fill()` → affichage, `extract()` → données |
| **Form.js** | data objet | data extrait | cast types, validation |
| **PropertySet** | — | config champs | `displayFn`, `itemDisplay`, `validate` |
| **Panel composant** | objet métier | payload composant | extrait les champs utiles (lat/lng…) |

---

## 11. Checklist nouvelle feature

```
□ Service
  □ fetchXxx retourne { data, pager } (liste) ou { data } (detail)
  □ fetchXxxLike retourne items[] plat
  □ saveXxx distingue POST (id=null) vs PUT (id>0) via { id, ...fields }
  □ Chaînes vides → null pour FK optionnels

□ PropertySet
  □ prop.name correspond exactement à la clé API
  □ type: 'date' → pas de validate Date object, string YYYY-MM-DD attendu
  □ type: 'relation' → displayFn tolérant aux champs manquants
  □ type: 'relation' → itemDisplay présent et cohérent avec fetchFn

□ Panel
  □ show(item) : l'item vient de l'API sans transformation Workbench
  □ onSave(id, data) : data = Form.extract(), id = PK ou null
  □ Pas de référence croisée entre panels

□ Composant (Leaflet, Dialog…)
  □ Panel normalise l'objet API → payload composant
  □ Valeurs null gérées (coordonnées manquantes → défaut)
  □ Composant détruit au destroy() du Panel ou du Workbench
```
