
# RelationPickerDialog

> source : [`RelationPickerDialog.js`](/refactoring/assets/js/ui/shared/RelationPickerDialog.js)

Dialog générique de sélection d'une entité liée (FK).  
Utilisé par les champs `type: 'relation'` de Form.js via le bus `dialog:*`.

---

## Rôle

`RelationPickerDialog` :

1. construit un `<dialog>` natif ;
2. l'enregistre auprès de `DialogManager` (insertion dans `document.body`) ;
3. gère la recherche avec debounce via une `fetchFn` fournie ;
4. affiche les résultats dans une table ;
5. publie la sélection via `dialogManager.select(id, item)` → event bus `dialog:select`.

### Ce qu'il ne fait PAS

- ne connaît pas le champ Form qui l'a ouvert ;
- ne transforme pas l'item (`valueKey`, `itemDisplay`, `displayFn` appartiennent à Form / PropertySet) ;
- ne stocke aucun état persistant entre deux ouvertures ;
- n'appelle pas d'API lui-même — uniquement la `fetchFn` injectée.

---

## Paramètres constructeur

| Paramètre   | Type       | Défaut          | Rôle |
|-------------|------------|-----------------|------|
| `id`        | `string`   | — (requis)      | Identifiant unique = `sourceId` dans `dialog:select` et `dialogId` du PropertySet |
| `title`     | `string`   | `'Sélectionner'`| Titre du header |
| `fetchFn`   | `Function` | — (requis)      | `async (q: string) => object[]` — **tableau plat**, pas d'enveloppe `{ data }` |
| `columns`   | `Array`    | `[]`            | `[{ key, label }]` colonnes de la table de résultats |
| `minLength` | `number`   | `2`             | Nombre de caractères avant déclenchement de la recherche |

---

## API publique

| Méthode     | Rôle |
|-------------|------|
| `render()`  | Construit le `<dialog>`, enregistre auprès de DialogManager, retourne `this` (chaînable) |
| `destroy()` | Clear timer, `unregister`, nullifie les refs |

---

## Cycle de vie dans un Workbench

```text
bootstrap()
  │
  ├─ 1. _createDialogs()          ← AVANT les panels
  │     new RelationPickerDialog({...}).render()
  │     → dialogManager.register(id, el) → document.body
  │
  ├─ 2. WorkbenchView.build()
  ├─ 3. _createPanels()           ← Form.js s'abonne à dialog:select
  ├─ 4. _bindEvents()
  └─ 5. load()

destroy()
  │
  ├─ dialogs.destroy()            ← unregister + remove DOM
  ├─ panels.destroy()
  └─ view.destroy()
````

**Règle** : créer les dialogs **avant** les panels. Sinon un clic 🔍 trop tôt publie dialog:show alors que le dialog n'est pas encore enregistré.

---

## Flux complet avec Form.js

text

```
1. Form (type: relation) — bouton 🔍
     → bus.publish('dialog:show', dialogId)

2. DialogManager.show(dialogId)
     → <dialog>.showModal()

3. Utilisateur saisit ≥ minLength caractères
     → debounce 280 ms → fetchFn(q) → table

4. Clic sur une ligne
     → dialogManager.select(id, item)
     → bus.publish('dialog:select', { sourceId, item })
     → dialog.close()

5. Form handler (filtré sur sourceId === dialogId)
     → hidden = item[valueKey]
     → display = itemDisplay(item)
```

Le Workbench ne participe pas à ce flux runtime. Il configure uniquement le dialog à la création et le PropertySet du Form.

---

## Contrat fetchFn

JavaScript

```
// ✅ Correct — tableau plat
fetchFn: (q) => fetchCpLike({ q, len: 20 })
// → [{ id, codepostal, commune }, ...]

