# EventDefinition

## Objectif

Documenter les événements disponibles.

L'architecture SPA repose massivement sur le bus d'événements.

Il faut donc décrire les contrats.

---

## Exemple

```
{    name : 'article:selected',    payload : {        id : 'number'    }}
```

---

## Exemple

```
{    name : 'vox:speak',    payload : {        targetId : 'string',        statusId : 'string'    }}
```

---

## Exemple ThreeJS

```
{    name : 'threejs:start',    payload : {        id : 'string'    }}
```

---

## Utilité

Permet :

- documentation
- validation
- génération automatique
- debug

---

## Architecture

```
Component    ↓Event    ↓Store    ↓View
```

---