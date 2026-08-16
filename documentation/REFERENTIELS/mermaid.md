Pour les couleurs 
des classes de stylesseront plus facile a réemployer
```
style A fill:#bbf,stroke:#f66,stroke-width:2px,color:#fff,stroke-dasharray: 5 5

// definit la classe classRoutes
classDef classRoutes fill:#f9f,stroke:#333,stroke-width:4px;
//afecte la classe classRoutes au noeud A
class A className;

// une autre ectriure plus codensée
A:::classRoutes --> B
classDef classRoutes fill:#f9f,stroke:#333,stroke-width:4px;
```
il faut employer stroke et fill

- fill 
Routes             bleu
Controller         vert
CmsService         orange
Models             jaune
Descriptor         violet
Renderers          rouge
Views              gris

- stroke indique un état : on peut employer stroke-width et stroke-dasharray: 5 5

## style
- Implémenté, utilisé en production : vert,stroke-width:4px    
- Utilisé mais sans documentation : jaune,stroke-width:2px   
bleu,stroke-width:2px Fonctionnel mais évolutif
violet,stroke-width:1px  Expérimentation conservée
blanc,stroke-width:1px,stroke-dasharray: 5 5   Conception future uniquement
rouge,stroke-width:2px,stroke-dasharray: 5 5   Plus utilisé

---

une évolution : ajouter, dans tous les diagrammes internes, une distinction entre flux d'appels et flux de données. Par exemple :

flèches pleines (-->) : appels de méthodes ;

flèches pointillées (-.->) : objets ou collections retournés (Category[], Article[], Section[], Part[], DescriptorDefinition, etc.).

Cela rendrait les diagrammes plus proches de diagrammes d'architecture qu'un simple organigramme d'exécution, tout en restant compatibles avec Mermaid.
