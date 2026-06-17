// /assets/js/core/domhelper.js
import { bus } from './eventBus.js'

// import { create } from './domhelper.js'   // déjà exporté

// ─── Variables d'écran (exportées pour les autres modules) ────────────────────
export let sw = -1   // screen.width
export let sh = -1   // screen.height
export let aw = -1   // screen.availWidth
export let ah = -1   // screen.availHeight
export let cd = -1   // colorDepth
export let cr = -1   // pixelDepth
export let dpr = 1   // devicePixelRatio

export function getScreenProperties() {
    sw  = screen.width
    sh  = screen.height
    aw  = screen.availWidth
    ah  = screen.availHeight
    cd  = screen.colorDepth
    cr  = screen.pixelDepth
    dpr = window.devicePixelRatio || 1
}


/*---------- refrence du DOM ------------------------------------
refs
getRef('ARTICLE_LIST')
setRef('ARTICLE_LIST', document.getElementById('dataList_article') )


------------------------------------------------------------------*/


const refs = new Map()

export function setRef(key, el) { refs.set(key, el) }

export function getRef(key) { return refs.get(key) }


// initialisation des reference sglobales
export function initGlobalRefs() {
    // setRef('ARTICLE_LIST', document.getElementById('dataList_article') )
}

/*---------- sélecteurs du DOM ------------------------------------*/


export function qs(sel, root = document) { return root.querySelector(sel) }

export function qsa(sel, root = document) { return [...root.querySelectorAll(sel)] }

export function byId(id) { return document.getElementById(id) }





// ─── Icônes Font Awesome ──────────────────────────────────────────────────────

/**
 * Correspondance id d'article => icône FA.
 * Priorité : id exact > mot-clé dans id ou titre > défaut.
 */
const ICON_BY_ID = {
    'tab1'    : 'fa-home',
    'tab2'    : 'fa-newspaper-o',
    'contact' : 'fa-envelope',
    'about'   : 'fa-info-circle',
    'info'    : 'fa-desktop',
    'techno'  : 'fa-wrench',
    'news'    : 'fa-rss',
}

const ICON_BY_KEYWORD = [
    ['accueil', 'fa-home'],       ['home',    'fa-home'],
    ['chimie',  'fa-flask'],      ['eau',     'fa-tint'],
    ['vapeur',  'fa-fire'],       ['contact', 'fa-envelope'],
    ['about',   'fa-info-circle'],['info',    'fa-desktop'],
    ['techno',  'fa-wrench'],     ['news',    'fa-rss'],
    ['article', 'fa-file-text-o'],
]

export function getIconForArticle(articleId, title) {
    const id = (articleId || '').toLowerCase()
    if (ICON_BY_ID[id]) return ICON_BY_ID[id]
    const t = (title || '').toLowerCase()
    for (const [kw, icon] of ICON_BY_KEYWORD) {
        if (id.includes(kw) || t.includes(kw)) return icon
    }
    return 'fa-file-text-o'
}

/*---------- factories du DOM ------------------------------------

export function div(...)
export function button(...)
export function textarea(...)
export function table(...)

------------------------------------------------------------------*/

export function create(tag, attrs = {}, events = {}) {
    const el = document.createElement(tag)

    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'text') el.textContent = v
        else if (k === 'html') el.innerHTML = v
        else el.setAttribute(k, v)
    })

    Object.entries(events).forEach(([evt, fn]) => {
        el.addEventListener(evt, fn)
    })

    return el
}

/**
 * 
 * columns = null, // [{key:'id', label:'ID'}]  
 * 🔹 Colonnes auto si non fournies  
 * 
  */
