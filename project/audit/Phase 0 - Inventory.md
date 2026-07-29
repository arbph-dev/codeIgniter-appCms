# Phase 0 - Inventaire

|Statut|Signification|
|---|---|
|✅ Stable|Implémenté, utilisé en production|
|🟡 À documenter|Utilisé mais sans documentation|
|🔵 En développement|Fonctionnel mais évolutif|
|🟣 Prototype|Expérimentation conservée|
|⚪ Projet|Conception future uniquement|
|❌ À supprimer|Plus utilisé|




| Fichier                                                                                                             | Domaine                 | Statut code         | Documentation | Doc                                                                                                        | Action               | Priorité |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- | -------------------- | -------- |
| [app/Config/Routes.php](/refactoring/app/Config/Routes.php)                                                         | Backend / Configuration | ✅ Stable            | ✅ Stable      | [/documentation/ARCHITECTURE/Routes.md](/documentation/ARCHITECTURE/Routes.md)                             | Vérifier             | P1       |
| [app/Controllers/CmsController.php](/refactoring/app/Controllers/CmsController.php)                                 | Backend / Controller    | 🔵 En développement | ✅ Stable      | [/documentation/ARCHITECTURE/CmsController.md](/documentation/ARCHITECTURE/CmsController.md)               | Documenter           | P1       |
| [app/Services/CmsService.php](/refactoring/app/Services/CmsService.php)                                             | Backend / Service       | ✅ Stable            | ✅ Stable      | [/documentation/ARCHITECTURE/CmsService.md](/documentation/ARCHITECTURE/CmsService.md)                     | Compléter            | P1       |
| `app/Views/components/apex.php`                                                                                     | Frontend / View         | ❌ Obsolète ?        | ⚪             | —                                                                                                          | Vérifier suppression | P2       |
| `app/Controllers/TestController.php`                                                                                | Backend / Controller    | 🟣 Prototype        | ❌             | —                                                                                                          | Vérifier             | P2       |
| [app/Libraries/Components/DescriptorDefinition.php](/refactoring/app/Libraries/Components/DescriptorDefinition.php) |                         |                     |               | [/documentation/ARCHITECTURE/DescriptorDefinition.md](/documentation/ARCHITECTURE/DescriptorDefinition.md) |                      |          |
| [app/Libraries/Components/DescriptorMapper.php](/refactoring/app/Libraries/Components/DescriptorMapper.php)         |                         |                     |               | [/documentation/ARCHITECTURE/DescriptorMapper.md](/documentation/ARCHITECTURE/DescriptorMapper.md)         |                      |          |




Observation

Le DescriptorMapper dépend actuellement d'une correspondance entre type_id et le nom logique du composant (three, apex, mermaid, ...).

La gestion de ce catalogue est aujourd'hui répartie entre ComponentTypeModel, CmsService et certains traitements internes (enrichPart()).

Cette responsabilité pourrait être factorisée dans un futur service dédié : le catalogue des composants.

```
CmsService <-> ComponentCatalog
			↓
	ComponentTypeModel
```

```
DescriptorMapper <-> ComponentCatalog
```


---------
# OBSOLETE


- Relation
- FieldDefinition
- EntityDefinition
- RelationDefinition

# Refactor components

Il y en a de très prometteur qui mérite une attention
plusieurs versions coexistent et ne fonctionne plus , du simple copier coller apex au components il y a eu des évolutions que la structure SPA n'encaissent pas

Analyse des composants
- Structure 
	requise dés la conception ou construite dynamiquement. 
	( Attention en cas d'erreur de script  )
- CSS
- Script
- Event de bus publish and subscribe
- Ressources, image, son vidéo, texte, lien, services (fetch)
- Url relatives mais aux dossiers /assets/

# Methodes
Interaction form, dialog, store

Eviter les id dans les form, utiliser un id pour le container.
Préciser les type button pour les boutons input de form (submit par défaut)

On doit considérer une application qui gère les états et les données
Le store central va agréger les données des autres store ? 

Les events transmettent les objets ou déléguent des évènements d'objets enfants
Peut on gérer un event bus local au composants ?, est ce souhaitable ?

Pour standardiser les tableaux on peut gérer les pair value key autant en php qu'en javascript 
Mais comment automatiser le code des composants , le code "feature" crud peut il etre ecript par php ou python
