// assets/js/ui/workbench/image/ImagePreviewPanel.js
// ─────────────────────────────────────────────────────────────────────────────
// Zone de prévisualisation grande taille — zone right de ImageWorkbench.
//
// Responsabilité unique : afficher l'image sélectionnée.
// Ne contient aucune logique métier ni interaction.
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { create, clear } from '/assets/js/core/domhelper.js'
import { toolbar }       from '/assets/js/ui/shared/templates/toolbar.template.js'

export class ImagePreviewPanel extends PanelBase
{
    constructor()
    {
        super()
        this.element = null
        this.bodyEl  = null
    }

    render()
    {
        this.element = create('section', { class: 'wb_image_preview_panel' })

        const header = toolbar({ title: 'Prévisualisation' })

        this.bodyEl = create('div', { class: 'wb_panel_body wb_image_preview_body' })

        this.element.append(header, this.bodyEl)

        this.clear()
        return this.element
    }

    /**
     * Affiche l'image sélectionnée.
     * @param {object|null} image  — {path, alt, …}
     */
    show(image)
    {
        if (!this.bodyEl) return
        clear(this.bodyEl)

        if (!image?.path)
        {
            this._showEmpty()
            return
        }

        const img = create('img', {
            src   : image.path,
            alt   : image.alt ?? '',
            class : 'wb_image_preview_img',
        })

        // Méta sous l'image
        const meta = create('div', { class: 'wb_image_preview_meta' })

        if (image.filename)
        {
            meta.appendChild(create('div', {
                class : 'wb_image_preview_filename',
                text  : image.filename,
            }))
        }

        if (image.width && image.height)
        {
            meta.appendChild(create('div', {
                class : 'wb_image_preview_dims',
                text  : `${image.width} × ${image.height}`,
            }))
        }

        this.bodyEl.append(img, meta)
    }

    clear()
    {
        if (!this.bodyEl) return
        this._showEmpty()
    }

    destroy()
    {
        this.element = null
        this.bodyEl  = null
    }

    // ── Privées ───────────────────────────────────────────────────────────────

    _showEmpty()
    {
        clear(this.bodyEl)
        this.bodyEl.appendChild(
            create('p', {
                class : 'wb-empty',
                text  : 'Sélectionnez une image.',
            })
        )
    }
}

export default ImagePreviewPanel
