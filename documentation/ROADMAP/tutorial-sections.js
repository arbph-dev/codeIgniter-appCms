// ==========================================
// tutorial-sections.js
// Sections pour l'application tutorielle JSONPlaceholder
// Pattern : Client → Contacts (adapté pour Users → Posts/Comments/Tasks)
// ==========================================

import { createLI } from '../utils/dom-helpers.js' // V04.3
import { SectionPostsAnalytics } from './SectionPostsAnalytics.js'// V04.5
import * as DOM from '../domcreat.js'
import { SectionPanels } from './spanel.js'
import {
    UserPropertySet,
    UserComputePropertySet,
    PostPropertySet,
    PostComputePropertySet,
    CommentPropertySet,
    CommentComputePropertySet,
    TodoPropertySet,
    TodoComputePropertySet,
    user_TemplateLi,
    post_TemplateLi,
    comment_TemplateLi,
    todo_TemplateLi
} from './tutorial-config.js'

// ==========================================
// SECTION USERS
// ==========================================

export class SectionUsers extends SectionPanels {
    constructor(ObjTab, SectionName) {
        super(
            ObjTab,
            SectionName,
            [], // Données vides au départ
            UserPropertySet,
            UserComputePropertySet,
            {
                type: 'custom',
                custom: user_TemplateLi
            }
        )
        // ✅ V0.4.7.1 Initialiser le cycle de vie APRÈS super()
        this.initLifecycle()
        // Configuration
        this.confMultipleSelection = false
        
        // Charger les données au démarrage
        this.loadUsersData()
    }



    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onInit() {
        console.log('🚀 SectionUsers: Initialisation')
        this.loadUsersData()
    }
    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onError(error) {
        console.error('❌ SectionUsers:', error)
        this.setTabInfobar({
            titre: 'Erreur',
            texte: error.message,
            type: 'error'
        })
        this.showTabInfobar()
    }

// ✅ V0.4.7.2 Implémenter les hooks 
    onMount() {
        console.log('📍 SectionUsers: Montée dans le DOM')
        // Activer les listeners d'événements
        //this.attachEventListeners() pas dans SectionUsers ?? 
    }
// ✅ V0.4.7.2 Implémenter les hooks     
    onUnmount() {
        console.log('📤 SectionUsers: Démontage du DOM')
        // Nettoyer les listeners
        //this.removeEventListeners() //pas dans SectionUsers
    }
// ✅ V0.4.7.2 Implémenter les hooks     
    onDestroy() {
        console.log('💥 SectionUsers: Destruction')
        // Libérer les ressources
        this.SectionData = null //dans SectionUsers
    }
// ✅ V0.4.7.2 Implémenter les hooks     
    onUpdate(data) {
        console.log('🔄 SectionUsers: Mise à jour', data)
        this.UpdateList //dans SectionUsers
    }


    /**
     * Charge les utilisateurs depuis l'API
     */
    loadUsersData() {
        console.log('👥 Chargement des utilisateurs...')
        
        window.Interceptor(
            null,
            null,
            {
                dataSource: 'user',
                dataAction: 'readall'
            },
            (data) => this.onUsersLoaded(data)
        )
    }
    
    /**
     * Callback appelé quand les utilisateurs sont chargés
     */
    onUsersLoaded(data) {
        console.log('✅ Utilisateurs reçus:', data)
        
        this.SectionDataOriginal = data
        this.SectionData = [...data]
        
        this.RefreshList()
        this.RenderTable()
        this.RenderGrid()
        
        this.setTabInfobar({
            titre: 'Succès',
            texte: `${data.length} utilisateur(s) chargé(s)`,
            type: 'success'
        })
        this.showTabInfobar()
        this.setTimeout(() => this.hideTabInfobar(), 2500)
    }
    
    /**
     * Override UpdateList pour gérer la sélection
    
    UpdateList() {
        let strNAMID = this.ul.id + '-li-'
        
        this.SectionData.forEach((item, i) => {
            const content = this.generateListItemContent(item)
            let li = DOM.domCreat_LI(strNAMID + i, content)
            li.dataset.index = i
            this.ul.appendChild(li)
        })
    }*/

