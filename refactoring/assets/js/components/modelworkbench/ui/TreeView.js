/**
 * /assets/js/components/modelworkbench/ui/TreeView.js
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 6
 *
 * Arbre interactif du graphe de scène.
 * Travaille directement sur THREE.Object3D pour conserver les refs.
 * Émet onSelect(node) au clic.
 * --------------------------------------------------------------------
 */

export class TreeView
{
    constructor({ container, onSelect })
    {
        this.container = container;
        this.onSelect  = onSelect ?? (() => {});

        this._selected = null;

        this._title = document.createElement('div');
        this._title.className   = 'wb-panel-title';
        this._title.textContent = 'Hiérarchie';

        this._body = document.createElement('div');
        this._body.className = 'wb-tree-body';

        this.container.appendChild(this._title);
        this.container.appendChild(this._body);
    }

    // ─── Rendu ────────────────────────────────────────────────────────────────

    render(obj)
    {
        this._body.innerHTML = '';
        this._selected = null;
        this._renderNode(obj, 0);
    }

    _renderNode(node, depth)
    {
        const isMesh = node.isMesh || node.isSkinnedMesh;
        const label  = node.name || `(${node.type})`;

        const el = document.createElement('div');
        el.className = 'wb-tree-node' + (isMesh ? ' wb-tree-node--mesh' : '');
        el.style.paddingLeft = (12 + depth * 14) + 'px';
        el.dataset.uuid = node.uuid;

        const icon = document.createElement('span');
        icon.className = 'wb-tree-icon' + (isMesh ? '' : ' wb-tree-icon--group');
        icon.textContent = isMesh ? '▪' : '▸';

        const name = document.createElement('span');
        name.textContent = label;
        name.style.overflow     = 'hidden';
        name.style.textOverflow = 'ellipsis';

        el.append(icon, name);

        el.addEventListener('click', (e) =>
        {
            e.stopPropagation();
            this._selectEl(el);
            this.onSelect(node);
        });

        this._body.appendChild(el);

        node.children.forEach(child => this._renderNode(child, depth + 1));
    }

    _selectEl(el)
    {
        if (this._selected) this._selected.classList.remove('wb-tree-node--selected');
        this._selected = el;
        el.classList.add('wb-tree-node--selected');
    }

    // ─── Cycle de vie ─────────────────────────────────────────────────────────

    destroy()
    {
        this.container.innerHTML = '';
    }
}
