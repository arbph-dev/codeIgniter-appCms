Ce dossier doit répertorier les éléments du système expert utiles pour un projet à venir

## Ressources
### AI
- [akinator-0-7](/project/sysex/akinator-0-7.md) sur disque local : "G:\PY\backup\XXpertSystem0.7\XXpertSystem\main.py"
- akinator-0-9, PyQtUI sur disque local "G:\PY\xxpert_system\main.py" 
- [gameai-2-5](/project/sysex/gameai-2-5.md) sur "G:\WEB\BACKUP\Hostinger\HostingerTemp\OBSIDIANDEV\OBSIDIANDEV\DOCUMENTATION\PYTHON\APPLICATIONS\AI\gameai02.5.py"
- [gameai-0-5](/project/sysex/gameai-0-5.md)
- [ai-1-0](/project/sysex/ai-1-0.md) calcul numérique Loi d'ohm

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

#### Instances (de classe)
une instance d'une classe pourra donner naissance à une classe 
- classe Animal / instance Oiseau
- classe Oiseau / instances : aigle, merle

Une instance peut être créée même si elle n’a pas toutes ses Valeurs de propriétés renseignées. Les valeurs absentes seront non créées, null ou héritées 

#### propriété
👉 **aucune duplication** en base  
👉 résolution dynamique



### Relation
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







    

