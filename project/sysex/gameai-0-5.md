# Concept

```mermaid
flowchart LR
  GameAI["gameai03.py KB (pywise_kb.json)"]
  RulesLib["tsdev_AI4.py (Faits / Regles)"]
  AdapterGame["adapters/gameai_adapter.py"]
  AdapterRules["adapters/rules_adapter.py"]
  Domain["pywise.domain (seClass, seProps, seInst, seInstPropsValues)"]
  Storage["pywise.storage (sqlite/mysql)"]
  CLI["pywise.cli (commands)"]

  GameAI --> AdapterGame --> Domain
  RulesLib --> AdapterRules --> Domain
  Domain <--> Storage
  CLI --> AdapterGame
  CLI --> AdapterRules

```


# Implementation

[`knowledge_base`](project/sysex/gameai-0-5/gameai-0-5.py#L1)
- knowledge_base - Data - Nombre de lignes  =13

[`def pose_question(caracteristique):`]()
- def pose_question(caracteristique): - ui - Nombre de lignes  =5

[`def ajouter_animal():`]()
- def ajouter_animal(): - Data - Nombre de lignes  =11

[`def deviner_animal():`]()
- def deviner_animal(): - Rules - Nombre de lignes  =31