 /** 
 * Override UpdateList pour gérer le HTML dans les templates
 * UTILISE createLI au lieu de DOM.domCreat_LI
 */
    UpdateList() {
        let strNAMID = this.ul.id + '-li-'
        
        this.SectionData.forEach((item, i) => {
            const htmlContent = this.generateListItemContent(item) // Génère HTML string
            let li = createLI(strNAMID + i, htmlContent) // V04.3 createLI avec innerHTML
            li.dataset.index = i
            this.ul.appendChild(li)
        })
    }
      
}

// ==========================================
// SECTION POSTS
// ==========================================

export class SectionPosts extends SectionPanels {
    constructor(ObjTab, SectionName) {
        super(
            ObjTab,
            SectionName,
            [],
            PostPropertySet,
            PostComputePropertySet,
            {
                type: 'custom',
                custom: post_TemplateLi
            }
        )
        // ✅ V0.4.7.1 Initialiser le cycle de vie APRÈS super()
        this.initLifecycle()
        this.confMultipleSelection = false
        this.loadPostsData()

    }
    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onInit() {
        console.log('🚀 SectionPosts: Initialisation')
        this.loadPostsData()
    }
    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onError(error) {
        console.error('❌ SectionPosts:', error)
        this.setTabInfobar({
            titre: 'Erreur',
            texte: error.message,
            type: 'error'
        })
        this.showTabInfobar()
    }
    
    
// ✅ V0.4.7.2 Implémenter les hooks 
    onMount() {
        console.log('📍 SectionPosts: Montée dans le DOM')
        // Activer les listeners d'événements
        //this.attachEventListeners() pas dans SectionUsers ?? 
    }
// ✅ V0.4.7.2 Implémenter les hooks     
    onUnmount() {
        console.log('📤 SectionPosts: Démontage du DOM')
        // Nettoyer les listeners
        //this.removeEventListeners() //pas dans SectionUsers
    }
// ✅ V0.4.7.2 Implémenter les hooks     
    onDestroy() {
        console.log('💥 SectionPosts: Destruction')
        // Libérer les ressources
        this.SectionData = null //dans SectionUsers
    }
// ✅ V0.4.7.2 Implémenter les hooks     
    onUpdate(data) {
        console.log('🔄 SectionPosts: Mise à jour', data)
        this.UpdateList //dans SectionUsers
    }



    /**
     * Charge les articles depuis l'API
     */
    loadPostsData() {
        console.log('📝 Chargement des articles...')
        
        // Si un utilisateur est sélectionné, charger ses posts
        if (window.selectedUser) {
            window.Interceptor(
                null,
                null,
                {
                    dataSource: 'post',
                    dataAction: 'readByUser'
                },
                (data) => this.onPostsLoaded(data)
            )
        } else {
            // Sinon, charger tous les posts
            window.Interceptor(
                null,
                null,
                {
                    dataSource: 'post',
                    dataAction: 'readall'
                },
                (data) => this.onPostsLoaded(data)
            )
        }
    }
    
    /**
     * Callback appelé quand les posts sont chargés
     */
    onPostsLoaded(data) {
        console.log('✅ Articles reçus:', data)
        
        this.SectionDataOriginal = data
        this.SectionData = [...data]
        
        this.RefreshList()
        this.RenderTable()
        this.RenderGrid()
        
        this.setTabInfobar({
            titre: 'Succès',
            texte: `${data.length} article(s) chargé(s)`,
            type: 'success'
        })
        this.showTabInfobar()
        this.setTimeout(() => this.hideTabInfobar(), 2500)
    }
    
    /**
     * Override UpdateList
    */

    UpdateList() {
        let strNAMID = this.ul.id + '-li-'
        
        this.SectionData.forEach((item, i) => {
            const htmlContent = this.generateListItemContent(item)
            let li = createLI(strNAMID + i, htmlContent) // V04.3  UTILISE createLI
            li.dataset.index = i
            this.ul.appendChild(li)
        })
    }        

}

// ==========================================
// SECTION COMMENTS
// ==========================================

export class SectionComments extends SectionPanels {
    constructor(ObjTab, SectionName) {
        super(
            ObjTab,
            SectionName,
            [],
            CommentPropertySet,
            CommentComputePropertySet,
            {
                type: 'custom',
                custom: comment_TemplateLi
            }
        )
        // ✅ V0.4.7.1 Initialiser le cycle de vie APRÈS super()
        this.initLifecycle()
        this.confMultipleSelection = false
        this.loadCommentsData()
    }

    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onInit() {
        console.log('🚀 SectionComments: Initialisation')
        this.loadCommentsData()
    }
    
    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onError(error) {
        console.error('❌ SectionComments:', error)
        this.setTabInfobar({
            titre: 'Erreur',
            texte: error.message,
            type: 'error'
        })
        this.showTabInfobar()
    }    

