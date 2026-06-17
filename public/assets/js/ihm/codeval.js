export function safeEval(code) {
    return Function('"use strict";return (' + code + ')')()
}

/**
 * fonction
 * 
 */

window.call = () => { return 'calling module fonction' }



export function initCodeVal() {

    document.querySelectorAll('.cp_codeval .titre')
        .forEach(titre => {

            titre.addEventListener('click', () => {

                const parent = titre.parentElement
                const scriptCode = parent.querySelector('.scriptcode')
                const result = parent.querySelector('.result')

                scriptCode.style.display = scriptCode.style.display === 'block' ? 'none' : 'block'

                result.style.display = 'none'
            })
        })

    window.evaluateCode = (id) => {

        const code = document.querySelector( `#CODEVAL_${id} textarea` ).value

        const resultDiv = document.querySelector( `#CODEVAL_${id} .result` )
        resultDiv.style.display = 'block'

        try {
            //const result = safeEval(code)
            const result = eval(code)
            resultDiv.textContent = `Résultat : ${result}`
        }
        catch (err) {
            resultDiv.textContent = `Erreur : ${err.message}`
        }
    }
}
