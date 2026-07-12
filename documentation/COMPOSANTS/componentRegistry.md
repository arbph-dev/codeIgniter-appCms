Le registre actuel :

```js
const registry = []

export function register(name, init) {
    registry.push({ name, init })
}

export function boot() {
    registry.forEach(c => c.init())
}
```

fonctionne, mais il ne sait gérer qu'une seule chose : **l'initialisation**.

Or, on commence à voir apparaître un véritable cycle de vie :

```
register()

↓

init()

↓

render()

↓

show()

↓

update()

↓

destroy()
```

C'est exactement ce que Leaflet nous a fait découvrir.

## Je proposerais donc de le faire légèrement évoluer

```
// /assets/js/core/componentRegistry.js

const registry = new Map()

export function register(name, component)
{
    registry.set(name, component)
}

export function get(name)
{
    return registry.get(name)
}

export function list()
{
    return [...registry.keys()]
}

export function boot()
{
    registry.forEach(component => {

        component.init()

    })
}
```

Et un composant s'enregistrerait ainsi :

```
register('leaflet', {

    init : initLeaflet

})
```

Aujourd'hui cela paraît inutile.

Demain, Three.js pourra faire :

```
register('threejs', {

    init    : initThree,

    version : '0.1',

    destroy : destroyThree,

    debug   : true

})
```

sans modifier le Registry.

---

## Je pense même qu'on ira encore un peu plus loin

Je ne stockerais pas une fonction.

Je stockerais carrément le composant.

Par exemple Apex :

```
register('apex', {

    init: initApex,

    render(id,payload){...},

    destroy(id){...},

    list(){...}

})
```

Leaflet :

```
register('leaflet', {

    init: initLeaflet,

    render(id,payload){...},

    destroy(id){...},

    list(){...}

})
```

Three.js exactement pareil.

---

## Et là on obtient quelque chose d'intéressant

Le CMS pourrait demander :

```
ComponentRegistry.get('leaflet')
```

puis

```
.render(...)
```

ou

```
.destroy(...)
```

sans connaître Leaflet.

On arrive à un véritable système de plugins.
