


## sources: 
local : "G:\WWW\OVH\PY\"

api-client-0-5
- [inpi_client.py](/project/sysex/api-client-0-5/inpi_client.py)
- [insee_client.py](/project/sysex/api-client-0-5/insee_client.py)
- [main2.py](/project/sysex/api-client-0-5/main2.py)
- [personne_client.py](/project/sysex/api-client-0-5/personne_client.py)




## Authentification
les credendtials sont gérés différemment

token
- insee

bearer
- inpi
- zealot via personne_client

### login zealot
```py
personne = PersonneClient("https://zealot.fr", "xxxxxxx", "xxxxxxx")
```

**correct => 200 ok**
```
[PersonneClient] GET https://zealot.fr/api/personnes?q=gaulle&page=1&per_page=20 → 200
```

**erreur login => 401**
```
[PersonneClient] GET https://zealot.fr/api/personnes?q=gaulle&page=1&per_page=20 → 401
[PersonneClient] 401 — tentative de refresh token...
[PersonneClient] HTTP Error login : 401 Client Error: Unauthorized for url: https://zealot.fr/api/auth/login — {"error":"Email ou mot de passe invalide"}
[PersonneClient] HTTP Error : 401 Client Error: Unauthorized for url: https://zealot.fr/api/personnes?q=gaulle&page=1&per_page=20 — {"message":"The access token is invalid."}
```


