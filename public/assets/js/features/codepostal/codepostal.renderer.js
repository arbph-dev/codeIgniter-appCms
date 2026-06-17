// js/features/codepostal/codepostal.renderer.js
// Lecture seule — pas de boutons Nouveau/Modifier/Supprimer

import { bus }                                    from '../../core/eventBus.js'
import { create, table, clear, btn,
         detail, pagination, notice }             from '/assets/js/core/domhelper.js'

// ── Formulaire de recherche ───────────────────────────────────────────────────
function buildSearchForm() {
    const form = create('form', {
        id       : 'cpSearchForm',
        class    : 'cp_form',
        onsubmit : 'return validateForm(this)',
    })

    form.append(
        create('label', { for: 'cpQInput',         text: 'Code postal ou commune' }),
        create('input', { type: 'text', id: 'cpQInput', name: 'cpq',
                          placeholder: '29000 ou Quimper…' }),

        create('label', { for: 'cpCodeInseeInput', text: 'Code INSEE (exact)' }),
        create('input', { type: 'text', id: 'cpCodeInseeInput', name: 'cpcodeinsee',
                          placeholder: '29232', maxlength: '5', pattern: '\\d{5}' }),
    )

    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Rechercher', icon: 'fa-search', variant: 'primary', attrs: { type: 'submit' } }),
        btn({ label: 'Retour',     icon: 'fa-list',   busEvent: 'cp:mode', busArg: 'list' }),
    )
    form.appendChild(actions)
    return form
}

// ── Détail d'une commune ──────────────────────────────────────────────────────
function buildDetail(selected) {
    if (!selected) return document.createDocumentFragment()

    const frag = document.createDocumentFragment()

    frag.appendChild(detail([
        { label: 'Code INSEE',     value: selected.codeinsee    },
        { label: 'Code postal',    value: selected.codepostal   },
        { label: 'Commune',        value: selected.commune      },
        { label: 'Acheminement',   value: selected.acheminement },
        { label: 'Ligne 5',        value: selected.ligne5 || '—' },
        { label: 'Latitude',       value: selected.latitude     },
        { label: 'Longitude',      value: selected.longitude    },
    ]))

    // Lien OpenStreetMap si coordonnées disponibles
    if (selected.latitude && selected.longitude) {
        const link = create('a', {
            href   : `https://www.openstreetmap.org/?mlat=${selected.latitude}&mlon=${selected.longitude}&zoom=13`,
            target : '_blank',
            text   : '📍 Voir sur OpenStreetMap',
            style  : 'display:inline-block;margin-top:8px;',
        })
        frag.appendChild(link)
    }

    const actions = create('div', { class: 'cp_form_actions' })
    actions.appendChild(
        btn({ label: '← Retour liste', icon: 'fa-list', busEvent: 'cp:mode', busArg: 'list' })
    )
    frag.appendChild(actions)
    return frag
}

// ── Init ──────────────────────────────────────────────────────────────────────
export function initCpRenderer() {
    const container = document.getElementById('cpContainer')
    if (!container) return

    const panels = {
        form       : container.querySelector('.cp_panel_form'),
        detail     : container.querySelector('.cp_panel_detail'),
        table      : container.querySelector('.cp_panel_table'),
        pagination : container.querySelector('.cp_panel_pagination'),
    }

    function applyMode(store) {
        const { mode, selected, data, pagination: pager } = store

        panels.form.style.display   = (mode === 'list') ? '' : 'none'
        panels.detail.style.display = (mode === 'detail') ? '' : 'none'

        if (mode === 'list') {
            clear(panels.form)
            panels.form.appendChild(buildSearchForm())
        }

        if (mode === 'detail') {
            clear(panels.detail)
            panels.detail.appendChild(buildDetail(selected))
            clear(panels.table)
            clear(panels.pagination)
            return
        }

        // ── Table ─────────────────────────────────────────────────────────────
        clear(panels.table)
        clear(panels.pagination)

        if (!data?.length) {
            panels.table.appendChild(notice('empty'))
            return
        }

        panels.table.appendChild(table({
            id        : 'cpTable',
            data,
            columns   : [
                { key: 'codepostal',   label: 'CP'        },
                { key: 'codeinsee',    label: 'INSEE'     },
                { key: 'commune',      label: 'Commune'   },
                { key: 'acheminement', label: 'Acheminement' },
            ],
            attrs     : { class: 'cp_table' },
            onRowClick: (row) => bus.publish('cp:select', row),
        }))

        if (pager) {
            panels.pagination.appendChild(pagination({
                pager,
                busEvent   : 'cp:page',
                style      : 'compact',
                maxVisible : 7,
            }))
        }
    }

    // ── Abonnements ───────────────────────────────────────────────────────────
    bus.subscribe('cp:render',  applyMode)
    bus.subscribe('cp:loading', (l) => {
        if (!l) return
        clear(panels.table)
        panels.table.appendChild(notice('loading'))
    })
    bus.subscribe('cp:loaded', (store) => { store.mode = 'list'; applyMode(store) })
    bus.subscribe('cp:error',  (msg)   => {
        clear(panels.table)
        panels.table.appendChild(notice('error', msg))
    })

    // Rendu initial — formulaire de recherche vide
    bus.publish('cp:render', { mode: 'list', selected: null, data: [], pagination: null })
}
