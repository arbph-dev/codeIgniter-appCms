
## Objectif

Le ComponentRegistry centralise les composants disponibles dans l'application.

---

## Responsabilités

### Enregistrement

```javascript
ComponentRegistry.register(
    'codeval',
    CodevalComponent
)
```

### Recherche

```javascript
ComponentRegistry.get('codeval')
```

### Initialisation

```javascript
ComponentRegistry.initAll()
```

---

## Contenu

Le registre stocke principalement :

```text
constructeurs Javascript
```

Exemple :

```javascript
{
    codeval : CodevalComponent,
    apex    : ApexComponent,
    vox     : VoxComponent,
    threejs : ThreeManager
}
```

---

## Cycle de vie

```text
Descriptor
    ↓

ComponentDefinition
    ↓

ComponentRegistry
    ↓

new Component(...)
```

---

## Avantages

- découplage
    
- chargement dynamique
    
- composants réutilisables
    
- CMS piloté par les descripteurs
    

---

## Rôle dans Zealot

Le registre constitue le catalogue actif des composants disponibles.