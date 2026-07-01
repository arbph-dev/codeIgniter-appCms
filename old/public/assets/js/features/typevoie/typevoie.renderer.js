// js/features/typevoie/typevoie.renderer.js

import { bus }                                       from '../../core/eventBus.js'
import { create, table, clear, btn,
         detail, pagination, notice }                from '/assets/js/core/domhelper.js'

function buildButtons(selected) {
    const frag = document.createDocumentFragment()
    frag.append(
        btn({ label: 'Rechercher', icon: 'fa-search', busEvent: 'tv:mode', busArg: 'list' }),
        btn({ label: 'Nouveau',    icon: 'fa-plus',   variant: 'primary',  busEvent: 'tv:mode', busArg: 'form' }),
        btn({ label: 'Modifier',   icon: 'fa-pencil', busEvent: 'tv:mode', busArg: 'form',   disabled: !selected }),
        btn({ label: 'Supprimer',  icon: 'fa-trash',  variant: 'danger',
              onClick: () => selected && bus.publish('tv:delete', selected.id),
              disabled: !selected }),
    )
    return frag
}

function buildSearchForm() {
    const form = create('form', { id: 'tvSearchForm', class: 'cp_form', onsubmit: 'return validateForm(this)' })
    form.append(
        create('label', { for: 'tvIdInput', text: 'ID' }),
        create('input', { type: 'number', id: 'tvIdInput', name: 'tvid', min: '1', max: '255', placeholder: '50' }),
        create('label', { for: 'tvQInput', text: 'Libellé' }),
        create('input', { type: 'text',   id: 'tvQInput',  name: 'tvq',  placeholder: 'rue, avenue…' }),
    )
    const actions = create('div', { class: 'cp_form_actions' })
    actions.appendChild(btn({ label: 'Rechercher', icon: 'fa-search', variant: 'primary', attrs: { type: 'submit' } }))
    form.appendChild(actions)
    return form
}

function buildEditForm(selected) {
    const isCreate = !selected?.id
    const tv       = selected || { id: '', nom: '' }

    const form = create('form', { id: 'tvEditForm', class: 'cp_form', onsubmit: 'return validateForm(this)' })

    form.append(create('label', { for: 'tvEditId', text: 'ID *' }))
    if (isCreate) {
        form.appendChild(create('input', {
            type: 'number', id: 'tvEditId', name: 'tv_id',
            min: '1', max: '255', required: '', placeholder: '64',
        }))
    } else {
        form.appendChild(create('input', { type: 'hidden', name: 'tv_id', value: tv.id }))
        form.appendChild(create('span', { text: String(tv.id), style: 'padding:6px 10px;font-weight:bold;' }))
    }

    form.append(
        create('label', { for: 'tvEditNom', text: 'Libellé *' }),
        create('input', { type: 'text', id: 'tvEditNom', name: 'tv_nom',
                          value: tv.nom, maxlength: '30', required: '' }),
    )

    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Enregistrer', icon: 'fa-floppy-o', variant: 'primary', attrs: { type: 'submit' } }),
        btn({ label: 'Annuler',     icon: 'fa-times',    busEvent: 'tv:mode', busArg: 'list' }),
    )
    form.appendChild(actions)
    return form
}

function buildDetail(selected) {
    if (!selected) return document.createDocumentFragment()
    const frag = document.createDocumentFragment()
    frag.appendChild(detail([
        { label: 'ID',      value: selected.id  },
        { label: 'Libellé', value: selected.nom },
    ]))
    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Modifier',  icon: 'fa-pencil', variant: 'primary', busEvent: 'tv:mode', busArg: 'form' }),
        btn({ label: 'Supprimer', icon: 'fa-trash',  variant: 'danger',
              onClick: () => bus.publish('tv:delete', selected.id) }),
    )
    frag.appendChild(actions)
    return frag
}

export function initTvRenderer() {
    const container = document.getElementById('tvContainer')
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

        clear(panels.buttons)
        panels.buttons.appendChild(buildButtons(selected))

        panels.form.style.display   = (mode === 'list' || mode === 'form') ? '' : 'none'
        panels.detail.style.display = (mode === 'detail') ? '' : 'none'

        if (mode === 'list') { clear(panels.form);   panels.form.appendChild(buildSearchForm()) }
        if (mode === 'form') { clear(panels.form);   panels.form.appendChild(buildEditForm(selected)) }
        if (mode === 'detail') { clear(panels.detail); panels.detail.appendChild(buildDetail(selected)) }

        if (mode !== 'list') return

        clear(panels.table)
        clear(panels.pagination)

        if (!data?.length) { panels.table.appendChild(notice('empty')); return }

        panels.table.appendChild(table({
            id        : 'tvTable',
            data,
            columns   : [
                { key: 'id',  label: 'ID'      },
                { key: 'nom', label: 'Libellé' },
            ],
            attrs     : { class: 'cp_table' },
            onRowClick: (row) => bus.publish('tv:select', row),
        }))

        if (pager) {
            panels.pagination.appendChild(pagination({
                pager, busEvent: 'tv:page', style: 'compact', maxVisible: 7,
            }))
        }
    }

    bus.subscribe('tv:render',  applyMode)
    bus.subscribe('tv:loading', (l) => { if (!l) return; clear(panels.table); panels.table.appendChild(notice('loading')) })
    bus.subscribe('tv:loaded',  (store) => { store.mode = 'list'; applyMode(store) })
    bus.subscribe('tv:error',   (msg)   => { clear(panels.table); panels.table.appendChild(notice('error', msg)) })

    bus.publish('tv:render', { mode: 'list', selected: null, data: [], pagination: null })
}
