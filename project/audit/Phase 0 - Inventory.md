# Phase 0 - Inventiare

|Statut|Signification|
|---|---|
|✅ Stable|Implémenté, utilisé en production|
|🟡 À documenter|Utilisé mais sans documentation|
|🔵 En développement|Fonctionnel mais évolutif|
|🟣 Prototype|Expérimentation conservée|
|⚪ Projet|Conception future uniquement|
|❌ À supprimer|Plus utilisé|



|Fichier|Domaine|Statut code|Documentation|Doc|Action|Priorité|
|---|---|---|---|---|---|---|
|`app/Config/Routes.php`|Backend / Configuration|✅ Stable|🟡 À documenter|[/documentation/ARCHITECTURE/Routes.md](/documentation/ARCHITECTURE/Routes.md)|Vérifier|P1|
|`app/Controllers/CmsController.php`|Backend / Controller|✅ Stable|🟡 À mettre à jour|`documentation/ARCHITECTURE/CmsController.md`|Documenter|P1|
|`app/Services/CmsService.php`|Backend / Service|✅ Stable|🟡 À mettre à jour|`documentation/ARCHITECTURE/CmsService.md`|Compléter|P1|
|`app/Views/components/apex.php`|Frontend / View|❌ Obsolète ?|⚪|—|Vérifier suppression|P2|
|`app/Controllers/TestController.php`|Backend / Controller|🟣 Prototype|❌|—|Vérifier|P2|









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