    // ✅ V0.4.7.2 Implémenter les hooks 
    onMount() {
        console.log('📍 SectionComments: Montée dans le DOM')
        // Activer les listeners d'événements
        //this.attachEventListeners() pas dans SectionUsers ?? 
    }

    // ✅ V0.4.7.2 Implémenter les hooks     
    onUnmount() {
        console.log('📤 SectionComments: Démontage du DOM')
        // Nettoyer les listeners
        //this.removeEventListeners() //pas dans SectionUsers
    }

    // ✅ V0.4.7.2 Implémenter les hooks     
    onDestroy() {
        console.log('💥 SectionComments: Destruction')
        // Libérer les ressources
        this.SectionData = null //dans SectionUsers
    }

    // ✅ V0.4.7.2 Implémenter les hooks     
    onUpdate(data) {
        console.log('🔄 SectionComments: Mise à jour', data)
        this.UpdateList //dans SectionUsers
    }    

    /**
     * Charge les commentaires depuis l'API
     */
    loadCommentsData() {
        console.log('💬 Chargement des commentaires...')
        
        // Si un post est sélectionné, charger ses commentaires
        if (window.selectedPost) {
            window.Interceptor(
                null,
                null,
                {
                    dataSource: 'comment',
                    dataAction: 'readByPost'
                },
                (data) => this.onCommentsLoaded(data)
            )
        } else {
            this.setTabInfobar({
                titre: 'Information',
                texte: 'Veuillez sélectionner un article',
                type: 'information'
            })
            this.showTabInfobar()
        }
    }
    
    /**
     * Callback appelé quand les commentaires sont chargés
     */
    onCommentsLoaded(data) {
        console.log('✅ Commentaires reçus:', data)
        
        this.SectionDataOriginal = data
        this.SectionData = [...data]
        
        this.RefreshList()
        this.RenderTable()
        this.RenderGrid()
        
        this.setTabInfobar({
            titre: 'Succès',
            texte: `${data.length} commentaire(s) chargé(s)`,
            type: 'success'
        })
        this.showTabInfobar()
        this.setTimeout(() => this.hideTabInfobar(), 2500)
    }
    
    /**
     * Override UpdateList
    */
    UpdateList() {
        let strNAMID = this.ul.id + '-li-'
        
        this.SectionData.forEach((item, i) => {
            const htmlContent = this.generateListItemContent(item)
            let li = createLI(strNAMID + i, htmlContent) // V04.3 createLI
            li.dataset.index = i
            this.ul.appendChild(li)
        })
    }
}

// ==========================================
// SECTION TASKS (TODOS)
// ==========================================

export class SectionTasks extends SectionPanels {
    constructor(ObjTab, SectionName) {
        super(
            ObjTab,
            SectionName,
            [],
            TodoPropertySet,
            TodoComputePropertySet,
            {
                type: 'custom',
                custom: todo_TemplateLi
            }
        )
        // ✅ V0.4.7.1 Initialiser le cycle de vie APRÈS super()
        this.initLifecycle()

        this.confMultipleSelection = false
        this.loadTasksData()
    }
    
    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onInit() {
        console.log('🚀 SectionTasks: Initialisation')
        this.loadUsersData()
    }
    
    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onError(error) {
        console.error('❌ SectionTasks:', error)
        this.setTabInfobar({
            titre: 'Erreur',
            texte: error.message,
            type: 'error'
        })
        this.showTabInfobar()
    }
    
    // ✅ V0.4.7.2 Implémenter les hooks 
    onMount() {
        console.log('📍 SectionTasks: Montée dans le DOM')
        // Activer les listeners d'événements
        //this.attachEventListeners() pas dans SectionUsers ?? 
    }

    // ✅ V0.4.7.2 Implémenter les hooks     
    onUnmount() {
        console.log('📤 SectionTasks: Démontage du DOM')
        // Nettoyer les listeners
        //this.removeEventListeners() //pas dans SectionUsers
    }