export function table( { id = null,  data = [],  columns = null, attrs = {}, onRowClick = null,  onCellClick = null } = {}) {  
  
    const table = create("table", { id, ...attrs  } )  

    if (!data || data.length === 0) {  return table  }  

    if (!columns) {      // 🔹 Colonnes auto si non fournies  
        columns = Object.keys(data[0]).map(k => ({ key: k, label: k }))  
    }  
  
    // 🔹 THEAD  
    const thead = create("thead")  
    const trHead = create("tr")  
    
    // columns = [ {key:'id', label:'ID'} ]  
    columns.forEach(col => {  
        const th = create("th")  
        th.textContent = col.label  
        trHead.appendChild(th)  
    })  
  
    thead.appendChild(trHead)  
    table.appendChild(thead)  
  
    // 🔹 TBODY  
    const tbody = create("tbody")  
  
    data.forEach(row => {  
  
        const tr = create("tr")  
        //gestion callback
        if (onRowClick) {  
            tr.addEventListener("click", () => onRowClick(row))  
        }  
  
        columns.forEach(col => {  
            const td = create("td")  
            td.textContent = row[col.key]  
  
            if (onCellClick) {  
                td.addEventListener("click", (e) => {  
                    e.stopPropagation()  
                    onCellClick(row, col.key)  
                })  
            }  
  
            tr.appendChild(td)  
        })  
  
        tbody.appendChild(tr)  
    })  
  
    table.appendChild(tbody)  
  
    return table  
}



// ─── TOC intra-article ────────────────────────────────────────────────────────
// construit une menu d'article mais abandonné trop haut, a conserver 
export function createMenu3() {
    document.querySelectorAll('main article').forEach(article => {
        const container = document.getElementById(article.id + '_menu')
        if (container) {
            container.innerHTML = ''
            container.appendChild(buildTOC(article, article.id))
        }
    })
}


// ─── Nav globale sidebar ──────────────────────────────────────────────────────

/**
 * Structure injectée dans #sidebar pour chaque article :
 *
 *  <div class="nav-article" data-article-id="tab1">
 *    <div class="nav-header-row">
 *      <a class="nav-title">  <- switche l'onglet ET closeNav()
 *        <i class="fa ..."></i> Titre
 *      </a>
 *      <button class="nav-toggle">  <- accordeon seul, nav reste ouverte
 *    </div>
 *    <ul class="nav-toc">...</ul>
 *  </div>
 *
 * Mobile : accordion via .open sur .nav-article, clic titre = closeNav
 * PC     : dropdown au :hover CSS, accordion ignoré
 */
export function buildGlobalNav() {
    const nav      = document.getElementById('sidebar')
    const articles = document.querySelectorAll('main article')

    articles.forEach(article => {
        const articleId = article.id
        const title     = article.querySelector('h1')?.textContent?.trim() || articleId
        const icon      = getIconForArticle(articleId, title)

        const container = document.createElement('div')
        container.classList.add('nav-article')
        // Marquer actif si l'article est visible au chargement (style="display:block")
        //if (article.style.display === 'block') { container.classList.add('active') }        
        container.dataset.articleId = articleId


        // Ligne de header : [lien-titre] [chevron]
        const headerRow = document.createElement('div')
        headerRow.classList.add('nav-header-row')
        // Marquer actif si l'article est visible au chargement (style="display:block")
        //if (article.style.display === 'block') { headerRow.classList.add('active') }
        // Lien titre : switche l'onglet (closeNav viendra de switchTab)
        const titleLink = document.createElement('a')
        titleLink.href = 'javascript:void(0)'
        titleLink.classList.add('nav-title')
        // Marquer actif si l'article est visible au chargement (style="display:block")
        if (article.style.display === 'block') { titleLink.classList.add('active') }        
        titleLink.innerHTML = `<i class="fa fa-fw ${icon}"></i> ${title}`
        titleLink.addEventListener('click', () => {
            window.openPage(articleId, titleLink)
        })


        // Bouton chevron : accordion uniquement, ne ferme PAS la nav
        const toggle = document.createElement('button')
        toggle.classList.add('nav-toggle')
        toggle.setAttribute('aria-label', 'Développer')
        toggle.setAttribute('aria-expanded', 'false')
        toggle.textContent = '>'
        toggle.addEventListener('click', (e) => {
            e.stopPropagation()
            const isOpen = container.classList.toggle('open')
            toggle.setAttribute('aria-expanded', String(isOpen))
        })

        headerRow.appendChild(titleLink)
        headerRow.appendChild(toggle)

        // TOC avec la classe ciblée par le CSS
        const toc = buildTOC(article, articleId)
        toc.classList.add('nav-toc')

        container.appendChild(headerRow)
        container.appendChild(toc)
        nav.appendChild(container)
    })
}


