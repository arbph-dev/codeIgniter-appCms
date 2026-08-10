> version : iteration 003 — type relation

> **Ressources**
> Documenation :
> - [PropertySet](/documentation/WORKBENCH/PropertySet.md)

> Sources : 
> ---

# Form.js

Form est un générateur de formulaire déclaratif.  
On lui passe un [PropertySet](/documentation/WORKBENCH/PropertySet.md) (schéma de champs) ; il construit le DOM, gère le remplissage, la validation, l’extraction des valeurs, et le nettoyage.

Il ne connaît ni les Workbenches, ni l’API, ni les messages HTTP.  

Il produit un objet métier ; le Panel décide ensuite de l’envoyer au service.

---

## Cycle de vie public

|Méthode|Quand|Effet|
|---|---|---|
|constructor(config)|Création|Mémorise le schéma, callbacks, labels — aucun DOM|
|render()|Une fois|Construit le DOM, retourne div.wb_form|
|fill(data)|Édition|Pré-remplit les champs depuis un objet existant|
|reset()|Création|Remet les valeurs par défaut / vide|
|extract()|Submit|Valide → caste → calcule → retourne data ou null|
|destroy()|Démontage|Désabonne le bus, vide les Maps, libère les refs|

```text
new Form({ propertySet, onSubmit, onCancel })
        │
        ▼
   form.render()     →  appendé dans le Panel
        │
   ┌────┴────┐
   │         │
 fill()   reset()     (édition / création)
   │         │
   └────┬────┘
        ▼
  extract()  ──null──► focus 1er champ invalide
        │
     data OK
        ▼
  onSubmit(data)      (via _handleSubmit ou appel manuel)
```

---

État interne

|Propriété|Type|Contenu|
|---|---|---|
|_ps|Array|[PropertySet](/documentation/WORKBENCH/PropertySet.md) (champs éditables)|
|_cps|Array|ComputePropertySet (champs calculés à l’extract)|
|_inputs|Map(name → HTMLElement)|Champ « valeur » (input, select, hidden pour relation)|
|_displays|Map(name → input)|Champ affichage des relations uniquement|
|_errorEls|Map(name → span)|Messages d’erreur inline|
|_busHandlers|Array|{ event, handler } pour destroy()|
|_onSubmit / _onCancel|fn|Callbacks|
|_labels|{ submit, cancel }|Textes des boutons|

Point clé pour relation : la valeur métier est dans le hidden (_inputs), le label visible est dans _displays.

---

render() — construction

1. Crée div.wb_form.
2. Pour chaque prop du PropertySet → _createField(prop).
3. Ajoute la rangée de boutons (Enregistrer / Annuler).
4. Branche Enter / Escape uniquement sur les champs « texte classiques » :
    - ignorés pour select, file, relation (readonly + dialog).

Le bouton Enregistrer appelle _handleSubmit() → extract() → onSubmit(data) si OK.

---

_createField(prop) — les 4 types1. Types classiques (text, number, date, …)

```text
label + input[type=prop.type] + span.error
```

Valeur stockée dans _inputs.2. select

```text
label + <select> + options(choices) + span.error
```

choices est extrait de options et non passé au DOM comme attribut HTML.3. file

```text
label + input[type=file] + span.error
```

Pas de fill du fichier (navigateur interdit le pré-remplissage).4. relation (nouveauté iteration 003)

```text
label
┌─────────────────────────────┬─────┐
│ input readonly (display)    │ 🔍  │
└─────────────────────────────┴─────┘
input[type=hidden]   ← valeur FK réelle
span.error
```

Comportement :

