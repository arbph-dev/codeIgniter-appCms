# Zealot v2 - CMS Headless

```mermaid
graph TD

CmsController --> CmsService

CmsService --> DescriptorFactory

DescriptorFactory --> Descriptor

Descriptor --> Renderer

Renderer --> View
```
Un CMS professionnel basé sur CodeIgniter 4.7 pour gérer :
- Contenu structuré (catégories → articles → sections → parts)
- Composants JavaScript avancés (Apex, Mermaid, ThreeJS)
- API JSON et descripteurs de composants

**Statut** : Migration vers refactorisation
**Tech** : PHP 8+, CodeIgniter 4.7, MySQL 8+/MariaDB, JavaScript ES6+

```mermaid
flowchart TB

    subgraph PHP
        AR["AdminRenderer"]
    end

    subgraph HTML
        T["textarea"]
        P["pre.mermaid"]
        B["Render button"]
    end

    subgraph AdminJS
        BS["admin/bootstrap.js"]
    end

    subgraph Core
        EB["EventBus"]
    end

    subgraph Components
        MC["components/mermaid.js"]
    end

    subgraph Library
        M["Mermaid"]
    end

    AR --> T
    AR --> P
    AR --> B

    B --> BS

    BS -->|copie| P

    BS -->|publish| EB

    EB --> MC

    MC --> M

    M --> P
```
