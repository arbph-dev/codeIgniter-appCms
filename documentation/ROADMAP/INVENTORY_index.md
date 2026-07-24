


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


