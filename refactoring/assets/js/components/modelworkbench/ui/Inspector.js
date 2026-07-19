/**
 * /assets/js/components/modelworkbench/ui/Inspector.js
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 6
 *
 * Panneau de droite.
 * showGlobal(report)  — stats globales après analyze()
 * showNode(node)      — détail d'un node sélectionné dans TreeView
 * --------------------------------------------------------------------
 */

export class Inspector
{
    constructor({ container })
    {
        this.container = container;

        this._title = document.createElement('div');
        this._title.className   = 'wb-panel-title';
        this._title.textContent = 'Inspector';

        this._body = document.createElement('div');
        this._body.className = 'wb-inspector-body';

        this.container.appendChild(this._title);
        this.container.appendChild(this._body);

        this._empty();
    }

    // ─── Stats globales ───────────────────────────────────────────────────────

    showGlobal(report)
    {
        this._title.textContent = 'Inspector — Global';
        this._body.innerHTML    = '';

        this._section('Géométrie', this._dl({
            'Meshes'   : report.global.meshCount,
            'Vertices' : report.global.vertexCount.toLocaleString(),
            'Faces'    : report.global.faceCount.toLocaleString(),
            'Diagonale': report.global.diagonal + ' u',
        }));

        this._section('Matériaux', this._tags(
            report.materials.map(m => m.name),
            'wb-tag'
        ));

        if (report.animations.length)
        {
            this._section('Animations', this._tags(
                report.animations.map(a => `${a.name} (${a.duration}s)`),
                'wb-tag wb-tag--anim'
            ));
        }
    }

    // ─── Node sélectionné ─────────────────────────────────────────────────────

    showNode(node)
    {
        this._title.textContent = 'Inspector — ' + (node.name || node.type);
        this._body.innerHTML    = '';

        // Infos communes
        this._section('Node', this._dl({
            'Nom'  : node.name  || '(sans nom)',
            'Type' : node.type,
            'UUID' : node.uuid.substring(0, 8) + '…',
        }));

        // Géométrie (Mesh uniquement)
        if (node.isMesh || node.isSkinnedMesh)
        {
            const geo   = node.geometry;
            const verts = geo.attributes.position?.count ?? 0;
            const faces = geo.index
                ? Math.round(geo.index.count / 3)
                : Math.round(verts / 3);

            this._section('Géométrie', this._dl({
                'Vertices' : verts.toLocaleString(),
                'Faces'    : faces.toLocaleString(),
            }));

            // Matériau(x)
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            const matData = {};

            mats.forEach((m, i) =>
            {
                if (!m) return;
                const prefix = mats.length > 1 ? `[${i}] ` : '';
                matData[prefix + 'Nom']   = m.name || '(sans nom)';
                matData[prefix + 'Type']  = m.type;
                matData[prefix + 'Color'] = m.color ? '#' + m.color.getHexString() : '—';
                matData[prefix + 'Map']   = m.map ? '✓' : '—';
            });

            this._section('Matériau', this._dl(matData));
        }

        // Position / rotation / scale
        const p = node.position;
        const s = node.scale;

        this._section('Transform', this._dl({
            'Position' : `${_r(p.x)}, ${_r(p.y)}, ${_r(p.z)}`,
            'Scale'    : `${_r(s.x)}, ${_r(s.y)}, ${_r(s.z)}`,
        }));
    }

    // ─── Helpers DOM ──────────────────────────────────────────────────────────

    _empty()
    {
        this._body.innerHTML = '';
        const msg = document.createElement('p');
        msg.className   = 'wb-empty';
        msg.textContent = 'Chargez un modèle\npuis sélectionnez un node.';
        this._body.appendChild(msg);
    }

    _section(title, content)
    {
        const sec = document.createElement('div');
        sec.className = 'wb-section';

        const h = document.createElement('div');
        h.className   = 'wb-section-title';
        h.textContent = title;

        sec.append(h, content);
        this._body.appendChild(sec);
    }

    _dl(obj)
    {
        const dl = document.createElement('dl');
        dl.className = 'wb-dl';

        Object.entries(obj).forEach(([key, val]) =>
        {
            const dt = document.createElement('dt');
            dt.textContent = key;
            const dd = document.createElement('dd');
            dd.textContent = val ?? '—';
            dl.append(dt, dd);
        });

        return dl;
    }

    _tags(labels, cls = 'wb-tag')
    {
        const wrap = document.createElement('div');
        labels.forEach((label) =>
        {
            const tag = document.createElement('span');
            tag.className   = cls;
            tag.textContent = label;
            wrap.appendChild(tag);
        });
        return wrap;
    }

    // ─── Cycle de vie ─────────────────────────────────────────────────────────

    destroy()
    {
        this.container.innerHTML = '';
    }
}

function _r(v) { return Math.round(v * 100) / 100; }
