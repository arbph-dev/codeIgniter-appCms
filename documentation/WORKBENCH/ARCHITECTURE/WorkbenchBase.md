# WorkbenchBase

Base commune de tous les Workbenches.

```mermaid
classDiagram
    classDef abstract fill:#f9f9f9,stroke:#333,stroke-dasharray: 5 5

    class WorkbenchBase:::abstract {
        <<abstract>>
        +id: string
        +name: string
        +container: HTMLElement
        +bus: EventBus
        +componentRegistry: Map
        +state: object
        +init(selector): Promise
        +renderStructure(): void
        +bootstrap(): Promise
        +register(name, initFn): void
        +initRegisteredComponentsIn(root): void
        +publish(event, data): void
        +subscribe(event, cb): void
        +destroy(): void
    }
```


Responsabilités :
- accès au container DOM via init()
- accès au bus d'événements via this.bus
- sélection d'éléments via getElement()
- points d'entrée du cycle de vie : bootstrap(), load(), destroy()

Ce que WorkbenchBase ne fait PAS :
- aucune construction de layout
- aucune gestion de Panel
- aucun enregistrement de composant
- aucun template
- aucun appel API
