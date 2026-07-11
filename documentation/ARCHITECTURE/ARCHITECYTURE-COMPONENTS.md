# Architecture des composants CMS

Version : 1.0  
Statut : Document de référence

---

# Objectif

L'objectif de cette architecture est de rendre chaque composant totalement autonome.

Le CMS ne connaît pas les détails d'implémentation d'un composant (ApexCharts, Mermaid, Leaflet, ThreeJS, etc.).

Il ne connaît que son cycle de vie.

Cette architecture doit permettre :

- d'ajouter facilement de nouveaux composants ;
    
- de créer des composants composites ;
    
- de limiter le couplage entre les composants ;
    
- de factoriser le code Javascript ;
    
- de simplifier le rendu côté PHP.
    

---

# Architecture générale

```
Article
    │
Section
    │
Part
    │
Component
```

Une **Part** contient exactement un composant.

Le composant est décrit par un **Descriptor**.

Le Descriptor est transformé en HTML par un **Renderer**.

Le Javascript instancie ensuite le composant dans le navigateur.

---

# Les briques

## Descriptor

Le Descriptor est la représentation sérialisée du composant.

Exemple :

```json
{
    "type":"apex",
    "config":{
        "id":"graph1",
        "chart":"line",
        "height":350
    }
}
```

Le Descriptor ne contient aucune logique.

Il ne fait que transporter les données.

---

## Renderer

Le Renderer produit le HTML.

Il ne contient aucune logique Javascript.

Exemple :

```html
<div
    id="graph1"
    class="cp_apex"
    data-chart="line">
</div>
```

---

## AdminRenderer

Le AdminRenderer produit le formulaire d'édition du composant.

Il est le miroir du Renderer.

Exemple :

```
Descriptor
        │
        ▼
AdminRenderer
        │
        ▼
Formulaire HTML
```

---

## Javascript

Le Javascript est responsable de :

- créer le composant
    
- maintenir son état
    
- écouter le bus
    
- détruire le composant
    

Il ne génère jamais le HTML.

---

# Structure d'un composant

Chaque composant possède la même organisation.

```
Component/

    Renderer.php

    AdminRenderer.php

    component.js

    assets.php (optionnel)

    presets.js (optionnel)

    README.md
```

---

# Assets

Un composant peut nécessiter :

- CSS
    
- Javascript
    
- librairies externes
    
- plugins
    
- fichiers de configuration
    

Exemple Leaflet :

```
Leaflet

    Renderer

    AdminRenderer

    leaflet.js

    GpPluginLeaflet.js

    GpPluginLeaflet.css

    customConfig.json
```

Ces ressources appartiennent au composant.

Le CMS ne doit pas connaître leur contenu.

---

# Cycle de vie

Tous les composants doivent implémenter le même cycle de vie.

```
init()

mount()

visible()

refresh()

destroy()
```

---

## init()

Chargement des ressources.

Aucune interaction avec le DOM.

Exemple :

- lecture configuration
    
- création des structures internes
    

---

## mount()

Le HTML existe.

Le composant peut créer ses objets Javascript.

Exemple :

- création ApexCharts
    
- création Mermaid
    
- création Leaflet
    

---

## visible()

Le composant devient visible.

Cette étape est indispensable pour les bibliothèques calculant leur géométrie.

Exemples :

- Leaflet
    
- Mermaid
    
- ThreeJS
    
- Monaco Editor
    

Le composant doit effectuer ici les calculs dépendant de la taille réelle du conteneur.

---

## refresh()

Les données changent.

Le composant met simplement son affichage à jour.

Exemple :

```
CodeVal
    │
    ▼
refresh Apex
```

---

## destroy()

Libération complète des ressources.

Exemples :

- suppression des écouteurs
    
- suppression des timers
    
- destruction des objets Javascript
    

---

# Bus d'événements

Deux familles d'événements existent.

---

## Evénements système

Ils sont communs à tous les composants.

```
component:init

component:mount

component:visible

component:hidden

component:refresh

component:destroy
```

Ils correspondent au cycle de vie.

---

## Evénements métier

Ils sont propres au domaine fonctionnel.

Exemples :

```
codeval:run

atelier:compute

apex:update

map:addMarker

phys:update
```

Le framework ne connaît jamais ces événements.

---

# Les composants ne se connaissent pas

Deux composants ne communiquent jamais directement.

Ils utilisent uniquement le bus.

```
CodeVal

        │

        ▼

Bus

        │

        ▼

Apex
```

Cette règle réduit fortement le couplage.

---

# Composants composites

Un composant peut contenir plusieurs composants.

Exemple :

```
Atelier moteur

    ├── CodeVal

    ├── Apex

    └── Callout
```

Le composant parent est responsable de la coordination.

Les composants enfants ignorent leur environnement.

---

## Exemple

```
CodeVal

        │

        ▼

atelier:compute

        │

        ▼

AtelierMoteur

        │

        ▼

Apex.refresh()
```

Apex ne connaît pas CodeVal.

CodeVal ne connaît pas Apex.

---

# Propagation du cycle de vie

Le cycle de vie est transmis récursivement.

```
Article

    Atelier

        Apex

        Mermaid

        Leaflet
```

Lorsque :

```
component:visible(Atelier)
```

le parent propage :

```
visible(Apex)

visible(Mermaid)

visible(Leaflet)
```

Chaque composant décide ensuite de son comportement.

---

# Registry

Le Registry référence tous les composants disponibles.

Il permet d'obtenir :

- Renderer
    
- AdminRenderer
    
- Javascript
    
- Assets
    

Le Registry devient le catalogue des composants.

---

# Convention Javascript

Chaque composant possède la même structure.

```
1 Engine

2 Registry

3 Renderer

4 Bootstrap

5 API publique
```

Cette organisation facilite la maintenance.

---

# Etat interne

Chaque composant possède un état interne.

Exemples :

Apex

```
chart
series
```

Leaflet

```
map
layers
markers
```

Mermaid

```
svg
```

CodeVal

```
script

variables

résultat
```

Cet état ne doit jamais être stocké dans le Descriptor.

Le Descriptor reste purement déclaratif.

---

# Conventions

## Le PHP

Produit uniquement :

- HTML
    
- données
    
- configuration
    

Jamais de logique Javascript.

---

## Le Javascript

Produit uniquement :

- comportement
    
- interactions
    
- rendu dynamique
    

Jamais de HTML généré côté client.

---

## Le Descriptor

Ne contient que des données.

Jamais de logique.

---

## Le Renderer

Produit uniquement du HTML.

---

## L'AdminRenderer

Produit uniquement le formulaire d'édition.

---

# Objectif final

Le CMS ne doit connaître que quatre concepts :

```
Descriptor

Renderer

Cycle de vie

EventBus
```

Tout le reste appartient aux composants.

Ainsi, ajouter un nouveau composant (Leaflet, ThreeJS, Monaco, OpenLayers, etc.) ne nécessite aucune modification du cœur du CMS.
