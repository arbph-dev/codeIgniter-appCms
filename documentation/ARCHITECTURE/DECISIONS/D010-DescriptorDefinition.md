# D010-DescriptorDefinition

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

Le moteur de composants doit être indépendant du CMS et des moteurs de rendu.

# Décision

Le `DescriptorDefinition` constitue le contrat d'exécution unique des composants.

Il décrit uniquement le runtime à construire.

Il ne contient :

* aucune logique métier ;
* aucun HTML ;
* aucun JavaScript ;
* aucune référence DOM.

# Conséquences

Le même Descriptor peut être utilisé par plusieurs Renderers ou Workbench.
