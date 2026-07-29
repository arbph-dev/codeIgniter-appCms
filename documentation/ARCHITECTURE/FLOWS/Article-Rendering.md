### Le backend ne connaît pas le Workbench
Il produit simplement du HTML.
Le backend termine son travail à la vue :
```
ComponentRenderer -> View article2.php
```
```
Navigateur
      │
      ▼
Routes.php
      │
      ▼
CmsController::article()
      │
      ├── getPublishedArticle()
      ├── getSectionsByArticle()
      └── renderArticle()
                │
                ▼
         getFullArticle()
                │
                ▼
        renderSection()
                │
                ▼
          renderPart()
                │
                ▼
        DescriptorMapper
                │
                ▼
      DescriptorDefinition
                │
                ▼
       ComponentRenderer
                │
                ▼
        XxxRenderer
                │
                ▼
           article2.php
                │
                ▼
          Navigateur
```
---

### Le frontend possède maintenant son propre runtime
Le HTML est ensuite pris en charge par : CmsArticleWorkbench

qui devient responsable de :
- organisation de la page ;
- chargement différé des sections ;
- initialisation des composants ;
- communication via EventBus.


```mermaid
flowchart LR
HTML["HTML Article"]
WB["CmsArticleWorkbench"]
TS["TabSystem"]
BUS["EventBus"]
REG["Component Registry"]
A["Apex"]
MER["Mermaid"]
TH["Three"]
LEAF["Leaflet"]
CODE["CodeVal"]
V["View
cms/article2.php"]
HTML --> WB
WB --> TS
WB --> REG
REG --> A
REG --> MER
REG --> TH
REG --> LEAF
REG --> CODE
WB --> BUS
TS -->|"fetch /cms/section/{id}"| HTML
V --> HTML
```



---

### Le Workbench orchestre les composants
Le Workbench devient le point d'entrée du runtime JavaScript.

```
Workbench
    ↓
Component Registry
    ↓
initApex() | initMermaid() | initThree()

```

---

### TabSystem devient un composant d'infrastructure

Le chargement différé est désormais :

```
Workbench
      ↓
TabSystem
      ↓
fetch()
      ↓
/cms/section/{id}
      ↓
HTML
      ↓
initRegisteredComponentsIn()
```

On sépare ainsi deux responsabilités :

- navigation ;
- initialisation des composants.






```mermaid
flowchart LR

%%==========================
%% BACKEND
%%==========================

subgraph BACKEND["Backend - CodeIgniter"]

R["Routes.php
/cms/article/test-art"]

C["CmsController::article(slug)"]

S["CmsService::renderArticle(slug)"]

M1["CmsArticleModel"]
M2["CmsSectionModel"]
M3["CmsPartModel"]

DM["DescriptorMapper"]

CR["ComponentRenderer"]

V["View
cms/article2.php"]

R --> C
C --> S

S --> M1
S --> M2
S --> M3

S --> DM
DM --> CR
CR --> V

end

%%==========================
%% FRONT
%%==========================

subgraph FRONTEND["Frontend - Runtime"]

HTML["HTML Article"]

WB["CmsArticleWorkbench"]

TS["TabSystem"]

BUS["EventBus"]

REG["Component Registry"]

A["Apex"]

MER["Mermaid"]

TH["Three"]

LEAF["Leaflet"]

CODE["CodeVal"]

HTML --> WB

WB --> TS

WB --> REG

REG --> A
REG --> MER
REG --> TH
REG --> LEAF
REG --> CODE

WB --> BUS

TS -->|"fetch /cms/section/{id}"| HTML

end

V --> HTML
```

