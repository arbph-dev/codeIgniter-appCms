//assets/js/core/vox.listen.js

import { bus } from '/assets/js/core/eventBus.js'  
  
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition  
  
const state = {  
	recognition : null,  
	listening : false,  
	lang : 'fr-FR',  
	interim : false,
    targetId : 'TXT_RVOX_1', // id par defaut zone de sortie
    statusId : 'RVOX_STATUS_1' //id par defaut zone info
}  

let elDom = null
let elDom2 = null


export function initVoxListen() {  
	if (!SpeechRecognition) {  
		bus.publish('listen:error', { error: 'SpeechRecognition non supporté'  })  
		return  
    }  
  
    state.recognition = new SpeechRecognition()  
    
    state.recognition.continuous = true  
    state.recognition.interimResults = false  
    state.recognition.lang = state.lang  
    
    state.recognition.onstart = () => {  
        state.listening = true  
        bus.publish('listen:start')  
    }  
    
    state.recognition.onresult = onResult  
    
    state.recognition.onerror = (event) => {  
        bus.publish('listen:error', { error: event.error })  
    }  
  
    state.recognition.onend = () => {  
        state.listening = false  
        bus.publish('listen:end')  
    }  
    // ecoute commande de la reconnaissance
    bus.subscribe('listen:cmd:start', startListening)  
    bus.subscribe('listen:cmd:stop', stopListening)  
    bus.subscribe('listen:cmd:setLang', setLang)  
    
    // ecoute evenement de la reconnaissance pour ui
    // a sortir
    bus.subscribe('listen:start', onRecStart)  
    bus.subscribe('listen:end', onRecEnd)  
    bus.subscribe('listen:result', onRecResult)  
    
    console.log('[vox.listen] init')  
}  
  
function startListening(payload = {}) {  
    state.recognition.lang = payload.lang || state.lang  
    state.recognition.interimResults = payload.interim ?? state.interim  
    state.targetId = payload.targetId ?? state.targetId     
    state.statusId = payload.statusId ?? state.statusId

    elDom = document.getElementById(state.targetId)
    elDom2 = document.getElementById(state.statusId)

    state.recognition.start()  
}  
  
function stopListening() { state.recognition.stop() }  
  
function setLang({ lang }) { state.lang = lang }  
  
function onResult(event) {  
    for (let i = event.resultIndex; i < event.results.length; i++) {  
        const result = event.results[i]  
        bus.publish('listen:result', {  
            transcript : result[0].transcript,  
            confidence : result[0].confidence,  
            final : result.isFinal  
        })  
    }  
}


function onRecResult({ transcript , final }) {
    if (!elDom) return  
    elDom.innerHTML = final ? transcript: transcript
    elDom2.innerHTML = 'Resultat'  
}  
      
function onRecStart() {
    if (!elDom) return  
    elDom.classList.add('listening')
    elDom2.innerHTML = 'Started'
}  
      
function onRecEnd() {  
    if (!elDom) return
    elDom.classList.remove('listening')  
    elDom2.innerHTML = 'Stopped'
}  
      

