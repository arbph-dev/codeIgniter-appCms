
export class MoteurAsynchrone {

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
