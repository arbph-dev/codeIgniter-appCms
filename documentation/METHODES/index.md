
# Plugin et librairie js a voir
blockly
https://github.com/RaspberryPiFoundation/blockly-samples/blob/main/examples/getting-started-codelab/complete-code/scripts/sound_blocks.js

# Guide de création d'un composant CMS


## check-list
Pour chaque nouveau composant, on produit toujours les mêmes fichiers et toujours le même ordre. Ainsi intégrer un nouveau composant devient une check-list.
```
app/Libraries/Components/Renderers/
    XxxRenderer.php

app/Libraries/Components/AdminRenderers/
    XxxAdminRenderer.php

assets/js/components/
    xxx.js

assets/css/components/
    xxx.css
```
puis
```
ComponentRegistry
AdminComponentRegistry
```
puis
```
cms/bootstrap.js
admin/bootstrap.js
```

## 1 - MermaidRenderer
app/Libraries/Components/Renderers/MermaidRenderer.php - EXISTE
[[DAILY/2026-06-28/app/Libraries/Components/Renderers/MermaidRenderer.php]]
## 2 - MermaidAdminRenderer
app/Libraries/Components/AdminRenderers/MermaidAdminRenderer.php - FAIT
[[DAILY/2026-06-28/app/Libraries/Components/AdminRenderers/MermaidAdminRenderer.php]]

n'intègre **aucun JavaScript** pour le moment.

Comme nous l'avons fait pour `CodeVal`, on commence par :

- éditer correctement les données ;
- sauvegarder correctement les données ;
- vérifier que `DescriptorMapper` fonctionne.

Ensuite seulement on branchera :

```
assets/js/components/mermaid.js
```

puis

```
assets/js/admin/bootstrap.js
```

pour obtenir une prévisualisation en direct.

---

Je propose d'avancer exactement comme pour `CodeVal` :

1. ✅ `MermaidAdminRenderer.php` (éditeur des propriétés)
2. `admin/bootstrap.js` (initialisation Mermaid)
3. `assets/js/components/mermaid.js` (mode édition)
4. ajout d'une **prévisualisation live** du diagramme à droite du textarea.

Je pense que cette progression limitera les régressions et te donnera un modèle réutilisable pour les futurs composants JS.

NON on ne modifie SURTOUT pas le composant js employé en production. Le composant n'a pas vocation a etre modifié par les users. On modifie le script du bouton, on créé une fonction dans le admin/bootstrap.js qui recopie le texte du textaera vers le pre et apelle l'event bus. Pour l'id j'ai repris `$id` calculé mais on peut garder `MERMAID_{$id}_RESULT` si tu veux tant que l'on utilis ele bon id dom pour le payload de l'event bus

C'est le composant **de production**. L'administration doit s'adapter à lui, pas l'inverse.
En fait, on retrouve exactement le principe que l'on s'était fixé :
- `components/` = composants métier, utilisés en production ;
- `admin/` = adaptation de l'interface d'administration.

Le composant Mermaid ne sait pas qu'il existe un textarea, et il ne doit jamais le savoir.


Le bouton ne publie plus directement l'événement Mermaid.
Il appelle une fonction du bootstrap admin :
Je trouve même cette solution plus élégante que le `onclick` actuel, parce qu'elle sépare les responsabilités
```
<button
    type="button"
    onclick="adminRenderMermaid('<?= $id ?>')">Render</button>
```

ou, si tu préfères éviter le PHP dans le HTML généré :

```
<button
    type="button"
    onclick="adminRenderMermaid('{$id}')">Render</button>
```

---

##  `assets/js/admin/bootstrap.js`
[[DAILY/2026-06-28/assets/js/admin/bootstrap.js]]
```js
import { bus } from '/assets/js/core/eventBus.js'

window.eventBusPublish = (evt, eventName, payload) => {    bus.publish(eventName, payload)
}

window.adminRenderMermaid = function(id){
	const source = document.getElementById(`MERMAID_${id}_SOURCE`);
	const result = document.getElementById(`MERMAID_${id}_RESULT`);
	
	if (!source || !result) { return; }
	
	result.textContent = source.value;
	window.eventBusPublish( null, 'mermaid:render', { id: result.id } );}
```

