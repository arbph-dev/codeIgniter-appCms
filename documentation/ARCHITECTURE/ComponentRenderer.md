# ComponentRenderer

**Fichier**

[/refactoring/app/Libraries/Components/ComponentRenderer.php](/refactoring/app/Libraries/Components/ComponentRenderer.php)

---

## Rôle

Point d'entrée unique du rendu des composants du CMS.

`ComponentRenderer` reçoit un `DescriptorDefinition`, interroge le `ComponentRegistry` afin de résoudre le Renderer adapté puis délègue entièrement le rendu.

Il ne contient aucune logique propre aux composants.

---

## Dépendances

- [/refactoring/app/Libraries/Components/DescriptorDefinition.php](/refactoring/app/Libraries/Components/DescriptorDefinition.php)
- [/refactoring/app/Libraries/Components/ComponentRegistry.php](/refactoring/app/Libraries/Components/ComponentRegistry.php)
- [/refactoring/app/Libraries/Components/Renderers/ComponentRendererInterface.php](/refactoring/app/Libraries/Components/Renderers/ComponentRendererInterface.php)

---

## Utilisateurs

- [/refactoring/app/Services/CmsService.php](/refactoring/app/Services/CmsService.php)

---

## Flux concernés

- Affichage d'un composant
- Affichage d'une section
- Affichage d'un article

```
DescriptorDefinition
        ↓
ComponentRenderer
        ↓
ComponentRegistry
        ↓
Renderer
        ↓
Vue HTML
```

---

## Documentation associée

- [/documentation/ARCHITECTURE/ComponentRegistry.md](/documentation/ARCHITECTURE/ComponentRegistry.md)
- [/documentation/ARCHITECTURE/DescriptorDefinition.md](/documentation/ARCHITECTURE/DescriptorDefinition.md)

---

## Statut

✅ Stable

---

## Décision d'architecture

**D006 — ComponentRenderer**

Le rendu d'un composant passe obligatoirement par `ComponentRenderer`.

Les Renderers spécialisés ne sont jamais instanciés directement par le CMS.