| Élément                                                                                     | Rôle                                                       |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| displayInput                                                                                | Affiche le libellé (ex. "75001 Paris") — readonly          |
| hiddenInput                                                                                 | Stocke la FK (codepostal_id) — c’est ce que voit extract() |
| Bouton ![🔍](https://abs.twimg.com/emoji/v2/svg/1f50d.svg "Left-pointing magnifying glass") | bus.publish('dialog:show', dialogId)                       |
| Handler dialog:select                                                                       | Si sourceId === dialogId → met à jour hidden + display     |

Schéma PropertySet attendu :

js

```js
{
  name: 'codepostal_id',
  description: 'Code postal',
  type: 'relation',
  options: {
    dialogId:    'dialog_cp',           // id de la dialog à ouvrir
    valueKey:    'id',                  // clé FK dans l’item sélectionné
    itemDisplay: (item) => ...,         // libellé depuis l’item de dialog
    displayFn:   (data) => ...,         // libellé depuis l’objet métier (fill)
    placeholder: 'Code postal...',
    required:    '',                    // présence de la clé = obligatoire
  },
}
```

Deux fonctions d’affichage distinctes :

- itemDisplay(item) — au moment de la sélection dans la dialog
- displayFn(data) — au moment du fill(data) (données déjà jointes côté API, ex. cp_codepostal + cp_commune)

Le handler est enregistré sur le bus et poussé dans _busHandlers pour être désabonné dans destroy().

---

fill(data) — mode éditionPour chaque prop :

|Type|Comportement|
|---|---|
|file|Ignoré|
|relation|hidden = data[name] ; si valeur → display = displayFn(data) sinon vide|
|date|Date → YYYY-MM-DD|
|Autres|data[name] ?? default|

Puis : clear erreurs + focus sur le premier champ éditable (pas file ni relation).

---

reset() — mode création

|Type|Comportement|
|---|---|
|file|value = ''|
|relation|hidden + display → ''|
|Autres|default ?? ''|

Focus sur le premier champ non-file / non-relation.

---

extract() — validation + objet métierBoucle sur _ps :

1. _checkField(prop, field)
2. Si échec → _showError + mémorise le 1er invalide
3. Si OK → data[name] = _castValue(field, type)

Si invalide :

- focus sur le display si c’est une relation, sinon sur le field
- retourne null

Si valide :

- applique chaque computePropertySet : data[name] = prop.calculate(data)
- retourne data

Form ne fait jamais de fetch.

---

_checkField — règles par typerelation

- Si required présent dans options et hidden vide → erreur « sélection requise »
- Si prop.validate et valeur → validation custom
- Pas de HTML5 validity (champ hidden)

file

- required → au moins un fichier
- validate(file) optionnel

select

- field.validity (HTML5)
- puis prop.validate si défini

Texte / number / date

- HTML5 validity (pattern → message dédié)
- puis prop.validate
- Particularité : si validate existe et que value === default, le champ est considéré invalide (évite de soumettre la valeur par défaut non touchée)

---

_castValue — typage

|Type|Résultat|
|---|---|
|number|parseInt|
|date|new Date(y, m-1, d)|
|file|File ou null|
|relation|parseInt ou string si NaN, null si vide|
|défaut|string|

La FK relation part donc en entier (ou null) vers le service — adapté aux colonnes *_id.

---

destroy() — anti-fuites

1. bus.unsubscribe pour chaque handler de _busHandlers
2. Clear des Maps (_inputs, _displays, _errorEls)
3. Nullification de element et _submitBtn

Indispensable dès qu’il y a des relation (handlers bus vivants hors du DOM).

---

Flux relation complet (exemple Adresse / code postal)

```text
1. render()
   → hidden + display + btn
   → subscribe('dialog:select', handler)

2. Utilisateur clique 🔍
   → bus.publish('dialog:show', 'dialog_cp')
   → une Dialog (ailleurs) s’ouvre, liste les CP

3. Utilisateur choisit un item
   → bus.publish('dialog:select', { sourceId: 'dialog_cp', item })
   → handler : hidden = item.id, display = itemDisplay(item)
   → clear erreur du champ

4. extract()
   → _checkField : required + validate sur hidden
   → _castValue : parseInt(hidden) ou null
   → data.codepostal_id = 42

5. destroy() (changement de mode / fermeture panel)
   → unsubscribe dialog:select
```

---

Frontière de responsabilités

|Fait par Form|Fait par le Panel|
|---|---|
|DOM des champs|Appels API|
|Validation locale|Feedback HTTP (422, etc.)|
|Cast des types|Verrou _working|
|ComputePropertySet|Affichage ID en lecture seule|
|Bus dialog:select (valeur)|Orchestration dialog métier|

---

Points d’attention

1. required pour relation/file : détecté par 'required' in options, pas par la valeur. required: '' suffit.
2. Deux display fn : itemDisplay (dialog) vs displayFn (fill API) — à ne pas confondre.
3. Enter/Escape volontairement absents sur relation (champ readonly ; la dialog a son propre clavier).
4. Focus après erreur relation : sur le display visible, pas sur le hidden.
5. Un handler par champ relation : plusieurs relations dans le même form → plusieurs handlers, tous nettoyés dans destroy().

En résumé : Form reste un outil de schéma → DOM → data, et le type relation y ajoute un couple hidden FK + display + dialog via event bus, sans casser le contrat render / fill / reset / extract / destroy.
