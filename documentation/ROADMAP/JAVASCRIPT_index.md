## Récursivité
tag : récursive, récursivité, récursif

```js
// Fonction récursive avec indentation
function renderNode(label, depth = 0) {
    const page = pageMap[label];
    if (!page) return "";

    const indent = "  ".repeat(depth); // ou "  " pour 2 espaces
    let output = `${indent}- [[${page.file.name}]]\n`;

    const children = pages
        .where(p => (p.cmp_PARENT || []).includes(label))
        .sort(p => p.cmp_ID);

    for (const child of children) {
        output += renderNode(child.cmp_LBL, depth + 1);
    }

    return output;
}

// Racines (pas de parent)
const rootPages = pages
    .where(p => !p.cmp_PARENT || p.cmp_PARENT.length === 0)
    .sort(p => p.cmp_ID);

// Génération texte indenté
let treeText = "";
for (const root of rootPages) {
    treeText += renderNode(root.cmp_LBL);
}
```
---

## Dates


```js
new Intl.DateTimeFormat().format( arg.birthdate )


/**
 * Calcule l'âge d'une personne
 */
export function computeAge(person) {
    if (!person.birthdate) return null
    
    const today = new Date()
    const birthDate = new Date(person.birthdate)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    
    return age
}

/**
 * Calcule les jours jusqu'au prochain anniversaire
 */
export function daysUntilBirthday(person) {
    if (!person.birthdate) return null
    
    const today = new Date()
    const birthDate = new Date(person.birthdate)
    const nextBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
    )
    
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = nextBirthday - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
```

## PERSISTENCE
```js
//-----------------------------------------------------------------------------------------------------------
//
//                                              PERSISTENCE
//
function toLocal( itemName , itemValue ) {
	const itemJson = JSON.stringify( itemValue )
	localStorage.setItem( itemName , itemJson )
}

function fromLocal( itemName ) {
	const itemValue = localStorage.getItem(itemName)
	return JSON.parse(itemValue )
}


```


## UI

### Pagination
js\ihm\sections\SectionPicGallery.js

```js
// Ajouter après constructor
renderPaginationControls() {
    const info = this.collection.getPaginationInfo()
    const controls = document.createElement('div')
    controls.className = 'pagination-controls'
    controls.innerHTML = `
        <button data-action="prev" ${!this.collection.hasPrev() ? 'disabled' : ''}>◀ Précédent</button>
        <span>Page ${this.collection.currentPage}/${this.collection.lastPage} (${info})</span>
        <button data-action="next" ${!this.collection.hasNext() ? 'disabled' : ''}>Suivant ▶</button>
    `
    
    controls.querySelector('[data-action="prev"]').onclick = () => this.prevPage()
    controls.querySelector('[data-action="next"]').onclick = () => this.nextPage()
    
    return controls
}

// Dans loadPicsData après RefreshList
loadPicsData() {
    // ... existing code
    this.RefreshList()
    this.updatePaginationUI()
}

updatePaginationUI() {
    let existing = this.divContent.querySelector('.pagination-controls')
    if (existing) existing.remove()
    
    this.divContent.appendChild(this.renderPaginationControls())
}
```

#### Bloc de pagination
```js
    clear(panels.pagination)
    panels.pagination.appendChild(
		pagination( { pager  : store.pagination , busEvent : 'mot:page' , style  : 'buttons' } )
	)
```


```js
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
```






---

### Liste Treeview
G:\WEB\BACKUP\Hostinger\25-10-23\public\build\assets\pure_script.js
G:\WEB\BACKUP\Hostinger\25-10-23\resources\views\vaeexps\index.blade.php

```js
//affiche masque tous les elements
window.TreeCmp_toggleAll = () => {
    const btn = document.getElementById('TreeCmp_toggleAll');
    const expand = btn.dataset.state !== 'expanded';

    document.querySelectorAll('.TreeCmp_children').forEach(el => {
        el.classList.toggle('TreeCmp_hidden', !expand);
    });

    document.querySelectorAll('.TreeCmp_toggle').forEach(el => {
        el.textContent = expand ? '▼' : '▶';
    });

    btn.textContent = expand ? 'Tout replier' : 'Tout déplier';
    btn.dataset.state = expand ? 'expanded' : 'collapsed';
}
```


---

### Icones
```js
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
```

### Navigation

#### buildGlobalNav()
```js
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
```

#### generateId

```js
function generateId(text) {
    return text.toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
}
```

#### buildTOC()

Construction du TOC
```js
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
```


