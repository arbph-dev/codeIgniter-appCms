ApiDefinition.md ne doit plus documenter les endpoints.

Il doit documenter le contrat commun :
- GET
- POST
- PUT
- DELETE

et aussi
- pagination
- errors
- links
- metadata

Autrement dit :
```
API Definition
        ↓
Organisation API
Entreprise API
Image API
...
```


---
# OBSOLETE

## Objectif

Décrire une API consommée par une Feature ou un Service.

L'ApiDefinition représente un contrat d'échange de données.

Elle ne contient aucun code métier.

---

## Exemple

```js
{
  name: 'adresseApi',
  baseUrl: '/api/adresse',
  endpoints: {
        list   : 'GET /',
        detail : 'GET /:id',
        create : 'POST /',
        update : 'PUT /:id',
        delete : 'DELETE /:id'
    }
}
```

---

## Rôle

Permet à une Feature de connaître :

```
Feature    ↓ApiDefinition    ↓Backend
```

---

## Exemple Zealot

```
{    name: 'codePostalApi',    baseUrl: '/api/codepostal',    endpoints: {        search : 'GET /like',        list   : 'GET /'    }}
```

---
