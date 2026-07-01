// js/features/adresse/adresse.renderer.js
//
// Nouveauté vs modules plats :
//   • buildEditForm utilise autocomplete() pour voietype_id et codepostal_id
//   • onSelect du CP auto-remplit acheminement, infodistribution, lat/lng
//   • Enums JS (CHARNIERES, RPT, PRECISION) pour les selects

import { bus }                                           from '../../core/eventBus.js'
import { create, table, clear, btn,
         detail, pagination, notice, autocomplete }      from '/assets/js/core/domhelper.js'

// ── Constantes Enums JS ───────────────────────────────────────────────────────

const CHARNIERES = [
    { value: '',  label: '— aucune —' },
    { value: '0', label: 'de'     },
    { value: '1', label: "d'"     },
    { value: '2', label: 'du'     },
    { value: '3', label: 'de la'  },
    { value: '4', label: 'des'    },
    { value: '5', label: "de l'"  },
    { value: '6', label: 'de las' },
    { value: '7', label: 'de los' },
]

const RPT = [
    { value: '',  label: '— aucun —'  },
    { value: 'B', label: 'Bis'        },
    { value: 'T', label: 'Ter'        },
    { value: 'Q', label: 'Quater'     },
    { value: 'C', label: 'Quinquies'  },
]

