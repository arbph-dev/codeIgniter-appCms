# AdminComponentRenderer

**Fichier**

[/refactoring/app/Libraries/Components/AdminComponentRenderer.php](/refactoring/app/Libraries/Components/AdminComponentRenderer.php)

---

## Rôle

Équivalent de `ComponentRenderer` pour les interfaces d'administration.

Il sélectionne l'`AdminRenderer` correspondant au type de composant afin de produire les formulaires d'édition.

---

## Dépendances

- [/refactoring/app/Libraries/Components/DescriptorDefinition.php](/refactoring/app/Libraries/Components/DescriptorDefinition.php)
- [/refactoring/app/Libraries/Components/AdminComponentRegistry.php](/refactoring/app/Libraries/Components/AdminComponentRegistry.php)

---

## Utilisateurs

- [/refactoring/app/Services/CmsService.php](/refactoring/app/Services/CmsService.php)

---

## Flux concernés

- Édition d'une Part
- Administration CMS
- Préparation des futurs Workbench

```
DescriptorDefinition
        ↓
AdminComponentRenderer
        ↓
AdminComponentRegistry
        ↓
AdminRenderer
        ↓
Vue HTML
```

---

## Documentation associée

- [/documentation/ARCHITECTURE/ComponentRegistry.md](/documentation/ARCHITECTURE/ComponentRegistry.md)

---

## Statut

✅ Stable

---

## Décision d'architecture

**D007 — AdminComponentRenderer**

Le rendu des interfaces d'administration est totalement indépendant du rendu public.

Chaque composant possède deux chaînes de rendu distinctes :

- FrontOffice
- Administration
