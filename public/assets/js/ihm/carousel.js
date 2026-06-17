// js/ihm/carousel.js
import { bus } from '../core/eventBus.js'
import { carouselManager } from './carousel/CarouselManager.js'


//--------------------------------------------
// carousel
  //bus.publish('carousel:prev', '1')
window.ihmCarouselPrev = (id) => bus.publish('carousel:prev', id)
  //bus.publish('carousel:next', '1')
window.ihmCarouselNext = (id) => bus.publish('carousel:next', id)


export function initCarousel() {
    console.log('-- initCarousel --')
    carouselManager.init()

}


