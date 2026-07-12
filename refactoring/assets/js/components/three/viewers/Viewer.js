/*
/assets/js/components/three/viewers/Viewer.js
Il sait :

créer le renderer ;
créer la caméra ;
créer la scène ;
appeler le ResourceLoader.


Il encapsule :

- `THREE.Scene` new THREE.Scene()
- `Renderer` renderer.render(...)
- `Camera` new PerspectiveCamera()
- boucle d'animation animate()
- resize
*/
export class Viewer
{
    constructor({ element, options })
    {
        this.element = element;
        this.options = options;
    }
}