// ❌ Incorrect — enveloppe API
fetchFn: async (q) => {
    const res = await fetchOrg({ q })
    return res          // { data: [], pager: {} } → table cassée
}
// → return res.data || []
```

Aligné avec DATA_CONTRACT : les endpoints *Like / suggest retournent un tableau plat pour être compatibles avec RelationPickerDialog.

Chaque item **doit** contenir la clé utilisée comme valueKey côté PropertySet (généralement id).

---

## Exemples existants

### Adresse — code postal + type de voie

JavaScript

```
// AdresseWorkbench._createDialogs()  (pattern documenté)

this._cpPicker = new RelationPickerDialog({
    id        : 'dialog_cp',
    title     : 'Code postal',
    fetchFn   : (q) => fetchCpLike({ q }),
    columns   : [
        { key: 'codepostal', label: 'CP' },
        { key: 'commune',   label: 'Commune' },
    ],
    minLength : 2,
}).render()

this._tvPicker = new RelationPickerDialog({
    id        : 'dialog_tv',
    title     : 'Type de voie',
    fetchFn   : (q) => fetchTvLike({ q }),
    columns   : [
        { key: 'nom', label: 'Type' },
    ],
}).render()
```

PropertySet associé :

JavaScript

```
{
    name        : 'codepostal_id',
    type        : 'relation',
    description : 'Code postal',
    options     : {
        dialogId    : 'dialog_cp',
        valueKey    : 'id',
        itemDisplay : (item) => `${item.codepostal} ${item.commune}`,
        displayFn   : (data) =>
            [data.cp_codepostal, data.cp_commune].filter(Boolean).join(' '),
        required    : '',
    },
}
```

### Organisation — adresse

JavaScript

```
// OrganisationWorkbench._createDialogs()

this._adressePicker = new RelationPickerDialog({
    id        : 'dialog_adresse',
    title     : 'Sélectionner une adresse',
    fetchFn   : (q) => fetchAdresseLike({ q, len: 20 }),
    columns   : [
        { key: 'voienom',    label: 'Voie' },
        { key: 'cp_commune', label: 'Commune' },
    ],
    minLength : 2,
}).render()
```

---

## Exemples préparatoires — module Personne

Le module Personne multiplie les FK et les cibles polymorphes (personne ↔ organisation / etablissement, adresses de naissance/décès, types de parcours). Les dialogs ci-dessous anticipent le futur PersonneWorkbench sans imposer encore le code.

Références :

- API Personne
- Tables Personne

### 1. Adresse de naissance / de décès

Colonnes métier : naissance_adresse_id, deces_adresse_id.

JavaScript

```
// PersonneWorkbench._createDialogs() — proposition

this._adresseNaissancePicker = new RelationPickerDialog({
    id        : 'dialog_adresse_naissance',
    title     : 'Adresse de naissance',
    fetchFn   : (q) => fetchAdresseLike({ q, len: 20 }),
    columns   : [
        { key: 'voienom',    label: 'Voie' },
        { key: 'cp_codepostal', label: 'CP' },
        { key: 'cp_commune', label: 'Commune' },
    ],
}).render()

