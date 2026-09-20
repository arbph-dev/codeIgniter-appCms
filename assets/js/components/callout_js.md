on reprend le code existant

- [/project/daily/2026-09-05.md](/project/daily/2026-09-05.md)
- [/refactoring/assets/js/components/callout.js](/refactoring/assets/js/components/callout.js)



## html

modifier le code html [/WebUI/ui.html](/WebUI/ui.html)

```html
                <div id="callout-0" class="tab-content">
                  <h3>Callout</h3>
                    <p>4 types disponibles</p>
                  
                    <h4>info</h4>
					<div id="CO_1" class="cp_callout cp_callout--info">
					    <strong class="cp_callout_title" style="cursor: pointer;">Attention</strong>
					    <div class="cp_callout_content" style="display: block;">Ceci est un callout de test de type <strong>info</strong>.2026-07-07 : Mise en production. Ajouter initCallout dans le bootstrap</div>
					</div>
					<h4>warning</h4>
					<div id="CO_2" class="cp_callout cp_callout--warning">
					    <strong class="cp_callout_title" style="cursor: pointer;">Attention</strong>
					    <div class="cp_callout_content" style="display: block;">Ceci est un callout de test de type <strong>warning</strong>.2026-07-07 : Mise en production. Ajouter initCallout dans le bootstrap</div>
					</div>
					<h4>danger</h4>
					<div id="CO_3" class="cp_callout cp_callout--danger">
					    <strong class="cp_callout_title" style="cursor: pointer;">Attention</strong>
					    <div class="cp_callout_content" style="display: block;">Ceci est un callout de test de type <strong>danger</strong>.2026-07-07 : Mise en production. Ajouter initCallout dans le bootstrap</div>
					</div>
					<h4>tip</h4>
					<div id="CO_4" class="cp_callout cp_callout--tip">
					    <strong class="cp_callout_title" style="cursor: pointer;">Attention</strong>
					    <div class="cp_callout_content" style="display: block;">Ceci est un callout de test de type <strong>tip</strong>.2026-07-07 : Mise en production. Ajouter initCallout dans le bootstrap</div>
					</div>

                </div>
```





## js

modifier le script [/WebUI/uiapp.js](/WebUI/uiapp.js)

```
	import { initCallout} from '/assets/js/components/callout.js'

onload
 initCallout()
```


## CSS

ajout des variables, dans chaque theme, a redefinir 
```
  --col-danger           : #f01313;
  --col-danger-secondary : #fdd8d0;
  --col-info             : #0000ff;
  --col-info-secondary   : #d0d8fd;
  --col-note             : #0b9d14;
  --col-note-secondary   : #d0f0da;        
  --col-warning          : #f79503;
  --col-warning-secondary: #fdf3d0;
```

### classe css

- titre : `cp_callout_title`
- contenu : `cp_callout_content`

on copie les classes depuis [/refactoring/assets/css/components/callout.css](/refactoring/assets/css/components/callout.css) vers [/WebUI/uistyle.css](/WebUI/uistyle.css)
