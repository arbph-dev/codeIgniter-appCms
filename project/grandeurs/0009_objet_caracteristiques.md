**`009_objet_caracteristiques` n'est pas une table de mesures, c'est une table de spécifications techniques**.

Je formaliserais donc les décisions suivantes.

---

# D-009-001 — Valeurs de référence constructeur

`objet_caracteristiques` ne contient **jamais** des mesures d'exploitation.

Elle contient uniquement :

- les caractéristiques constructeur ;
- les valeurs de référence ;
- les valeurs calculées à partir des données constructeur.

Exemples :

- Puissance utile : 7,5 kW
- Tension : 400 V
- Intensité : 15,2 A
- Rendement calculé : 91 %
- Temps maximal d'amorçage : 15 min

Les mesures réelles appartiendront à un futur module (`historique_mesures`, `relevés`, `supervision`, etc.).

---

# D-009-002 — Les caractéristiques calculées sont autorisées

C'est une excellente décision.

Prenons ton exemple :

Plaque constructeur :

```
Pu = 7,5 kWU  = 400 VI  = 15 A
```

Le système peut calculer automatiquement :

```
Pa = U × I × √3 × cosφη = Pu / Pa
```

Ces résultats deviennent eux aussi des **caractéristiques de référence**.

Elles ne sont pas des mesures.

Elles enrichissent la connaissance de l'équipement.

Je trouve cette approche très élégante.

---

# D-009-003 — Le rôle devient indispensable

Je proposerais le champ :

```
role VARCHAR(64) NULL
```

Exemples :

|Caractéristique|Rôle|
|---|---|
|Pression|Entrée|
|Pression|Sortie|
|Température|Aller|
|Température|Retour|
|Tension|Alimentation|
|Tension|Commande|
|Débit|Nominal|
|Débit|Maximum|

Ainsi, une même caractéristique peut être utilisée plusieurs fois sur un même équipement, sans créer plusieurs définitions dans le catalogue.

---

# D-009-004 — Une valeur polymorphe

Tu confirmes un point que je pressentais.

Toutes les caractéristiques ne sont pas numériques.

Je proposerais donc une structure inspirée des modèles de métadonnées, avec **une seule colonne renseignée selon le type**.

|Colonne|Usage|
|---|---|
|`valeur_decimal`|Grandeurs physiques|
|`valeur_texte`|IP55, Classe F|
|`valeur_booleen`|Oui / Non|
|`valeur_date`|Date constructeur|

C'est simple à exploiter et cela évite de multiplier les tables.

---

# D-009-005 — `structure_type` / `structure_id`

Je préfère également cette terminologie.

`structure` est plus large qu'`objet`.

On pourra viser :

- équipement ;
- sous-équipement ;
- composant ;
- local ;
- bâtiment ;
- installation ;
- réseau.

Sans changer le modèle.

---

# Une évolution qui me paraît très intéressante

En lisant ton exemple de la pompe, j'ai réalisé qu'il manque peut-être une information.

Prenons :

```
Temps d'amorçage = 15 min
```

Cette valeur n'est pas seulement une référence.

C'est aussi une **limite**.

De même :

```
Température maximale = 80°CPression maximale = 10 barIntensité nominale = 15 AIntensité maximale = 18 A
```

Je me demande si `caracteristiques` ne devrait pas intégrer une **nature** ou un **usage**.

Par exemple :

|Nature|Exemple|
|---|---|
|NOMINALE|Débit nominal|
|MINIMALE|Pression minimale|
|MAXIMALE|Température maximale|
|CONSIGNE|Température de consigne|
|CALCULEE|Rendement|
|CONSTRUCTEUR|Puissance utile|

Je ne créerais pas de table supplémentaire. Un simple `VARCHAR(32)` suffirait.

Cela rendrait le catalogue beaucoup plus expressif et faciliterait, plus tard, les comparaisons avec les mesures.

---

## Une dernière réflexion

Ton exemple de la pompe confirme une intuition que j'avais depuis quelques migrations :

Le module que nous construisons n'est pas seulement un référentiel d'unités ou de formules. Il devient progressivement un **référentiel technique** sur lequel pourront s'appuyer :

- la GMAO ;
- les procédures de maintenance ;
- les campagnes de mesures ;
- les diagnostics ;
- les calculs de performance ;
- les tableaux de bord.

