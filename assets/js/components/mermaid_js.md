## mermaid

on reche la lcasse mermaid sur github

1- on ajoute le code html, le div tab-content n'est pas listé il faut un tag H3 
  voir readPage ligne 98 

2- on doit intégrer js
  `<button id="executeButton" name="executeButton" onclick="mermaid_Run('mmG1')">Exécuter</button>`

on ajoute
- import dans appui.js 
- initMermaid dans windowload

```js
import { initMermaid } from '/assets/js/components/mermaid.js'

window.onload( (e) => {
  initMermaid()
})
```

## Ressources

https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/app/Views/cms/index.php
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/components/mermaid.js


le code ci dessous pose probleme => mis autre source ok
```html
<div id="mermaid_grf1">
  <pre class="mermaid" id="mmG1">
    gantt
    dateFormat  YYYY-MM-DD

    section Clickable
    Visit mermaidjs, read documentation         :active, cl1, 2025-08-22, 2d
    Print arguments         :cl2, after cl1, 3d
    Print task              :cl3, after cl2, 3d

    click cl1 href "https://mermaidjs.github.io/"
    click cl2 call mermaid_printArguments("test1", "test2", 3)
    click cl3 call window.mermaid_printTask(cl3)
  </pre>

  <button id="executeButton" name="executeButton" onclick="mermaid_Run('mmG1')">Exécuter</button>                  
</div>
```
