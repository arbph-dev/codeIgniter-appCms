// js/data/articleRenderer.js
import { DOM } from '../core/domRefs.js'

import { bus } from '../core/eventBus.js'

/**
 * articleRenderer.js
 * Rendu dynamique des articles dans le DOM
 */

class ArticleRenderer {
    
    constructor(containerId = 'dataList_article', debug = false) {
        
        //this.container = document.getElementById(containerId) //containerId a gérer avec DOM
        //this.container = DOM.ARTICLE_LIST
        /* deja realise par DOM (domRefs)
        if (!this.container) {
            console.warn(`⚠️ Container #${containerId} introuvable`)
        }
        */

    }

    /**
     * Rendu principal : liste d'articles
     */
    renderArticles(articles) {
        // renud inutile depuis test dom ?
        // if (!this.container) return
        if (!DOM.ARTICLE_LIST) return
        
        if ( DOM.DEBUG ){ console.log('🎨 Rendu de', articles.length, 'article(s)') }
        
        //this.container.innerHTML = '' // Clear
        DOM.ARTICLE_LIST.innerHTML = '' // Clear
        
        articles.forEach((article, index) => {

            if ( DOM.DEBUG ){  console.log(article) }
            let tmpPIC = DOM.domCreat_Img( article.path, "tempory descritpion", {width:200} , 
                { 
                    click: (evt) => { console.log(`image click : ${index}`) },
                    dblclick: (evt) => { console.log(`image dblclick : ${index} path : ${article.path}`) }
                }
            )
            DOM.ARTICLE_LIST.appendChild(tmpPIC)
        })

/*        let table = DOM.domCreat_Table(
            "myTable",
            [ { id: 1, nom: "Alice", sexe : "f" }, { id: 2, nom: "Bob" ,  sexe : "h" } ] ,
            ["id", "nom" ,"sexe"]
        );
*/
        let table = DOM.domCreat_Table(
        {  
            id: 'myTable',  
            data: [ { id: 1, nom: "Alice", sexe : "f" }, { id: 2, nom: "Bob" ,  sexe : "h" } ],  
            columns: [ {key:'id', label:'ID'} , {key:'nom', label:'NOM'}, {key:'sexe', label:'SEXE'} ],  
            attrs: { class: 'cp_table' },  
    
            onRowClick: (row) => {  
                console.log('click row', row)  
            },  
    
            //onCellClick: (row, key) => { console.log('cell', key, row[key]) }  
            onCellClick: null  
        })  

        DOM.ARTICLE_LIST.appendChild(table)

    }



    /**
     * Affichage loading
     */
    showLoading() {
        if (!DOM.ARTICLE_LIST) return
        DOM.ARTICLE_LIST.innerHTML = `
            <div class="loading-state">
                <p>⏳ Chargement des articles...</p>
            </div>
        `
    }

    /**
     * Affichage erreur
     */
    showError(message) {
        if (!DOM.ARTICLE_LIST) return
        DOM.ARTICLE_LIST.innerHTML = `
            <div class="error-state">
                <p>❌ Erreur : ${message}</p>
                <button onclick="cmdListArticle()">Réessayer</button>
            </div>
        `
    }

    /**
     * Message vide
     */
    showEmpty() {
        if (!DOM.ARTICLE_LIST) return
        DOM.ARTICLE_LIST.innerHTML = `
            <div class="empty-state">
                <p>📭 Aucun article disponible</p>
            </div>
        `
    }
}

// Instance unique
const articleRenderer = new ArticleRenderer()

/**
 * Initialisation des souscriptions
 */
export function initArticleRenderer() {
    
    bus.subscribe('data:articles:loading', (isLoading) => {
        if (isLoading) {
            articleRenderer.showLoading()
        }
    })
    
    bus.subscribe('data:articles:loaded', (articles) => {
        if (!articles || articles.length === 0) {
            articleRenderer.showEmpty()
        } else {
            articleRenderer.renderArticles(articles)
        }
    })
    
    bus.subscribe('data:articles:error', (error) => {
        articleRenderer.showError(error)
    })
    
    console.log('✅ ArticleRenderer initialisé')
}

export { articleRenderer }
