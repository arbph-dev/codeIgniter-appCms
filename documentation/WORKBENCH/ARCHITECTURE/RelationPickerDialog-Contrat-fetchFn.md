# RelationPickerDialog-Contrat-fetchFn

Le contrat est volontairement **étroit** : une fonction, une entrée, une sortie. Toute la complexité API (enveloppe, pagination, filtres) reste **hors** du dialog.

---

## 1. Signature

```js
fetchFn: (q: string) => Promise<object[]>
```

|Élément|Règle|
|---|---|
|**Entrée**|q — chaîne saisie par l’utilisateur, déjà trim() côté dialog|
|**Sortie**|Promise d’un **tableau plat** d’objets|
|**Échec**|throw Error (message affiché via notice('error', err.message))|

Le dialog ne parse pas de JSON, n’ajoute pas de headers, ne gère pas le pager. Il appelle fetchFn(q) et attend object[].

---

## 2. Entrée q

- Toujours une string (éventuellement '' si un jour minLength vaut 0).
- Le dialog ne déclenche la recherche que si q.length >= minLength (défaut 2).
- Debounce interne **280 ms** : fetchFn n’est pas appelée à chaque frappe.
- **Pas** d’objet options passé par le dialog aujourd’hui :

```js
// Aujourd’hui
fetchFn(q)

// Pas (encore)
fetchFn({ q, page, filters })
```

Filtres métier (type, source_type, len…) → **fermeture** dans la fonction fournie par le Workbench :

```js
fetchFn: (q) => fetchOrgLike({ q, typeId: this._typeId, len: 20 })
```

---

## 3. Sortie — tableau plat obligatoire

### Correct

```js
[
  { id: 42, codepostal: '29120', commune: "Pont-l'Abbé" },
  { id: 43, codepostal: '29000', commune: 'Quimper' },
]
```

### Incorrect

```
// Enveloppe API standard
{ status: 200, data: [ ... ], pager: { ... } }

// Page unique en objet
{ id: 1, nom: '...' }

// null / undefined
null
```

Si le service métier renvoie l’enveloppe DATA_CONTRACT, **normaliser dans le service Like ou dans la fermeture** :

JavaScript

```js
// Dans *.service.js (recommandé)
export async function fetchCpLike({ q, len = 20 }) {
    const res = await apiFetch(`/api/codepostal/like?q=${encodeURIComponent(q)}&len=${len}`)
    // si l’API renvoie déjà [] → return res
    // si l’API renvoie { data: [] } → return res.data ?? []
    return Array.isArray(res) ? res : (res.data ?? [])
}

// Ou dans le Workbench (acceptable mais moins propre)
fetchFn: async (q) => {
    const result = await fetchOrg({ q, perPage: 20 })
    return Array.isArray(result.data) ? result.data : []
}
```

**Règle DATA_CONTRACT** : les endpoints destinés au picker (*Like, suggest) exposent un **tableau plat** pour rester branchables sans adaptation.

---

## 4. Forme des items

### Clés obligatoires / attendues

|Besoin|Règle|
|---|---|
|Valeur FK|Au moins une clé stable, en pratique **id** (ou celle déclarée en valueKey du PropertySet)|
|Affichage table|Toutes les clés listées dans columns[].key|
|Affichage après sélection|Ce que consomme itemDisplay(item)|

Si valueKey: 'id' et qu’un item n’a pas id → le hidden du Form reçoit undefined → validation / save cassés.

### Types des champs

Alignés sur DATA_CONTRACT :

|Champ|Type JS après parse|
|---|---|
|PK / FK|number|
|Libellés|string|
|Dates|string (YYYY-MM-DD ou ISO), pas d’objet Date|
|Null|null (pas '' pour les absents côté API)|

Le dialog **n’interprète pas** les types : il les affiche via table({ columns }) (souvent String(value)).

### Exemple item « riche » (adresse)

```js
{
  id: 5,
  voienom: 'Lilas',
  voienumero: '12',
  voietype_nom: 'Rue',
  cp_codepostal: '29120',
  cp_commune: "Pont-l'Abbé",
}
```

columns n’affiche qu’un sous-ensemble ; itemDisplay peut utiliser tout l’objet.

---

## 5. Erreurs

```js
export async function fetchPersonneLike({ q, len = 20 }) {
    const res = await apiFetch(`/api/personnes/like?q=${encodeURIComponent(q)}&len=${len}`)
    if (!res.ok) {
        // selon apiFetch : throw déjà fait
    }
    return Array.isArray(res) ? res : (res.data ?? [])
}
```

- Toute exception → notice('error', err.message) dans la zone résultats.
- Tableau vide [] → notice('empty') (pas une erreur).
- **Ne pas** retourner null en cas d’échec : throw explicite.

---

## 6. Pagination et volume

Le dialog **n’a pas de pagination**.

Conventions pratiques :