const PRECISION = [
    { value: '',        label: '— non définie —' },
    { value: 'numero',  label: 'Au numéro'        },
    { value: 'voie',    label: 'À la voie'        },
    { value: 'commune', label: 'À la commune'     },
    { value: 'approx',  label: 'Approximatif'     },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSelect(name, options, selectedValue = '') {
    const sel = create('select', { name })
    options.forEach(({ value, label }) => {
        const opt = create('option', { value, text: label })
        if (String(value) === String(selectedValue)) opt.setAttribute('selected', '')
        sel.appendChild(opt)
    })
    return sel
}

function rptLabel(v) {
    return RPT.find(r => r.value === v)?.label ?? v ?? ''
}

function charniereLabel(v) {
    return CHARNIERES.find(c => c.value === String(v ?? ''))?.label ?? ''
}

function formatLigne4(row) {
    return [
        row.voienumero,
        rptLabel(row.voierpt),
        row.voietype_nom,
        charniereLabel(row.voiecharniere),
        row.voienom,
    ].filter(Boolean).join(' ')
}

// ── Boutons ───────────────────────────────────────────────────────────────────
function buildButtons(selected) {
    const frag = document.createDocumentFragment()
    frag.append(
        btn({ label: 'Rechercher', icon: 'fa-search', busEvent: 'adresse:mode', busArg: 'list' }),
        btn({ label: 'Nouvelle',   icon: 'fa-plus',   variant: 'primary',
              busEvent: 'adresse:mode', busArg: 'form' }),
        btn({ label: 'Modifier',   icon: 'fa-pencil',
              busEvent: 'adresse:mode', busArg: 'form', disabled: !selected }),
        btn({ label: 'Supprimer',  icon: 'fa-trash',  variant: 'danger',
              onClick: () => selected && bus.publish('adresse:delete', selected.id),
              disabled: !selected }),
    )
    return frag
}

// ── Formulaire de recherche ───────────────────────────────────────────────────
function buildSearchForm() {
    const form = create('form', { id: 'adresseSearchForm', class: 'cp_form',
                                  onsubmit: 'return validateForm(this)' })
    form.append(
        create('label', { for: 'adresseQInput', text: 'Voie, commune ou code postal' }),
        create('input', { type: 'text', id: 'adresseQInput', name: 'adresseq',
                          placeholder: 'Victor Hugo, 29200, Brest…' }),
    )
    const actions = create('div', { class: 'cp_form_actions' })
    actions.appendChild(btn({ label: 'Rechercher', icon: 'fa-search',
                               variant: 'primary', attrs: { type: 'submit' } }))
    form.appendChild(actions)
    return form
}

// ── Formulaire de création / édition ─────────────────────────────────────────
function buildEditForm(selected) {
    const isCreate = !selected?.id
    const a        = selected || {}

    const form = create('form', { id: 'adresseEditForm', class: 'cp_form',
                                  onsubmit: 'return validateForm(this)' })

    // id caché
    form.appendChild(create('input', { type: 'hidden', name: 'adresse_id', value: a.id ?? '' }))

    // ── Ligne 3 — Complément ─────────────────────────────────────────────────
    form.append(
        create('label', { text: 'Complément (BP, lieu-dit…)' }),
        create('input', { type: 'text', name: 'complement',
                          value: a.complement ?? '', maxlength: '60',
                          placeholder: 'BP 824, Résidence Les Pins…' }),
    )

    // ── Ligne 4 — Voie ───────────────────────────────────────────────────────
    form.append(create('label', { text: 'Numéro' }))
    form.appendChild(create('input', { type: 'text', name: 'voienumero',
                                        value: a.voienumero ?? '', maxlength: '10',
                                        placeholder: '125, 12-14…' }))

    form.append(create('label', { text: 'Indice répétition' }))
    form.appendChild(makeSelect('voierpt', RPT, a.voierpt ?? ''))

    // Autocomplete type de voie
    form.append(create('label', { text: 'Type de voie' }))
    const tvWrapper = create('div', {})
    const tvAc = autocomplete({
        id          : 'acAdresseTv',
        name        : 'voietype_id',
        placeholder : 'Rue, Avenue…',
        busRequest  : 'tv:ui:like',
        busResponse : 'tv:ui:response',
        labelKey    : 'nom',
        valueKey    : 'id',
    })
    // Pré-remplir si édition
    if (a.voietype_nom) tvAc.input.value = a.voietype_nom
    if (a.voietype_id)  tvAc.hidden.value = a.voietype_id
    tvWrapper.appendChild(tvAc.wrapper)
    form.appendChild(tvWrapper)

    form.append(create('label', { text: 'Charnière' }))
    form.appendChild(makeSelect('voiecharniere', CHARNIERES, a.voiecharniere ?? ''))

    form.append(
        create('label', { text: 'Nom de voie *' }),
        create('input', { type: 'text', name: 'voienom',
                          value: a.voienom ?? '', maxlength: '60', required: '',
                          placeholder: 'Victor Hugo, Lilas…' }),
    )

    // ── Ligne 5 — Distribution ───────────────────────────────────────────────
    form.append(
        create('label', { text: 'Info distribution (Bât., étage…)' }),
        create('input', { type: 'text', name: 'infodistribution',
                          value: a.infodistribution ?? '', maxlength: '60',
                          placeholder: 'Bâtiment A — Étage 3' }),
    )

    // ── Ligne 6 — Code postal avec autocomplete ───────────────────────────────
    form.append(create('label', { text: 'Code postal / Commune *' }))

    // Champs cachés auto-remplis quand un CP est sélectionné
    const hiddenAcheminement    = create('input', { type: 'hidden', name: 'acheminement',
                                                     value: a.acheminement ?? '' })
    const hiddenLat             = create('input', { type: 'hidden', name: 'latitude',
                                                     value: a.latitude ?? '' })
    const hiddenLng             = create('input', { type: 'hidden', name: 'longitude',
                                                     value: a.longitude ?? '' })
    const inputAcheminement     = create('input', { type: 'text', name: '_acheminement_display',
                                                     value: a.acheminement ?? '',
                                                     placeholder: 'Acheminement (auto)',
                                                     readonly: '' })

    const cpAc = autocomplete({
        id          : 'acAdresseCp',
        name        : 'codepostal_id',
        placeholder : '29000 ou Quimper…',
        busRequest  : 'cp:ui:like',
        busResponse : 'cp:ui:response',
        labelKey    : '_label',
        valueKey    : 'id',
        onSelect    : (item) => {
            // Auto-remplissage depuis le CP sélectionné
            hiddenAcheminement.value  = item.acheminement || item.commune || ''
            hiddenLat.value           = item.latitude  ?? ''
            hiddenLng.value           = item.longitude ?? ''
            inputAcheminement.value   = item.acheminement || item.commune || ''

            // Infodistribution depuis ligne5 si champ vide
            const infoDist = form.querySelector('[name="infodistribution"]')
            if (infoDist && !infoDist.value && item.ligne5) {
                infoDist.value = item.ligne5
            }

            // Précision par défaut : commune
            const selPrec = form.querySelector('[name="precision"]')
            if (selPrec && !selPrec.value) selPrec.value = 'commune'
        },
    })

    // Pré-remplir si édition
    if (a.cp_codepostal && a.cp_commune)
        cpAc.input.value  = `${a.cp_codepostal} — ${a.cp_commune}`
    if (a.codepostal_id)
        cpAc.hidden.value = a.codepostal_id

    const cpWrapper = create('div', {})
    cpWrapper.appendChild(cpAc.wrapper)
    form.appendChild(cpWrapper)

    form.append(
        create('label', { text: 'Acheminement (auto)' }),
        inputAcheminement,
        hiddenAcheminement, hiddenLat, hiddenLng,
    )

    // ── Précision GPS ─────────────────────────────────────────────────────────
    form.append(create('label', { text: 'Précision GPS' }))
    form.appendChild(makeSelect('precision', PRECISION, a.precision ?? ''))

    // ── Actions ───────────────────────────────────────────────────────────────
    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Enregistrer', icon: 'fa-floppy-o', variant: 'primary',
              attrs: { type: 'submit' } }),
        btn({ label: 'Annuler', icon: 'fa-times',
              busEvent: 'adresse:mode', busArg: 'list' }),
    )
    form.appendChild(actions)
    return form
}