    // ✅ V0.4.7.2 Implémenter les hooks     
    onDestroy() {
        console.log('💥 SectionTasks: Destruction')
        // Libérer les ressources
        this.SectionData = null //dans SectionUsers
    }

    // ✅ V0.4.7.2 Implémenter les hooks     
    onUpdate(data) {
        console.log('🔄 SectionTasks: Mise à jour', data)
        this.UpdateList //dans SectionUsers
    }        
    

    /**
     * Charge les tâches depuis l'API
     */
    loadTasksData() {
        console.log('📋 Chargement des tâches...')
        
        // Si un utilisateur est sélectionné, charger ses tâches
        if (window.selectedUser) {
            window.Interceptor(
                null,
                null,
                {
                    dataSource: 'todo',
                    dataAction: 'readByUser'
                },
                (data) => this.onTasksLoaded(data)
            )
        } else {
            // Sinon, charger toutes les tâches
            window.Interceptor(
                null,
                null,
                {
                    dataSource: 'todo',
                    dataAction: 'readall'
                },
                (data) => this.onTasksLoaded(data)
            )
        }
    }
    
    /**
     * Callback appelé quand les tâches sont chargées
     */
    onTasksLoaded(data) {
        console.log('✅ Tâches reçues:', data)
        
        this.SectionDataOriginal = data
        this.SectionData = [...data]
        
        this.RefreshList()
        this.RenderTable()
        this.RenderGrid()
        
        // Compter les tâches terminées
        const completed = data.filter(t => t.completed).length
        
        this.setTabInfobar({
            titre: 'Succès',
            texte: `${data.length} tâche(s) chargée(s) (${completed} terminées)`,
            type: 'success'
        })
        this.showTabInfobar()
        this.setTimeout(() => this.hideTabInfobar(), 2500)
    }
    
    /**
     * Override UpdateList pour gérer les tâches terminées
    */

    UpdateList() {
        let strNAMID = this.ul.id + '-li-'
        
        this.SectionData.forEach((item, i) => {
            const htmlContent = this.generateListItemContent(item)
            let li = createLI(strNAMID + i, htmlContent) // V04.3 createLI
            li.dataset.index = i
            
            // Ajouter classe "done" si la tâche est terminée
            if (item.completed) {
                li.classList.add('done')
            }
            
            this.ul.appendChild(li)
        })
    }    
    
    /**
     * Filtre pour afficher seulement les tâches en cours
     */
    showPendingTasks() {
        this.currentFilter = {
            key: 'completed',
            value: false
        }
        this.hasFilter = true
        
        this.SectionData = this.SectionDataOriginal.filter(task => !task.completed)
        
        // Vider la liste
        while (this.ul.firstChild) {
            this.ul.removeChild(this.ul.firstChild)
        }
        
        // Remplir
        this.UpdateList()
    }
    
    /**
     * Filtre pour afficher seulement les tâches terminées
     */
    showCompletedTasks() {
        this.currentFilter = {
            key: 'completed',
            value: true
        }
        this.hasFilter = true
        
        this.SectionData = this.SectionDataOriginal.filter(task => task.completed)
        
        while (this.ul.firstChild) {
            this.ul.removeChild(this.ul.firstChild)
        }
        
        this.UpdateList()
    }
    
    /**
     * Override addlistFilterBar pour ajouter filtres tâches
     */
    addlistFilterBar(PL, debug = false) {
        const filterBar = super.addlistFilterBar(PL, debug)
        
        // Ajouter boutons filtres tâches
        let strNAMID = PL.id + '-Taskbar'
        
        const btnPending = DOM.domCreat_Input(
            strNAMID + '-pending',
            'button',
            '⬜ En cours',
            {},
            { click: () => this.showPendingTasks() }
        )
        
        const btnCompleted = DOM.domCreat_Input(
            strNAMID + '-completed',
            'button',
            '✅ Terminées',
            {},
            { click: () => this.showCompletedTasks() }
        )
        
        filterBar.appendChild(btnPending)
        filterBar.appendChild(btnCompleted)
        
        return filterBar
    }
}

// ==========================================
// EXPORT
// ==========================================
// ✅ APRÈS (exports nommés)
export {
    SectionPostsAnalytics
}
// Export default optionnel (pour compatibilité)
export default {
    SectionUsers,
    SectionPosts,
    SectionComments,
    SectionTasks
}
// ✅ V0.4.6.1
export { SectionProfile } from './SectionProfile.js'
