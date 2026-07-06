Je pense que tu tiens la bonne direction, mais je ferais une séparation encore plus stricte.

Aujourd'hui ton availableApi mélange trois niveaux :

1. Utilitaires CodeVal
2. Domaine métier (physique)
3. Composants UI (Apex, Vox)

Actuellement :

const availableApi = {
    call,
    call2,
    PHYS,
    plot: (...)
}

C'est pratique pour les essais, mais ça ne scale pas très bien.

Architecture que je verrais
Niveau 1 : api.system

Ce qui appartient au notebook lui-même.

api.system.version()
api.system.help()
Niveau 2 : api.phys

Bibliothèque métier.

api.phys.ohm(...)
api.phys.power(...)
api.phys.volumeISO2533(...)
api.phys.motor(...)

Exemple :

const result =
    api.phys.volumeISO2533(
        volume,
        pression,
        temperature
    )
Niveau 3 : api.graph

Publication vers Apex.

api.graph.plot(
    'APEX_1',
    {
        type:'line',
        payload:{ data }
    }
)

qui ferait simplement :

bus.publish('apex:render', ...)
Niveau 4 : api.vox

Publication vers Vox.

api.vox.speak('Simulation terminée')
Exemple complet

L'utilisateur écrit :

const moteur =
    api.phys.motor(
        1500,
        230,
        50,
        4,
        0.5,
        1.0,
        0.4,
        0.9
    )

const data =
    moteur.genererCourbeCouple(40)

api.graph.plot(
    'APEX_1',
    {
        type:'moteurCouple',
        payload:{ data }
    }
)

api.vox.speak('Courbe générée')

const result = 'Simulation OK'

Et le moteur CodeVal ne connaît ni Apex ni Vox.

Il ne fait que fournir des façades.

Concernant le namespace PHYS

Je suis d'accord avec toi :

Je n'exposerais pas :

api.PHYS

parce que ça expose toute l'implémentation.

On perd le contrôle de l'API publique.

Je préfère :

import * as PHYS from
    '/assets/js/libs/physics/index.js'

puis :

const availableApi = {

    phys: {

        ohm:
            PHYS.electric_URI,

        power:
            PHYS.electric_power,

        gas:
            PHYS.volumeISO2533,

        motor:
            (...args) =>
                new PHYS.MoteurAsynchrone(...args)
    }
}
Le fichier index.js des libs

Ça me paraît même indispensable.

// libs/physics/index.js

export { electric_URI }
    from './electric.js'

export { electric_power }
    from './electric.js'

export { volumeISO2533 }
    from './gas.js'

export { MoteurAsynchrone }
    from './motor.js'

Ensuite :

import * as PHYS
    from '/assets/js/libs/physics/index.js'

reste stable même si l'organisation interne change.

Là où je pousserais encore plus loin

Vu ton architecture EventBus, je vois CodeVal devenir un véritable composant de calcul.

CodeVal
    ↓
API métier
    ↓
résultat
    ↓
publication bus
    ↓
autres composants

Par exemple :

const data =
    moteur.genererCourbeCouple(40)

bus.publish(
    'simulation:motor:curve',
    data
)

ou via une façade :

api.events.publish(
    'simulation:motor:curve',
    data
)

Puis Apex pourrait écouter :

bus.subscribe(
    'simulation:motor:curve',
    ...
)

sans que le script utilisateur connaisse Apex.

C'est la seule évolution que je vois à moyen terme : passer de :

CodeVal
    ↓
Apex

à :

CodeVal
    ↓
EventBus
    ↓
Composants consommateurs

Ce serait parfaitement cohérent avec la migration "full event bus" que tu es en train de faire.
