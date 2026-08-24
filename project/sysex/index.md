Ce dossier doit répertorier les éléments du système expert utiles pour un projet à venir

## Ressources
### AI
- [XXpertSystem](/project/sysex/XXpertSystem.md)
- [akinator-0-7](/project/sysex/akinator-0-7.md) sur disque local : "G:\PY\backup\XXpertSystem0.7\XXpertSystem\main.py"
- akinator-0-9, PyQtUI sur disque local "G:\PY\xxpert_system\main.py" 
- [gameai-2-5](/project/sysex/gameai-2-5.md) sur "G:\WEB\BACKUP\Hostinger\HostingerTemp\OBSIDIANDEV\OBSIDIANDEV\DOCUMENTATION\PYTHON\APPLICATIONS\AI\gameai02.5.py"
- [gameai-0-5](/project/sysex/gameai-0-5.md)
- [ai-1-0](/project/sysex/ai-1-0.md) calcul numérique Loi d'ohm
- "G:\WWW\TRAVAUX\TEMP\2026-06-08-001\main_v3.py"

### API 
- api-client-0-5


### Couches applicatives
- [Couche DB](/project/sysex/akinator-0-7/XXpertSystem/layerDB.md)
  - [Couche DB sqlite3](/project/sysex/akinator-0-7/XXpertSystem/layerDB.md)
  - [Tables de données](/project/sysex/data.md)
  - En rapport :
    - [sqlalchemy](/documentation/REFERENTIELS/PYTHON/index.md#sqlalchemy)
- [Couche MetaRegle](/project/sysex/akinator-0-7/XXpertSystem/layerMETARULES.md)
- [Couche Regle](/project/sysex/akinator-0-7/XXpertSystem/layerRULES.md)
- [Couche UI](/project/sysex/akinator-0-7/XXpertSystem/layerUI.md)
  - En rapport :[pyqt6-gui-000.py](/documentation/REFERENTIELS/PYTHON/pyqt6-gui-000.py) / [pyqt6-gui-000.md](/documentation/REFERENTIELS/PYTHON/pyqt6-gui-000.md)



### Librairies

```
import statistics  # Pour median et stdev
import sqlite3
from rich

## DEV 2025-12-25
from ui.pyqt_ui import PyQtUI
```


# Définitions
## Règle de conception

👉 Les arbres de décision sont les plus compatibles avec un moteur expert (explicables).

### ⚠️ Normalisation obligatoire pour les noms (classes,propriété....)
- `couleur dominante` → `couleur_dominante`
- `"true"`, `"false"`, `"n"` → bool normalisé

```py
def ask_yes_no(question):
    while True:
        ans = Prompt.ask(f"[bold cyan]{question}[/] (oui/o / non/n / X inconnu)", default="o").strip().lower()
        if ans in ("oui", "o", "yes", "y", "1"):
            return True
        if ans in ("non", "n", "no", "0"):
            return False
        if ans in ("x", "inconnu", ""):
            return None
        console.print("[red]Répondez par oui/o, non/n ou X[/red]")

```

### Hiérachie

#### classes
  Relation héritage : ajout d'un champ parent (convention pid ?)
  - ex : Animal / Oiseau
  
**⚠️ Héritage automatique** : Oiseau hérite de toutes les **propriétés** de la **classe** Animal et possède ses propres propriétés

Une sous-classe n’existe que si :
- Elle est discriminante
- Elle regroupe un nombre suffisant d’instances
- Elle ajoute au moins une contrainte nouvelle

Exemple :
- Classe = Animal = Prop : ovipare = true → création de Animal.Ovipare

Ne pas faire !  Animal.MasseSupérieureA50kg → bruit statistique, pas conceptuel

👉 Distinguer :
- classe sémantique (mammifère, reptile)
- classe de segmentation (cluster temporaire)



#### Instances (de classe)
une instance d'une classe pourra donner naissance à une classe 
- classe Animal / instance Oiseau
- classe Oiseau / instances : aigle, merle

Une instance peut être créée même si elle n’a pas toutes ses Valeurs de propriétés renseignées. Les valeurs absentes seront non créées, null ou héritées 

#### propriété
👉 **aucune duplication** en base  
👉 résolution dynamique

💡 Règle : **Une propriété booléenne est une projection d’une propriété catégorielle.**

Exemple : une classe à des props (seProps)
- carnivore ( bool )  = True / False
- herbivore ( bool )  = True / False
- omnivore ( bool )  = True / False
- alimentation ( enum ) = Carnivore / Herbivore / Omnivore

```
alimentation = Carnivore → génère : carnivore = true ; herbivore = false ; omnivore = false
```

##### Typologie claire des propriétés

Distinguer au niveau modèle : (voir type sqlite)

| Type logique |  Exemple |  Traitement | 
| --- |  --- |  --- | 
| Booléenne |  carnivore |  Feature binaire | 
| Catégorielle mono |  habitat |  Enum | 
| Catégorielle multi |  alimentation |  Enum | 
| Numérique |  masse |  Stat + seuils | 
| Identité |  sys_imdb_id |  clé externe | 






### Relation
gestion des relations entre instances 

C'est une étape clé pour enrichir le système expert, car ça permet de modéliser des liens complexes (ex : un "Animal" "possède" un "Habitat", ou un "CircuitElectrique" "contient" des "Composants").Rappel du contexte

Actuellement, ton modèle a :
- Classes (hierarchie avec parent_id)
- Propriétés (attachées à classes via seclass_prop)
- Instances (attachées à classes via class_id)
- Valeurs (seinst_value pour props des instances)

Mais pas de liens directs entre instances (ex : une instance A "est parent de" B, ou A "contient" plusieurs B).

Idées pour l'implémentation

1. Modèle de relations :
    - Ajouter une table se_relation pour des liens n-m (flexible) :
        - id (PK)
        - source_inst_id (FK seinst)
        - target_inst_id (FK seinst)
        - relation_type (string : "parent_of", "contains", "depends_on", etc.)
        - optional : props_json (pour métadonnées sur le lien, ex : {"strength": 0.8})
    - Alternative : Utiliser des propriétés de type "reference" ou "list_reference" (stocké comme ID ou liste d'IDs en JSON dans seinst_value). Plus simple, mais moins queryable.


#### Instances (de classe)


---

## Elements

### Classes 
table : [`seClass`](/project/sysex/data.md#seclass)

Les classes regroupe les éléments de connaissance 


#### seClass

|id|name|parent_id |
|---|---|---|
|1|Animal|null|
|2|Oiseau|Animal|

Relation héritage : ajout d'un champ parent (convention pid ?)

### Instances (de classe)
table : seInst

⚠️ Les animaux: tigre, aigle, merle… ne sont PAS des classes ce sont des **instances** de la classe Animal. Mais une instance d'une classe pourra donner naissance à une classe 

#### seInst

|id|nom|seClass|
|---|---|---|
|1|tigre|Animal|
|2|merle|Animal|
|3|aigle|Animal|
|4|manchot empereur|Oiseau|
|5|lion|Animal|



### propriétés (de classe)
table : [seProps](/project/sysex/data.md#seprop)
les seProps définissent les caractéristiques d'une classe : ["ailes", "plumes", "crie", ...]`

une propriété permet de distinguer une classe d'une autre
- 1 animal a des ailes 
- 1 animal a des plumes

> c'est un oiseau

**types**
```py
ptype = Prompt.ask("[cyan]Type[/cyan]", choices=["string","bool","int","float","date"], default="bool")
```

#### seProps (extrait)

|id|nom|type|
|---|---|---|
|1|ailes|bool|
|2|plumes|bool|
|3|crie|String|
|4|rapace|bool|
|5|mammifère|bool|
|6|vit_dans_leau|bool|
|7|couleur_dominante|String|
|8|taille|String|
|9|a_criniere|bool|

### Valeurs des propriétés
table : seInstPropsValues

Exemple : tigre
- classe "Animal"
- instance "tigre"
- propriétés "ailes" et "mammifère"
```
Valeurs des propriétés => {
  "ailes": false,
  "mammifère": true
}
```
#### seInstPropsValues

|seInst|seClassProp|value|
|---|---|---|
|tigre|ailes|false|
|tigre|mammifère|true|







    

