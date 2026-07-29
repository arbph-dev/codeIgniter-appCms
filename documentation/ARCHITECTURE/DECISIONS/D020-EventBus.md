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
