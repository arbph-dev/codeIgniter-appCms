# ComponentRegistry

**Fichier**

[/refactoring/app/Libraries/Components/ComponentRegistry.php](/refactoring/app/Libraries/Components/ComponentRegistry.php)

---

## Rôle

Registre principal des composants du CMS.

Il associe un type logique de composant (`raw`, `mermaid`, `apex`, `threejs`, etc.) à son Renderer PHP.

Le registre constitue le point d'entrée unique permettant de résoudre le Renderer adapté à un `DescriptorDefinition`.

Il ne contient aucune logique métier.

---

## Dépendances

Aucune dépendance métier.

Le registre manipule uniquement les Renderers enregistrés.

---

## Utilisateurs

- [/refactoring/app/Libraries/Components/ComponentRenderer.php](/refactoring/app/Libraries/Components/ComponentRenderer.php)

---

## Flux concernés

- Affichage d'un article
- Affichage d'une section
- Affichage d'un composant

```
DescriptorDefinition
        ↓
ComponentRenderer
        ↓
ComponentRegistry
        ↓
Renderer
```

---

## Documentation associée

- [/documentation/ARCHITECTURE/ComponentRegistry.md](/documentation/ARCHITECTURE/ComponentRegistry.md)
- [/documentation/ARCHITECTURE/DescriptorDefinition.md](/documentation/ARCHITECTURE/DescriptorDefinition.md)

---

## Statut

✅ Stable

---

## Décision d'architecture

**D005 — ComponentRegistry**

Le registre est l'unique point de résolution des Renderers PHP.

Il ne doit contenir ni logique métier, ni dépendance au CMS, ni accès aux modèles.



----
## OSOLETE

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
