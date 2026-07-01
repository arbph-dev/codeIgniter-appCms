



export function initCallout() {

    document.querySelectorAll('.cp_callout .titre')
        .forEach(titre => {

            titre.addEventListener('click', () => {

                const parent = titre.parentElement
                const Content = parent.querySelector('.content')
                Content.style.display = Content.style.display === 'block' ? 'none' : 'block'
            })
        })


}