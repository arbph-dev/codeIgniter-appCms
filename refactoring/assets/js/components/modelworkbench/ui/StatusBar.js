/**
 * /assets/js/components/modelworkbench/ui/StatusBar.js
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 6
 *
 * Barre de statut inférieure : stats globales du modèle chargé.
 * --------------------------------------------------------------------
 */

export class StatusBar
{
    constructor({ container })
    {
        this.container = container;
        this._render(null);
    }

    render(global)
    {
        this._render(global);
    }

    _render(g)
    {
        this.container.innerHTML = '';

        if (!g)
        {
            const msg = document.createElement('span');
            msg.textContent = 'Aucun modèle chargé';
            this.container.appendChild(msg);
            return;
        }

        const stats = [
            { label: 'Meshes',   val: g.meshCount                    },
            { label: 'Vertices', val: g.vertexCount.toLocaleString()  },
            { label: 'Faces',    val: g.faceCount.toLocaleString()    },
            { label: 'Diag.',    val: g.diagonal + ' u'               },
        ];

        stats.forEach(({ label, val }) =>
        {
            const el = document.createElement('span');
            el.className = 'wb-stat';
            el.innerHTML = `${label} <b class="wb-stat-val">${val}</b>`;
            this.container.appendChild(el);
        });

        const right = document.createElement('span');
        right.className   = 'wb-statusbar-right';
        right.textContent = 'ModelWorkbench';
        this.container.appendChild(right);
    }

    destroy()
    {
        this.container.innerHTML = '';
    }
}
