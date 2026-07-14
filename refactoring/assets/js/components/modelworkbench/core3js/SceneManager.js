/**
 
    '/assets/js/components/modelworkbench/core3js/SceneManager.js'

* --------------------------------------------------------------------
 * ModelWorkbench
 * Phase 0 - Commit 1
 *
 * SceneManager
 *
 * Responsable de l'initialisation de la scène Three.js.
 *
 * Responsabilités actuelles :
 *  - créer la scène
 *  - préparer les objets Three.js
 *
 * Les éléments suivants seront ajoutés progressivement :
 *  - caméra
 *  - renderer
 *  - éclairage
 *  - contrôles utilisateur
 *  - grille
 *  - repère XYZ
 *  - boucle de rendu
 *  - gestion du redimensionnement
 * --------------------------------------------------------------------
 */

export class SceneManager
{
    constructor()
    {
        this.scene = null;

        this.initialize();
    }

    /**
     * Initialise la scène Three.js.
     */
    initialize()
    {
        this.createScene();
    }

    /**
     * Création de la scène.
     */
    createScene()
    {
        this.scene = null;
    }
}
