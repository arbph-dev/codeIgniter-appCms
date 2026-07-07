// /assets/js/components/callout.js

export function initCallout() {

    document.querySelectorAll('.cp_callout_title')
        .forEach(titre => {

            titre.addEventListener('click', () => {

                const parent = titre.parentElement
                const Content = parent.querySelector('.cp_callout_content')
                Content.style.display = Content.style.display === 'block' ? 'none' : 'block'
            })
        })


}