Le point important est ici : result.id est une string 
```
window.eventBusPublish(    null,    'mermaid:render',    result.id);
```
rappel : ==les payloads eventbus ont besoin d'objets==
```js
 window.eventBusPublish( null, 'mermaid:render', { id: result.id } );
```

Le payload n'est plus :
```
MM_1
```
mais :
```
MERMAID_MM_1_RESULT
```
c'est-à-dire **l'id réel du `<pre>`** dans la vue admin.

---


Je conserverais cette convention de nommage :

```
MERMAID_<id>
MERMAID_<id>_SOURCE
MERMAID_<id>_RESULT
```


Tu as raison sur un point important : avec l'architecture que tu construis, **je dois systématiquement demander le composant JS** avant de proposer une adaptation de l'admin.

J'avais raisonné par analogie avec `CodeVal` alors que `Mermaid` avait sa propre convention d'appel.

En réalité, on a appris quelque chose d'utile pour la suite.

## La règle que je retiens pour les prochains composants

Avant de coder un `XXXAdminRenderer`, on regarde toujours :

```
assets/js/components/xxx.js
```

et on identifie :

- les événements auxquels il souscrit ;
- le format exact du payload ;
- les ids DOM attendus ;
- la structure HTML qu'il manipule.

L'admin s'adapte ensuite à cette API, jamais l'inverse.

---

D'ailleurs, ce composant Mermaid nous a permis de formaliser une architecture que je trouve très propre :

```
AdminRenderer (PHP)
        │
        ▼
HTML d'édition
        │
        ▼
admin/bootstrap.js
        │
        ├── copie textarea → pre
        └── publish(event, payload)
                    │
                    ▼
EventBus
                    │
                    ▼
assets/js/components/mermaid.js
                    │
                    ▼
Mermaid
```

---

**méthodologie d'intégration des composants** :

1. **Renderer** : affichage public.
2. **AdminRenderer** : édition des paramètres.
3. **bootstrap admin** : adaptation DOM si nécessaire.
4. **Composant JS** : inchangé, réutilisé tel quel.
5. **EventBus** : contrat de communication unique.

cette méthode va s'appliquer aux prochains composants (`Apex`, `Leaflet`, `Three.js`, `Blockly`, etc.) sans avoir à réinventer l'intégration à chaque fois.

une architecture où les composants sont :
- stockés en base,
- éditables,
- réordonnables,
- rendus côté public,
- rendus côté administration,
- pilotés par un bus d'événements.

---

# Cycle de vie d'un composant

## méthodes des  composants
- render() : Génère le HTML
- init() :  Initialise le composant
- visible() : Le composant devient visible
- refresh() : Les données changent
- destroy() : Nettoyage

## Event bus 
- component:init
- component:visible
- component:refresh
- component:destroy

## convention
une convention importante qui permettra d'intégrer naturellement tous les composants "sensibles à la visibilité" sans leur faire connaître les détails de l'interface (onglets, accordéons, panneaux repliables, etc.). 
Le CMS gérera ces transitions, et chaque composant n'aura qu'à réagir à son propre cycle de vie. C'est une abstraction qui rendra l'ensemble beaucoup plus cohérent et extensible.

On y définirait précisément :
- les rôles (Descriptor, ComponentDefinition, ComponentInstance) ;
- le cycle de vie (init, mount, visible, refresh, destroy) ;
- la gestion des assets ;
- les conventions du bus (événements système vs métier) ;
- les composants composites et la propagation des événements.

Nous intégrerions Leaflet en suivant ces règles. 

Si Leaflet s'intègre sans entorse au modèle, cela signifiera que l'architecture est suffisamment solide pour accueillir des composants plus complexes.
Il faut poser ces fondations avant que le nombre de composants n'augmente.








