// js/features/codenaf/codenaf.renderer.js

import { bus } from '../../core/eventBus.js'
//import { DOM } from '../../core/domRefs.js'
import { table, clear } from '/assets/js/core/domhelper.js'

function renderPagination(pagination) {
    if (!pagination) return ''

    const { currentPage, pageCount } = pagination

    let html = ''
    for (let i = 1; i <= pageCount; i++) {
        html += `<button type="button"
            onclick="eventBusPublish(this,'naf:page',${i})"
            class="${i === currentPage ? 'active' : ''}">
            ${i}
        </button>`
    }

    return html
}

function renderTree(nodes) {
    if (!nodes || !nodes.length) return ''

    let html = '<ul>'

    for (const n of nodes) {
        html += `<li>
            <span onclick="eventBusPublish(this,'naf:children','${n.codenaf}')">
                ${n.nom}
            </span>`

        if (n.children?.length) {
            html += renderTree(n.children)
        }

        html += '</li>'
    }

    html += '</ul>'
    return html
}

/**
 * 20260506-001
 * 
 */
export function initNafRenderer() {

    const resultDiv = document.getElementById('nafResult')
    const treeDiv = document.getElementById('nafTree')
    const paginationDiv = document.getElementById('nafPagination')

    bus.subscribe('naf:loading', (loading) => {
        if (loading) resultDiv.textContent = '⏳ Chargement...'
    })

    bus.subscribe('naf:loaded', (store) => {

        const elTable = table({
            id: 'nafTable',
            data: store.data,
            columns: [
                { key: 'codenaf', label: 'Code' },
                { key: 'nom', label: 'Libellé' }
            ],
            onRowClick: (row) => {
                bus.publish('naf:select', row.codenaf)
            }
        })

        clear(resultDiv)
        resultDiv.appendChild(elTable)

        paginationDiv.innerHTML = renderPagination(store.pagination)
    })

    bus.subscribe('naf:tree:loaded', (tree) => {
        treeDiv.innerHTML = renderTree(tree)
    })

    bus.subscribe('naf:error', (msg) => {  
        resultDiv.textContent = `❌ ${msg}`  
    })      
}