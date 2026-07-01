// js/plugins/apex.js

export function initApex() {

    const ref = document.getElementById('apex_grf1')

    if (!ref) return
    
    // apex_Barsbasic(ref) // ok
    
    // apex_Linesbasic(ref) // ok
    
    //apex_Linesdata(ref)
    
    //apex_Lines2dataSrc(ref)
    
    apex_LinesMS(ref)
}

//----------------------------
function apex_Barsbasic(domRef){

    const options = {
        chart: { type: 'bar' },
        series: [{
            name: 'sales',
            data: [30,40,35,85,49,60,70,91,125]
        }],
        xaxis: {
            categories: [1991,1992,1993,1994,1995,1996,1997,1998,1999]
        }
    }

    const chart = new ApexCharts(domRef, options)
    chart.render()

}


//---------------------------------------------------------------------------

const data = [
    { vitesse: 0, couple: 0 },
    { vitesse: 1000, couple: 20 },
    { vitesse: 2000, couple: 40 },
    { vitesse: 3000, couple: 60 },
    { vitesse: 4000, couple: 80 },
    { vitesse: 5000, couple: 100 }
];

const dataMoteur1 = [
    { vitesse: 0, couple: 0 },
    { vitesse: 1000, couple: 20 },
    { vitesse: 2000, couple: 40 },
];
    
const dataMoteur2 = [
    { vitesse: 0, couple: 5 },
    { vitesse: 1000, couple: 25 },
    { vitesse: 2000, couple: 45 },
];



function apex_Linesbasic(domRef){
    var options = {
        series: [{
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }],
        chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
      };

      var chart = new ApexCharts(domRef, options);
      chart.render();

}


function apex_Linesdata(domRef){

    const options = { 
        chart: { type: 'line', height: 350 },
        series: [
            { name: 'Couple', data: data.map(point => point.couple) }
        ],
        xaxis: { 
            categories: data.map(point => point.vitesse), 
            title: { text: 'Vitesse (RPM)' } 
        },
        yaxis: { 
            title: { text: 'Couple (Nm)' } 
        },
        title: { 
            text: 'Courbe de Couple en fonction de la Vitesse', align: 'left' 
        }
  
    };

    var chart = new ApexCharts(domRef, options);
    chart.render();
}



function apex_Lines2dataSrc(domRef){
    const options = {
        chart: { type: 'line', height: 350 },
        series: [
            { name: 'Moteur 1', data: dataMoteur1.map(point => point.couple) },
            { name: 'Moteur 2', data: dataMoteur2.map(point => point.couple) }
        ],
        xaxis: {
            categories: dataMoteur1.map(point => point.vitesse),
            title: { text: 'Vitesse (RPM)' }
        },
        yaxis: { title: { text: 'Couple (Nm)' } },
        title: { text: 'Comparaison des Courbes de Couple', align: 'left' }
        };

    var chart = new ApexCharts(domRef, options);
    chart.render();    
}

function apex_LinesMS(domRef){

    
    
    const moteurExemple = new MoteurAsynchrone(
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
    console.log(`Vitesse de synchronisme: ${moteurExemple.vitesseSynchronisme.toFixed(2)} RPM`);
    
    // Génération des données pour la courbe de couple
    const donneesCouple = moteurExemple.genererCourbeCouple(20);
    
    // Affichage des premiers points de la courbe
    console.log("Premiers points de la courbe Couple-Vitesse:");
    donneesCouple.slice(0, 5).forEach(point => {
        console.log(`Vitesse: ${point.vitesse.toFixed(2)} RPM, Couple: ${point.couple.toFixed(2)} Nm`);
    });


    const options = {
        chart: { type: 'line', height: 350 },
        series: [
            { name: 'Couple', data: donneesCouple.map(point => point.couple) }
        ],
        xaxis: {
            categories: donneesCouple.map(point => point.vitesse),
            title: { text: 'Vitesse (RPM)' }
        },
        yaxis: { title: { text: 'Couple (Nm)' } },
        title: { text: 'Comparaison des Courbes de Couple', align: 'left' }
        };

    var chart = new ApexCharts(domRef, options);
    chart.render();

}



//--------------------------------------------------------------------------------------------------------------------

class MoteurAsynchrone {

    constructor(puissanceNominale, tensionNominale, frequence, nombrePoles, resistanceStator, reactanceStator, resistanceRotor, reactanceRotor) {
        this.puissanceNominale = puissanceNominale; // Puissance nominale en Watts (W)
        this.tensionNominale = tensionNominale; // Tension nominale en Volts (V)
        this.frequence = frequence; // Fréquence du réseau en Hertz (Hz)
        this.nombrePoles = nombrePoles; // Nombre de pôles
        this.resistanceStator = resistanceStator; // Résistance du stator (Ohms, Ω)
        this.reactanceStator = reactanceStator; // Réactance du stator (Ohms, Ω)
        this.resistanceRotor = resistanceRotor; // Résistance du rotor (Ohms, Ω)
        this.reactanceRotor = reactanceRotor; // Réactance du rotor (Ohms, Ω)
        // Calcul de la vitesse de synchronisme
        this.vitesseSynchronisme = this.calculerVitesseSynchronisme();
    }
    
      
    // Calcul de la vitesse de synchronisme en tours par minute (RPM)
    calculerVitesseSynchronisme() {
        return (120 * this.frequence) / this.nombrePoles;
    }
    
    // Calcul du couple en fonction du glissement (s)
    // Cette formule est une approximation simplifiée, des modèles plus complexes existent.
    calculerCouple(glissement) {
        // Le glissement est généralement entre 0 et 1 gérer l'erreur
        if (glissement < 0 || glissement > 1) { return 0; }
    
        const s = glissement;
        const R1 = this.resistanceStator;
        const X1 = this.reactanceStator;
        const R2 = this.resistanceRotor;
        const X2 = this.reactanceRotor;
    
        // Calcul du couple maximal (Cmax) et du glissement correspondant (s_max)
        // Ces valeurs sont souvent calculées à partir des paramètres du moteur.
        // Pour simplifier, nous allons utiliser une formule plus générale.
            
        // Formule simplifiée du couple (basée sur le modèle équivalent monophasé)
    
        const denominateur = Math.pow(R1 + (R2 / s), 2) + Math.pow(X1 + X2, 2);
        const couple = (3 * Math.pow(this.tensionNominale, 2) * R2 / s) / (this.vitesseSynchronisme * denominateur);
    
        return couple;
    }
    
    // Fonction pour générer une série de points couple-vitesse
    genererCourbeCouple(nombrePoints = 50) {
        const donneesCourbe = [];
        const glissementMax = 1.0; // Le glissement maximal est généralement 1 (à l'arrêt)
        const glissementMin = 0.01; // On évite le glissement nul pour ne pas diviser par zéro

        for (let i = 0; i < nombrePoints; i++) {
            // Calcul du glissement pour chaque point
            const s = glissementMin + (glissementMax - glissementMin) * (i / (nombrePoints - 1));
            // Calcul du couple pour ce glissement
            const couple = this.calculerCouple(s);
            // Calcul de la vitesse de rotation correspondante
            const vitesseRotation = this.vitesseSynchronisme * (1 - s);
            donneesCourbe.push({ vitesse: vitesseRotation, couple: couple });
        }
        return donneesCourbe;
    }
    
}