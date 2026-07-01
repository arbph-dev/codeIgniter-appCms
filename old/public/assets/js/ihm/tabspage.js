// /assets/js/ihm/tabspage.js
import { bus } from '../core/eventBus.js'

/**
 * 2026-04-30
 * - window.openPage : correction double-publish, gestion interne/externe
 * - switchTab       : tolère elm null
 * - nav:goto        : switche l'onglet puis scroll smooth vers la section
 */


// ─── openPage ─────────────────────────────────────────────────────────────────

/**
 * Appelée depuis :
 *   - les <a onclick="openPage(...)"> statiques dans le HTML
 *   - buildGlobalNav() via titleLink.addEventListener (domhelper.js)
 *
 * @param {string}  pageName  id de l'article cible
 * @param {Element} elmnt     élément déclencheur (pour la classe .active)
 */
window.openPage = (pageName, elmnt) => {
    const url        = elmnt?.href || ''
    const isInternal = !url || url === 'javascript:void(0)'

    if (isInternal) {
        bus.publish('tabs:switch', { name: pageName, elm: elmnt })
    } else {
        window.location.assign(url)
    }
}


// ─── switchTab ────────────────────────────────────────────────────────────────

/**
 * Affiche l'article ciblé, masque les autres.
 * Met à jour .active sur le lien sidebar si elm est fourni.
 *
 * @param {{ name: string, elm: Element|null }} params
 */
function switchTab(params) {
    document.querySelectorAll('article').forEach(e => {
        e.style.display = (e.id === params.name) ? 'block' : 'none'
    })

    if (params.elm) {
        document.querySelectorAll('#sidebar .nav-title').forEach(e => {
            e.classList.toggle('active', e === params.elm)
        })
    }

    closeNav()
}


// ─── nav:goto ─────────────────────────────────────────────────────────────────

/**
 * Navigue vers une section : switche l'onglet si nécessaire, puis scroll.
 *
 * @param {{ articleId: string, targetId: string }} params
 */
function gotoSection({ articleId, targetId }) {
    const article = document.getElementById(articleId)

    if (article && ( article.style.display === 'none' || article.style.display === '') ) {
        // L'onglet est masqué : le switcher d'abord
        const titleLink = document.querySelector(
            `#sidebar .nav-article[data-article-id="${articleId}"] .nav-title`
        )
        switchTab({ name: articleId, elm: titleLink })
        // closeNav() est déjà appelé par switchTab
    } else {
        // L'onglet est déjà visible : fermer simplement la nav mobile
        closeNav()
    }

    // Scroll après que le display:block soit appliqué
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const target = document.getElementById(targetId)
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            } else {
                console.warn(`[tabspage] nav:goto — #${targetId} introuvable`)
            }
        })
    })
}


// ─── init ─────────────────────────────────────────────────────────────────────

export function initTabs() {
    console.log('[tabspage] init')
    bus.subscribe('tabs:switch', switchTab)
    bus.subscribe('nav:goto',    gotoSection)
}