// ── Détail ────────────────────────────────────────────────────────────────────
function buildDetail(a) {
    if (!a) return document.createDocumentFragment()

    const frag = document.createDocumentFragment()

    frag.appendChild(detail([
        { label: 'ID',               value: a.id                                },
        { label: 'Complément',       value: a.complement      || '—'            },
        { label: 'Ligne 4',          value: formatLigne4(a)                     },
        { label: 'Info distribution',value: a.infodistribution || '—'           },
        { label: 'Code postal',      value: `${a.cp_codepostal} ${a.acheminement ?? a.cp_commune ?? ''}` },
        { label: 'Commune',          value: a.cp_commune      || '—'            },
        { label: 'Précision GPS',    value: a.precision       || '—'            },
        { label: 'Latitude',         value: a.latitude        || '—'            },
        { label: 'Longitude',        value: a.longitude       || '—'            },
    ]))

    if (a.latitude && a.longitude) {
        const link = create('a', {
            href   : `https://www.openstreetmap.org/?mlat=${a.latitude}&mlon=${a.longitude}&zoom=15`,
            target : '_blank',
            text   : '📍 Voir sur OpenStreetMap',
            style  : 'display:inline-block;margin:8px 0;',
        })
        frag.appendChild(link)
    }

    const actions = create('div', { class: 'cp_form_actions' })
    actions.append(
        btn({ label: 'Modifier',  icon: 'fa-pencil', variant: 'primary',
              busEvent: 'adresse:mode', busArg: 'form' }),
        btn({ label: 'Supprimer', icon: 'fa-trash',  variant: 'danger',
              onClick: () => bus.publish('adresse:delete', a.id) }),
        btn({ label: '← Liste',   icon: 'fa-list',
              busEvent: 'adresse:mode', busArg: 'list' }),
    )
    frag.appendChild(actions)
    return frag
}

// ── Init ──────────────────────────────────────────────────────────────────────
export function initAdresseRenderer() {

    const container = document.getElementById('adresseContainer')
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
            id        : 'adresseTable',
            data,
            columns   : [
                { key: 'id',           label: 'ID'       },
                { key: 'ligne4',       label: 'Voie'     },
                { key: 'cp_codepostal',label: 'CP'       },
                { key: 'cp_commune',   label: 'Commune'  },
                { key: 'precision',    label: 'Précision'},
            ],
            attrs     : { class: 'cp_table' },
            onRowClick: (row) => bus.publish('adresse:select', row),
        }))

        if (pager) {
            panels.pagination.appendChild(pagination({
                pager, busEvent: 'adresse:page', style: 'compact', maxVisible: 7,
            }))
        }
    }

    bus.subscribe('adresse:render',  applyMode)
    bus.subscribe('adresse:loading', (l) => {
        if (!l) return
        clear(panels.table)
        panels.table.appendChild(notice('loading'))
    })
    bus.subscribe('adresse:loaded', (store) => { store.mode = 'list'; applyMode(store) })
    bus.subscribe('adresse:error',  (msg)   => {
        clear(panels.table)
        panels.table.appendChild(notice('error', msg))
    })

    bus.publish('adresse:render', {
        mode: 'list', selected: null, data: [], pagination: null,
    })
}
