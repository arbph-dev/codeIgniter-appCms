
Le **seeder SQL pour `objet_caracteristiques`** remplit cette table de démarrage avec des caractéristiques techniques de référence pour différents équipements courants (moteur électrique, pompe centrifuge, échangeur, chaudière, ventilateur). Chaque ligne inclut le type de structure (`structure_type`), un identifiant fictif (`structure_id`), la référence à la caractéristique du catalogue (`caracteristique_id` par code), ainsi que le rôle (code technique), la désignation (libellé métier), l’unité, la valeur (décimale, texte, booléen ou date), l’origine (CONSTRUCTEUR, CALCULEE, IMPORT, SAISIE) et un commentaire explicatif.

Le tableau ci-dessous résume les exemples insérés. On y voit des valeurs numériques (puissance, tension, débit, pression…), des textes (fluidos, type d’énergie), des booléens et des dates, ainsi qu’un cas de valeur non renseignée (`NULL`). Un équipement est représenté par `structure_type='Equipement'` et un `structure_id` fictif (par ex. 1 pour le moteur, 2 pour la pompe, etc.). Les valeurs unitaires utilisent des codes d’unité (par ex. `V`, `kW`, `m3_h`, `bar`, `degC`), et certains rôles (ex. `P_NOM`, `U`, `I`) sont utilisés par le moteur de calcul. L’**origine** indique si la valeur vient du constructeur, d’un calcul ou d’une saisie ultérieure.

Ces exemples illustrent :

- l’usage de différentes unités (on autorise même une unité différente du catalogue, par exemple l/min vs m3/h) ;
- la présence de champs _NULL_ quand une valeur est non encore connue (financement du « taux d’information » plus tard) ;
- des valeurs textuelles (ex. type d’énergie) et booléennes.
- Des valeurs calculées ou vérifiées (indiquées `origine = 'CALCULEE'`).

Ce seeder sert à « booster » la base avec des cas réalistes pour tester le moteur de calcul et les écrans de saisie.

|code_caractéristique|role|désignation|valeur|unité|origine|structure_type|structure_id|
|---|---|---|---|---|---|---|---|
|PUISSANCE_NOMINALE|P_NOM|Puissance nominale|11.00000000|kW|CONSTRUCTEUR|Equipement|1|
|TENSION_ALIM|U|Tension d’alimentation|400.00000000|V|CONSTRUCTEUR|Equipement|1|
|INTENSITE_NOMINALE|I|Intensité nominale|21.30000000|A|CONSTRUCTEUR|Equipement|1|
|RENDEMENT_MOTEUR|REN|Rendement du moteur|92.00000000||CALCULEE|Equipement|1|
|DATE_MISE_EN_SERVICE|DATE_ME|Date de mise en service|2015-06-15||CONSTRUCTEUR|Equipement|1|
|DEBIT_NOMINAL_POMPE|Q_NOM|Débit nominal|120.00000000|m3_h|CONSTRUCTEUR|Equipement|2|
|PRESSION_NOMINALE_POMPE|P_NOM|Pression nominale|8.00000000|bar|CONSTRUCTEUR|Equipement|2|
|TEMPERATURE_MAX_POMPE|T_MAX|Température maximale autorisée|120.00000000|degC|CONSTRUCTEUR|Equipement|2|
|DATE_INSTALLATION|DATE_INS|Date d’installation|NULL||SAISIE|Equipement|2|
|SURFACE_ECHANGEUR|SUR|Surface d’échange|15.00000000|m2|CONSTRUCTEUR|Equipement|3|
|PUISSANCE_THERMIQUE|P_TH|Puissance thermique nominale|50.00000000|kW|CONSTRUCTEUR|Equipement|3|
|FLUIDE_PRIMAIRE|FLU_PR|Fluide primaire|Eau chaude||CONSTRUCTEUR|Equipement|3|
|PRESSION_MAXI_EXCH|P_MAXI|Pression maximale|6.00000000|bar|CONSTRUCTEUR|Equipement|3|
|RENDEMENT_ECHANGEUR|REN_EX|Rendement de l’échangeur|84.00000000||CALCULEE|Equipement|3|
|PUISSANCE_NOMINALE_CHAU|P_NOM|Puissance nominale|200.00000000|kW|CONSTRUCTEUR|Equipement|4|
|PRESSION_MAXI_CHAUDIERE|P_MAXI|Pression maximale chaudière|6.00000000|bar|CONSTRUCTEUR|Equipement|4|
|TEMP_MAX_CHAUDIERE|T_MAX|Température maximale chaudière|120.00000000|degC|CONSTRUCTEUR|Equipement|4|
|RENDEMENT_CHAUDIERE|REN|Rendement (circuit chauffage)|90.00000000||CONSTRUCTEUR|Equipement|4|
|TYPE_ENERGIE|ENR|Type d’énergie|Électricité||CONSTRUCTEUR|Equipement|4|
|DEBIT_AIR_FAN|Q_AIR|Débit d’air nominal|5000.00000000|m3_h|CONSTRUCTEUR|Equipement|5|
|PRESSION_STATIQUE|P_STAT|Pression statique nominale|150.00000000|Pa|CONSTRUCTEUR|Equipement|5|
|VITESSE_VENTILATEUR|RPM|Vitesse nominale|1440.00000000|TR_MIN|CONSTRUCTEUR|Equipement|5|
|INCLINAISON_PAR_DFT|INCL|Inclinaison par défaut|false||CONSTRUCTEUR|Equipement|5|