this._adresseDecesPicker = new RelationPickerDialog({
    id        : 'dialog_adresse_deces',
    title     : 'Adresse de décès',
    fetchFn   : (q) => fetchAdresseLike({ q, len: 20 }),
    columns   : [
        { key: 'voienom',    label: 'Voie' },
        { key: 'cp_commune', label: 'Commune' },
    ],
}).render()
```

PropertySet (extrait) :

JavaScript

```
{
    name        : 'naissance_adresse_id',
    type        : 'relation',
    description : 'Lieu de naissance',
    options     : {
        dialogId    : 'dialog_adresse_naissance',
        valueKey    : 'id',
        itemDisplay : (item) =>
            [item.voienom, item.cp_codepostal, item.cp_commune].filter(Boolean).join(' — '),
        displayFn   : (data) =>
            data.naissance_adresse_label
            ?? (data.naissance_adresse_id ? `Adresse #${data.naissance_adresse_id}` : ''),
        // required omis → optionnel
    },
}
```

> Deux dialogs distincts (dialog_adresse_naissance / dialog_adresse_deces) même si la fetchFn est identique : chaque champ relation filtre dialog:select sur son propre dialogId.

### 2. Type de parcours (parcours_types)

Référentiel lecture seule : id | code | label. Utilisé par personne_parcours.type (FK).

JavaScript

```
this._parcoursTypePicker = new RelationPickerDialog({
    id        : 'dialog_parcours_type',
    title     : 'Type de parcours',
    fetchFn   : (q) => fetchParcoursTypeLike({ q }),  // → tableau plat
    columns   : [
        { key: 'code',  label: 'Code' },
        { key: 'label', label: 'Libellé' },
    ],
    minLength : 1,  // référentiel court — 1 caractère suffit
}).render()
```

JavaScript

```
{
    name        : 'type',           // FK personne_parcours.type
    type        : 'relation',
    description : 'Type de parcours',
    options     : {
        dialogId    : 'dialog_parcours_type',
        valueKey    : 'id',
        itemDisplay : (item) => item.label,
        displayFn   : (data) => data.parcours_type_label ?? data.type_label ?? '',
        required    : '',
    },
}
```

### 3. Structure d'un parcours (organisation ou établissement)

personne_parcours.structure_objet ∈ { organisation, entreprise, etablissement }

- structure_id.

Deux approches possibles :

**A — Un dialog par type de structure** (simple, aligné sur le pattern actuel) :

JavaScript

```
this._orgPicker = new RelationPickerDialog({
    id        : 'dialog_structure_org',
    title     : 'Organisation',
    fetchFn   : (q) => fetchOrgLike({ q, len: 20 }),
    columns   : [
        { key: 'nom',        label: 'Nom' },
        { key: 'type_label', label: 'Type' },
    ],
}).render()

this._etabPicker = new RelationPickerDialog({
    id        : 'dialog_structure_etab',
    title     : 'Établissement',
    fetchFn   : (q) => fetchEtablissementLike({ q, len: 20 }),
    columns   : [
        { key: 'nom',             label: 'Nom' },
        { key: 'organisation_nom', label: 'Organisation' },
    ],
}).render()
```

Le Form / Panel choisit quel dialogId ouvrir selon structure_objet.

**B — Un seul dialog « structure »** dont la fetchFn délègue selon un contexte (nécessiterait une évolution de RelationPickerDialog — hors scope actuel).

### 4. Cible d'une relation métier (relations)

Table relations : source_type / target_type ∈ personne | organisation | etablissement, source_id / target_id, relation_type_id.

Pour lier une personne à une organisation :

JavaScript

```
this._relationTargetOrgPicker = new RelationPickerDialog({
    id        : 'dialog_relation_target_org',
    title     : 'Organisation liée',
    fetchFn   : (q) => fetchOrgLike({ q, len: 20 }),
    columns   : [
        { key: 'nom',        label: 'Nom' },
        { key: 'type_label', label: 'Type' },
    ],
}).render()

