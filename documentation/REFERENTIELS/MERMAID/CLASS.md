| diagramme | code |
| --------- | ---- |
| DialogManager | ```  |
| DOMHelper | ```  |
| RelationPickerDialog | ```  |


### RelationPickerDialog

#### RelationPickerDialog - diagramme
```mermaid
classDiagram
    class RelationPickerDialog {
        +id: string
        +title: string
        +fetchFn: Function
        +columns: Array
        +minLength: number
        -_dialogEl: HTMLDialogElement
        -_searchEl: HTMLInputElement
        -_resultsEl: HTMLElement
        -_timer: number
        +constructor(config)
        +render(): RelationPickerDialog
        +destroy(): void
        -_buildHeader(): HTMLElement
        -_buildSearch(): HTMLElement
        -_handleInput(): void
        -_search(q): Promise
        -_showResults(items): void
        -_select(item): void
        -_showHint(): void
        -_reset(): void
    }
```

#### RelationPickerDialog - code
```
classDiagram
    class RelationPickerDialog {
        +id: string
        +title: string
        +fetchFn: Function
        +columns: Array
        +minLength: number
        -_dialogEl: HTMLDialogElement
        -_searchEl: HTMLInputElement
        -_resultsEl: HTMLElement
        -_timer: number
        +constructor(config)
        +render(): RelationPickerDialog
        +destroy(): void
        -_buildHeader(): HTMLElement
        -_buildSearch(): HTMLElement
        -_handleInput(): void
        -_search(q): Promise
        -_showResults(items): void
        -_select(item): void
        -_showHint(): void
        -_reset(): void
    }
```

### DialogManager

#### DialogManager - diagramme
```mermaid
classDiagram
    class DialogManager {
        <<singleton>>
        +register(id, dialog): void
        +unregister(id): void
        +show(id): void
        +close(id): void
        +select(id, item): void
    }
```
#### DialogManager - code
```
classDiagram
    class DialogManager {
        <<singleton>>
        +register(id, dialog): void
        +unregister(id): void
        +show(id): void
        +close(id): void
        +select(id, item): void
    }
```

### DOMHelper
#### DOMHelper - diagramme
```mermaid
classDiagram
    class DOMHelper {
        <<utility>>
        +create(tag, attrs): HTMLElement
        +clear(element): void
        +table(config): HTMLTableElement
        +notice(type, msg?): HTMLElement
    }
```
#### DOMHelper - code
```
classDiagram
    class DOMHelper {
        <<utility>>
        +create(tag, attrs): HTMLElement
        +clear(element): void
        +table(config): HTMLTableElement
        +notice(type, msg?): HTMLElement
    }
```