C'est une orientation que je trouve très saine. Chaque table que nous avons conçue (`dimensions`, `unites`, `grandeurs_physiques`, `constantes`, `formules_physiques`, `caracteristiques`) reste générique et réutilisable, tandis que `objet_caracteristiques` fait le lien avec les équipements réels. Cette séparation entre **connaissance technique** et **données d'exploitation** me paraît être l'un des points forts de l'architecture que nous sommes en train de construire.




1. Une caractéristique est-elle toujours issue du catalogue ?
Oui

2. Une valeur est-elle obligatoire ?
Non, Null est autorisé.

Je crée un equipement pompe. Je sais qu'il existe mais je n'ai rien, pas de doc pas de fiche equipement 
je ne peux pas saisir,par contre on gerera le "taux d'information" dans la vue de l'équipements

certaines valeurs comme le courant doivent être saisis mais pas immédiatmeent, cela implique que la presonne connait la valeur a régler sur le thermique.
Un OT suivi pompe , pourra générer des BT 
- compléter la gmao (fonction des informations "nécessaires" et du "taux d'informations" )
- relever le réglage du disjoncteur moteur


### notion de "taux d'information"
Nous savons que cette information est importante, mais elle n'est pas encore connue.

C'est très différent.
Du coup, je ne calculerais pas le taux d'information dans la table.
Je le calculerais dans une vue SQL ou un service.

Par exemple :
Nombre de caractéristiques obligatoires
/
Nombre de caractéristiques renseignées

On obtient : Pompe P001 72 % ou 98 %

C'est une idée pour piloter la qualité du référentiel.

---

3.oui on peut imaginer que les gens puissent créer des unités
MAIS
on a une table préférence qui invitera a saisir dans l'unité préféré et convertira, au besoin, la saisie dans l'unité préféré
la création des unité est réserver a l'administation

4. Role
Attention tu prends un echangeur on a 
Pression entrée fluide chaud
Pression entrée fluide froid
Température entrée fluide chaud
Température entrée fluide froid

5 Pas de reclacul auto , ok


6 et 7 
oui c'est utile en cas de doute ou de litige avec des clients

8 champ référence
redondant avec origine 


---

## il faut distinguer le sens métier et le sens fonctionnel.

Prenons un échangeur.

Caractéristique	Désignation
Température	Entrée fluide chaud
Température	Sortie fluide chaud
Température	Entrée fluide froid
Température	Sortie fluide froid

Visuellement, désignation est parfaite.

Mais maintenant regardons le calcul.

ΔT chaud = Tentrée chaud - Tsortie chaud

ΔT froid = Tsortie froid - Tentrée froid

Le moteur de calcul ne comprend pas "Entrée fluide chaud".

Il a besoin de savoir que cette valeur correspond à une variable de la formule.

Autrement dit, il existe deux niveaux :

Niveau	Exemple
Métier (humain)	Entrée fluide chaud
Fonctionnel (calcul)	TH_IN

Voilà pourquoi je garderais finalement les deux.

Je proposerais
designation VARCHAR(128)

Visible par les utilisateurs.

Exemples :

Entrée fluide chaud
Sortie fluide chaud
Tension de commande
Tension alimentation
Aspiration
Refoulement

Et

role VARCHAR(64)

Technique.

Exemples :

TH_IN
TH_OUT
TC_IN
TC_OUT
U
I
P
Q
DT

Le moteur de calcul ne travaille que sur role.

Les utilisateurs ne voient que designation.

Cela résout aussi un autre problème

Deux clients peuvent employer des termes différents.

L'un dira :

Entrée primaire

L'autre :

Circuit chaud entrée

Mais les deux auront :

role = TH_IN

Le moteur ne change jamais.

Pour les échangeurs

Ton objectif est très clair.

À partir des caractéristiques constructeur :

Débit chaud

Débit froid

Température entrée

Température sortie

et des mesures :

Température entrée réelle

Température sortie réelle

on pourra calculer :

ΔT ;
puissance thermique ;
rendement ;
efficacité de l'échangeur ;
encrassement probable.

Et cela sans modifier le référentiel.

Je trouve que c'est une excellente validation de notre modèle.

---

Je crois que je comprends maintenant où tu veux aller

Au début, je pensais que nous construisions une GMAO enrichie.

En réalité, nous construisons un référentiel technique orienté diagnostic.

Les caractéristiques constructeur ne servent pas seulement à documenter les équipements.

Elles deviennent la base de comparaison entre :

ce que la machine devrait faire (référence constructeur) ;
ce qu'elle fait réellement (mesures) ;
ce que le moteur calcule (indicateurs).

