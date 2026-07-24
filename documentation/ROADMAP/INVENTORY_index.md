


# Routes

## Routes Publiques
GET / :  Cms::index (Accueil du portail)
GET /cms/category/{segment} : CmsController::category()
GET /cms/article/{segment} : CmsController::article()
GET /cms/section/{num} : CmsController::section()
GET /cms/part/{num} : CmsController::part()
GET /technologies : Technologies::index
GET /technologies/{segment} : Technologies::rubrique()
GET /technologies/{segment}/{segment} : Technologies::show()
GET /informatique : Informatique::index
GET /portal : Portal::index
GET /chimie : Chimie::index

## Routes Admin
GET /admin : Admin::index
GET /admin/modelworkbench : Admin\ModelWorkbench::index
Groupe admin/cmspart :
- Index, Create, Edit, Insert, Update, Delete, Up, Down

## Routes API
Groupe /api/auth 
- login, profile, me, logout
Groupe /api (très riche) :
- mot
- codesnaf, comptespcg, image, formejuridique, typevoie, codepostal, adresse, organisation, entreprise
Beaucoup de méthodes like, tree, hierarchy, children

## Autres
Plusieurs routes de test (test/components, test/service, etc.)
service('auth')->routes() (génère les routes d’authentification)

---

# Analyse de la Board Admin (version old/)


## 1. Partie Serveur (CodeIgniter + Shield)Fichier : old/app/Controllers/Admin.phpMéthodes principales :

|Méthode|Rôle|Réutilisable ?|Commentaire|
|---|---|---|---|
|requireAdmin()|Vérification admin/superadmin|Oui (fortement)|Très utile pour tous les contrôleurs admin|
|isSuperAdmin()|Test superadmin|Oui|Simple et clair|
|extractEmail()|Extraction email depuis Shield identities|Oui|Utile car Shield stocke les identités séparément|
|index()|Page principale|Partiellement|Logique de récupération des users|
|buildDebugData()|Construction données debug|Très réutilisable|Statique + bien fait → à mettre dans un Service ou Trait|

Points forts à réemployer :

- Gestion propre de Shield (auth()->user(), inGroup(), getProvider())
- buildDebugData() → très utile pour tous les workbenches (debug overlay)
- Bonne séparation des préoccupations (requireAdmin en private)

Points à améliorer :

- Le contrôleur fait trop de choses (récupération + formatage données + debug)
- Pas d’injection de dépendances (à faire évoluer vers Services)

---

## 2. Partie Client (DOM + CSS + JS)Fichier : old/app/Views/cms/admin.phpStructure globale :

- Layout : layouts/cms
- Sidebar + Header + Contenu principal
- Tableau des utilisateurs avec filtre, tri, et panneau détail latéral

Éléments intéressants à réemployer dans les Workbenches :JS utile :

- domhelper.init() → indispensable
- Utilisation de eventBus
- Système de table dynamique (filtre + tri + rendu via template string)
- Panneau détail latéral (pattern très réutilisable)
- Stats cards en haut
- Badges et status dots (design system naissant)

CSS utile :

- .adm-stats, .adm-stat-card
- .adm-badge, .adm-dot
- .adm-row, .adm-row--selected
- .adm-detail-header, .adm-dl

Idées d’architecture pour les futurs Workbenches :

- Créer un AdminWorkbench ou GenericWorkbench qui inclut :
    - Sidebar
    - Header + StatusBar
    - Zone de contenu principale
    - Système de tabs
    - Overlay debug (en utilisant buildDebugData)

---

Recommandations pour la refonteCe qu’il faut garder / capitaliser :

1. buildDebugData() + debug overlay
2. requireAdmin() → à transformer en Filter ou Middleware
3. Pattern tableau + panneau détail
4. domhelper (même s’il doit être refondu)
5. Système de badges + status visuels
6. Utilisation de l’eventBus

Ce qu’il faut faire évoluer :

- Passer d’un contrôleur monolithique à un AdminController de base + Services
- Créer un Workbench Base côté JS qui absorbe domRef et une partie de domHelper
- Uniformiser le design system (classes adm-xxx → wb-xxx ou ui-xxx)
