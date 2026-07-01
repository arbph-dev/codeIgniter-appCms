// /assets/js/core/componentRegistry.js

/*
le composant importe register
    import {register } from '/assets/js/core/componentRegistry.js'

le composant s'enregistre
    register('codeval', initCodeVal)

dans window.load on appelle boot

*/


const registry = []

export function register(name, init) {
    registry.push({ name, init })
}

export function boot() {
    registry.forEach(c => c.init())
}
