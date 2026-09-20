# Exploitation

on ajoute script cdn dans appui.html
```html
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
```

on modifie uiapp.js
- import apex
- init initApex()
```js
  import { initApex } from '/assets/js/components/apex.js'
```
On l'intègre simplement
```html
<div id="APEX_LIGNE_1" class="cp_apex" data-chart="line"></div>
<div id="APEX_BARRES_1" class="cp_apex" data-chart="bars"></div>
```





## Historique
### 2026-09-20-003 modifier builder moteurCouple
Les libellés des valeurs de l'axe y comportaient des zéros inutiles après la virgule [apex.js](/refactoring/assets/js/components/apex.js)

---
---

# A expliquer

le repository des types : https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/components/apex.js#L82-L118


## type = line

### Datas
```js
const SAMPLE_LINE = [ 12, 18, 15, 22, 20, 27, 24 ]
```

### Configuration
```js
function buildLineConfig(data = [], options = {})
{
    return {
        chart      : { type: 'line', height: options.height ?? 350, zoom: { enabled: false } },
        series     : [ { name: options.name ?? 'Série', data } ],
        xaxis      : options.xaxis ?? {},
        yaxis      : options.yaxis ?? {},
        stroke     : { width: options.width ?? 3, curve: options.curve ?? 'straight' },
        markers    : { size: options.markerSize ?? 4 },
        grid       : { show: true },
        title      : { text: options.title ?? '', align: 'left' },
        dataLabels : { enabled: false }
    }
}
```
### Builder
```js
const CHARTS = {
  line(payload = {}) {
    return buildLineConfig( payload.data ?? SAMPLE_LINE, payload.options ?? {} )
  },
```
## type = bars
### Datas
```js
const SAMPLE_BARS = [ { name: 'Valeurs', data: [14, 9, 17, 12] } ]
const SAMPLE_CATEGORIES = [ 'A', 'B', 'C', 'D' ]
```
### Configuration
```js
function buildBarConfig(series = [], categories = [], options = {})
{
    return {
        chart  : { type: 'bar', height: options.height ?? 350 },
        series,
        xaxis  : { categories },
        title  : { text: options.title ?? '', align: 'left' }
    }
}
```
### Builder

```js
const CHARTS = {
    bars(payload = {}) {
      return buildBarConfig( payload.series ?? SAMPLE_BARS , payload.categories ?? SAMPLE_CATEGORIES, payload.options ?? {})
    },
```

## type = moteurCouple



### Datas

```js
const SAMPLE_MOTEUR = [
    { vitesse:1000, couple:110 },
    { vitesse:1500, couple:145 },
    { vitesse:2000, couple:170 },
    { vitesse:2500, couple:182 },
    { vitesse:3000, couple:176 },
    { vitesse:3500, couple:160 },
    { vitesse:4000, couple:138 }
]
```
### Configuration
moteurCouple utilise la configuration line buildLineConfig


### Builder

```js
const CHARTS = {
    moteurCouple(payload = {})
    {
        const data = payload.data ?? SAMPLE_MOTEUR
        return buildLineConfig(
            data.map(p => p.couple),
            {
                name  : 'Couple',
                title : 'Courbe Couple / Vitesse',
                xaxis : { categories: data.map(p => p.vitesse), title: { text: 'Vitesse (RPM)' } },
                yaxis : { title: { text: 'Couple (Nm)' } }
            }
        )
    },
}
```

# Ressources a compiler

https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/COMPOSANTS/INDEX.md
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/COMPOSANTS/INDEX.md#22-apex-charts-graphiques
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/components/apex.js
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/public/assets/js/plugins/apex.js - exemple avec 2 courbes moteur

