

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

