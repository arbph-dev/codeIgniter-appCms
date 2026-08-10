



# Documentation

La documentation historique (documentation/) mélange CMS widgets et digressions architecturales.

Elle est en cours de réorganisation autour de :
- Vision — Versatile Knowledge Base  
- Architecture Workbench & Panel Contract  
- Features (workbenches, knowledge base)  
- Conventions dev (JS, CSS, services)  
- Roadmap

Les notes quotidiennes (project/daily/) contiennent les décisions récentes non encore consolidées.


## Principes

Panel Contract strict — pas d’API dans les panels, pas de side-effect dans le constructeur.  

Form.js — contrat minimal : render() · fill() · reset() · extract().  

Backend workbench minimal — route + méthode + vue stub.  

Pas de deuxième pattern — SectionPanel est héritage, non modèle.

## Arborescence
- [ ] Détailler les éléments clefs

```
refactoring/assets/js/ui/
├── shared/              # Form, validation, templates
└── workbench/
    ├── WorkbenchBase.js
    ├── TabSystem.js
    ├── core/
    ├── layouts/
    ├── views/
    ├── mot/             # référence
    ├── catalog/
    ├── image/
    └── adresse/
```


