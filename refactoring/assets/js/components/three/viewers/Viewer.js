/*
/assets/js/components/three/viewers/Viewer.js

Responsabilités
- encapsule une scène Three.js
- encapsule un renderer WebGL
- encapsule une caméra
- gère le cycle de vie
    - init()
    - refresh()
    - destroy()
- gère le rendu
- gère le redimensionnement
- délègue le chargement des ressources
*/
export class Viewer
{
    constructor({ element, options })
    {
        this.element = element;
        this.options = options;

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.resource = null;

        this.animationId = null;

        this.state = {};
    }

    init() {}

    refresh() {}

    resize() {}

    render() {}

    animate() {}

    destroy() {}
}
