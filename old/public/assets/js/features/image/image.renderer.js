// js/features/image/image.renderer.js
//
// Corrections apportées :
//   1. buildSearchForm  — select statut avec options pending/validated/rejected
//   2. buildEditForm    — création (upload fichier) ET édition (alt + statut)
//   3. applyMode        — visibilité panels form/detail, mode 'form' géré
//   4. abonnement image:loaded ajouté (manquant)
//   5. abonnement forms:submit pour imageEditForm (délégué depuis image.form.js)

import { bus } from '../../core/eventBus.js'

import {
    create,
    table,
    clear,
    btn,
    detail,
    pagination,
    notice,
} from '/assets/js/core/domhelper.js'

// ── Constantes ────────────────────────────────────────────────────────────────

const STATUTS = ['pending', 'validated', 'rejected']

// ─────────────────────────────────────────────────────────────
// BUTTONS
// ─────────────────────────────────────────────────────────────

function buildButtons(selected) {

    const frag = document.createDocumentFragment()

    frag.append(

        btn({
            label    : 'Rechercher',
            icon     : 'fa-search',
            busEvent : 'image:mode',
            busArg   : 'list',
        }),

        btn({
            label    : 'Nouvelle',
            icon     : 'fa-plus',
            variant  : 'primary',
            busEvent : 'image:mode',
            busArg   : 'form',
        }),

        btn({
            label    : 'Modifier',
            icon     : 'fa-pencil',
            busEvent : 'image:mode',
            busArg   : 'form',
            disabled : !selected,
        }),

        btn({
            label    : 'Supprimer',
            icon     : 'fa-trash',
            variant  : 'danger',
            busEvent : 'image:delete',
            busArg   : selected?.id,
            disabled : !selected,
        })
    )

    return frag
}

// ─────────────────────────────────────────────────────────────
// SEARCH FORM
// ─────────────────────────────────────────────────────────────

function buildSearchForm() {

    const form = create('form', {
        id       : 'imageSearchForm',
        class    : 'cp_form',
        onsubmit : 'return validateForm(this)',
    })

    // ── Champ texte ──
    form.append(
        create('label', { for: 'imageQInput', text: 'Recherche (nom / alt)' }),
        create('input', { type: 'text', id: 'imageQInput', name: 'imageq', placeholder: 'Mot-clé…' })
    )

    // ── Select statut ──
    const sel = create('select', { name: 'imagestatus', id: 'imageStatusSelect' })

    const optAll = create('option', { value: '', text: '— Tous statuts —' })
    sel.appendChild(optAll)

    STATUTS.forEach(s => {
        const opt = create('option', { value: s, text: s })
        sel.appendChild(opt)
    })

    form.append(
        create('label', { for: 'imageStatusSelect', text: 'Statut' }),
        sel
    )

    // ── Bouton ──
    const actions = create('div', { class: 'cp_form_actions' })
    actions.appendChild(
        btn({ label: 'Rechercher', icon: 'fa-search', variant: 'primary', attrs: { type: 'submit' } })
    )
    form.appendChild(actions)

    return form
}

// ─────────────────────────────────────────────────────────────
// EDIT FORM  (création = upload fichier / édition = alt + statut)
// ─────────────────────────────────────────────────────────────

function buildEditForm(selected) {

    const isCreate = !selected?.id
    const img      = selected || { id: '', alt: '', status: 'pending' }

    const form = create('form', {
        id       : 'imageEditForm',
        class    : 'cp_form',
        onsubmit : 'return validateForm(this)',
    })

    // id caché (vide à la création)
    form.appendChild(create('input', { type: 'hidden', name: 'id', value: img.id }))

    // ── Fichier (création uniquement) ──
    if (isCreate) {
        form.append(
            create('label', { for: 'imageFile', text: 'Fichier image *' }),
            create('input', {
                type     : 'file',
                id       : 'imageFile',
                name     : 'file',
                accept   : 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
                required : '',
            })
        )
    } else {
        // Rappel du fichier en lecture seule
        form.append(
            create('label', { text: 'Fichier' }),
            create('span',  { text: img.filename ?? '—' })
        )
    }

    // ── Alt ──
    form.append(
        create('label', { for: 'imageAlt', text: 'Texte alternatif (alt)' }),
        create('input', {
            type        : 'text',
            id          : 'imageAlt',
            name        : 'alt',
            value       : img.alt ?? '',
            placeholder : 'Description de l\'image…',
            maxlength   : '1000',
        })
    )

    // ── Statut ──
    const sel = create('select', { id: 'imageEditStatus', name: 'status' })
    STATUTS.forEach(s => {
        const opt = create('option', { value: s, text: s })
        if (s === img.status) opt.setAttribute('selected', '')
        sel.appendChild(opt)
    })
    form.append(create('label', { for: 'imageEditStatus', text: 'Statut' }), sel)

    // ── user_id caché (optionnel — 0 si absent) ──
    form.appendChild(create('input', { type: 'hidden', name: 'user_id', value: '0' }))

    // ── Actions ──
    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Enregistrer', icon: 'fa-floppy-o', variant: 'primary', attrs: { type: 'submit' } }),
        btn({ label: 'Annuler',     icon: 'fa-times',    busEvent: 'image:mode', busArg: 'list' })
    )
    form.appendChild(actions)

    return form
}

