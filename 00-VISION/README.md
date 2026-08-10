# Zealot — Versatile Knowledge Base

**Plateforme de connaissance polyvalente** construite sur CodeIgniter 4.

> Ce n’est plus un simple CMS à widgets.  
> C’est un socle pour explorer, structurer et manipuler des connaissances métier via des **Workbenches** modulaires.

| | |
|---|---|
| **Statut** | Refactoring actif — infrastructure Workbench stabilisée |
| **Stack** | CodeIgniter 4 · PHP 8.2+ · Vanilla JS · MySQL/MariaDB |
| **Site** | [zealot.fr](https://zealot.fr/) |
| **Licence** | AGPL-3.0 |

---

## Vision

**Zealot** permet de construire rapidement des interfaces d’exploration et d’édition de données structurées.

Le cœur du produit n’est plus la publication de pages CMS, mais le **Workbench** : un banc de travail plein écran composé de panels (liste, détail, preview, carte…) pilotés par des services API.

| Domaine | Rôle |
|---------|------|
| **Knowledge Base** | Concepts, mots, descripteurs, relations |
| **Workbenches** | Interfaces d’édition / exploration par domaine |
| **Component Catalog** | Catalogue de composants visuels (charts, maps, 3D…) |
| **CMS** | Couche de contenu structurée (héritage, en consolidation) |

---

## Architecture frontend (Workbench)

Principe directeur : **Raw is beautiful** — peu de classes, responsabilités nettes, pas de fat objects.

```
WorkbenchBase
    │
    ▼
Workbench          (orchestrateur : panels, events, services)
    │
    ▼
WorkbenchView      (layout + zones + montage DOM uniquement)
    │
    ▼
PanelBase          (render / show / clear / destroy)
    │
    ▼
Panels métier      (List, Detail, Preview, Map…)
```


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


```
codeIgniter-appCms/
├── refactoring/          # Code actif (cible)
│   ├── app/              # Controllers, Models, Libraries, Views, Config
│   └── assets/js/        # Frontend workbench + features
├── old/                  # Ancienne base (référence / migration)
├── documentation/        # Doc stable (en réorganisation)
├── project/
│   ├── daily/            # Notes de session (source de vérité temporaire)
│   ├── stages/           # Contrats & checklists (Panel Contract, etc.)
│   └── audit/
├── README.md
└── LICENSE
```



Documentation

La documentation historique (documentation/) mélange CMS widgets et digressions architecturales. Elle est en cours de réorganisation autour de :Vision — Versatile Knowledge Base  
Architecture Workbench & Panel Contract  
Features (workbenches, knowledge base)  
Conventions dev (JS, CSS, services)  
Roadmap

Les notes quotidiennes (project/daily/) contiennent les décisions récentes non encore consolidées.




PrincipesMotWorkbench est la référence — tout nouveau workbench suit son pattern.  
Panel Contract strict — pas d’API dans les panels, pas de side-effect dans le constructeur.  
Form.js — contrat minimal : render() · fill() · reset() · extract().  
Backend workbench minimal — route + méthode + vue stub.  
Pas de deuxième pattern — SectionPanel est héritage, non modèle.









