

## services/auth/

ApiKeyAuth.py
- Authentification par clé API — header ou query param.


Usage :
```py
  # INSEE : clé en header
  auth = ApiKeyAuth(api_key="xxx", header_name="X-INSEE-Api-Key-Integration")
  session = auth.get_session()

  # Autre API : clé en query param
  auth = ApiKeyAuth(api_key="xxx", query_name="api_key")
```

CredentialsStore

```py
from services.auth import CredentialsStore
from ci_client.codesnaf import CodeNafClient
from ci_client.formejuridique import FormeJuridiqueClient

store = CredentialsStore("./data/credentials.db")

# cration des credentials a faire une fois
# store.set("zealot", login="xxxx@yyyy.com", password="zzzzzzzzzz")
auth = store.build_and_login("zealot")   # fait le POST /auth/login

naf  = CodeNafClient("https://zealot.fr/api", auth=auth)
print(naf.get("68.10Z"))
print(naf.like("immo", len_=5))
print(naf.hierarchy("68.10Z"))
```



---

ci_client/formejuridique.py
Client pour l'API FormeJuridique de zealot.fr — lecture + écriture.

Routes couvertes :
    GET    /api/formejuridique                    → liste paginée
    GET    /api/formejuridique?q=soci             → recherche
    GET    /api/formejuridique?id=5499            → par code exact
    GET    /api/formejuridique/{id}               → fiche par code
    GET    /api/formejuridique/like?q=soci&len=10 → autocomplete
    POST   /api/formejuridique                    → créer
    PUT    /api/formejuridique/{id}               → modifier
    DELETE /api/formejuridique/{id}               → supprimer

Structure d'une FormeJuridique :
    { "id": "5499", "description": "Société par actions simplifiée" }



