# Phase 0 - Stabilisation

## Objectif

Arrêter les nouvelles features.

## Actions

- gel du périmètre
- inventaire des composants
- inventaire des features
- inventaire des API
- inventaire des modèles

## Livrables

- architecture.md
- composants.md
- features.md
- api.md

---






3 choses importantes

j'ai oublier de me ménager des aires de repos
- J'adore Threejs j'ai d'énormes projets mais suis bloqué sur des architectures pour intégré Threejs
- l'extraction d'entités depuis le contenu m'intéressent mais il faut déjà les entités

J'ai compliqué ce qui ne doit pas l'être en mélangeant la production de la conception
Python ou Open refine vont  géré la data science au mieux, pour les api tierces on va gérer les sources brutes via python et préparer les tables dans sqlite pour les exporter

Plus important j'ai négligé la documentation trop abondantes et diluées qui vous éloignent de vos objectifs

on finit l'audit il peut influer sur les besoins backend (quiz, pièce de théatre)

on va attaquer les stubs et documenter 
- EntityApiInterface
- EntityRegistry
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