// ─── Construction du TOC ─────────────────────────────────────────────────────

function generateId(text) {
    return text.toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
}

function buildTOC(article, articleId) {
    const headers = article.querySelectorAll('h2, h3, h4')
    const root    = document.createElement('ul')
    const stack   = [{ level: 1, element: root }]

    headers.forEach(h => {
        const level = parseInt(h.tagName.substring(1))
        if (!h.id) {
            h.id = articleId + '--' + generateId(h.textContent)
        }

        const li = document.createElement('li')
        const a  = document.createElement('a')
        a.textContent      = h.textContent
        a.href             = 'javascript:void(0)'
        a.dataset.targetId = h.id

        a.addEventListener('click', (e) => {
            e.preventDefault()
            bus.publish('nav:goto', { articleId, targetId: h.id })
        })

        li.appendChild(a)

        while (stack.length && stack[stack.length - 1].level >= level) {
            stack.pop()
        }
        stack[stack.length - 1].element.appendChild(li)

        const ul = document.createElement('ul')
        li.appendChild(ul)
        stack.push({ level, element: ul })
    })

    return root
}



/*---------- utilitaires DOM ------------------------------------*/

export function clear(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild)
    }
}

export function toggle(el, state) {
    el.style.display = state ? 'block' : 'none'
}
// ═══════════════════════════════════════════════════════════════════════════
// 20260524-001 :: ADDITIONS À /assets/js/core/domhelper.js


