/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Seeder : 005
 * Objet  : formules_physiques
 *
 ******************************************************************************/

/******************************************************************************
 * PUISSANCE ELECTRIQUE
 *
 * P = U × I
 *
 ******************************************************************************/

INSERT INTO formules_physiques
(
    code,
    nom,
    categorie,
    grandeur_physique_id,
    notation,
    expression,
    version,
    etat,
    ordre_affichage,
    description
)

SELECT

'ELECTRICAL_POWER',
'Puissance électrique',
'ELECTRICITE',
gp.id,
'P',
'U * I',
'1.0',
'ACTIVE',
10,
'Puissance électrique active'

FROM grandeurs_physiques gp

WHERE gp.code='POWER';


/******************************************************************************
 * PUISSANCE THERMIQUE
 *
 * P = Q × Cp × ΔT
 *
 ******************************************************************************/

INSERT INTO formules_physiques
(
code,
nom,
categorie,
grandeur_physique_id,
notation,
expression,
version,
etat,
ordre_affichage,
description
)

SELECT

'THERMAL_POWER',
'Puissance thermique',
'THERMIQUE',
gp.id,
'P',
'Q * Cp * DT',
'1.0',
'ACTIVE',
20,
'Calcul de puissance thermique'

FROM grandeurs_physiques gp

WHERE gp.code='POWER';


/******************************************************************************
 * SURFACE CERCLE
 *
 * S = PI × R²
 *
 ******************************************************************************/

INSERT INTO formules_physiques
(
code,
nom,
categorie,
grandeur_physique_id,
notation,
expression,
version,
etat,
ordre_affichage,
description
)

SELECT

'CIRCLE_AREA',
'Surface cercle',
'GEOMETRIE',
gp.id,
'S',
'PI * R * R',
'1.0',
'ACTIVE',
30,
'Surface d''un cercle'

FROM grandeurs_physiques gp

WHERE gp.code='AREA';


/******************************************************************************
 * VOLUME CYLINDRE
 *
 * V = PI × R² × H
 *
 ******************************************************************************/

INSERT INTO formules_physiques
(
code,
nom,
categorie,
grandeur_physique_id,
notation,
expression,
version,
etat,
ordre_affichage,
description
)

SELECT

'CYLINDER_VOLUME',
'Volume cylindre',
'GEOMETRIE',
gp.id,
'V',
'PI * R * R * H',
'1.0',
'ACTIVE',
40,
'Volume d''un cylindre'

FROM grandeurs_physiques gp

WHERE gp.code='VOLUME';


/******************************************************************************
 * VITESSE LINEAIRE
 *
 * V = PI × D × N
 *
 ******************************************************************************/

INSERT INTO formules_physiques
(
code,
nom,
categorie,
grandeur_physique_id,
notation,
expression,
version,
etat,
ordre_affichage,
description
)

SELECT

'LINEAR_SPEED',
'Vitesse linéaire',
'MECANIQUE',
gp.id,
'V',
'PI * D * N',
'1.0',
'ACTIVE',
50,
'Vitesse périphérique'

FROM grandeurs_physiques gp

WHERE gp.code='SPEED';
