# Backend
## Structure

| Field      | Type        | Null | Key | Default | Extra |
| ---------- | ----------- | ---- | --- | ------- | ----- |
| codenaf    | varchar(10) | NO   | PRI | _NULL_  |       |
| nom        | text        | NO   | MUL | _NULL_  |       |
| parentcode | varchar(10) | YES  | MUL | _NULL_  |       |
| created_at | datetime    | YES  |     | _NULL_  |       |
| updated_at | datetime    | YES  |     | _NULL_  |       |
## Model
note :
- [[CI/PORTAIL/Portail/app/Models/CodeNafModel.php]]
src : 
- [[CI/PORTAIL/Portail/app/Models/CodePostalModel.php]]

## Routes
Routes couvertes :
    GET /api/codesnaf                   → liste paginée
    GET /api/codesnaf?q=terme           → recherche par nom
    GET /api/codesnaf/{code}            → fiche par code NAF
    GET /api/codesnaf/like?q=term&len=n → ==autocomplete== #autocomplete
    GET /api/codesnaf/{code}/children   → enfants directs
    GET /api/codesnaf/{code}/hierarchy  → hiérarchie vers la racine
    GET /api/codesnaf/tree              → arbre complet

## Controller
file : app\Controllers\Api\CodeNaf.php
note : [[CI/PORTAIL/Portail/app/Controllers/Api/CodeNaf.php]]
src : 

# [[API/zealot.codesnaf]]
Structure d'un CodeNaf :
```json
{ 
	"codenaf": "68.10Z",
	"nom": "Activités des marchands...",
	"parentcode": "68.1" 
}
```

Lecture / Ecriture : Lecture seul , référentiel fixe


# Frontend js

\assets\js\features\codenaf\codenaf.controller.js"
\assets\js\features\codenaf\codenaf.form.js"
\assets\js\features\codenaf\codenaf.renderer.js"
\assets\js\features\codenaf\codenaf.service.js"
\assets\js\features\codenaf\codenaf.store.js"
\assets\js\features\codenaf\index.js"

# Python
ci_client/codesnaf.py
Client pour l'API CodeNaf de zealot.fr — lecture seule.

Usage :
    from services.auth import CredentialsStore
    store = CredentialsStore("./data/credentials.db")
    auth  = store.build_and_login("zealot")
    naf   = CodeNafClient("https://zealot.fr/api", auth=auth)
    item  = naf.get("68.10Z")