/**
 * /assets/js/components/modelworkbench/ui/Toolbar.js
 */

export class Toolbar
{
    constructor({ container, sceneManager, onClearScene })
    {
        this.container     = container;
        this.sceneManager  = sceneManager;
        this.onClearScene  = onClearScene;   // ← Nouveau callback

        this._state = {
            grid      : true,
            axes      : true,
            wireframe : false,
        };

        this._render();
    }

    _render()
    {
        this.container.innerHTML = '';

        const title = document.createElement('span');
        title.className   = 'wb-toolbar-title';
        title.textContent = 'ModelWorkbench';
        this.container.appendChild(title);

        this._addSep();

        // Groupe Vue
        this._addToggle('Grille',    'grid',      () => this._toggleGrid());
        this._addToggle('Axes',      'axes',      () => this._toggleAxes());
        this._addToggle('Wireframe', 'wireframe', () => this._toggleWireframe());

        this._addSep();

        this._addBtn('Reset caméra', () => this._resetCamera());

        // Nouveau bouton Vider
        this._addSep();
        this._addBtn('🗑 Vider scène', () => {
            if (confirm('Vider complètement la scène ?')) {
                this.onClearScene?.();
            }
        }, 'wb-btn--danger');   // classe optionnelle pour le style
    }

    _addToggle(label, key, handler)
    {
        const btn = document.createElement('button');
        btn.className   = 'wb-btn' + (this._state[key] ? ' wb-btn--active' : '');
        btn.textContent = label;
        btn.dataset.key = key;
        btn.addEventListener('click', () => {
            this._state[key] = !this._state[key];
            btn.classList.toggle('wb-btn--active', this._state[key]);
            handler();
        });
        this.container.appendChild(btn);
    }

    _addBtn(label, handler, extraClass = '')
    {
        const btn = document.createElement('button');
        btn.className   = `wb-btn ${extraClass}`.trim();
        btn.textContent = label;
        btn.addEventListener('click', handler);
        this.container.appendChild(btn);
    }

    _addSep()
    {
        const sep = document.createElement('span');
        sep.className = 'wb-toolbar-sep';
        this.container.appendChild(sep);
    }

    // === Actions existantes (inchangées) ===
    _toggleGrid()     { this.sceneManager.gridManager?.setVisible(this._state.grid); }
    _toggleAxes()     { this.sceneManager.axisManager?.setVisible(this._state.axes); }

    _toggleWireframe()
    {
        this.sceneManager.scene.traverse((node) => {
            if (!node.isMesh) return;
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach(m => { if (m) m.wireframe = this._state.wireframe; });
        });
    }

    _resetCamera()
    {
        const cam = this.sceneManager.camera;
        cam.position.set(0, 2, 5);
        cam.lookAt(0, 0, 0);
        this.sceneManager.controls?.reset();
    }

    destroy()
    {
        this.container.innerHTML = '';
    }
}
