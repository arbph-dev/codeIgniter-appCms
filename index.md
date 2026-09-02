

https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/TASKS.md

Projet en cours
- [Orbis / Index](/Orbis/index.md) Orbis (python)
  - [Orbis / Couche 3](/project/daily/2026-09-01.md)
  - [Orbis / Couche 5 / definition](/project/daily/2026-08-30-001-Orbis.md) 
  - [Orbis / Couche 5 / Étape 1](/project/daily/2026-08-30-002.md)
  - [Orbis / Couche 5 / Étape 2](/project/daily/2026-08-31-003.md) : Découpage en 3 modules + layer5.py mince. Scoring intégré à l’étape 2, colonnes M/V/G.-
  - [Orbis / Couche 5 / Étape 3](/project/daily/2026-08-31-004.md)
  - [Orbis / Couche 5 / Étape 4](/project/daily/2026-09-01-001.md)
  - [Orbis / Couche 5 / Etat et évolutions](/project/daily/2026-09-01-002.md)
  - [Orbis / Client API / Adresse (Zealot)](/project/daily/2026-09-01-003.md)
- referentiels
	- python : https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/REFERENTIELS/PYTHON/object.md
- Workbench Js
- Serveur CodeIgniter
- API
	- Zealot
		- [2026-08-30](/project/daily/2026-08-30.md) : Refactor Organisation Entreprises Etablissements pour Orbis
		- [2026-08-31-001-Etablissement](/project/daily/2026-08-31-001-Etablissement.md)
  		- [Adresse](/documentation/METIERS/Adresse.md)
    		-  mise a jour documentation pour création client **Orbis** [2026-09-01-003](/project/daily/2026-09-01-003.md) 
  		- [Image](/documentation/API/Image.md) intégration [Orbis](/project/daily/2026-09-01-004.md)
  - Publique
 		- [insee_note](/documentation/API/public/insee_note.md)
   		- [poligraph](/documentation/API/public/poligraph.md)
---

# Orbis / Couche 3 et 5
- [Orbis / Couche 3](/project/daily/2026-09-01.md)
	- slug, forme_juridique, dates, méthodes dynamiques
- [Orbis / Couche 5 / Étape 4](/project/daily/2026-09-01-001.md)
	- push Zealot (attach)
- [Orbis / Couche 5 / Etat et évolutions](/project/daily/2026-09-01-002.md)
	- Point Orbis couche 5 & pipeline Entreprise

---

# [2026-08-31](/project/daily/2026-08-31.md)

- [2026-08-31-001](/project/daily/2026-08-31-001-Etablissement.md)
	- Serveur Zealot / Domaine Organisation / API
 	- Dans etablissement - relation adresse, que l'on va pouvoir propager aux organisations
 		- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Models/EtablissementModel.php
   		- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Controllers/Api/Etablissement.php
- [2026-08-31-002](/project/daily/2026-08-31-002.md)
	- Étape 2 — Recherche INSEE (WorkingMemory)
- [2026-08-31-003](/project/daily/2026-08-31-003.md)
	- Découpage en 3 modules + layer5.py mince.
	- Scoring intégré à l’étape 2, colonnes M/V/G.
- [2026-08-31-004](/project/daily/2026-08-31-004.md)
	- Étape 3 — Qualifier + intégrer SIRENE (local)



---

# [2026-08-30](/project/daily/2026-08-30.md)
- Refactor Organisation Entreprises Etablissements pour Orbis
- [Orbis / Couche 5 / definition](/project/daily/2026-08-30-001-Orbis.md)
- [Orbis / Couche 5 / Étape 1](/project/daily/2026-08-30-002.md)
	- Orbis/Couche 5/etape1 — qualification / enrichissement (stub).


---
A documenter :
- EntrepriseZealot
- un sample JSON réel GET /entreprise/:id permet de valider siege et les libellés.









# 2026-08-22

## Reprise de la documentation

### documentation-API
Les travaux récents implique d'arrêter de nouvelles méthodes pour les API
le dossier sera /documentation/API/ARCHITECTURE/
- gestion des versions
- meta a généraliser
  - Echo des paramètres — utile pour le cache et le débogage client
- reprendre
  - https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/presentation.md
  - index des apis
- ressources à compiler
  - documentation/METHODES/modelisation.md
    - https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/ARCHITECTURE/normalisation.md#conseils-pour-les-api-futures
  - documentation/API/ARCHITECTURE/API — Routes de référence.md
    - https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/ARCHITECTURE/API%20%E2%80%94%20Routes%20de%20r%C3%A9f%C3%A9rence.md
  - ajouter personnes      

```
documentation/
├── API/
│   ├── index.md
│   ├── Organisation.md                   ⏳
│   ├── Entreprise.md                     ⏳
│   ├── Etablissement.md                  ⏳
│   ├── Services.md                       ⏳
│   ├── CodeNaf.md                        ⏳
│   ├── FormeJuridique.md                 ⏳
│   ├── TypeVoie.md                       ⏳
│   ├── CodePostal.md                     ⏳
│   ├── Adresse.md                        ⏳
│   ├── Image.md                          ⏳
│   ├── ComptespcG.md                     ⏳
│   └── Mot.md                            ⏳
└── METIERS/
    └── index.md                          (concepts, projets à créer)
```
#### [documentation/API/](/documentation/API/)
- [index.md](/documentation/API/index.md)
- [presentation.md](/documentation/API/presentation.md)

### documentation-BACKEND
Le Backend doit être organisé en module dans le dossier  [documentation/METIERS/](/documentation/METIERS/)
- un README
Les modules comme [ORGANISATIONS](/documentation/METIERS/ORGANISATIONS) regrouperont des classes  
chaque module doit comporter : 
- un README rédigés selon le template [modules](/documentation/REFERENTIELS/TEMPLATES#modules)dans documentation/REFERENTIELS/TEMPLATES/
  - la liste des classes
  - on indiquera l'état ( projet, en production)
- un dossier par classe 
- une note par classe
     - liste des fichiers : model, Controller, routes
- une note relation

Des notes seront a géré en daily puis a ventilées
- configuration
- méthodes
  - [charte-de-modélisation](/documentation/METHODES/modelisation.md#charte-de-modélisation)
  - table polymorphique
  - gestion des relations
  - contrat api 

### documentation-FRONTEND
- L'arborescence doit être détaillé

## Taches
- [] Lister les Workbench
- [] Détailler les éléments clefs des Workbench
- [] Ajuster l'arborescence
- [] Etablir des templates

