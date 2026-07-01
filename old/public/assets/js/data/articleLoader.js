// ./js/data/articleLoader.js
import { bus } from '../core/eventBus.js'

// import { DOM } from '../core/domRefs.js'
// ligne 36 if ( DOM.DEBUG ){ console.warn('Chargement déjà en cours...') }
// ligne 58 if ( DOM.DEBUG ){ console.log('✅ Articles chargés:', this.articles.length) }

/**
Gestion du chargement des articles depuis JSON
// Instance unique => articleLoader utilsé dans main.js

* ArticleLoader::constructor()
* async ArticleLoader::loadArticles()
* ArticleLoader::getArticles()
* ArticleLoader::getArticleById(id)

Publie les données via eventBus
* bus.publish('data:articles:loading', true) / bus.publish('data:articles:loading', false)
* bus.publish('data:articles:loaded', this.articles)
* bus.publish('data:articles:error', error.message)

Écouter les demandes
* bus.subscribe('data:articles:list', () .... )
* bus.subscribe('data:articles:reload', ()
* 
 */

class ArticleLoader {
    
    constructor() {
        this.articles = null
        this.loading = false
        this.error = null
    }

    async loadArticles() {
        if (this.loading) { return }

        this.loading = true
        this.error = null
        
        // Publier état loading
        bus.publish('data:articles:loading', true)

        try {
            //const response = await fetch("http://localhost:8000/data/articles.json")
            //const response = await fetch("../../data/persons.json")
            //'/assets/img/3js/textures/shom11.png' assets/files/data/images.json
            const response = await fetch("/assets/files/data/images.json")

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`)
            }
        
            const json = await response.json()
            
            this.articles = Array.isArray(json) ? json : [json]
            
            // Publier succès avec données
            bus.publish('data:articles:loaded', this.articles)
            
            
            return this.articles

        } 
        catch (error) {
            this.error = error.message
            console.error(`❌ Impossible de charger les articles : ${error}`)
            // Publier erreur
            bus.publish('data:articles:error', error.message)
            return null
        } 
        finally {
            this.loading = false
            bus.publish('data:articles:loading', false)
        }
    }

    getArticles() {
        return this.articles
    }

    getArticleById(id) {
        if (!this.articles) return null
        return this.articles.find(a => a.id === id)
    }
}

// Instance unique
const articleLoader = new ArticleLoader()

/**
 * Initialisation des souscriptions
 * initArticleLoader
 */
export function initArticleLoader() {
    
    // Charger automatiquement au démarrage
    articleLoader.loadArticles()
    
    // Écouter les demandes de liste
    bus.subscribe('data:articles:list', () => {
        if (articleLoader.articles) {
            // Si déjà chargé, republier
            bus.publish('data:articles:loaded', articleLoader.articles)
        } else {
            // Sinon, charger
            articleLoader.loadArticles()
        }
    })
    
    // Écouter les demandes de rechargement
    bus.subscribe('data:articles:reload', () => {
        articleLoader.articles = null // Forcer rechargement
        articleLoader.loadArticles()
    })
}

export { articleLoader }
