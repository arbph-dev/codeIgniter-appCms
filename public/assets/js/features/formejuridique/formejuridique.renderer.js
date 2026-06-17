// js/features/formejuridique/formejuridique.renderer.js

import { bus }                                          from '../../core/eventBus.js'
import { create, table, clear, btn,
         detail, pagination, notice }                   from '/assets/js/core/domhelper.js'

// ── Boutons ───────────────────────────────────────────────────────────────────
function buildButtons(selected) {
    const frag = document.createDocumentFragment()
    frag.append(
        btn({ label: 'Rechercher', icon: 'fa-search',  busEvent: 'fj:mode', busArg: 'list'   }),
        btn({ label: 'Nouveau',    icon: 'fa-plus',    variant: 'primary', busEvent: 'fj:mode', busArg: 'form'   }),
        btn({ label: 'Modifier',   icon: 'fa-pencil',  busEvent: 'fj:mode', busArg: 'form',   disabled: !selected }),
        btn({ label: 'Supprimer',  icon: 'fa-trash',   variant: 'danger',
              onClick: () => selected && bus.publish('fj:delete', selected.id),
              disabled: !selected }),
    )
    return frag
}

// ── Formulaire de recherche ───────────────────────────────────────────────────
function buildSearchForm() {
    const form = create('form', { id: 'fjSearchForm', class: 'cp_form', onsubmit: 'return validateForm(this)' })

    form.append(
        create('label', { for: 'fjIdInput', text: 'Code (4 chiffres)' }),
        create('input', { type: 'text', id: 'fjIdInput', name: 'fjid',
                          placeholder: '5499', maxlength: '4', pattern: '\\d{0,4}' }),
        create('label', { for: 'fjQInput', text: 'Libellé' }),
        create('input', { type: 'text', id: 'fjQInput', name: 'fjq', placeholder: 'société…' }),
    )

    const actions = create('div', { class: 'cp_form_actions' })
    actions.appendChild(btn({ label: 'Rechercher', icon: 'fa-search', variant: 'primary', attrs: { type: 'submit' } }))
    form.appendChild(actions)
    return form
}

// ── Formulaire de création / édition ─────────────────────────────────────────
function buildEditForm(selected) {
    const isCreate = !selected?.id
    const fj       = selected || { id: '', description: '' }

    const form = create('form', { id: 'fjEditForm', class: 'cp_form', onsubmit: 'return validateForm(this)' })

    // Code — éditable uniquement à la création
    form.append(
        create('label', { for: 'fjEditId', text: 'Code INSEE (4 chiffres) *' }),
    )
    if (isCreate) {
        form.appendChild(create('input', {
            type: 'text', id: 'fjEditId', name: 'fj_id',
            placeholder: '9999', maxlength: '4', pattern: '\\d{4}', required: '',
        }))
    } else {
        // En édition : affiché en lecture seule + champ caché
        form.appendChild(create('input', { type: 'hidden', name: 'fj_id', value: fj.id }))
        form.appendChild(create('span',  { text: fj.id, style: 'padding:6px 10px;font-weight:bold;' }))
    }

    // Description
    form.append(
        create('label', { for: 'fjEditDesc', text: 'Libellé *' }),
        create('input', {
            type: 'text', id: 'fjEditDesc', name: 'fj_description',
            value: fj.description, maxlength: '200', required: '',
        }),
    )

    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Enregistrer', icon: 'fa-floppy-o', variant: 'primary', attrs: { type: 'submit' } }),
        btn({ label: 'Annuler',     icon: 'fa-times',    busEvent: 'fj:mode', busArg: 'list' }),
    )
    form.appendChild(actions)
    return form
}

// ── Détail ────────────────────────────────────────────────────────────────────
function buildDetail(selected) {
    if (!selected) return document.createDocumentFragment()

    const frag = document.createDocumentFragment()
    frag.appendChild(detail([
        { label: 'Code',    value: selected.id },
        { label: 'Libellé', value: selected.description },
    ]))

    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Modifier',  icon: 'fa-pencil', variant: 'primary', busEvent: 'fj:mode', busArg: 'form' }),
        btn({ label: 'Supprimer', icon: 'fa-trash',  variant: 'danger',
              onClick: () => bus.publish('fj:delete', selected.id) }),
    )
    frag.appendChild(actions)
    return frag
}

// ── Init ──────────────────────────────────────────────────────────────────────
export function initFjRenderer() {

    const container = document.getElementById('fjContainer')
    if (!container) return

    const panels = {
        buttons    : container.querySelector('.cp_panel_buttons'),
        form       : container.querySelector('.cp_panel_form'),
        detail     : container.querySelector('.cp_panel_detail'),
        table      : container.querySelector('.cp_panel_table'),
        pagination : container.querySelector('.cp_panel_pagination'),
    }

    function applyMode(store) {
        const { mode, selected, data, pagination: pager } = store

        // Boutons
        clear(panels.buttons)
        panels.buttons.appendChild(buildButtons(selected))

        // Visibilité panels
        panels.form.style.display   = (mode === 'list' || mode === 'form') ? '' : 'none'
        panels.detail.style.display = (mode === 'detail') ? '' : 'none'

        // Contenu form
        if (mode === 'list') { clear(panels.form); panels.form.appendChild(buildSearchForm()) }
        if (mode === 'form') { clear(panels.form); panels.form.appendChild(buildEditForm(selected)) }

        // Contenu detail
        if (mode === 'detail') { clear(panels.detail); panels.detail.appendChild(buildDetail(selected)) }

        // Table (mode list uniquement)
        if (mode !== 'list') return

        clear(panels.table)
        clear(panels.pagination)

        if (!data?.length) {
            panels.table.appendChild(notice('empty'))
            return
        }

        panels.table.appendChild(table({
            id        : 'fjTable',
            data,
            columns   : [
                { key: 'id',          label: 'Code'    },
                { key: 'description', label: 'Libellé' },
            ],
            attrs     : { class: 'cp_table' },
            onRowClick: (row) => bus.publish('fj:select', row),
        }))

        if (pager) {
            panels.pagination.appendChild(pagination({
                pager,
                busEvent   : 'fj:page',
                style      : 'compact',
                maxVisible : 7,
            }))
        }
    }

    // ── Abonnements ───────────────────────────────────────────────────────────
    bus.subscribe('fj:render',  applyMode)

    bus.subscribe('fj:loading', (loading) => {
        if (!loading) return
        clear(panels.table)
        panels.table.appendChild(notice('loading'))
    })

    bus.subscribe('fj:loaded', (store) => {
        store.mode = 'list'
        applyMode(store)
    })

    bus.subscribe('fj:error', (msg) => {
        clear(panels.table)
        panels.table.appendChild(notice('error', msg))
    })

    // Rendu initial
    bus.publish('fj:render', { mode: 'list', selected: null, data: [], pagination: null })
}
