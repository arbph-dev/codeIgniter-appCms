// js/features/pcg/pcg.renderer.js

import { bus }      from '../../core/eventBus.js'
import { pcgStore } from './pcg.store.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getEl(id) { return document.getElementById(id) }

function classeBadge(classe) {
    return `<span class="pcg-classe pcg-classe--${classe}">Classe ${classe}</span>`
}

function breadcrumb(hierarchy) {
    if (!hierarchy?.length) return ''
    return hierarchy
        .map(h => `<span class="pcg-bc-item">${h.numpcg} · ${h.nom}</span>`)
        .join('<span class="pcg-bc-sep">›</span>')
}

// ── Templates ─────────────────────────────────────────────────────────────────

function tplResultRow(compte) {
    return `
        <tr class="pcg-row" data-numpcg="${compte.numpcg}">
            <td class="pcg-num">${compte.numpcg}</td>
            <td class="pcg-nom">${compte.nom}</td>
            <td>${classeBadge(compte.classe)}</td>
        </tr>
    `
}

function tplDetail(compte, children, hierarchy) {
    const childrenHtml = children?.length
        ? children.map(c => `
            <div class="pcg-child" data-numpcg="${c.numpcg}">
                <span class="pcg-num">${c.numpcg}</span>
                <span class="pcg-nom">${c.nom}</span>
            </div>`).join('')
        : '<p class="pcg-empty">Aucun sous-compte</p>'

    return `
        <div class="pcg-detail-header">
            <div class="pcg-detail-num">${compte.numpcg}</div>
            <div>
                <h3 class="pcg-detail-nom">${compte.nom}</h3>
                <div class="pcg-breadcrumb">${breadcrumb(hierarchy)}</div>
            </div>
            ${classeBadge(compte.classe)}
        </div>
        <div class="pcg-detail-section">
            <h4>Sous-comptes</h4>
            <div class="pcg-children">${childrenHtml}</div>
        </div>
    `
}

function tplEmpty(msg = 'Aucun résultat') {
    return `<tr><td colspan="3" class="pcg-empty">${msg}</td></tr>`
}

function tplLoading() {
    return `<tr><td colspan="3" class="pcg-loading">
        <i class="fa fa-spinner fa-spin"></i> Chargement…
    </td></tr>`
}

// ── Rendus ────────────────────────────────────────────────────────────────────

function renderResults(results) {
    const tbody = getEl('pcgResultsBody')
    if (!tbody) return

    if (!results?.length) {
        tbody.innerHTML = tplEmpty()
        return
    }

    tbody.innerHTML = results.map(tplResultRow).join('')

    // Clic sur une ligne → sélection
    tbody.querySelectorAll('.pcg-row').forEach(tr => {
        tr.addEventListener('click', () => {
            const numpcg = tr.dataset.numpcg
            bus.publish('pcg:select', { numpcg })
            tbody.querySelectorAll('.pcg-row').forEach(r => r.classList.remove('pcg-row--selected'))
            tr.classList.add('pcg-row--selected')
        })
    })
}

function renderDetail({ compte, children, hierarchy }) {
    const panel = getEl('pcgDetail')
    if (!panel) return
    panel.style.display = 'block'
    panel.innerHTML     = tplDetail(compte, children, hierarchy)

    // Clic sur un enfant → sélection
    panel.querySelectorAll('.pcg-child').forEach(el => {
        el.addEventListener('click', () => {
            bus.publish('pcg:select', { numpcg: el.dataset.numpcg })
        })
    })
}

function renderPager() {
    const pager  = pcgStore.pager
    const wrap   = getEl('pcgPager')
    if (!wrap || !pager) return

    const { currentPage, pageCount } = pager

    wrap.innerHTML = `
        <button class="pcg-btn" id="pcgPrev"
            ${currentPage <= 1 ? 'disabled' : ''}>‹ Préc</button>
        <span class="pcg-page">${currentPage} / ${pageCount}</span>
        <button class="pcg-btn" id="pcgNext"
            ${currentPage >= pageCount ? 'disabled' : ''}>Suiv ›</button>
    `

    getEl('pcgPrev')?.addEventListener('click', () => {
        bus.publish('pcg:search', { page: currentPage - 1 })
    })
    getEl('pcgNext')?.addEventListener('click', () => {
        bus.publish('pcg:search', { page: currentPage + 1 })
    })
}

// ── Init ─────────────────────────────────────────────────────────────────────

