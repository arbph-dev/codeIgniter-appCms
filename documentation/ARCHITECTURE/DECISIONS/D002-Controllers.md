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

