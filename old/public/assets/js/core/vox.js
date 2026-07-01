// /assets/js/core/vox.js
//
// ══════════════════════════════════════════════════════════════════════════════
// Moteur de synthèse vocale — PAS d'accès DOM direct.
//
// Modifications vs version précédente :
//   · state.currentAlias    — alias de l'acteur en cours
//   · vox:start publie      { index, sentence, alias, statusId }
//   · vox:end publie        { statusId }
//   · vox:highlight publie  { html, wordIndex, alias, statusId }
//   · Supprimé de initVoxBus : les trois subscribers DOM
//       (vox:start / vox:end / vox:highlight / vox:voices:list)
//     → déplacés dans vox.renderer.js
// ══════════════════════════════════════════════════════════════════════════════

import { bus } from '/assets/js/core/eventBus.js'

const LANG_USER = 'fr-FR'

let synth = window.speechSynthesis

const state = {
    voice: null,
    voices: [], // garde toutes les voix 
    allVoices: [], // garde toutes les voix 
    lang: 'fr-FR',
    aliases: {
        Romeo: {voiceIndex: 2, rate: 1, pitch: 1, volume: 1 },
        Juliette: { voiceIndex: 0, rate: 1.2, pitch: 1.1, volume: 0.8},
        
        Enfant1: { voiceIndex: 0, rate: 1.18, pitch: 1.55, volume: 1.0 },
        Enfant2: { voiceIndex: 0, rate: 1.08, pitch: 1.35, volume: 0.95 },
        Enfant3: { voiceIndex: 1, rate: 1.22, pitch: 1.65, volume: 1.0 },
        Enfant4: { voiceIndex: 1, rate: 1.00, pitch: 1.28, volume: 0.9 },
        Enfant5: { voiceIndex: 3, rate: 1.15, pitch: 1.45, volume: 1.0 },
        Enfant6: { voiceIndex: 3, rate: 0.95, pitch: 1.18, volume: 0.85 },
        Enfant7: { voiceIndex: 2, rate: 1.05, pitch: 0.92, volume: 1.0 },
        Enfant8: { voiceIndex: 2, rate: 0.88, pitch: 0.78, volume: 0.95 }
        
    },
    rate: 1,
    pitch: 1,
    volume: 1,
    queue: [],
    currentIndex: 0,
    speaking: false,
    // gestion des mots de phrase avec boundary / highlight a sortir a terme
    words: [],
    wordCount: 0,
    wordCI: 0,
    wordLCI: 0,
    currentText: '',
    currentAlias: null,          // ← 20260516 : alias de la phrase en lecture
    statusId: 'VOX_STATUS' // valeur par défaut
}

/** INIT  */

export function initVoxBus() {

    loadVoices()
    speechSynthesis.addEventListener('voiceschanged',loadVoices)

    bus.subscribe('vox:speak', onSpeak) // declecnher par le bouton tester ; 
    bus.subscribe('vox:next', playNext) // appel recursif par playNext
    bus.subscribe('vox:pause', onPause) // ne semble pas utilisée
    bus.subscribe('vox:resume', onResume)// ne semble pas utilisée
    bus.subscribe('vox:stop', onStop) // ne semble pas utilisée
    
    bus.subscribe('vox:getVoices',onGetVoices)//20260511-001 ne semble pas utilisée
    bus.subscribe('vox:setVoice', onSetVoice) // utilisée par les boutons  Sélectionner ; tester
    bus.subscribe('vox:setLang', onSetLang) // ne semble pas utilisée
    bus.subscribe('vox:rate', onRate) // ne semble pas utilisée
    bus.subscribe('vox:volume', onVolume)// ne semble pas utilisée
    bus.subscribe('vox:queue:add', onQueueAdd)// ne semble pas utilisée
    bus.subscribe('vox:queue:clear', onQueueClear)// ne semble pas utilisée
    
    // boundary → handleBoundary (état interne) → publie vox:highlight
    // vox:highlight est consommé par vox.renderer.js (plus ici)
    bus.subscribe('vox:boundary',(data) => { handleBoundary(data)})



    
    console.log('[vox] init')
}



function loadVoices() {
    state.allVoices = synth.getVoices() // pourrait garder toutes les voix
    state.voices = state.allVoices.filter( voice => voice.lang.startsWith( LANG_USER ))
    if (!state.voice) { 
        state.voice = state.voices[0] || state.allVoices[0] 
    }
}



function onSpeak(payload = {}) {
    stopAll()
    state.statusId = payload.statusId || 'VOX_STATUS'  // ← ici
    const text = resolveText(payload) //decoupe le texte
    if (!text) return
    state.queue = splitText(text)
    state.currentIndex = 0
    playNext()
}



