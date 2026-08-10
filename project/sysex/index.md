Ce dossier doit répertorier les elements du système expert


## Définitions

### Classes 
table : seClass

Les classes regroupe les éléments de connaissance 

exemple
- Animal
- Oiseau (hérite de Animal)

### Instances (de classe)
table : seInst

Les animaux: tigre, aigle, merle… ne sont PAS des classes ce sont des **instances** de classes

### propriétés (de classe)
table : seProps

définissent les caractéristiques d'une classe : ["ailes", "plumes", "crie", ...]`

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
---

### ⚠️ Normalisation obligatoire pour les noms de classes et propriété:
- `couleur dominante` → `couleur_dominante`
- `"true"`, `"false"`, `"n"` → bool normalisé

une propriété permet de distinguer une classe d'une autre
- 1 animal a des ailes 
- 1 animal a des plumes

> c'est un oiseau

### ⚠️ Héritage automatique :
- Oiseau hérite de toutes les **propriétés** de la **classe** Animal et possède ses propres propriétés

👉 **aucune duplication** en base  
👉 résolution dynamique via service 

### ⚠️ Création des instances
Une instance peut être créée même si elle n’a pas toutes ses Valeurs de propriétés renseignées**.

Les valeurs absentes :
- soit non créées
- soit null
- soit héritées implicitement (plus tard)
---

## Tables
- seClass
- seInst
- seProps
- seInstPropsValues

---

### seClass

|id|nom|parent|
|---|---|---|
|1|Animal|null|
|2|Oiseau|Animal|

Relation héritage : ajout d'un champ parent (convnetion pid ?)

---

### seInst

|id|nom|seClass|
|---|---|---|
|1|tigre|Animal|
|2|merle|Animal|
|3|aigle|Animal|
|4|manchot empereur|Oiseau|
|5|lion|Animal|

---

### seProps (extrait)

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

---

### seInstPropsValues

|seInst|seClassProp|value|
|---|---|---|
|tigre|ailes|false|
|tigre|mammifère|true|


    

