# AdminComponentRegistry

**Fichier**

[/refactoring/app/Libraries/Components/AdminComponentRegistry.php](/refactoring/app/Libraries/Components/AdminComponentRegistry.php)

---

## Rôle

Registre des Renderers d'administration.

Il associe chaque type de composant à son AdminRenderer afin de construire les interfaces d'édition.

Il est le pendant du `ComponentRegistry` utilisé pour le rendu public.

---

## Dépendances

Aucune.

Il référence uniquement les AdminRenderers.

---

## Utilisateurs

- [/refactoring/app/Libraries/Components/AdminComponentRenderer.php](/refactoring/app/Libraries/Components/AdminComponentRenderer.php)

---

## Flux concernés

- Administration CMS
- Édition d'une Part
- Édition d'un composant

```
DescriptorDefinition
        ↓
AdminComponentRenderer
        ↓
AdminComponentRegistry
        ↓
AdminRenderer
```

---

## Documentation associée

- [/documentation/ARCHITECTURE/ComponentRegistry.md](/documentation/ARCHITECTURE/ComponentRegistry.md)

---

## Statut

✅ Stable

---

## Décision d'architecture

**D005 — ComponentRegistry**

Les registres FrontOffice et Administration sont volontairement séparés.

Le rendu public ne dépend jamais des outils d'administration.
