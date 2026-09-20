export class MoteurAsynchrone {

    constructor(
        puissanceNominale,
        tensionNominale,
        frequence,
        nombrePoles,
        resistanceStator,
        reactanceStator,
        resistanceRotor,
        reactanceRotor
    ) {
        this.puissanceNominale = puissanceNominale
        this.tensionNominale = tensionNominale
        this.frequence = frequence
        this.nombrePoles = nombrePoles
        this.resistanceStator = resistanceStator
        this.reactanceStator = reactanceStator
        this.resistanceRotor = resistanceRotor
        this.reactanceRotor = reactanceRotor

        this.vitesseSynchronisme = this.calculerVitesseSynchronisme()
    }

    // Vitesse de synchronisme en tr/min
    calculerVitesseSynchronisme() {
        return (120 * this.frequence) / this.nombrePoles
    }

    // Couple en fonction du glissement
    calculerCouple(glissement) {
        if (glissement === 0) return 0

        const s = glissement
        const R1 = this.resistanceStator
        const X1 = this.reactanceStator
        const R2 = this.resistanceRotor
        const X2 = this.reactanceRotor

        const denominateur =
            Math.pow(R1 + (R2 / s), 2) +
            Math.pow(X1 + X2, 2)

        return (
            3 *
            Math.pow(this.tensionNominale, 2) *
            (R2 / s) /
            (this.vitesseSynchronisme * denominateur)
        )
    }

    // Génère la courbe couple / vitesse.
    //
    // glissementMin < 0 :
    //     permet de représenter l'hypersynchronisme.
    //
    // glissementMax = 1 :
    //     moteur à l'arrêt.
    genererCourbeCouple(
        nombrePoints = 100,
        glissementMin = -0.2,
        glissementMax = 1.0
    ) {
        const donneesCourbe = []

        for (let i = 0; i < nombrePoints; i++) {

            const s =
                glissementMin +
                (glissementMax - glissementMin) *
                (i / (nombrePoints - 1))

            const couple = this.calculerCouple(s)

            const vitesseRotation =
                this.vitesseSynchronisme * (1 - s)

            donneesCourbe.push({
                vitesse: vitesseRotation,
                couple: couple,
                glissement: s
            })
        }

        return donneesCourbe
    }
}
