# D001-CmsService

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

Le CMS manipule plusieurs modèles (`Category`, `Article`, `Section`, `Part`, `ComponentType`) ainsi que le système de rendu des composants.

Sans couche intermédiaire, les contrôleurs devraient gérer directement les modèles et le pipeline de rendu.

# Décision

Le **CmsService** constitue la façade du backend du CMS.

Toute la logique métier du CMS transite par ce service.

# Conséquences

* les contrôleurs restent légers ;
* les accès aux modèles sont centralisés ;
* le pipeline de rendu est encapsulé ;
* les évolutions futures sont facilitées.

# Voir également

* [[CmsService]]
* [[D002-Controllers]]
* [[D010-DescriptorDefinition]]