export function initPcgRenderer() {

    bus.subscribe('pcg:loading', (loading) => {
        const tbody = getEl('pcgResultsBody')
        if (tbody && loading) tbody.innerHTML = tplLoading()
    })

    bus.subscribe('pcg:results', (results) => {
        renderResults(results)
        renderPager()
    })

    bus.subscribe('pcg:selected', (payload) => {
        renderDetail(payload)
    })

    bus.subscribe('pcg:error', (msg) => {
        const tbody = getEl('pcgResultsBody')
        if (tbody) tbody.innerHTML = tplEmpty(`Erreur : ${msg}`)
    })

    // ── Formulaire de recherche ───────────────────────────────────────────────
    const form    = getEl('pcgSearchForm')
    const input   = getEl('pcgSearchInput')
    const selClasse = getEl('pcgClasseSelect')

    form?.addEventListener('submit', (e) => {
        e.preventDefault()
        bus.publish('pcg:search', {
            q:      input?.value.trim()         ?? '',
            classe: selClasse?.value            ?? null,
            page:   1,
        })
    })

    // Reset
    getEl('pcgResetBtn')?.addEventListener('click', () => {
        if (input)     input.value     = ''
        if (selClasse) selClasse.value = ''
        bus.publish('pcg:reset')
    })

    // ── CSS ───────────────────────────────────────────────────────────────────
    if (!document.getElementById('pcg-style')) {
        const style      = document.createElement('style')
        style.id         = 'pcg-style'
        style.textContent = `
            /* Table résultats */
            #pcgResults { width: 100%; border-collapse: collapse; font-size: .9rem; }
            #pcgResults th {
                background: var(--textcolor, darkblue);
                color: var(--bgcolor, lightblue);
                padding: 7px 12px; text-align: left;
            }
            #pcgResults td { padding: 7px 12px; border-bottom: 1px solid #e0e0e0; }
            .pcg-row { cursor: pointer; transition: background .15s; }
            .pcg-row:hover { background: #f0f4ff; }
            .pcg-row--selected { background: #ddeeff !important; }
            .pcg-num { font-weight: 600; font-family: monospace; white-space: nowrap; }
            .pcg-empty, .pcg-loading { text-align: center; padding: 20px; opacity: .5; }

            /* Badge classe */
            .pcg-classe {
                display: inline-block;
                padding: 1px 8px;
                border-radius: 4px;
                font-size: .78rem;
                background: #e8eaf6;
                color: #3949ab;
            }
            .pcg-classe--1 { background:#fce4ec; color:#c62828; }
            .pcg-classe--2 { background:#f3e5f5; color:#6a1b9a; }
            .pcg-classe--3 { background:#e8eaf6; color:#283593; }
            .pcg-classe--4 { background:#e3f2fd; color:#1565c0; }
            .pcg-classe--5 { background:#e0f2f1; color:#00695c; }
            .pcg-classe--6 { background:#fff3e0; color:#e65100; }
            .pcg-classe--7 { background:#f1f8e9; color:#33691e; }
            .pcg-classe--8 { background:#fafafa; color:#424242; }

            /* Pager */
            #pcgPager { display:flex; align-items:center; gap:10px; margin-top:10px; }
            .pcg-page { font-size:.85rem; opacity:.7; }
            .pcg-btn {
                padding: 4px 12px;
                border: 1px solid var(--textcolor, darkblue);
                border-radius: 5px;
                background: transparent;
                cursor: pointer;
                font-size: .85rem;
            }
            .pcg-btn:disabled { opacity: .35; cursor: not-allowed; }

            /* Détail */
            #pcgDetail {
                display: none;
                border: 2px solid var(--textcolor, darkblue);
                border-radius: 10px;
                padding: 16px;
                margin-top: 14px;
            }
            .pcg-detail-header {
                display: flex; align-items: flex-start;
                gap: 14px; margin-bottom: 14px; flex-wrap: wrap;
            }
            .pcg-detail-num {
                font-size: 1.8rem; font-weight: 700;
                font-family: monospace;
                color: var(--textcolor, darkblue);
                min-width: 60px;
            }
            .pcg-detail-nom { margin: 0 0 4px; font-size: 1.1rem; }
            .pcg-breadcrumb { font-size:.8rem; opacity:.6; }
            .pcg-bc-item + .pcg-bc-sep { margin: 0 4px; }
            .pcg-detail-section h4 { margin: 0 0 8px; opacity:.7; font-size:.85rem; }
            .pcg-children { display: flex; flex-direction: column; gap: 4px; }
            .pcg-child {
                display: flex; gap: 12px; align-items: center;
                padding: 6px 10px;
                border-radius: 6px;
                cursor: pointer;
                transition: background .15s;
            }
            .pcg-child:hover { background: #f0f4ff; }
        `
        document.head.appendChild(style)
    }
}
