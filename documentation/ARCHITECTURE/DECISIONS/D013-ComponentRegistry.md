# D013-ComponentRegistry

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

Les composants doivent être identifiés indépendamment de leur implémentation.

# Décision

Le `ComponentRegistry` centralise l'enregistrement des types de composants disponibles.

Il constitue le catalogue officiel des composants.

# Conséquences

* enregistrement unique des composants ;
* simplification des Renderers ;
* extensibilité de l'architecture.