this._relationTargetPersonnePicker = new RelationPickerDialog({
    id        : 'dialog_relation_target_personne',
    title     : 'Personne liée',
    fetchFn   : (q) => fetchPersonneLike({ q, len: 20 }),
    columns   : [
        { key: 'nom_complet', label: 'Nom' },
        { key: 'date_naissance', label: 'Naissance' },
    ],
}).render()
```

PropertySet (cible organisation) :

JavaScript

```
{
    name        : 'target_id',
    type        : 'relation',
    description : 'Cible',
    options     : {
        dialogId    : 'dialog_relation_target_org',
        valueKey    : 'id',
        itemDisplay : (item) => item.nom,
        displayFn   : (data) => data.target_label ?? '',
        required    : '',
    },
}
```

Le champ relation_type_id peut rester un select / radio alimenté par GET /api/relation-types?source_type=personne&target_type=organisation (référentiel filtré, souvent assez court pour éviter un picker).

### 5. Type de relation (relation_types) — si le référentiel grossit

JavaScript

```
this._relationTypePicker = new RelationPickerDialog({
    id        : 'dialog_relation_type',
    title     : 'Type de relation',
    fetchFn   : (q) => fetchRelationTypeLike({
        q,
        source_type : 'personne',
        target_type : 'organisation',
    }),
    columns   : [
        { key: 'code',  label: 'Code' },
        { key: 'label', label: 'Libellé' },
    ],
    minLength : 1,
}).render()
```

---

## Règles d'usage

1. **Un id unique par dialog** dans toute la page (plusieurs Workbenches = préfixer, ex. personne_dialog_cp).
2. **fetchFn → tableau plat** ; normaliser dans le service si l'API renvoie { data: [] }.
3. **valueKey doit exister** sur tous les items retournés.
4. **itemDisplay (sélection)** ≠ **displayFn (fill API)** — deux fonctions distinctes.
5. **Créer les dialogs avant les panels** ; les détruire dans destroy() du Workbench.
6. **Ne pas partager un même dialogId** entre deux champs relation du même form si les handlers doivent rester isolés (sauf intention explicite).
7. Préférer RelationPicker pour les référentiels **larges / recherchables** ; un select / radio suffit pour les listes courtes figées (ex. organisation_types à 7 entrées).

---

## Relation avec les autres briques

text

```
Workbench._createDialogs()
        │
        ▼
RelationPickerDialog.render()
        │
        ▼
DialogManager.register(id, <dialog>)
        │
        ├── document.body
        └── bus : dialog:show / dialog:close / dialog:select
                │
                ▼
        Form.js (type: 'relation')
                ├── publish dialog:show
                └── subscribe dialog:select (filtré dialogId)
```

|Brique|Rôle|
|---|---|
|DialogManager|Registre + show/close/select|
|Form|Champ relation, handlers bus|
|PropertySet|dialogId, valueKey, itemDisplay, displayFn|
|DATA_CONTRACT|Forme des items, endpoints *Like|

---

## Limites actuelles / évolutions possibles

|Limite|Commentaire|
|---|---|
|Pas de navigation clavier (↑↓ Enter) dans la table|Acceptable pour l'instant|
|Une seule sélection (pas multi-select)|Suffisant pour les FK scalaires|
|fetchFn synchrone au contexte (pas de filtre dynamique dans le dialog)|Le Workbench peut fermer/recréer un dialog si le contexte change|
|Pas de création inline (« + Nouveau »)|Hors scope — ouvrir un autre Workbench / flux|

Évolutions **non prioritaires** : multi-select, création inline, fetchFn contextualisée sans recréer le dialog.

---

## Checklist intégration Workbench

text

```
□ _createDialogs() appelé en premier dans bootstrap()
□ new RelationPickerDialog({ id, title, fetchFn, columns }).render()
□ fetchFn retourne object[] (tableau plat)
□ PropertySet : type 'relation' + dialogId + valueKey + itemDisplay + displayFn
□ destroy() : picker.destroy() avant panels.destroy()
□ CSS dialog.css chargé (si pas déjà global)
```

---

### Notes pour la consolidation

- Les exemples **Personne** sont volontairement **proposés** (pas encore du code live) : ils servent de spécification pour le futur Workbench.
- Deux dialogs adresse (naissance / décès) plutôt qu’un seul partagé : plus simple avec le contrat actuel `dialog:select` filtré par `dialogId`.
- `parcours_types` et `relation_types` courts → `minLength: 1` ; éventuellement un `select` plus tard si le volume reste faible.
- La règle métier `organisation` → `etablissement` (`applyTargetResolution`) reste côté **service backend** ; le p
