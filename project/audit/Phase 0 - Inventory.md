# Phase 0 - Inventiare










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
