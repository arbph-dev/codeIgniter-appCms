// js/features/mot/mot.renderer.js  — refactorisé DOM pur
//
// Utilise les factories de domhelper :
//   create(), table(), clear(), btn(), detail(), pagination(), notice()
//
// Plus de innerHTML sauf pour le formulaire (form est structurel, pas de données).
// La pagination passe par la factory pagination() de domhelper.

import { bus } from '../../core/eventBus.js'
import { create, table, clear, btn, detail, pagination, notice }  from '/assets/js/core/domhelper.js'

// ── ButtonPanel ──────────────────────────────────────────────────────────────
function buildButtons(mode, selected) {
    const frag = document.createDocumentFragment()

    frag.append(
        btn({ label: 'Rechercher', icon: 'fa-search', busEvent: 'mot:mode', busArg: 'list' }),
        btn({ label: 'Nouveau',    icon: 'fa-plus',   variant: 'primary', busEvent: 'mot:mode', busArg: 'form' }),
        btn({ label: 'Modifier',   icon: 'fa-pencil', busEvent: 'mot:mode', busArg: 'form',   disabled: !selected }),
        btn({ label: 'Supprimer',  icon: 'fa-trash',  variant: 'danger',  busEvent: 'mot:mode', busArg: 'delete', disabled: !selected }),
    )

    return frag
}

// ── SearchForm (mode list) — inline HTML car c'est de la structure, pas des données
function buildSearchForm() {
    const form = create('form', { id: 'motForm', onsubmit: 'return validateForm(this)' })

    const lblId = create('label', { for: 'idInput', text: 'ID (optionnel)' })
    const inId  = create('input', { type: 'number', id: 'idInput', name: 'motid', min: '1' })
    const lblQ  = create('label', { for: 'qInput', text: 'Mot (optionnel)' })
    const inQ   = create('input', { type: 'text', id: 'qInput', name: 'motq' })
    const submit = btn({ label: 'Rechercher', icon: 'fa-search', variant: 'primary', attrs: { type: 'submit' } })

    form.append(lblId, inId, lblQ, inQ, submit)
    return form
}

// ── EditForm (mode form — création / édition)
function buildEditForm(selected) {
    const mot  = selected || { mot_id: '', mot_lbl: '' }
    const form = create('form', { id: 'motEditForm', onsubmit: 'return validateForm(this)' })

    const hidden = create('input', { type: 'hidden', name: 'mot_id', value: mot.mot_id })
    const lbl    = create('label', { text: 'Mot' })
    const input  = create('input', { type: 'text', name: 'mot_lbl', value: mot.mot_lbl, required: '' })

    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Enregistrer', icon: 'fa-floppy-o', variant: 'primary', attrs: { type: 'submit' } }),
        btn({ label: 'Annuler',     icon: 'fa-times',    busEvent: 'mot:mode', busArg: 'list' })
    )

    form.append(hidden, lbl, input, actions)
    return form
}

// ── DetailPanel
function buildDetail(selected) {
    if (!selected) return document.createDocumentFragment()

    const dl = detail([
        { label: 'ID',  value: selected.mot_id  },
        { label: 'Mot', value: selected.mot_lbl },
    ])

    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Modifier',  icon: 'fa-pencil', variant: 'primary', busEvent: 'mot:mode',   busArg: 'form' }),
        btn({ label: 'Supprimer', icon: 'fa-trash',  variant: 'danger',
              onClick: () => bus.publish('mot:delete', selected.mot_id) })
    )

    const frag = document.createDocumentFragment()
    frag.append(dl, actions)
    return frag
}

// ── Init ─────────────────────────────────────────────────────────────────────
export function initMotRenderer() {

    // Résolution des panels — fonctionne avec id OU sans id (parent+class)
    function getPanel(container, cls) {
        return container?.querySelector(cls)
    }

    // On peut avoir plusieurs containers (name="imageContainer")
    // Pour mot : un seul container avec id
    const container = document.getElementById('motContainer')
    if (!container) return

    const panels = {
        buttons:    getPanel(container, '.cp_panel_buttons'),
        form:       getPanel(container, '.cp_panel_form'),
        detail:     getPanel(container, '.cp_panel_detail'),
        table:      getPanel(container, '.cp_panel_table'),
        pagination: getPanel(container, '.cp_panel_pagination'),
    }

    // ── applyMode ─────────────────────────────────────────────────────────────
    function applyMode(store) {
        const { mode, selected, data, pagination: pager } = store

        // ButtonPanel
        clear(panels.buttons)
        panels.buttons.appendChild(buildButtons(mode, selected))

        // Form / Detail visibilité
        panels.form.style.display   = (mode === 'list' || mode === 'form') ? '' : 'none'
        panels.detail.style.display = mode === 'detail' ? '' : 'none'

        // Form
        if (mode === 'list') {
            clear(panels.form)
            panels.form.appendChild(buildSearchForm())
        }
        if (mode === 'form') {
            clear(panels.form)
            panels.form.appendChild(buildEditForm(selected))
        }

        // Detail
        if (mode === 'detail') {
            clear(panels.detail)
            panels.detail.appendChild(buildDetail(selected))
        }

        // Table
        if (mode !== 'list') return

        clear(panels.table)
        clear(panels.pagination)

        if (!data || !data.length) {
            panels.table.appendChild(notice('empty'))
            return
        }

        panels.table.appendChild(table({
            id       : 'motTable',
            data,
            columns  : [
                { key: 'mot_id',  label: 'ID'  },
                { key: 'mot_lbl', label: 'Mot' }
            ],
            attrs    : { class: 'cp_table' },
            onRowClick: (row) => bus.publish('mot:select', row)
        }))

        if (pager) {
            panels.pagination.appendChild(pagination({
                pager,
                busEvent : 'mot:page',
                style    : 'compact',       // 'buttons' | 'prev-next' | 'compact'
                maxVisible: 5,
            }))
        }
    }

    // ── Abonnements ───────────────────────────────────────────────────────────
    bus.subscribe('mot:render', applyMode)

    bus.subscribe('mot:loading', (loading) => {
        if (!loading) return
        clear(panels.table)
        panels.table.appendChild(notice('loading'))
    })

    bus.subscribe('mot:loaded', (store) => {
        store.mode = 'list'
        applyMode(store)
    })

    bus.subscribe('mot:error', (msg) => {
        clear(panels.table)
        panels.table.appendChild(notice('error', msg))
    })

    bus.subscribe('forms:submit', (form) => {
        if (form.id !== 'motEditForm') return
        const fd = new FormData(form)
        bus.publish('mot:save', {
            id:  fd.get('mot_id')?.trim(),
            lbl: fd.get('mot_lbl')?.trim()
        })
    })

    // Rendu initial
    bus.publish('mot:render', { mode: 'list', selected: null, data: [], pagination: null })
}
