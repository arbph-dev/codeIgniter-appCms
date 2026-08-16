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
