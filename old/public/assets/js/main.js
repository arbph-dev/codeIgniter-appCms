/*
import { DOM } from './core/domRefs.js'

*/
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




function outTest() {
  console.log("tester:out - Sortie console")
}


export function initTester() {
    bus.subscribe('tester:out', outTest)
}

//sidebar
window.openNav = () => { bus.publish('sidebar:open') }

window.closeNav = () => { bus.publish('sidebar:close') }

// tabs
window.openPage = (pageName, elmnt) =>  bus.publish('tabs:switch', { name : pageName , elm : elmnt } )

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
window.threeStart = (id ) => { bus.publish('threejs:start', id ) }
window.threeStop = (id ) => { bus.publish('threejs:stop', id )  }


//--------------------------------------------
document.addEventListener("DOMContentLoaded", function () {

  console.log("System - DOM Content Loaded")
  
  initTester()
  initSidebar()
  initTabs()

  initCodeVal()
  initCallout()

  initApex()

  initCarousel()
})


window.addEventListener('load', () => {
  console.log("System - Document loaded")  
  bus.publish('tester:out')

  bus.publish('carousel:glen', '1') // Longueur d'un carousel (debug) voir js/ihm/carousel/CarouselManager.js

	bus.publish('carousel:run', '1')
   bus.publish('carousel:run', '2')
	//bus.publish('carousel:run:all')
	//bus.publish('carousel:stop' , '2') // a tester avec bouton
	//bus.publish('carousel:colmin','1') // ??
  
  initSvg()
  //initLeaflet()
  initThreejs()

})