// ─────────────────────────────────────────────────────────────
// DETAIL
// ─────────────────────────────────────────────────────────────

function buildDetail(selected) {

    if (!selected) return document.createDocumentFragment()

    const frag = document.createDocumentFragment()

    // Miniature si disponible
    if (selected.path) {
        const img = create('img', {
            src   : selected.path,
            alt   : selected.alt ?? '',
            style : 'max-width:240px;max-height:180px;border-radius:4px;margin-bottom:8px;display:block;',
        })
        frag.appendChild(img)
    }

    frag.appendChild(detail([
        { label: 'ID',         value: selected.id },
        { label: 'Fichier',    value: selected.filename },
        { label: 'Alt',        value: selected.alt },
        { label: 'Statut',     value: selected.status },
        { label: 'Dimensions', value: `${selected.width} × ${selected.height} px` },
        { label: 'Taille',     value: selected.size_ko ? `${selected.size_ko} Ko` : '—' },
        { label: 'Extension',  value: selected.extension },
    ]))

    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({
            label    : 'Modifier',
            icon     : 'fa-pencil',
            variant  : 'primary',
            busEvent : 'image:mode',
            busArg   : 'form',
        }),
        btn({
            label   : 'Supprimer',
            icon    : 'fa-trash',
            variant : 'danger',
            onClick : () => bus.publish('image:delete', selected.id),
        })
    )
    frag.appendChild(actions)

    return frag
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

export function initImageRenderer() {

    const container = document.getElementById('imageContainer')
    if (!container) return

    const panels = {
        buttons    : container.querySelector('.cp_panel_buttons'),
        form       : container.querySelector('.cp_panel_form'),
        detail     : container.querySelector('.cp_panel_detail'),
        table      : container.querySelector('.cp_panel_table'),
        pagination : container.querySelector('.cp_panel_pagination'),
    }

    // ── applyMode ─────────────────────────────────────────────────────────────

    function applyMode(store) {

        const { mode, selected, data, pagination: pager } = store

        // ── Boutons ──
        clear(panels.buttons)
        panels.buttons.appendChild(buildButtons(selected))

        // ── Visibilité panels form / detail ──
        panels.form.style.display   = (mode === 'list' || mode === 'form') ? '' : 'none'
        panels.detail.style.display = (mode === 'detail') ? '' : 'none'

        // ── Contenu du panel form ──
        if (mode === 'list') {
            clear(panels.form)
            panels.form.appendChild(buildSearchForm())
        }

        if (mode === 'form') {
            clear(panels.form)
            panels.form.appendChild(buildEditForm(selected))
        }

        // ── Contenu du panel detail ──
        if (mode === 'detail') {
            clear(panels.detail)
            panels.detail.appendChild(buildDetail(selected))
        }

        // ── Table + pagination (mode list uniquement) ──
        if (mode !== 'list') return

        clear(panels.table)
        clear(panels.pagination)

        if (!data?.length) {
            panels.table.appendChild(notice('empty'))
            return
        }

        panels.table.appendChild(
            table({
                id         : 'imageTable',
                data,
                columns    : [
                    { key: 'id',        label: 'ID'      },
                    { key: 'filename',  label: 'Fichier' },
                    { key: 'alt',       label: 'Alt'     },
                    { key: 'status',    label: 'Statut'  },
                    { key: 'width',     label: 'W'       },
                    { key: 'height',    label: 'H'       },
                ],
                attrs      : { class: 'cp_table' },
                onRowClick : (row) => bus.publish('image:select', row),
            })
        )

        if (pager) {
            panels.pagination.appendChild(
                pagination({
                    pager,
                    busEvent   : 'image:page',
                    style      : 'compact',
                    maxVisible : 5,
                })
            )
        }
    }

    // ── Abonnements ───────────────────────────────────────────────────────────

    bus.subscribe('image:render', applyMode)

    bus.subscribe('image:loading', (loading) => {
        if (!loading) return
        clear(panels.table)
        panels.table.appendChild(notice('loading'))
    })

    // ← manquait dans la version initiale
    bus.subscribe('image:loaded', (store) => {
        store.mode = 'list'
        applyMode(store)
    })

    bus.subscribe('image:error', (msg) => {
        clear(panels.table)
        panels.table.appendChild(notice('error', msg))
    })

    // ── Rendu initial ─────────────────────────────────────────────────────────
    bus.publish('image:render', {
        mode       : 'list',
        selected   : null,
        data       : [],
        pagination : null,
    })
}