**Diagramme relationnel (Mermaid)** – Relations entre les tables :

mermaid

Copier

```
graph LR
    C[Caractéristiques] --> O(Objet_caractéristiques)
    U[Unités] --> O
    S[Structure (équipements, etc.)] --> O
```

## Seeder SQL détaillé

sql

Copier

```sql
/******************************************************************************
 * Seeder : 009_objet_caracteristiques
 * Objet : Données de référence des caractéristiques techniques
 * Domaine : Référentiel technique
 *
 * Ce seeder insère des valeurs de référence constructeur ou calculées
 * pour divers équipements courants. Chaque INSERT utilise un SELECT
 * sur les tables `caracteristiques` et `unites` pour respecter les FK.
 ******************************************************************************/

-- Moteur électrique (structure_type='Equipement', structure_id=1)
INSERT INTO objet_caracteristiques
    (structure_type, structure_id, caracteristique_id, role, designation, unite_id, valeur_decimal, valeur_texte, valeur_booleen, valeur_date, origine, commentaire)
SELECT
    'Equipement', 1, c.id, 'P_NOM', 'Puissance nominale', u.id, 11.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Puissance nominale du moteur indiquée sur la plaque'
FROM caracteristiques c, unites u
WHERE c.code = 'PUISSANCE_NOMINALE'
  AND u.code = 'kW';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 1, c.id, 'U', 'Tension d’alimentation', u.id, 400.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Tension nominale triphasée à 400 V'
FROM caracteristiques c, unites u
WHERE c.code = 'TENSION_ALIMENTATION'
  AND u.code = 'V';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 1, c.id, 'I', 'Intensité nominale', u.id, 21.30000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Intensité nominale 21,3 A mesurée à pleine charge'
FROM caracteristiques c, unites u
WHERE c.code = 'INTENSITE_NOMINALE'
  AND u.code = 'A';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 1, c.id, 'REN', 'Rendement du moteur', NULL, 92.00000000, NULL, NULL, NULL,
    'CALCULEE', 'Rendement calculé par le fabricant (92 %)'
FROM caracteristiques c
WHERE c.code = 'RENDEMENT_MOTEUR';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 1, c.id, 'DATE_MEI', 'Date de mise en service', NULL, NULL, NULL, NULL, '2015-06-15',
    'CONSTRUCTEUR', 'Date mentionnée sur la documentation constructeur'
FROM caracteristiques c
WHERE c.code = 'DATE_MISE_EN_SERVICE';

-- Pompe centrifuge (structure_type='Equipement', structure_id=2)
INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 2, c.id, 'Q_NOM', 'Débit nominal', u.id, 120.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Débit nominal en eau à 20 °C'
FROM caracteristiques c, unites u
WHERE c.code = 'DEBIT_NOMINAL'
  AND u.code = 'm3_h';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 2, c.id, 'P_NOM', 'Pression nominale', u.id, 8.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Pression de refoulement nominale'
FROM caracteristiques c, unites u
WHERE c.code = 'PRESSION_NOMINALE'
  AND u.code = 'bar';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 2, c.id, 'T_MAX', 'Température maximale autorisée', u.id, 120.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Température max. du fluide (°C)'
FROM caracteristiques c, unites u
WHERE c.code = 'TEMPERATURE_MAX'
  AND u.code = 'degC';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 2, c.id, 'DATE_INS', 'Date d'installation', NULL, NULL, NULL, NULL, NULL,
    'SAISIE', 'Ajoutée ultérieurement après installation'
FROM caracteristiques c
WHERE c.code = 'DATE_INSTALLATION';

-- Échangeur de chaleur (structure_type='Equipement', structure_id=3)
INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 3, c.id, 'SUR', 'Surface d’échange', u.id, 15.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Surface de transfert thermique en m²'
FROM caracteristiques c, unites u
WHERE c.code = 'SURFACE_ECHANGEUR'
  AND u.code = 'm2';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 3, c.id, 'P_TH', 'Puissance thermique nominale', u.id, 50.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Puissance de chauffage nominale à ∆T standard'
FROM caracteristiques c, unites u
WHERE c.code = 'PUISSANCE_THERMIQUE'
  AND u.code = 'kW';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 3, c.id, 'FLU_PR', 'Fluide primaire', NULL, NULL, 'Eau chaude', NULL, NULL,
    'CONSTRUCTEUR', 'Fluide entrant dans le circuit primaire'
FROM caracteristiques c
WHERE c.code = 'FLUIDE_PRIMAIRE';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 3, c.id, 'P_MAXI', 'Pression maximale', u.id, 6.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Pression maximale admissible (côté primaire et secondaire identique)'
FROM caracteristiques c, unites u
WHERE c.code = 'PRESSION_MAXI'
  AND u.code = 'bar';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 3, c.id, 'REN_EX', 'Rendement de l’échangeur', NULL, 84.00000000, NULL, NULL, NULL,
    'CALCULEE', 'Rendement théorique (exemple calculé)'
FROM caracteristiques c
WHERE c.code = 'RENDEMENT_ECHANGEUR';

-- Chaudière (structure_type='Equipement', structure_id=4)
INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 4, c.id, 'P_NOM', 'Puissance nominale', u.id, 200.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Puissance maximale de la chaudière'
FROM caracteristiques c, unites u
WHERE c.code = 'PUISSANCE_NOMINALE'
  AND u.code = 'kW';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 4, c.id, 'P_MAXI', 'Pression maximale chaudière', u.id, 6.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Pression max. admissible du circuit chaudière'
FROM caracteristiques c, unites u
WHERE c.code = 'PRESSION_MAXI'
  AND u.code = 'bar';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 4, c.id, 'T_MAX', 'Température maximale chaudière', u.id, 120.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Température max. admissible du circuit'
FROM caracteristiques c, unites u
WHERE c.code = 'TEMPERATURE_MAX'
  AND u.code = 'degC';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 4, c.id, 'REN', 'Rendement (circuit chauffage)', NULL, 90.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Rendement nominal indiqué (90 %)'
FROM caracteristiques c
WHERE c.code = 'RENDEMENT_CHAUDIERE';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 4, c.id, 'ENR', 'Type d’énergie', NULL, NULL, 'Électricité', NULL, NULL,
    'CONSTRUCTEUR', 'Chaudière électrique dans cet exemple'
FROM caracteristiques c
WHERE c.code = 'TYPE_ENERGIE';

-- Ventilateur (structure_type='Equipement', structure_id=5)
INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 5, c.id, 'Q_AIR', 'Débit d’air nominal', u.id, 5000.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Débit maximal à l’entrée du ventilateur'
FROM caracteristiques c, unites u
WHERE c.code = 'DEBIT_AIR'
  AND u.code = 'm3_h';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 5, c.id, 'P_STAT', 'Pression statique nominale', u.id, 150.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Pression statique générée au débit nominal'
FROM caracteristiques c, unites u
WHERE c.code = 'PRESSION_STATIQUE'
  AND u.code = 'Pa';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 5, c.id, 'RPM', 'Vitesse nominale', u.id, 1440.00000000, NULL, NULL, NULL,
    'CONSTRUCTEUR', 'Vitesse de rotation en tr/min'
FROM caracteristiques c, unites u
WHERE c.code = 'VITESSE_NOMINALE'
  AND u.code = 'Tr_min';

INSERT INTO objet_caracteristiques
SELECT
    'Equipement', 5, c.id, 'INCL', 'Inclinaison par défaut', NULL, NULL, 'false', NULL, NULL,
    'CONSTRUCTEUR', 'Position fixe installée sur site'
FROM caracteristiques c
WHERE c.code = 'INCLINAISON_PAR_DEFAUT';
```

_Remarques administratives :_ ce seeder utilise des codes fictifs de caractéristiques et d’unités (à adapter selon votre référentiel réel). Assurez-vous que les codes utilisés dans le `WHERE c.code = ...` existent dans vos tables `caracteristiques` et `unites`. Les `structure_id` sont des exemples. Adaptez `structure_type`/`structure_id` à vos équipements réels.
