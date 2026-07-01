// js/ihm/3js/ThreeManager.js
//
// Gestionnaire de toutes les instances ThreeScene.
// Pattern calqué sur CarouselManager.js.
//
// ── Events bus disponibles ────────────────────────────────────────────────────
//
//   bus.publish('threejs:start',   'THREE_1')           → démarre une scène
//   bus.publish('threejs:stop',    'THREE_1')           → pause une scène
//   bus.publish('threejs:destroy', 'THREE_1')           → détruit une scène
//   bus.publish('threejs:scene',   { id:'THREE_1', type:'galaxy' }) → change de scène
//   bus.publish('threejs:start:all')                    → démarre toutes
//   bus.publish('threejs:stop:all')                     → pause toutes
//   bus.publish('threejs:list')                         → log debug
//
// ─────────────────────────────────────────────────────────────────────────────

import { bus }        from '../../core/eventBus.js'
import { ThreeScene } from './ThreeScene.js'

class ThreeManager {

    constructor() {
        this.scenes = new Map()      // id → ThreeScene
        this._registerEvents()
    }

    // ─── Init ─────────────────────────────────────────────────────────────────

    /**
     * Scanne le DOM, crée une ThreeScene par nœud .cp_threejs et la démarre.
     * Appelé une seule fois depuis initThreejs().
     */
    init() {
        const nodes = document.querySelectorAll('.cp_threejs')

        nodes.forEach(node => {
            const instance = new ThreeScene(node)
            this.scenes.set(instance.id, instance)
            instance.start()
        })

        console.log(`ThreeManager: ${this.scenes.size} scène(s) initialisée(s)`)
    }

    // ─── Accès ────────────────────────────────────────────────────────────────

    getById(id) {
        return this.scenes.get(id) ?? null
    }

    destroy(id) {
        const scene = this.getById(id)
        if (!scene) return
        scene.destroy()
        this.scenes.delete(id)
    }

    // ─── Bus Events ──────────────────────────────────────────────────────────

    _registerEvents() {

        // ── Contrôle individuel ───────────────────────────────────────────
        bus.subscribe('threejs:start', (id) => {
            this.getById(id)?.start()
        })

        bus.subscribe('threejs:stop', (id) => {
            this.getById(id)?.stop()
        })

        bus.subscribe('threejs:destroy', (id) => {
            this.destroy(id)
        })

        // ── Changement de type de scène à chaud ───────────────────────────
        // bus.publish('threejs:scene', { id: 'THREE_1', type: 'galaxy' })
        bus.subscribe('threejs:scene', ({ id, type }) => {
            const scene = this.getById(id)
            if (!scene) return
            scene.stop()
            scene.destroy()
            this.scenes.delete(id)

            // Recrée la scène avec le nouveau type
            const node = document.getElementById(id)
            if (!node) return
            node.dataset.scene = type
            const fresh = new ThreeScene(node)
            this.scenes.set(fresh.id, fresh)
            fresh.start()
            console.log(`ThreeManager: scène [${id}] recréée en mode "${type}"`)
        })

        // ── Actions globales ──────────────────────────────────────────────
        bus.subscribe('threejs:start:all', () => {
            this.scenes.forEach(s => s.start())
        })

        bus.subscribe('threejs:stop:all', () => {
            this.scenes.forEach(s => s.stop())
        })

        bus.subscribe('threejs:destroy:all', () => {
            this.scenes.forEach((s, id) => s.destroy())
            this.scenes.clear()
        })

        // ── Debug ──────────────────────────────────────────────────────────
        bus.subscribe('threejs:list', () => {
            console.log('ThreeManager — scènes actives :', [...this.scenes.keys()])
        })
    }
}

export const threeManager = new ThreeManager()
