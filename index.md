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