/*
  pagination()
  ─────────────────────────────────────────────────────────────────────────────
  Construit un bloc de pagination en DOM pur (zéro innerHTML).

  Options :
    pager        {object}   { currentPage, pageCount }   — requis
    busEvent     {string}   nom de l'event bus à publier   (défaut : 'page')
    style        {string}   'buttons' | 'prev-next' | 'compact'
    cssPage      {string}   classe CSS du bouton page     (défaut : 'cp_page_btn')
    cssWrap      {string}   classe CSS du conteneur       (défaut : 'cp_pagination')
    cssActive    {string}   classe CSS du bouton actif    (défaut : 'active')
    maxVisible   {number}   nb max de pages affichées en style 'buttons'
                             0 = toutes (défaut : 0)

  Retourne :
    HTMLElement  (div)   — à appender directement dans le panel

  Exemple :
    clear(panels.pagination)
    panels.pagination.appendChild(pagination({
        pager    : store.pagination,
        busEvent : 'mot:page',
        style    : 'buttons'
    }))
*/
export function pagination({
    pager,
    busEvent  = 'page',
    style     = 'buttons',
    cssPage   = 'cp_page_btn',
    cssWrap   = 'cp_pagination',
    cssActive = 'active',
    maxVisible = 0,
} = {}) {

    const wrap = create('div', { class: cssWrap })

    if (!pager) return wrap

    const { currentPage, pageCount } = pager
    if (!pageCount || pageCount <= 1) return wrap

    // ── Styles ────────────────────────────────────────────────────────────────

    if (style === 'prev-next') {
        // [ ‹ Préc ]  Page X / Y  [ Suiv › ]
        const prev = create('button', {
            type: 'button',
            class: cssPage,
            text: '‹ Préc',
            ...(currentPage <= 1 ? { disabled: '' } : {})
        })
        prev.addEventListener('click', () => bus.publish(busEvent, currentPage - 1))

        const info = create('span', {
            class: 'cp_pagination_info',
            text: `${currentPage} / ${pageCount}`
        })

        const next = create('button', {
            type: 'button',
            class: cssPage,
            text: 'Suiv ›',
            ...(currentPage >= pageCount ? { disabled: '' } : {})
        })
        next.addEventListener('click', () => bus.publish(busEvent, currentPage + 1))

        wrap.append(prev, info, next)
        return wrap
    }

    if (style === 'compact') {
        // [ ‹ ]  [3] [4] [5]  [ › ]  avec ellipsis
        const pages = buildPageRange(currentPage, pageCount, maxVisible || 5)

        const prevBtn = create('button', {
            type: 'button',
            class: cssPage,
            text: '‹',
            ...(currentPage <= 1 ? { disabled: '' } : {})
        })
        prevBtn.addEventListener('click', () => bus.publish(busEvent, currentPage - 1))
        wrap.appendChild(prevBtn)

        pages.forEach(p => {
            if (p === '…') {
                wrap.appendChild(create('span', { class: 'cp_pagination_ellipsis', text: '…' }))
                return
            }
            const btn = create('button', {
                type: 'button',
                class: p === currentPage ? `${cssPage} ${cssActive}` : cssPage,
                text: String(p)
            })
            btn.addEventListener('click', () => bus.publish(busEvent, p))
            wrap.appendChild(btn)
        })

        const nextBtn = create('button', {
            type: 'button',
            class: cssPage,
            text: '›',
            ...(currentPage >= pageCount ? { disabled: '' } : {})
        })
        nextBtn.addEventListener('click', () => bus.publish(busEvent, currentPage + 1))
        wrap.appendChild(nextBtn)

        return wrap
    }

    // style === 'buttons' (défaut) : tous les numéros
    const pages = maxVisible > 0
        ? buildPageRange(currentPage, pageCount, maxVisible)
        : Array.from({ length: pageCount }, (_, i) => i + 1)

    pages.forEach(p => {
        if (p === '…') {
            wrap.appendChild(create('span', { class: 'cp_pagination_ellipsis', text: '…' }))
            return
        }
        const btn = create('button', {
            type: 'button',
            class: p === currentPage ? `${cssPage} ${cssActive}` : cssPage,
            text: String(p)
        })
        btn.addEventListener('click', () => bus.publish(busEvent, p))
        wrap.appendChild(btn)
    })

    return wrap
}

/** Construit un tableau de numéros de pages avec ellipsis. */
function buildPageRange(current, total, window = 5) {
    if (total <= window + 2) return Array.from({ length: total }, (_, i) => i + 1)

    const half  = Math.floor(window / 2)
    let start   = Math.max(2, current - half)
    let end     = Math.min(total - 1, current + half)

    if (current - half < 2)        end   = Math.min(total - 1, window)
    if (current + half > total - 1) start = Math.max(2, total - window)

    const pages = [1]
    if (start > 2) pages.push('…')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < total - 1) pages.push('…')
    pages.push(total)

    return pages
}


