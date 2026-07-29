# ComponentRendererInterface

**Fichier**

[/refactoring/app/Libraries/Components/Renderers/ComponentRendererInterface.php](/refactoring/app/Libraries/Components/Renderers/ComponentRendererInterface.php)

---

## Rôle

Contrat commun à tous les Renderers.

Il garantit qu'un composant peut être résolu et exécuté de manière uniforme par `ComponentRenderer`, quel que soit son type.

L'interface définit l'API minimale que doivent respecter tous les Renderers.

---

## Dépendances

- [/refactoring/app/Libraries/Components/DescriptorDefinition.php](/refactoring/app/Libraries/Components/DescriptorDefinition.php)

---

## Utilisateurs

Implémentée par :

- ApexRenderer
- CalloutRenderer
- CodeValRenderer
- LeafletRenderer
- MermaidRenderer
- RawRenderer
- ThreeRenderer

Utilisée par :

- [/refactoring/app/Libraries/Components/ComponentRenderer.php](/refactoring/app/Libraries/Components/ComponentRenderer.php)

---

## Flux concernés

Tous les flux de rendu des composants.

---

## Documentation associée

- [/documentation/ARCHITECTURE/ComponentRegistry.md](/documentation/ARCHITECTURE/ComponentRegistry.md)

---

## Statut

✅ Stable

---

## Décision d'architecture

**D006 — ComponentRenderer**

Tous les Renderers doivent implémenter une interface unique.

`ComponentRenderer` ne connaît jamais les implémentations concrètes.
