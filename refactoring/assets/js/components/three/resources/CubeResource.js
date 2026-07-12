// assets/js/components/three/resources/CubeResource.js

import * as THREE from 'three';

export class CubeResource
{
    constructor({
        viewer,
        options = {}
    })
    {
        this.viewer = viewer;
        this.options = options;

        this.mesh = null;
    }

    /**
     * Initialise la ressource.
     */
    init()
    {
        const size = this.options.size ?? 1;

        const geometry = new THREE.BoxGeometry(
            size,
            size,
            size
        );

        const material = new THREE.MeshStandardMaterial({

            color: this.options.color ?? 0x00aaee

        });

        this.mesh = new THREE.Mesh(
            geometry,
            material
        );

        this.viewer.scene.add(this.mesh);
    }

    /**
     * Animation.
     */
    update(delta)
    {
        if (!this.mesh)
        {
            return;
        }

        const speed = this.options.rotationSpeed ?? 1;

        this.mesh.rotation.x += delta * speed;
        this.mesh.rotation.y += delta * speed;
    }

    /**
     * Libère les ressources.
     */
    destroy()
    {
        if (!this.mesh)
        {
            return;
        }

        this.viewer.scene.remove(this.mesh);

        this.mesh.geometry.dispose();
        this.mesh.material.dispose();

        this.mesh = null;
    }
}