function playNext() {
    // controle lecture terminée ?
    if (state.currentIndex >= state.queue.length) {
        state.speaking = false
        //bus.publish('vox:end')
        bus.publish('vox:end', { statusId: state.statusId })
        return
    }
    
    //reset variable pour renderHighlightedText
    state.wordCount = 0
    state.wordCI = 0
    state.wordLCI = 0
    
    // Parser alias et texte 
    const info = parseDialogue( state.queue[state.currentIndex] )
    state.currentAlias    = info[0].alias   // ← NOUVEAU
    state.currentText = info[0].text
    state.words = state.currentText.split(' ')
    
    const sentence = info[0].text

    //configuration de la voix
    const utter = new SpeechSynthesisUtterance(sentence)
    const vconfig = resolveVoiceConfig(info[0].alias)
    utter.voice  = vconfig.voice
    utter.lang   = state.lang
    utter.rate   = vconfig.rate
    utter.pitch  = vconfig.pitch
    utter.volume = vconfig.volume
   
    // Boundary → handleBoundary → vox:highlight
    utter.addEventListener('boundary', (event) => {
        bus.publish( 'vox:boundary', { 
            charIndex : event.charIndex, 
            elapsedTime : event.elapsedTime,
            name : event.name 
        })
    })

    utter.onstart = () => {
        state.speaking = true
        // ← alias + statusId dans vox:start (consommé par vox.renderer)
        bus.publish('vox:start', { 
            index: state.currentIndex,
            sentence ,
            alias   : state.currentAlias, 
            statusId: state.statusId 
        })
    }

    utter.onend = () => {
        state.currentIndex++
        bus.publish('vox:next')
    }

    synth.speak(utter)
}



function onPause() { synth.pause() }
function onResume() { synth.resume() }
function onStop() { synth.cancel() }

function stopAll() {
    synth.cancel()
    state.queue = []
    state.currentIndex = 0
    state.speaking = false
    state.currentAlias = null
}



function onGetVoices() {
    // vox:voices:list est consommé par vox.renderer.js
    bus.publish('vox:voices:list',{
        voices : state.voices.map(v => ({ 
                name : v.name, 
                lang : v.lang, 
                default : v.default
            }))
    })
}

function onSetVoice(payload = {}) {
    const voice = state.voices.find( v => v.name === payload.name )
    if (voice) {
        state.voice = voice
        console.log( 'vox voice:', voice.name )
    }
}



function onSetLang(payload = {}) { state.lang = payload.lang }
function onRate(payload = {}) { state.rate = payload.value }
function onVolume(payload = {}) { state.volume = payload.value }
function onQueueAdd(payload = {}) { state.queue.push(payload) }
function onQueueClear() { state.queue = [] ; synth.cancel() }

// boundary → handleBoundary (état interne) → publie vox:highlight
// vox:highlight est consommé par vox.renderer.js (plus ici)
function handleBoundary(event) {
    state.wordCI = event.charIndex

    const wordsv = state.currentText.substring( state.wordLCI, state.wordCI)
    if ( wordsv && state.wordCI !== 0) { state.wordCount++ }
    state.wordLCI = state.wordCI

    bus.publish('vox:highlight',{
            html: renderHighlightedText(),
            wordIndex: state.wordCount,
            alias     : state.currentAlias,
            statusId  : state.statusId,            
        }
    )
}

function renderHighlightedText() {
    return state.words
        .map((word, index) => {
            if (index === state.wordCount) {return `<span style="color:red;font-weight:bold;">${word}</span>`
            }
            return word
        })
        .join(' ')
}

//--------------------------------------------------------
//Découpage en parties
function splitText(text) {
    return text.match(/[^.!?]+[.!?]+/g) || [text]
}

function resolveText(payload) {
    if (payload.text) { return payload.text }
    if (payload.targetId) {
        const el = document.getElementById(payload.targetId)
        if (!el) return ''
        return el.value || el.innerText || ''
    }
    return ''
}

function parseDialogue(sentence) {
    const match = sentence.trim().match(/^([^:]+):(.*)$/)
    if (!match) return [{ alias: null, text: sentence.trim() }]
    return [{ alias: match[1].trim(), text: match[2].trim() }]
}

function resolveVoiceConfig(alias) {
    const defaults = { 
        voice: state.voice,
        rate: state.rate,
        pitch: state.pitch,
        volume: state.volume
    }
    if (!alias) return defaults
    const config = state.aliases[alias]
    if (!config) return defaults
    return {
        voice:  state.voices[config.voiceIndex] || state.voice,
        rate:   config.rate   ?? state.rate,
        pitch:  config.pitch  ?? state.pitch,
        volume: config.volume ?? state.volume,
    }
}
