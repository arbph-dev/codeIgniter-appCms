# D021-Workbench

**Date** : 2026-07-29

**Statut** : Proposed

# Contexte

Les futurs Workbench doivent s'intégrer au CMS sans créer une architecture parallèle.

# Décision

Les Workbench réutiliseront l'architecture existante :

* DescriptorDefinition ;
* DescriptorMapper ;
* ComponentRenderer ;
* EventBus ;
* système de ressources.

# Conséquences

Les Workbench deviennent des composants de l'architecture CMS plutôt qu'un sous-projet indépendant.