C'est une approche très proche de la maintenance conditionnelle, sans imposer d'emblée une architecture complexe.

À mon sens, cela justifie pleinement d'avoir :

designation : le libellé métier, destiné aux utilisateurs et aux documents ;
role : l'identifiant technique stable, destiné au moteur de calcul et aux règles métier.

Les deux ne sont pas redondants : ils répondent à deux besoins différents. Et cette séparation rendra les formules, les comparaisons et les futurs diagnostics beaucoup plus robustes. C'est une évolution que je recommanderais d'intégrer dès la première version de 009_objet_caracteristiques.


# Migrations
```sql
/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Migration      : 009
 * Objet          : objet_caracteristiques
 * Domaine        : Référentiel technique
 * Version        : 1.0.0
 * Compatibilité  : MySQL 8.x
 *
 * ----------------------------------------------------------------------------
 * Description
 * ----------------------------------------------------------------------------
 *
 * Associe des caractéristiques techniques aux structures métier
 * (équipements, composants, bâtiments, installations, etc.).
 *
 * Cette table stocke exclusivement les valeurs de référence :
 *  - constructeur
 *  - calculées
 *  - importées
 *  - saisies
 *
 * Elle ne stocke jamais des mesures d'exploitation.
 *
 ******************************************************************************/

DROP TABLE IF EXISTS objet_caracteristiques;

CREATE TABLE objet_caracteristiques
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Identifiant technique',

    structure_type VARCHAR(64) NOT NULL
        COMMENT 'Type de structure (Equipement, Composant, Local...)',

    structure_id BIGINT UNSIGNED NOT NULL
        COMMENT 'Identifiant de la structure',

    caracteristique_id BIGINT UNSIGNED NOT NULL
        COMMENT 'Caractéristique du catalogue',

    role VARCHAR(64) NULL
        COMMENT 'Identifiant technique utilisé par le moteur de calcul (U, I, TH_IN...)',

    designation VARCHAR(128) NULL
        COMMENT 'Libellé métier (Entrée fluide chaud, Tension commande...)',

    unite_id BIGINT UNSIGNED NULL
        COMMENT 'Unité réellement utilisée',

    valeur_decimal DECIMAL(24,8) NULL
        COMMENT 'Valeur numérique',

    valeur_texte VARCHAR(255) NULL
        COMMENT 'Valeur texte',

    valeur_booleen TINYINT(1) NULL
        COMMENT 'Valeur booléenne',

    valeur_date DATE NULL
        COMMENT 'Valeur date',

    origine VARCHAR(32) NOT NULL DEFAULT 'CONSTRUCTEUR'
        COMMENT 'CONSTRUCTEUR, CALCULEE, IMPORT, SAISIE',

    commentaire TEXT NULL
        COMMENT 'Commentaires ou justification',

    created_at DATETIME NULL,

    updated_at DATETIME NULL,

    deleted_at DATETIME NULL,

    CONSTRAINT pk_objet_caracteristiques
        PRIMARY KEY (id),

    CONSTRAINT fk_objet_caracteristiques__caracteristique
        FOREIGN KEY (caracteristique_id)
        REFERENCES caracteristiques(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_objet_caracteristiques__unite
        FOREIGN KEY (unite_id)
        REFERENCES unites(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT ck_objet_caracteristiques__origine
        CHECK (
            origine IN (
                'CONSTRUCTEUR',
                'CALCULEE',
                'IMPORT',
                'SAISIE'
            )
        )

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Valeurs de référence des caractéristiques techniques';
```

## Index
```sql
CREATE INDEX idx_objet_caracteristiques__structure
ON objet_caracteristiques
(
    structure_type,
    structure_id
);

CREATE INDEX idx_objet_caracteristiques__caracteristique
ON objet_caracteristiques
(
    caracteristique_id
);

CREATE INDEX idx_objet_caracteristiques__role
ON objet_caracteristiques
(
    role
);

CREATE INDEX idx_objet_caracteristiques__designation
ON objet_caracteristiques
(
    designation
);

CREATE INDEX idx_objet_caracteristiques__origine
ON objet_caracteristiques
(
    origine
);
```
Une évolution que je proposerais immédiatement

Je remplacerais la clé unique que j'avais imaginée par une plus complète.
```sql
UNIQUE
(
    structure_type,
    structure_id,
    caracteristique_id,
    role,
    designation
)
```

---
# seeder

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



