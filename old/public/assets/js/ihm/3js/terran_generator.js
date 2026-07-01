/* ===================================================================================================== */
//import{ getMaterialFromTextures } from '../3js.js'
import * as UTIL from './util.js'
import * as THREE from 'three';

// js/ihm/3js/terran_generator
export class TerranGenerator {
    #W; #H; #U; #V; #G; #M; #O;
    arrMARKS;

    constructor(TW = 240, TH = 120, VW = 20, VH = 20) {
        this.#W = TW;
        this.#H = TH;
        this.#U = VW;
        this.#V = VH;
        this.#G = new THREE.PlaneGeometry(this.#W, this.#H, this.#U, this.#V);
        this.#M = UTIL.getMaterialFromTextures(1);
        this.arrMARKS = [];
    }

    fillPlanar(ZMAX = 0, ZMIN = 5) {
        let idxPG = 0;
        for (let iH = 0; iH <= this.#V; iH++) {
            for (let iW = 0; iW <= this.#U; iW++) {
                idxPG = (((this.#U + 1) * iH + iW) * 3) + 2;
                this.#G.attributes.position.array[idxPG] = UTIL.getRandomArbitrary(ZMIN, ZMAX);
            }
        }
    }

    addMarks(S) {
        const SB = 0.5;
        const SB2 = SB / 2;
        const DW = this.#W / this.#U;
        const DH = this.#H / this.#V;
        const TW2 = this.#W / 2;
        const TH2 = this.#H / 2;

        for (let iH = 0; iH <= this.#V; iH++) {
            for (let iW = 0; iW <= this.#U; iW++) {
                const material = new THREE.MeshStandardMaterial({ color: "red", metalness: 0.5, roughness: 1 });
                let geo = new THREE.BoxGeometry(SB, SB, SB);
                let BOX = new THREE.Mesh(geo, material);
                this.arrMARKS.push(BOX);
                S.add(BOX);
                BOX.position.x = (iW * DW) - TW2 + SB2;
                BOX.position.y = 0;
                BOX.position.z = (iH * DH) - TH2 + SB2;
            }
        }
    }

    setPlaneColor(C = 0xff0f0f) {
        this.#M.color.setHex(C);
    }

    getMesh() {
        this.#G.computeVertexNormals();
        this.#O = new THREE.Mesh(this.#G, this.#M);
        return this.#O;
    }

    getMaterial() { return this.#M; }

    setMaterial(M) { this.#M = M; }
}

/* ===================================================================================================== */

