/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Seeder         : 004
 * Objet          : constantes
 * Domaine        : Métrologie
 *
 ******************************************************************************/

/******************************************************************************
 * CONSTANTES MATHEMATIQUES
 ******************************************************************************/

INSERT INTO constantes
(
    code,
    nom,
    categorie,
    grandeur_physique_id,
    unite_id,
    notation,
    valeur,
    ordre_affichage,
    description
)

VALUES
(
    'PI',
    'Nombre Pi',
    'MATHEMATIQUE',
    NULL,
    NULL,
    'π',
    3.141592653589793,
    10,
    'Rapport entre la circonférence et le diamètre.'
);

/******************************************************************************
 * CONSTANTES MECANIQUES
 ******************************************************************************/

INSERT INTO constantes
(
    code,
    nom,
    categorie,
    grandeur_physique_id,
    unite_id,
    notation,
    valeur,
    ordre_affichage,
    description
)

SELECT

'G_STANDARD',
'Accélération gravitationnelle',
'MECANIQUE',
gp.id,
u.id,
'g',
9.806650000000000,
20,
'Gravité terrestre standard'

FROM grandeurs_physiques gp

INNER JOIN unites u
ON u.code='METER_PER_SECOND_SQUARED'

WHERE gp.code='ACCELERATION';


/******************************************************************************
 * THERMIQUE
 ******************************************************************************/

INSERT INTO constantes (...)

SELECT

'CP_WATER',

'Capacité thermique massique de l''eau',

'THERMIQUE',

gp.id,

u.id,

'Cp',

4186.000000000000000,

30,

'À environ 20°C'

FROM grandeurs_physiques gp

INNER JOIN unites u

ON u.code='JOULE_PER_KILOGRAM_KELVIN'

WHERE gp.code='SPECIFIC_HEAT';


/******************************************************************************
 * ELECTRICITE
 ******************************************************************************/

INSERT INTO constantes (...)

SELECT

'VACUUM_PERMITTIVITY',

'Permittivité du vide',

'ELECTRICITE',

gp.id,

u.id,

'ε₀',

8.8541878128E-12,

40,

'Constante physique'

FROM grandeurs_physiques gp

INNER JOIN unites u

ON u.code='FARAD_PER_METER'

WHERE gp.code='PERMITTIVITY';