/*
  btn()
  ─────────────────────────────────────────────────────────────────────────────
  Factory bouton rapide pour les panels de boutons.

  Options :
    label    {string}   Texte affiché
    icon     {string}   Classe FA  ex: 'fa-search'
    variant  {string}   '' | 'primary' | 'danger'
    disabled {boolean}
    onClick  {Function} handler click (priorité sur busEvent)
    busEvent {string}   event bus à publier
    busArg   {*}        argument du bus
    attrs    {object}   attributs HTML additionnels

  Exemple :
    panels.buttons.append(
        btn({ label: 'Nouveau',  icon: 'fa-plus',    variant: 'primary', busEvent: 'mot:mode', busArg: 'form' }),
        btn({ label: 'Modifier', icon: 'fa-pencil',  busEvent: 'mot:mode', busArg: 'form', disabled: !selected }),
        btn({ label: 'Suppr.',   icon: 'fa-trash',   variant: 'danger',  busEvent: 'mot:mode', busArg: 'delete', disabled: !selected }),
    )
*/
export function btn({
    label    = '',
    icon     = '',
    variant  = '',
    disabled = false,
    onClick  = null,
    busEvent = null,
    busArg   = null,
    attrs    = {},
} = {}) {

    const cssClass = ['cp_btn', variant ? `cp_btn--${variant}` : '']
        .filter(Boolean).join(' ')

    const el = create('button', { type: 'button', class: cssClass, ...attrs })
    if (disabled) el.setAttribute('disabled', '')

    if (icon) {
        el.appendChild(create('i', { class: `fa fa-fw ${icon}`, 'aria-hidden': 'true' }))
        el.appendChild(document.createTextNode(` ${label}`))
    } else {
        el.textContent = label
    }

    if (onClick) {
        el.addEventListener('click', onClick)
    } else if (busEvent) {
        el.addEventListener('click', () => bus.publish(busEvent, busArg))
    }

    return el
}


/*
  detail()
  ─────────────────────────────────────────────────────────────────────────────
  Construit une <dl class="cp_detail"> depuis un tableau de { label, value }.

  Exemple :
    panels.detail.appendChild(detail([
        { label: 'ID',  value: selected.mot_id  },
        { label: 'Mot', value: selected.mot_lbl },
    ]))
*/
export function detail(fields = []) {
    const dl = create('dl', { class: 'cp_detail' })

    fields.forEach(({ label, value }) => {
        const dt = create('dt', { text: label })
        const dd = create('dd', { text: value ?? '—' })
        dl.append(dt, dd)
    })

    return dl
}


/*
  notice()
  ─────────────────────────────────────────────────────────────────────────────
  Message inline simple (loading / erreur / vide).

  type : 'loading' | 'error' | 'empty'

  Exemple :
    clear(panels.table)
    panels.table.appendChild(notice('loading'))
    panels.table.appendChild(notice('error', 'HTTP 500'))
    panels.table.appendChild(notice('empty'))
*/
const NOTICE_CFG = {
    loading : { icon: '⏳', text: 'Chargement…',    css: 'cp_notice cp_notice--loading' },
    error   : { icon: '❌', text: 'Erreur.',         css: 'cp_notice cp_notice--error'   },
    empty   : { icon: '🔍', text: 'Aucun résultat.', css: 'cp_notice cp_notice--empty'   },
}

export function notice(type = 'empty', msg = '') {
    const cfg = NOTICE_CFG[type] || NOTICE_CFG.empty
    const el  = create('p', { class: cfg.css })
    el.textContent = msg ? `${cfg.icon} ${msg}` : `${cfg.icon} ${cfg.text}`
    return el
}



