# D002-Controllers

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

Les contrôleurs constituent le point d'entrée HTTP de l'application.

# Décision

Les contrôleurs ne contiennent aucune logique métier.

Leur rôle est limité à :

* recevoir les paramètres de la requête ;
* appeler le `CmsService` ;
* retourner une vue ou une réponse HTTP ;
* gérer les erreurs (404, etc.).

# Conséquences

* séparation claire entre HTTP et métier ;
* contrôleurs faciles à maintenir ;
* meilleure testabilité.

---

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

---

# D011-DescriptorMapper

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

Les données du CMS ne possèdent pas le même format que les composants.

# Décision

Le `DescriptorMapper` traduit les données métier du CMS vers un `DescriptorDefinition`.

Il réalise uniquement une normalisation.

Il ne :

* crée aucun composant ;
* ne réalise aucun rendu ;
* ne contient aucune logique métier.

# Conséquences

Le CMS reste indépendant du moteur de rendu.

---

# D012-ComponentRenderer

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

Chaque composant possède un mode de rendu spécifique.

# Décision

Le `ComponentRenderer` sélectionne automatiquement le Renderer spécialisé correspondant au type du Descriptor.

Chaque Renderer est responsable d'un seul type de composant.

# Conséquences

* architecture extensible ;
* ajout d'un composant sans modifier les autres ;
* responsabilité unique des Renderers.

---

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

---

# D020-EventBus

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

Les composants JavaScript doivent communiquer sans dépendances directes.

# Décision

Les échanges entre composants s'effectuent via l'`EventBus`.

Les composants ne se connaissent pas directement.

# Conséquences

* faible couplage ;
* meilleure réutilisabilité ;
* intégration simplifiée de nouveaux composants.

---

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

---

# D100-Documentation

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

La documentation du projet s'est progressivement dispersée entre notes de conception, comptes-rendus et documentation technique.

# Décision

La documentation est organisée en quatre catégories :

* **ARCHITECTURE** : description des composants et des couches ;
* **FLOWS** : diagrammes d'exécution ;
* **DECISIONS** : choix d'architecture validés ;
* **ROADMAP** : évolutions prévues.

# Conséquences

Chaque information possède un emplacement unique, ce qui limite les duplications et facilite la maintenance de la documentation.
