// js/features/mot/mot.form.js
/*
    bus.subscribe 'forms:submit'
    
    bus.publish 'mot:error'
    bus.publish 'mot:search'

attention pas de id dans les name des input !!
on met id et q dans payload

                    <form id="motForm"  onsubmit="return validateForm(this)">
                        <label for="idInput">ID (optionnel) :</label><br />
                        <input type="number" id="idInput" name="motid" min="1" /><br />

                        <label for="qInput">Mot (optionnel) :</label><br />
                        <input type="text" id="qInput" name="motq" /><br />

                        <input type="submit" value="Submit">
                        <div id="result"></div>  
                    </form>
*/
import { bus } from '../../core/eventBus.js'  
  
export function initMotForm() {  
    bus.subscribe('forms:submit', (form) => {  
        if (form.id !== 'motForm') return  
  
        const formData = new FormData(form)  
  
        const payload = {  
            id: formData.get('motid')?.trim(),  
            q: formData.get('motq')?.trim()  
        }  
  
        if (!payload.id && !payload.q) {  
            bus.publish('mot:error', 'Veuillez saisir un ID ou un mot.')  
            return  
        }  
  
        bus.publish('mot:search', payload)  
    })  
}