/*
  autocomplete()
  ─────────────────────────────────────────────────────────────────────────────
  Crée un <input> + <ul> de suggestions piloté par le bus.

  Options :
    id           {string}   id de l'input (= sourceId transmis au contrôleur)
    name         {string}   attribut name du champ
    placeholder  {string}
    busRequest   {string}   event bus à publier quand l'user tape
    busResponse  {string}   event bus à écouter pour recevoir les suggestions
    labelKey     {string}   clé du label dans les items     (défaut : 'label')
    valueKey     {string}   clé de la valeur dans les items (défaut : 'id')
    minLength    {number}   nb de chars min avant requête   (défaut : 2)
    debounce     {number}   délai ms                        (défaut : 250)
    onSelect     {Function} callback(item) quand l'user choisit
    attrs        {object}   attributs HTML additionnels sur l'input

  Retourne :
    { wrapper, input, hidden }   — le wrapper est à appender dans le DOM
    Le champ <hidden> porte la valeur (id) de l'item sélectionné.

  Exemple :
    const ac = autocomplete({
        id          : 'acMot',
        name        : 'mot_id',
        placeholder : 'Rechercher un mot…',
        busRequest  : 'mot:ui:like',
        busResponse : 'mot:ui:response',
        labelKey    : 'mot_lbl',
        valueKey    : 'mot_id',
        onSelect    : (item) => console.log('sélectionné', item)
    })
    someForm.appendChild(ac.wrapper)
*/
export function autocomplete({
    id          = 'ac_' + Math.random().toString(36).slice(2),
    name        = 'value',
    placeholder = 'Rechercher…',
    busRequest  = 'ui:like',
    busResponse = 'ui:response',
    labelKey    = 'label',
    valueKey    = 'id',
    minLength   = 2,
    debounce    = 250,
    onSelect    = null,
    attrs       = {},
} = {}) {

    const wrapper = create('div', { class: 'cp_ac_wrapper', style: 'position:relative' })
    const input   = create('input', {
        type        : 'text',
        id,
        autocomplete: 'off',
        placeholder,
        ...attrs
    })
    const hidden  = create('input', { type: 'hidden', name })
    const list    = create('ul', { class: 'cp_ac_list', role: 'listbox' })
    list.style.display = 'none'

    wrapper.append(input, hidden, list)

    // ── Debounce ──────────────────────────────────────────────────────────────
    let timer = null
    input.addEventListener('input', () => {
        const q = input.value.trim()
        hidden.value = ''                  // reset valeur sélectionnée
        list.innerHTML = ''
        list.style.display = 'none'

        if (q.length < minLength) return

        clearTimeout(timer)
        timer = setTimeout(() => {
            bus.publish(busRequest, { q, len: 10, sourceId: id })
        }, debounce)
    })

    // ── Réception suggestions ────────────────────────────────────────────────
    bus.subscribe(busResponse, ({ sourceId, items }) => {
        if (sourceId !== id) return          // pas pour cet input

        list.innerHTML = ''
        if (!items || !items.length) {
            list.style.display = 'none'
            return
        }

        items.forEach(item => {
            const li = create('li', {
                class : 'cp_ac_item',
                role  : 'option',
                text  : item[labelKey] ?? ''
            })
            li.addEventListener('mousedown', (e) => {
                e.preventDefault()           // évite blur avant click
                input.value  = item[labelKey]
                hidden.value = item[valueKey]
                list.style.display = 'none'
                if (onSelect) onSelect(item)
            })
            list.appendChild(li)
        })

        list.style.display = 'block'
    })

    // Fermer si clic ailleurs
    input.addEventListener('blur', () => {
        setTimeout(() => { list.style.display = 'none' }, 150)
    })
    input.addEventListener('focus', () => {
        if (list.children.length) list.style.display = 'block'
    })

    // Navigation clavier
    input.addEventListener('keydown', (e) => {
        const items = [...list.querySelectorAll('.cp_ac_item')]
        const active = list.querySelector('.cp_ac_item--focus')
        let idx = items.indexOf(active)

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (active) active.classList.remove('cp_ac_item--focus')
            idx = (idx + 1) % items.length
            items[idx]?.classList.add('cp_ac_item--focus')
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (active) active.classList.remove('cp_ac_item--focus')
            idx = (idx - 1 + items.length) % items.length
            items[idx]?.classList.add('cp_ac_item--focus')
        } else if (e.key === 'Enter') {
            if (active) {
                e.preventDefault()
                active.dispatchEvent(new MouseEvent('mousedown'))
            }
        } else if (e.key === 'Escape') {
            list.style.display = 'none'
        }
    })

    return { wrapper, input, hidden }
}



export function init() {
    getScreenProperties()
    console.log(`[domhelper] W:${sw} H:${sh} | aW:${aw} aH:${ah} | dpr:${dpr}`)
    //createMenu3() // fonctionne mais surcharge l'ihm a voir pour aside de la premiere section 
    // un composant pourrait etre créé depuis ce script
    // on a besoin d'un article structure avec un header contenant articleId + '_menu'
    buildGlobalNav()
}
