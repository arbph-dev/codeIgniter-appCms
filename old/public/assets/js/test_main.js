/* */
import { DOM } from './core/domRefs.js'

import { bus } from './core/eventBus.js'

import { initSidebar } from './ihm/sidebar.js'
import { initTabs } from './ihm/tabsPage.js'

import { initCodeVal } from './ihm/codeval.js'
import { initCallout } from './ihm/callout.js'

import { initCarousel } from './ihm/carousel.js'
/*
  gestion carousel, 3 fichiers 
  - le module js/ihm/carousel.js qui exploite un CarouselManager
  - js/ihm/carousel/CarouselManager.js
  - js/ihm/carousel/Carousel.js 
*/

import { initApex } from './plugins/apex.js'
import mermaid from './plugins/mermaid.js'

import { initLeaflet } from './plugins/mapleaflet.js'
import { initSvg } from './ihm/svg.js'
import { initThreejs } from './ihm/3js.js'

//2026-04-01
import { initDialog } from './ihm/dialog.js'
import { initForms } from './ihm/formsManager.js'

import { initArticleLoader } from './data/articleLoader.js'
import { initArticleRenderer } from './data/articleRenderer.js'

//2026-04-06
import { initMotForm } from './features/mot/mot.form.js'
import { initMotController } from './features/mot/mot.controller.js'
import { initMotRenderer } from './features/mot/mot.renderer.js'

function outTest() {
  console.log("tester:out - Sortie console")
}

export function initTester() {
  bus.subscribe('tester:out', outTest)
}

//------------------------------------------------------
// sidebar
window.openNav = () => { bus.publish('sidebar:open') }

window.closeNav = () => { bus.publish('sidebar:close') }

//------------------------------------------------------
// navigation page / onglets
// voir  
// - js/ihm/tabs/tabsPage.js
// - app\Views\layouts\nav.php
window.openPage = (pageName, elmnt) => {

  let urlA = elmnt.href
  let urlWH = window.location.href // Page location
  let urlWP = window.location.pathname // Page path
  console.log(`openPage :  ${pageName} element.href ${urlA} location.href ${urlWH} location.pathname ${urlWP} `)

  if (urlA === 'javascript:void(0)') {
    // on appelle le script pour changer l'onglet
    bus.publish('tabs:switch', { name: pageName, elm: elmnt })
    console.log(`Lien interne a la page`)
  } else {
    // on redirige la fenêtre
    console.log(`Lien externe a la page`)
    //window.Location.assign(elmnt.href)
  }

  //debugger

  bus.publish('tabs:switch', { name: pageName, elm: elmnt })
}

//--------------------------------------------
// carousel
//bus.publish('carousel:prev', '1')
window.ihmCarouselPrev = (id) => bus.publish('carousel:prev', id)
//bus.publish('carousel:next', '1')
window.ihmCarouselNext = (id) => bus.publish('carousel:next', id)

//--------------------------------------------
// Leaflet
window.testLeafelt = initLeaflet

//--------------------------------------------
// Threejs
window.threeList = () => { bus.publish('threejs:list') }
window.threeStart = (id) => { bus.publish('threejs:start', id) }
window.threeStop = (id) => { bus.publish('threejs:stop', id) }

//--------------------------------------------
// forms
window.validateForm = (evt) => {
  bus.publish('forms:submit', evt)
  return false
}

//----------------------------------------------
// XHR
window.cmdListArticle = () => bus.publish('data:articles:list')

//--------------------------------------------
// DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {

  console.log("System - DOM Content Loaded")

  DOM.init()

  initTester()
  initSidebar()
  initTabs()

  initCodeVal()
  initCallout()

  initApex()

  initCarousel()

  //2026-04-01
  initDialog()
  initForms()
})

// ---------------- window.load  ---------------------------------------
window.addEventListener('load', () => {

  console.log("System - Document loaded")

  // Authentification supprimée : on démarre directement l'application

  console.log("System - Running application")

  bus.publish('tester:out')

  // Longueur d'un carousel (debug) voir js/ihm/carousel/CarouselManager.js
  bus.publish('carousel:glen', '1')

  bus.publish('carousel:run', '1')
  // bus.publish('carousel:run', '2')
  //bus.publish('carousel:run:all')
  //bus.publish('carousel:stop', '2') // a tester avec bouton
  //bus.publish('carousel:colmin','1') // ??

  initSvg()
  //initLeaflet()
  initThreejs()

  //2026-04-06
  initArticleLoader()
  initArticleRenderer()

  //2026-04-06
  initMotForm()
  initMotController()
  initMotRenderer()
})
