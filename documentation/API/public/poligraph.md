
Client Python pour l'API publique Poligraph.

API : 
- https://poligraph.fr/api

Documentation :
- https://poligraph.fr/docs/api

Authentification :
- aucune.

Pagination JSON :
- page  : numéro de page, défaut 1
- limit : nombre d'éléments, maximum 100

Identifiants stables :
- PG = politique
- AF = affaire
- FC = fact-check
- SC = scrutin
- PT = parti
- EL = élection
- MA = mandat
- DO = dossier législatif
- GP = groupe parlementaire
- LM = liste municipale

Usage :
```py
    client = PoligraphClient()
    data = client.list_politiques()
    data = client.get_politique("jean-luc-melenchon")
```    


# poligraph

les anomalies : 
- encodage UTF-8 dans certaines sorties
- différence entre endpoint liste et endpoint fiche
- résolution /id/PG-000123
- comportement de q/slug.

----------------------

## `GET /api/politiques`
liste + pagination  + q NON pas ici ; retourne la collection paginée

----------------------
## `GET /api/politiques/{slug}`
— fiche détaillée /api/politiques/damien-abad → 200 OK

le header confirme explicitement X-Matched-Path: /api/politiques/[slug]

le détail retourne les mêmes champs de base que la liste, plus mandates, declarations et les compteurs d'affaires/factchecks

----------------------
GET /api/politiques?slug=...

comportement constaté

/api/politiques?slug=damien-abad → 200 OK, mais ce n'est pas un endpoint de détail : il retourne la collection paginée
le champ identifiant retourné est id, pas poligraphId
le champ nom est fullName
la réponse de collection confirme data + pagination.

----------------------
GET /id/{publicId} — résolution d’un identifiant public par redirection

une route web canonique, pas directement un endpoint JSON.

----------------------

## GET /api/affaires — affaires enrichies avec politicien, sources et sémantique

curl -s "https://poligraph.fr/api/affaires?page=1&limit=2" | python -m
Chaque affaire contient notamment :

id
slug
title
description
status
category
involvement
factsDate
startDate
verdictDate
sentence
appeal
createdAt
updatedAt
politician
partyAtTime
sources[]
semantics

Et politician contient lui-même :

id
slug
fullName
currentParty

plus riche que la simple liste des politiques.

Je relève également que le problème d'encodage apparaît de nouveau dans la réponse brute

statuts et catégories sous forme de constantes métier (ENQUETE_PRELIMINAIRE, CONDAMNATION_DEFINITIVE, etc.).

le JSON brut est bien affiché avec des URL normales
contrairement à la première copie qui contenait des liens Markdown.



"semantics": 
{ 
"involvementLabel": "Mis en cause", 
"statusLabel": "Condamnation d\u00c3\u00a9finitive", 
"statusDescription": "ive.", 
"categoryLabel": "D\u00c3\u00a9tournement de fonds publics", 
"statusAppliesToPolitician": true,
 "needsPresumption": false, 
"certaintyLevel": "ETABLI", 
"certaintyLabel": "Condamnation d\u00c3\u00a9finitive",
 "judicialMaturity": "CONDAMNATION",
 "judicialMaturityLabel": "Condamnation" }



## partis

`GET /api/partis`

`curl -s "https://poligraph.fr/api/partis?page=1&limit=2" | python -m json.tool`

Un parti contient :
- id
- slug
- name
shortName
color
politicalPosition
politicalPositionSource
politicalPositionSourceUrl
logoUrl
foundedDate
dissolvedDate
website
memberCount

À noter également : l'encodage accentué présente à nouveau

----------------------
## elections 
`GET /api/elections`

— élections

`curl -s "https://poligraph.fr/api/elections?page=1&limit=2" | python -m json.tool`

election expose :
id
slug
type
title
shortTitle
status
scope
suffrage
round1Date
round2Date
dateConfirmed
totalSeats
candidacyCount

Valeurs observées notamment :

type        = EUROPEENNES / REGIONALES
status      = UPCOMING
scope       = EUROPEAN / REGIONAL
suffrage    = DIRECT

--------------------
## Votes

`GET /api/votes — scrutins`

`curl -s "https://poligraph.fr/api/votes?page=1&limit=2" | python -m json.tool`

id: "cmsld5mgi4ollth4s46k4ak8u"
"externalId": "VTANR5L17V8434"
"title": "l'ensemble de la proposition de loi visant \u00c3\u00a0 moderniser la gestion du patrimoine immobilier de l'\u00c3\u2030tat (texte de la commission mixte paritaire).", 
"votingDate": "2026-07-21T00:00:00.000Z",
"legislature": 17, 
"votesFor": 276, 
"votesAgainst": 86, 
"votesAbstain": 2, 
"result": "ADOPTED", 
"sourceUrl": "https://www.assemblee-nationale.fr/dyn/17/scrutins/8434", 
"totalVotes": 366 },




## mandats avec politicien
`GET /api/mandats`
curl -s "https://poligraph.fr/api/mandats?page=1&limit=2" | python -m json.tool
expose :
id
type
title
institution
role
constituency
departmentCode
startDate
endDate
isCurrent
politician
startDatePublicationStatus

avec politician :
id
slug
fullName
photoUrl

Je garde également les valeurs métier (PRESIDENT_PARTI, DEPUTE, isCurrent, AVAILABLE, etc.) telles qu'observées.

Pagination confirmée, notamment sur /politiques avec page, limit, total, totalPages


