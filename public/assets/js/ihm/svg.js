/* ---------------------------------------------------------------------------------------- */
// animation svg
//* 80*80 */

    // Gestion du svg 

    const svgWidth = 360;
    const svgHeight = 80;
    //const path = document.getElementById('curve');
    

    let path; // paht ne peut etre initialisé avant chargment du dom on deplace l'init d ela var dans la fonction looad du doc 


    // Paramètres de la courbe
    const A = 60; // Amplitude X
    const B = 30; // Amplitude Y
    const delta = Math.PI / 2; // Déphasage
    let a = 1; // Fréquence initiale X
    let b = 0.5; // Fréquence initiale Y

    // Paramètres de variation
    const stepPHI = Math.PI / 360; // Pas pour faire varier le déphasage (0 à 360°)
    const ratioFmin = 0.5; // Fréquence minimale pour Y
    const ratioFmax = 2; // Fréquence maximale pour Y
    const stepF = 0.05; // Pas pour faire varier la fréquence

    let currentDelta = 0; // Initialisation du déphasage à 0
    let currentFreqX = a; // Initialisation de la fréquence X
    let currentFreqY = b; // Initialisation de la fréquence Y

//--------------------------------------------------------------------------------------------------------------
    function generateLissajous(a, b, delta) {
      const points = [];
      const step = 0.01; // Précision

      for (let t = 0; t <= 2 * Math.PI; t += step) {
        //const x = svgWidth / 2 + A * Math.sin( 2 * Math.PI * a * t + delta); // u  =U sin wt w = 2 pi f
        const x = svgWidth + A * Math.sin( 2 * Math.PI * a * t + delta); // u  =U sin wt w = 2 pi f
        const y = svgHeight / 2 + B * Math.sin(2 * Math.PI * b * t);
        const svgx = x;
        const svgy = y;
        //const x = offY + ( svgHeight / 2 + B * Math.sin(b * t) );
        points.push(`${svgx},${svgy}`);
//        points.push(`${x},${y}`);
      }
      return points.join(' ');
    }

//--------------------------------------------------------------------------------------------------------------    

    function animateLissajous() {
      // Faire varier le déphasage
      currentDelta += stepPHI;  // Déphasage augmente avec chaque frame
      
      if (currentDelta >= Math.PI) {
        currentDelta = - Math.PI ; // Réinitialiser le déphasage à 0 après un cycle complet (360°)

        // Faire varier les fréquences à chaque retour à 0 du déphasage
        currentFreqY += stepF;
        if (currentFreqY > ratioFmax) currentFreqY = ratioFmin; // Réinitialiser ou limiter la fréquence X

        //currentFreqY = currentFreqX * 0.6; // Moduler la fréquence Y par rapport à X (exemple de ratio)
      }

      // Générer la nouvelle courbe avec le déphasage et les fréquences modifiés
      path.setAttribute('d', `M ${generateLissajous(currentFreqX, currentFreqY, currentDelta)}`);

      // Appeler à nouveau l'animation
      requestAnimationFrame(animateLissajous);
    }
//--------------------------------------------------------------------------------------------------------------

export function initSvg() {

    //bus.subscribe('tabs:switch', switchTab)
    path = document.getElementById('lissajous-path');
    animateLissajous()

}