# Panel Contract Standard — Stage 1

## Objectif
Assurer une homogénéisation complète de tous les Panels, indépendamment de leur usage ou complexité.

---

## API Publique Obligatoire

### 1. Constructor
```javascript
constructor(config = {})
{
    // Initialisation SANS appel API
    // SANS rendu DOM
    // SANS side effects
}
```

**Principes** :
- Pas de paramètres obligatoires
- Config optionnelle
- État interne uniquement (pas de références externes)

---

### 2. render() → HTMLElement
```javascript
render()
{
    // Crée et retourne l'élément racine
    // Aucun contenu métier n'est affiché
    // Layout structure vide (empty state par défaut)
    
    return this.element;
}
```

**Principes** :
- Appelé UNE SEULE FOIS dans le Workbench
- Retourne la racine HTML du Panel
- Structure DOM complète mais sans données
- Appelle `this.clear()` à la fin pour état initial
- Le Workbench insère le résultat dans le DOM

---

### 3. show(data) → void
```javascript
show(data)
{
    // Affiche les données passées
    // Met à jour le Panel sans le recréer
}
```

**Principes** :
- Appelé pour remplir/rafraîchir le contenu
- `data` peut être n'importe quel type (objet, tableau, null)
- Signature flexible : `show()`, `show(item)`, `show(items, pager)`, etc.
- Doit gérer gracieusement `data === null`
- Peut appeler `this.clear()` ou `this._showEmpty()` si pas de données

**Variantes acceptées** :
```javascript
// Simple objet
show(mot) { ... }

// Tableau + pagination
show(items, pager = null) { ... }

// Définition JSON
show(definition) { ... }
```

---

### 4. clear() → void
```javascript
clear()
{
    // Efface le contenu métier
    // Affiche l'état vide (message "Aucune sélection", etc.)
    // Préserve la structure du Panel
}
```

**Principes** :
- Appelé pour revenir à l'état initial
- Vide le contenu sans détruire les éléments de structure
- Appelle généralement `show(null)` ou une méthode `_showEmpty()`

---

### 5. destroy() → void
```javascript
destroy()
{
    // Libère toutes les ressources
    // Anule les event listeners
    // Met à null les références internes
}
```

**Principes** :
- Appelé lors du nettoyage du Workbench
- Nettoie TOUTES les références (sinon fuite mémoire)
- Inverse de `render()`

---

## API Privée (Conventions)

### Helper Methods
```javascript
_showEmpty()
{
    // Affiche le message "Aucune donnée"
}

_showLoading()
{
    // Affiche "⏳ Chargement…"
}

_showError(msg)
{
    // Affiche "❌ Erreur"
}
```

---

## Callbacks Optionnels

### Enregistrement des callbacks
```javascript
onSelect(fn)
{
    this._onSelectFn = fn;
}

onUpdate(fn)
{
    this._onUpdateFn = fn;
}
```

**Principes** :
- Méthodes `onXxx()` retournent `this` (chaînable si possible)
- Callbacks stockés en privé `_onXxxFn`
- Invocation avec `this._onXxxFn?.(data)` (safe navigation)

---

## Pattern Complet

```javascript
// ============================================================================
// assets/js/ui/workbench/[feature]/[Name]Panel.js
// ============================================================================

import { create, clear } from '/assets/js/core/domhelper.js';

export class [Name]Panel
{
    constructor(config = {})
    {
        // Aucun side-effect ici
        this._onSelectFn = null;
        this.element     = null;
        this.bodyEl      = null;
    }

    // ──────────────────────────────────────────────────────────────────────
    // API Publique
    // ──────────────────────────────────────────────────────────────────────

    render()
    {
        this.element = create('section', { class: 'wb_[name]_panel' });

        const header = create('header', { class: 'wb_panel_header' });
        header.appendChild(create('h2', { text: '[Titre]' }));

        this.bodyEl = create('div', { class: 'wb_panel_body' });

        this.element.append(header, this.bodyEl);

        this.clear();

        return this.element;
    }

    show(data)
    {
        clear(this.bodyEl);

        if (!data)
        {
            this._showEmpty();
            return;
        }

        // Rendu du contenu
        // ...
    }

    clear()
    {
        if (!this.bodyEl) return;
        this._showEmpty();
    }

    destroy()
    {
        this._onSelectFn = null;
        this.element     = null;
        this.bodyEl      = null;
    }

    // ──────────────────────────────────────────────────────────────────────
    // Callbacks
    // ──────────────────────────────────────────────────────────────────────

    onSelect(fn)
    {
        this._onSelectFn = fn;
        return this;  // Chaînable
    }

    // ──────────────────────────────────────────────────────────────────────
    // Privées
    // ──────────────────────────────────────────────────────────────────────

    _showEmpty()
    {
        clear(this.bodyEl);
        this.bodyEl.appendChild(
            create('p', {
                class: 'wb_empty',
                text: 'Aucune donnée.',
            })
        );
    }
}

export default [Name]Panel;
```

---

## Checklist de Conformité

Pour chaque Panel, vérifier :

- [ ] `constructor(config = {})` — pas de logique métier
- [ ] `render() → HTMLElement` — crée la structure, appelle `clear()`
- [ ] `show(data)` — affiche et gère `data === null`
- [ ] `clear()` — revient à état vide
- [ ] `destroy()` — nettoie TOUTES les références
- [ ] Callbacks avec `on***()` si applicable
- [ ] Private methods en `_***()` si applicables
- [ ] JSDoc sur les signatures
- [ ] Pas d'appel API dans le Panel

---

## Panneaux à Corriger

| Fichier | Status | À Faire |
|---------|--------|---------|
| `DefinitionPanel.js` | ✅ Conforme | RAS |
| `DescriptorPanel.js` | ✅ Conforme | RAS |
| `MotDetailPanel.js` | ✅ Conforme | RAS |
| `MotListPanel.js` | ✅ Conforme | RAS |
| `CatalogPanel.js` | ⚠️ Partiellement | Ajouter `destroy()`, standardiser interface |
| `JsonPanel.js` | ❌ Non-conforme | Remplacer `getElement()` par `render()`, `setData()` par `show()` |

---

## Tests de Conformité

```javascript
// Chaque Panel doit passer ce test
const panel = new MyPanel();

// Phase 1 : Construction
assert(panel.element === null || panel.element === undefined);

// Phase 2 : Rendu
const dom = panel.render();
assert(dom instanceof HTMLElement);
assert(panel.element !== null);

// Phase 3 : Affichage
panel.show(testData);
assert(panel.bodyEl.textContent.length > 0);

// Phase 4 : Vide
panel.clear();
assert(panel.bodyEl.textContent.includes('Aucune') || panel.bodyEl.textContent === '');

// Phase 5 : Destruction
panel.destroy();
assert(panel.element === null);
```

---

## Notes

- **Stage 1** : Uniformisation de la structure
- **Stage 2** : Ajouter des méthodes optionnelles (refresh, validate, etc.)
- **Stage 3** : Intégration avec WorkbenchView
- **Stage 4** : Permissions et contexte d'authentification

