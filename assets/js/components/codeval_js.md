# codeval

## Historique

### 2026-09-20 modifier css
- Le bloc code ne s'affiche qu'après 2 clics
```css
/* .cp_codeval .scriptcode { display: none; padding: 10px; } */
.cp_codeval .scriptcode { display: block; padding: 10px; }
```


# Exploitation

## css
on reprend les couleurs définis pour les themes 
- on ajoute 4 classes
- voir si besoin de `cp_toolbar`

## js
```js
window.onload = (event) => {
  ...
  initCodeVal()
  ...
}
```

## code textaera
il faut impérativement exploiter la constante **result**. **result** est utilisé pour affihé le resultat du script
```js
const result = api.call()
const result = api.call2('ali baba')
```


# api
expliquer utilisation api
```
import * as PHYS from '/assets/js/libs/physics.js'
    PHYS,
    plot  : (id, cfg)  => bus.publish('apex:render', { id, ...cfg })
```

## MoteurAsynchrone
pour le textaera utilise **api.PHYS.MoteurAsynchrone**

```js
    let sTemp = null
    
    const moteurExemple = new api.PHYS.MoteurAsynchrone(
        1500, // Puissance nominale (W) - Exemple: 1.5 kW
        230, // Tension nominale (V)
        50, // Fréquence (Hz)
        4, // Nombre de pôles (ex: 4 pôles pour 1500 RPM à 50Hz)
        0.5, // Resistance Stator (Ω)
        1.0, // Reactance Stator (Ω)
        0.4, // Resistance Rotor (Ω)
        0.9 // Reactance Rotor (Ω)
    );
    
    // Affichage de la vitesse de synchronisme
    sTemp = `Vitesse de synchronisme: ${moteurExemple.vitesseSynchronisme.toFixed(2)} RPM\n`;
    
    // Génération des données pour la courbe de couple
    // const donneesCouple = moteurExemple.genererCourbeCouple(20);
    const donneesCouple = moteurExemple.genererCourbeCouple(100, -1.0, 1.0)
    // Affichage des premiers points de la courbe
    sTemp += "Premiers points de la courbe Couple-Vitesse:\n";
    donneesCouple.slice(0, 5).forEach(point => {
        sTemp += `Vitesse: ${point.vitesse.toFixed(2)} RPM, Couple: ${point.couple.toFixed(2)} Nm\n`;
    });
    const result = sTemp;                           

```


# Interaction
il faut maintenant gérer le graph


### Modifications
- modifier [plot](/refactoring/assets/js/components/codeval.js#L34) ligne 34 de `/assets/js/components/codeval.js`

- modifier le code du textaera [/assets/ui_html.md](/WebUI/ui.html)
```js
    //const donneesCouple = moteurExemple.genererCourbeCouple(20);
    const donneesCouple = moteurExemple.genererCourbeCouple(100, -1.0, 1.0)
    api.plot('APEX_LIGNE_3', { data: donneesCouple });
```

- modifier builder moteurCouple de [apex.js](/refactoring/assets/js/components/apex.js)

Les libellés des valeurs de l'axe y comportaient des zéros inutiles

```js
// yaxis : { title: { text: 'Couple (Nm)' } }
yaxis : { title: { text: 'Couple (Nm)' }, labels: { formatter: value => Number(value).toFixed(0) } }
```




---



## code textaera
code a insérer dans textaera
a récupérer et intégrer

```
    <section>
        <h3>Calcul des purges</h3>

const TAC_brute    = 33  // °f eau brute
const TAC_chaudiere = 100 // °f chaudière
const VA           = 2   // m³/h appoint
const purges = (TAC_brute * VA) / 100
"Purges = " + purges + " m³/h"


// test a faire avec {$script}
// pas de br ni de \n ne fonctionne
           Avec :<br>
                - un débit q de 75 m3/h<br> 
                - une section de 2 m2 <br>
                on obtient une vitesse de passage de 37,5 m/h.<br>        

const q = 75
    const S = 2
    const Vp = q / S
    "Vp = " + Vp + " m/h"
```


notes composants
```

// =============================================================================
// Pont HTML inline → bus
// =============================================================================
// Iter007 : déplacé depuis /assets/js/cms/bootstrap.js vers assets/js/core/eventBus.js
//
// Utilisé par les renderers PHP qui génèrent des onclick inline, ex :
//   CodeValRenderer   : onclick="window.eventBusPublish(event,'codeval:eval','CV_1')"
//
// Disponible dès que eventBus.js est importé par n'importe quel module,
// indépendamment du bootstrap CMS — plus de couplage avec bootstrap.js.
//
// Signature : (evt, eventName, payload)
//   evt       — événement DOM (ignoré, présent pour compatibilité onclick)
//   eventName — nom de l'événement bus
//   payload   — données transmises aux subscribers
// =============================================================================
 
window.eventBusPublish = (evt, eventName, payload = null) => {
    bus.publish(eventName, payload)
}
```

## Ressources
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/COMPOSANTS/codeval_notes.md
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/COMPOSANTS/INDEX.md
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/COMPOSANTS/INDEX.md#21-codeval-interpréteur-javascript
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/components/codeval.js

