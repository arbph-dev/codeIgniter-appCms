// js/ihm/3js/ThreeScene.js
//
// Une instance Three.js autonome attachée à un nœud DOM.
// Pattern calqué sur Carousel.js.
//
// Usage HTML :
//   <div id="THREE_1" class="cp_threejs"
//        data-scene="cube"
//        data-width="800"
//        data-height="600">
//   </div>
//
// data-scene : "cube" | "terrain" | "model" | "galaxy"
// data-model : chemin vers un .obj  (optionnel, pour data-scene="model")

import * as THREE from 'three';
import { OrbitControls }  from 'three/addons/controls/OrbitControls.js';
import { OBJLoader }      from 'three/addons/loaders/OBJLoader.js';
import { TerranGenerator } from './terran_generator.js';
import * as UTIL           from './util.js';

export class ThreeScene {

    constructor(rootNode) {
        this.root   = rootNode
        this.id     = rootNode.id
        this.type   = rootNode.dataset.scene  ?? 'cube'
        this.width  = parseInt(rootNode.dataset.width)  || 800
        this.height = parseInt(rootNode.dataset.height) || 600

        // ── Three.js core ──────────────────────────────────────────────────
        this.scene     = null
        this.camera    = null
        this.renderer  = null
        this.controls  = null
        this.clock     = null
        this.raycaster = null

        // ── Objets de scène (référencés pour update / dispose) ─────────────
        this._cube    = null
        this._galaxy  = null
        this._model   = null   // chargement async
        this._terran  = null
        this._terranMesh = null

        // ── Boucle rAF ────────────────────────────────────────────────────
        this._rafId   = null

        // ── IntersectionObserver — pause auto hors écran ───────────────────
        this._observer = null
        this._visible  = false

        // ── Bind ──────────────────────────────────────────────────────────
        this._animate  = this._animate.bind(this)
        this._onResize = this._onResize.bind(this)

        this._build()
        this._initObserver()
    }

    // ─── Construction ─────────────────────────────────────────────────────────

    _build() {
        // Scène
        this.scene = new THREE.Scene()

        // Caméra
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
        this.camera.position.z = 5

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.root.appendChild(this.renderer.domElement)

        // Contrôles orbitaux
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true

        // Utilitaires
        this.clock     = new THREE.Clock()
        this.raycaster = new THREE.Raycaster()

        // Lumières communes
        this._addLights()

        // Repère axes (peut être désactivé via data-axes="false")
        if (this.root.dataset.axes !== 'false') {
            this.scene.add(new THREE.AxesHelper(5))
        }

        // Contenu selon type
        this._buildScene()

        // Resize responsive
        window.addEventListener('resize', this._onResize)
    }

    _addLights() {
        const ambient  = new THREE.AmbientLight(0xffffff, 1.5)
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
        dirLight.position.set(5, 10, 7)
        this.scene.add(ambient, dirLight)
    }

    _buildScene() {
        const builders = {
            cube    : () => this._buildCube(),
            terrain : () => this._buildTerrain(),
            model   : () => this._buildModel(),
            galaxy  : () => this._buildGalaxy(),
        }
        ;(builders[this.type] ?? builders.cube)()
    }

    // ─── Types de scènes ──────────────────────────────────────────────────────

    _buildCube() {
        const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5)
        const mat = new THREE.MeshStandardMaterial({ color: 0x00aaff })
        this._cube = new THREE.Mesh(geo, mat)
        this.scene.add(this._cube)
    }

    _buildTerrain() {
        this._terran     = new TerranGenerator(60, 60, 30, 30)
        this._terran.fillPlanar(2, -2)
        this._terranMesh = this._terran.getMesh()
        this._terranMesh.rotateX(-Math.PI / 2)
        this.scene.add(this._terranMesh)
        this.camera.position.set(0, 20, 30)
        this.camera.lookAt(0, 0, 0)
    }

    _buildModel() {
        const path = this.root.dataset.model
            ?? './assets/img/3js/model3d/bateaux/barco/Barco_obj/Barco.obj'

        const loader = new OBJLoader()
        loader.load(path, (obj) => {
            // Centre le modèle sur l'origine
            const box    = new THREE.Box3().setFromObject(obj)
            const center = box.getCenter(new THREE.Vector3())
            obj.position.sub(center)

            this._model = obj
            this.scene.add(obj)
            console.log(`ThreeScene [${this.id}] — modèle chargé`)
        })
    }

    _buildGalaxy() {
        const count     = 8000
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 30
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const mat = new THREE.PointsMaterial({ color: 0xaaddff, size: 0.05 })
        this._galaxy = new THREE.Points(geo, mat)
        this.scene.add(this._galaxy)
        this.camera.position.set(0, 5, 12)
    }

    // ─── Boucle d'animation ───────────────────────────────────────────────────

    _animate() {
        this._rafId = requestAnimationFrame(this._animate)

        // Pause GPU si la scène n'est pas visible (IntersectionObserver)
        if (!this._visible) return

        this.controls.update()                       // damping obligatoire
        this._updateScene(this.clock.getDelta())
        this.renderer.render(this.scene, this.camera)
    }

    _updateScene(delta) {
        switch (this.type) {
            case 'cube':
                if (this._cube) {
                    this._cube.rotation.x += delta * 0.8
                    this._cube.rotation.y += delta * 0.5
                }
                break
            case 'galaxy':
                if (this._galaxy) this._galaxy.rotation.y += delta * 0.05
                break
            case 'model':
                if (this._model)  this._model.rotation.y  += delta * 0.3
                break
            case 'terrain':
                // terrain statique — la caméra orbit suffit
                break
        }
    }

    // ─── IntersectionObserver ─────────────────────────────────────────────────

    _initObserver() {
        this._observer = new IntersectionObserver(
            (entries) => {
                this._visible = entries[0].isIntersecting
                // Reset clock au retour en visibilité pour éviter un delta explosif
                if (this._visible) this.clock.getDelta()
            },
            { threshold: 0.1 }
        )
        this._observer.observe(this.root)
    }

    // ─── Resize ───────────────────────────────────────────────────────────────

    _onResize() {
        const w = this.root.clientWidth  || this.width
        const h = this.root.clientHeight || this.height
        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(w, h)
    }

    // ─── API publique ─────────────────────────────────────────────────────────

    /**
     * Lance la boucle de rendu.
     * Sans effet si déjà démarrée.
     */
    start() {
        if (this._rafId !== null) return
        this.clock.start()
        this._animate()
        console.log(`ThreeScene [${this.id}] — start`)
    }

    /**
     * Stoppe la boucle de rendu (pause, libère le GPU).
     */
    stop() {
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId)
            this._rafId = null
        }
        this.clock.stop()
        console.log(`ThreeScene [${this.id}] — stop`)
    }

    /**
     * Détruit proprement : arrête la boucle, déconnecte l'observer,
     * dispose toutes les ressources GPU, retire le canvas du DOM.
     */
    destroy() {
        this.stop()

        window.removeEventListener('resize', this._onResize)

        if (this._observer) {
            this._observer.disconnect()
            this._observer = null
        }

        // Libération mémoire GPU (géométries + matériaux)
        this.scene.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose()
            if (obj.material) {
                const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
                mats.forEach(m => m.dispose())
            }
        })

        this.renderer.dispose()

        if (this.renderer.domElement.parentNode === this.root) {
            this.root.removeChild(this.renderer.domElement)
        }

        console.log(`ThreeScene [${this.id}] — destroyed`)
    }
}