|Contexte|Recommandation|
|---|---|
|Suggest / like|Limiter côté API (len / per_page 15–30)|
|Référentiel court (parcours_types)|Retourner toute la liste filtrée par q|
|Gros référentiel|Strict like + limite serveur ; pas de « page 2 » dans le dialog|

JavaScript

```
fetchFn: (q) => fetchOrgLike({ q, len: 20 })
```

Un résultat trop long dégrade l’UX ; ce n’est pas au dialog de paginer.

---

## 7. Filtres et contexte (fermetures)

Le dialog ignore le contexte métier. Le Workbench l’injecte par fermeture :

```js
// Filtre type organisation déjà choisi dans le Workbench
fetchFn: (q) => fetchOrgLike({
    q,
    typeId: this._typeId || undefined,
    len: 20,
})

// Relation types applicables personne → organisation
fetchFn: (q) => fetchRelationTypeLike({
    q,
    source_type: 'personne',
    target_type: 'organisation',
})
```

Si le contexte change **après** render() (ex. l’utilisateur change target_type) :

- soit la fermeture lit un état mutable (this._targetType) à chaque appel ;
- soit on destroy() + recrée le dialog (rare).

```js
// État mutable lu à chaque frappe — OK
this._relationTargetType = 'organisation'

fetchFn: (q) => {
    if (this._relationTargetType === 'personne') {
        return fetchPersonneLike({ q, len: 20 })
    }
    if (this._relationTargetType === 'etablissement') {
        return fetchEtablissementLike({ q, len: 20 })
    }
    return fetchOrgLike({ q, len: 20 })
}
```

---

## 8. Contrat avec PropertySet / Form

|Côté fetchFn (item)|Côté PropertySet|
|---|---|
|item[valueKey]|stocké dans le hidden (FK)|
|objet complet|passé à itemDisplay(item)|
|—|displayFn(data) utilise l’objet **API parent** au fill(), pas l’item du picker|

```js
// Item retourné par fetchFn
{ id: 42, codepostal: '29120', commune: "Pont-l'Abbé" }

// PropertySet
valueKey:    'id'
itemDisplay: (item) => `${item.codepostal} ${item.commune}`

// fill() depuis GET personne / adresse
displayFn: (data) => [data.cp_codepostal, data.cp_commune].filter(Boolean).join(' ')
```

Les noms de champs JOIN (cp_commune) peuvent différer des noms suggest (commune) : d’où **deux** fonctions d’affichage.

---

## 9. Exemples de contrats par domaine

### Code postal

```js
// fetchFn
(q) => fetchCpLike({ q })

// Item minimal
{ id: number, codepostal: string, commune: string }
```

### Adresse

```js
(q) => fetchAdresseLike({ q, len: 20 })

// Item minimal pour columns + itemDisplay
{
  id: number,
  voienom: string,
  cp_commune?: string,
  cp_codepostal?: string,
  voietype_nom?: string,
}
```

### Organisation

```js
(q) => fetchOrgLike({ q, len: 20 })

{ id: number, nom: string, type_label?: string }
```

### Personne (futur)

```js
(q) => fetchPersonneLike({ q, len: 20 })

{
  id: number,
  nom_complet: string,
  date_naissance?: string | null,
}
```

### Parcours type (référentiel)

```js
(q) => fetchParcoursTypeLike({ q })

{ id: number, code: string, label: string }
```

### Type de relation filtré

```js
(q) => fetchRelationTypeLike({
  q,
  source_type: 'personne',
  target_type: 'organisation',
})

{ id: number, code: string, label: string, inverse_code?: string }
```

---

## 10. Checklist implémentation fetchXxxLike

text

```
□ Signature async ({ q, ...filtres }) ou (q) selon le service
□ Retourne object[] (jamais { data }, jamais null)
□ Chaque item a la clé valueKey (id)
□ Limite serveur (len / per_page) pour les gros volumes
□ throw Error avec message lisible si HTTP KO
□ 401/403 : throw (le dialog affiche l’erreur ; pas de redirection magique)
□ Pas de dépendance au DialogManager / Form
```

---

## 11. Anti-patterns

|Anti-pattern|Pourquoi|
|---|---|
|return result alors que result = { data: [] }|Table vide ou plantage|
|Omettre id sur les items|FK undefined dans le Form|
|Appels API dans le dialog (hors fetchFn)|Casse le contrat générique|
|Muter l’item dans fetchFn pour « aider » Form|Form / PropertySet doivent rester seuls responsables de l’extraction|
|fetchFn synchrone non-Promise|Le dialog fait await this.fetchFn(q)|
|Ignorer les erreurs réseau (return [])|Confusion « aucun résultat » vs « API down »|

---

## 12. Résumé en une phrase

> **fetchFn(q) renvoie une Promise d’un tableau plat d’objets sérialisables, chacun portant au minimum la clé utilisée comme FK (id), et lève une Error en cas d’échec — rien de plus.**

Ce contrat est le même pour Adresse, Organisation et le futur Personne ; seuls changent la fermeture (filtres) et la forme des items documentée par le service *Like.
