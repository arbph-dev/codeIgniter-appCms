// ./js/ihm/dialog.js
import { bus } from '../core/eventBus.js'



/** +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *                                              CLASS DialogManager (singleton)
 */
class DialogManager {

    constructor() {
        this.dialogs = new Map()
        this._registerEvents()
    }


    init() {
        const dialogs = document.querySelectorAll('.cp_dialog')

        dialogs.forEach(node => {
            this.dialogs.set(node.id, node)
        })

        console.log(`DialogManager: ${this.dialogs.size} instance(s) enregistrée(s)`)
    }
    
    /** ------------------------------------------------------------------------------------------------------------
     * 
     * @param {String} id 
     * @returns {HTMLDialogElement}
     * usage :  
     * const dialogElem = dialogManager.getById( 'DIALOG_1' )
     */
    getById( id ) {
        //return this.dialogs.get('DIALOG_' + idSuffix) ?? null
        return this.dialogs.get( id ) ?? null
    }

    /** ------------------------------------------------------------------------------------------------------------
     * 
     * @param {String} id 
     * @returns null
     */
    destroy( id ) {
        const dialog = this.getById( id )
        if ( !dialog ) { return }
        dialog.destroy()
        //this.dialogs.delete('DIALOG_' + id)
        this.dialogs.delete( id )
    }
    /** ------------------------------------------------------------------------------------------------------------
     * utiliser par eventBus
     */
    _registerEvents() {

        bus.subscribe('dialog:glen' , () => { 
            console.log(`DialogManager: ${this.dialogs.size} instance(s) enregistrée(s)`) 
        })

        bus.subscribe('dialog:show', ( idSuffix ) => { showDialog( idSuffix ) })

        bus.subscribe('dialog:close', ( idSuffix ) => { closeDialog( idSuffix ) })        
    }

}
/** ++++++++++++++++++++++++++++++++++++++++  MODULE ++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

let activeDialog = null // conserve une reference au dialog

/** ------------------- showDialog MODULE     -------------------------------------
 * @param { string } id 
 * @returns null
 * HTML : button onclick="showModal('DIALOG_1')"
 */
function showDialog( id ) { 
    if (activeDialog === null ){
        const dialogElem = dialogManager.getById(id) //'DIALOG_' + id
        dialogElem.showModal()
        activeDialog = id //'DIALOG_' + id
    }
    return
}
/** ------------------- closeDialog MODULE     -------------------------------------
 * @param { string } id 
 * @returns null
 */
function closeDialog( id ){
    //'DIALOG_' + id

    if (activeDialog === id ){
        const dialogElem = dialogManager.getById(id)
        dialogElem.close()
        activeDialog = null //reset null
    }
    return
}

/* -----------        Init MODULE        --------------------------------------------- */

const dialogManager = new DialogManager()

export function initDialog() {

    console.log('-- initDialog --')
    
    dialogManager.init()

    // a deplacer dans module dialog
    window.showModal = (id) => bus.publish('dialog:show', id)
    window.closeModal = (id) => bus.publish('dialog:close', id)
}

