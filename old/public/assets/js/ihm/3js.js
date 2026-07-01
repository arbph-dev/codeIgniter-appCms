// js/ihm/3js.js
//
// Point d'entrée Three.js.
// Rôle unique : importer le manager et appeler init().
//
// Architecture :
//   3js.js
//   └── ThreeManager  (Map d'instances, bus events)
//       └── ThreeScene  (1 instance = 1 canvas autonome)
//
// Appelé depuis main.js :
//   import { initThreejs } from './ihm/3js.js'
//   ...
//   window.addEventListener('load', () => { initThreejs() })
//
// HTML requis (autant de blocs que souhaité) :
//   <div id="THREE_1" class="cp_threejs" data-scene="cube"    data-width="800" data-height="600"></div>
//   <div id="THREE_2" class="cp_threejs" data-scene="galaxy"  data-width="800" data-height="600"></div>
//   <div id="THREE_3" class="cp_threejs" data-scene="terrain" data-width="800" data-height="600"></div>
//   <div id="THREE_4" class="cp_threejs" data-scene="model"   data-model="./assets/img/3js/model3d/bateaux/barco/Barco_obj/Barco.obj"></div>
//
// Contrôle via bus (exemples depuis n'importe quel module) :
//   bus.publish('threejs:stop',    'THREE_2')
//   bus.publish('threejs:start',   'THREE_2')
//   bus.publish('threejs:scene',   { id: 'THREE_1', type: 'galaxy' })
//   bus.publish('threejs:stop:all')
//   bus.publish('threejs:list')

import { threeManager } from './3js/ThreeManager.js'

export function initThreejs() {
    console.log('-- initThreejs --')
    threeManager.init()
}
