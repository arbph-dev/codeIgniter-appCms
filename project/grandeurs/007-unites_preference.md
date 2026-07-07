Résumé des décisions clés
Objectif – La table unites_preferences stockera l’unité d’affichage préférée en fonction du contexte (global SI, contexte technique, client, projet, utilisateur, etc.) et du niveau de mesure (dimension ou grandeur). Elle vient compléter le référentiel métrologique existant (tables dimensions, unites, grandeurs_physiques, etc.).

Unité interne cohérente – En interne les données mesurées restent stockées dans une unité de référence fixe (p.ex. unité SI ou technique de base). La conversion vers l’unité préférée s’effectue à l’affichage selon la préférence de l’utilisateur ou du contexte (principe « conversion au besoin »).

Codification standardisée – Les unités utiliseront des codes normalisés (p.ex. codes UCUM) pour éviter les ambiguïtés. UCUM «fournit un système de codage unique pour les unités, complet et sans aucune ambiguïté». Le référentiel unites du CMS pourra donc exploiter de tels codes pour garantir l’univocité des symboles d’unité.

Hiérarchie et héritage – Les préférences sont hiérarchisées : on cherchera d’abord une préférence utilisateur, puis projet, local, régional, client, technique, et enfin le contexte global SI par défaut (cf. diagramme). Cette succession permet de définir un comportement d’override : une préférence plus spécifique (utilisateur) masque la préférence plus générale (client ou technique).

Contraintes et intégrité – Les clés étrangères garantissent la cohérence : dimension_id référence dimensions, grandeur_physique_id référence grandeurs_physiques, unite_id référence unites, etc. On impose qu’exactement l’un de dimension_id ou grandeur_physique_id soit renseigné (contrainte CHECK) pour désigner la portée de la préférence. Une contrainte UNIQUE sur le triplet (contexte, dimension/grandeur, scope) assure qu’il n’existe qu’une préférence par contexte et niveau.

Requêtes d’exemple – Pour déterminer l’unité effective d’un utilisateur donné, on interrogera unites_preferences en filtrant sur les champs de contexte (par ex. utilisateur_id, puis projet_id, etc.) et en triant par ordre de priorité. Par exemple :

sql
Copier
SELECT up.unite_id
FROM unites_preferences AS up
WHERE (up.contexte = 'UTILISATEUR' AND up.utilisateur_id = @UserId)
   OR (up.contexte = 'PROJET'     AND up.projet_id     = @ProjetId)
   OR (up.contexte = 'CLIENT'     AND up.client_id     = @ClientId)
   OR up.contexte IN ('LOCAL','REGIONAL','TECHNIQUE','SI')
  AND (up.dimension_id = @dimId OR up.grandeur_physique_id = @grandId)
ORDER BY FIELD(up.contexte,
              'UTILISATEUR','PROJET','LOCAL','REGIONAL','CLIENT','TECHNIQUE','SI')
LIMIT 1;
Cette requête renvoie l’ID de l’unité correspondant à la première préférence trouvée selon la priorité (utilisateur > projet > local > … > SI).

Jeu de données initial (seeder) – On préremplira des cas usuels. Par exemple, pour la dimension Longueur le système SI par défaut sera le mètre, et la préférence «technique» pourra être le millimètre. On donnera aussi un exemple d’override utilisateur. Exemples de lignes de seed :

Contexte	Dimension / Grandeur	Unité préférée	Commentaire
SI	LENGTH	MÈTRE (METER)	Unité par défaut SI pour la longueur
TECHNIQUE	LENGTH	MILLIMÈTRE	Contexte technique (ex. plan technique)
TECHNIQUE	TEMPERATURE	°C (DEGREE_CELSIUS)	Contexte technique pour température
TECHNIQUE	POWER (grandeur)	kW (KILOWATT)	Puissance – contexte technique
UTILISATEUR	LENGTH	CENTIMÈTRE	Préférence d’un utilisateur (exemple)

Tests de cohérence – Le système devra vérifier qu’on ne crée pas deux préférences contradictoires (même contexte et même grandeur) et que les valeurs référencées existent. Les migrations sont ordonnées de telle sorte que dimensions, grandeurs_physiques, et unites sont créés AVANT unites_preferences, pour éviter de référencer des clés inexistantes.

Sources – Ce design s’inspire des bonnes pratiques (unités SI / UCUM pour codage) et de recommandations de modélisation («stockez les données dans une unité interne cohérente et convertissez selon la préférence utilisateur»). L’idée d’une «unité de base» par type de grandeur (comme dans IBM TRIRIGA) explique qu’on stocke en interne une unité de référence, distincte des préférences d’affichage.

Exigences et cas d’usage
Personnalisation – Chaque utilisateur ou organisation peut souhaiter voir les valeurs dans ses unités habituelles. Par exemple, un technicien peut préférer mm pour longueur tandis qu’un client final utilise m. La table unites_preferences doit permettre de stocker ces choix.
Multiples niveaux de contexte – Les préférences peuvent s’appliquer globalement (SI ou Technique), au niveau d’un client/entreprise, d’un projet particulier, d’une localisation géographique (site local ou régional), ou d’un utilisateur spécifique. Cette hiérarchie doit être modélisée pour supporter la notion d’héritage de préférences.
Unité par dimension ou grandeur – Pour certaines mesures (ex : vitesse, densité), on se réfère à la dimension physique (ex : longueur, masse, etc.), tandis que pour d’autres (ex : puissance, rendement) on se réfère à une grandeur spécifique. Il faut donc laisser le choix de lier la préférence soit à une dimension (champ dimension_id), soit à une grandeur_physique (champ grandeur_physique_id).
Consistance interne – Les valeurs stockées doivent être dans une unité interne unique (p.ex. l’unité SI de base), puis converties pour l’affichage. Cela simplifie les requêtes statistiques/agrégations (tout est dans la même unité stockée) et ne requiert la conversion que dans la couche métier ou présentation.
Normes d’unités – On s’appuiera sur les nomenclatures officielles. Par exemple, le Système International d’unités (ISO 80000) et le code UCUM fournissent des symboles standard. UCUM garantit un codage univoque : «système de codage complet et sans ambiguïté». Le CMS pourra utiliser ces références pour peupler la table unites.
Performances et échelle – Les préférences peuvent être rares (quelques dizaines de lignes) et lues fréquemment pour l’affichage. Des index sur les champs de contexte et dimension/grandeur sont prévus pour accélérer les recherches. Les contraintes uniques/clé étrangère garantissent l’intégrité sans surcoût de requêtage majeur.
Migration ordonnée – La migration des préférences sera placée après la création des autres référentiels (dimensions, unités, grandeurs) pour que les clés existent. Ceci assure la compatibilité ascendante (si jamais on ajoute un contexte, on pourra l’insérer sans modifier le schéma).
Fallback – En l’absence de préférence explicite à un niveau, on «tombe» sur le niveau global suivant (cf. diagramme ci-dessous). En particulier, si même le contexte «Technique» n’a pas d’entrée, on considère implicitement l’unité de base SI de la dimension (stockée en table dimensions). Par exemple, si aucune ligne SI ni TECHNIQUE n’existe, on utilisera l’unité par défaut du référentiel (idéalement celle marquée comme «SI» dans dimensions ou le système).
Modèle relationnel de unites_preferences
sql
Copier
/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Migration      : 007
 * Objet          : unites_preferences
 * Domaine        : Métrologie
 * Version        : 1.0.0
 * Compatibilité  : MySQL 8.x
 *
 * ----------------------------------------------------------------------------
 * Description
 * ----------------------------------------------------------------------------
 *
 * Référentiel des unités d'affichage préférées, selon un contexte et une mesure.
 *
 * - `contexte` : string identifiant le type de contexte (SI, TECHNIQUE, CLIENT, PROJET, LOCAL, REGIONAL, UTILISATEUR, ...).
 * - `utilisateur_id`, `client_id`, `projet_id` : références facultatives indiquant l'entité cible du contexte.
 * - On précise soit `dimension_id`, soit `grandeur_physique_id` (exactement l'un des deux).
 * - `unite_id` : unité choisie pour ce contexte.
 * - `ordre_affichage` (priorité) et `actif` pour filtrer les préférences valides.
 *
 ******************************************************************************/

DROP TABLE IF EXISTS unites_preferences;

CREATE TABLE unites_preferences
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Identifiant unique de la preference',

    contexte VARCHAR(20) NOT NULL
        COMMENT 'Type de contexte (ex: SI, TECHNIQUE, CLIENT, PROJET, LOCAL, REGIONAL, UTILISATEUR, etc.)',

    utilisateur_id BIGINT UNSIGNED NULL
        COMMENT 'Si contexte = UTILISATEUR, l\'ID de l\'utilisateur cible',

    client_id BIGINT UNSIGNED NULL
        COMMENT 'Si contexte = CLIENT, l\'ID du client/entreprise',

    projet_id BIGINT UNSIGNED NULL
        COMMENT 'Si contexte = PROJET, l\'ID du projet concerné',

    dimension_id BIGINT UNSIGNED NULL
        COMMENT 'Référence à la dimension physique (ex: LENGTH, TEMPERATURE, ...)',

    grandeur_physique_id BIGINT UNSIGNED NULL
        COMMENT 'Référence à la grandeur physique (ex: FLOW, POWER, ...)',

    unite_id BIGINT UNSIGNED NOT NULL
        COMMENT 'Référence à l\'unité de mesure affichée',

    ordre_affichage SMALLINT UNSIGNED NOT NULL DEFAULT 100
        COMMENT 'Priorité d\'affichage (1 = plus prioritaire)',

    actif TINYINT(1) NOT NULL DEFAULT 1
        COMMENT '1 = préférence active',

    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,

    -- Clés et contraintes
    CONSTRAINT pk_unites_preferences
        PRIMARY KEY (id),

    CONSTRAINT uk_unites_preferences__unique_scope
        UNIQUE (
            contexte,
            utilisateur_id,
            client_id,
            projet_id,
            dimension_id,
            grandeur_physique_id
        ),

    -- Au moins l'un de dimension_id ou grandeur_physique_id doit être renseigné
    CONSTRAINT chk_unites_preferences__xor
        CHECK (
             (dimension_id IS NOT NULL AND grandeur_physique_id IS NULL)
          OR (dimension_id IS NULL AND grandeur_physique_id IS NOT NULL)
        ),

    CONSTRAINT fk_unites_preferences__dimension
        FOREIGN KEY (dimension_id)
        REFERENCES dimensions(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_unites_preferences__grandeur
        FOREIGN KEY (grandeur_physique_id)
        REFERENCES grandeurs_physiques(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_unites_preferences__unite
        FOREIGN KEY (unite_id)
        REFERENCES unites(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_unites_preferences__utilisateur
        FOREIGN KEY (utilisateur_id)
        REFERENCES utilisateurs(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_unites_preferences__client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_unites_preferences__projet
        FOREIGN KEY (projet_id)
        REFERENCES projets(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Référentiel des unités préférées selon le contexte';

/******************************************************************************
 * Index
 ******************************************************************************/

CREATE INDEX idx_unites_pref__contexte
ON unites_preferences(contexte);

CREATE INDEX idx_unites_pref__utilisateur
ON unites_preferences(utilisateur_id);

CREATE INDEX idx_unites_pref__client
ON unites_preferences(client_id);

CREATE INDEX idx_unites_pref__projet
ON unites_preferences(projet_id);

CREATE INDEX idx_unites_pref__dimension
ON unites_preferences(dimension_id);

CREATE INDEX idx_unites_pref__grandeur
ON unites_preferences(grandeur_physique_id);

CREATE INDEX idx_unites_pref__actif
ON unites_preferences(actif);
Commentaires de conception – Nous avons opté pour un schéma normalisé avec FK et UNIQUE pour garantir la cohérence. La contrainte CHECK (XOR) empêche une entrée sans niveau défini. L’indexation multiple (sur contexte, utilisateur_id, etc.) facilite les requêtes rapides par contexte et scope. Le champ actif permet d’invalider temporairement une préférence.

Exemples de données (Seeder)
Voici un script SQL d’initialisation illustrant quelques préférences typiques :

sql
Copier
/******************************************************************************
 * Seeder : 007 - unites_preferences
 * Domaine : Métrologie
 ******************************************************************************/

/* Par défaut SI (utilisé si aucune autre préférence) */
INSERT INTO unites_preferences
(contexte, dimension_id, unite_id, ordre_affichage, actif)
SELECT
    'SI',
    d.id,
    u.id,
    10,
    1
FROM dimensions d
JOIN unites u ON u.code = 'METER'  -- mètre (SI)
WHERE d.code = 'LENGTH';

/* Préférence technique pour la longueur (par exemple sur plans) */
INSERT INTO unites_preferences
(contexte, dimension_id, unite_id, ordre_affichage, actif)
SELECT
    'TECHNIQUE',
    d.id,
    u.id,
    20,
    1
FROM dimensions d
JOIN unites u ON u.code = 'MILLIMETER'  -- millimètre
WHERE d.code = 'LENGTH';

/* Préférence technique pour la température */
INSERT INTO unites_preferences
(contexte, dimension_id, unite_id, ordre_affichage, actif)
SELECT
    'TECHNIQUE',
    d.id,
    u.id,
    30,
    1
FROM dimensions d
JOIN unites u ON u.code = 'DEGREE_CELSIUS'  -- degré Celsius
WHERE d.code = 'TEMPERATURE';

/* Préférence technique pour la puissance (grandeur POWER) */
INSERT INTO unites_preferences
(contexte, grandeur_physique_id, unite_id, ordre_affichage, actif)
SELECT
    'TECHNIQUE',
    gp.id,
    u.id,
    40,
    1
FROM grandeurs_physiques gp
JOIN unites u ON u.code = 'KILOWATT'  -- kilowatt
WHERE gp.code = 'POWER';

/* Préférence spécifique pour un utilisateur (ID = 42) : longueur en cm */
INSERT INTO unites_preferences
(contexte, dimension_id, unite_id, utilisateur_id, ordre_affichage, actif)
SELECT
    'UTILISATEUR',
    d.id,
    u.id,
    42,
    50,
    1
FROM dimensions d
JOIN unites u ON u.code = 'CENTIMETER'  -- centimètre
WHERE d.code = 'LENGTH';
Ces lignes seedent :

SI : Longueur en mètre,
TECHNIQUE : Longueur en millimètre,
TECHNIQUE : Température en °C,
TECHNIQUE : Puissance en kW,
UTILISATEUR (ID 42) : Longueur en centimètre.
Bien sûr, le schéma autorise l’ajout facile d’autres contextes (ex. CLIENT, PROJET, LOCAL, REGIONAL) sans changer la structure.

Requêtes d’exemple
Pour récupérer l’unité affichée selon le contexte, on peut exécuter des requêtes SQL qui jouent sur les colonnes de contexte, et trient par priorité. Par exemple, pour obtenir l’unité effective d’un utilisateur donné pour la grandeur de longueur :

sql
Copier
SELECT u.code AS unite_affichee
FROM unites_preferences up
JOIN unites u ON u.id = up.unite_id
WHERE (up.contexte = 'UTILISATEUR' AND up.utilisateur_id = 42)
   OR (up.contexte = 'PROJET'     AND up.projet_id     = 7)
   OR (up.contexte = 'CLIENT'     AND up.client_id     = 3)
   OR up.contexte IN ('LOCAL','REGIONAL','TECHNIQUE','SI')
  AND (up.dimension_id = (SELECT id FROM dimensions WHERE code = 'LENGTH')
       OR up.grandeur_physique_id = NULL)
ORDER BY FIELD(up.contexte,
               'UTILISATEUR','PROJET','LOCAL','REGIONAL','CLIENT','TECHNIQUE','SI')
LIMIT 1;
Cette requête retourne l’unité (u.code) de la première préférence active trouvée. On notera l’utilisation de FIELD(contexte, ...) pour imposer l’ordre logique. On peut adapter les filtres (up.dimension_id = … OR up.grandeur_physique_id = …) selon qu’on cherche par dimension ou par grandeur. Les résultats seraient :

si l’utilisateur 42 a une préférences sur la longueur (ici centimètre), on obtient CENTIMETER ;
sinon on retombe sur le contexte technique (millimètre), etc.
Comparaison des approches de conception
Choix de conception	Colonnes	Avantages	Inconvénients
Préférence par dimension	dimension_id, pas de grandeur_physique_id	Couvrir rapidement tout type de grandeur (ex. LONGUEUR, MASSE…)<br>Moins de lignes à gérer	Ne permet pas d’affiner la préférence par grandeur spécifique (ex. puissance, densité)<br>Manque de granularité
Préférence par grandeur	grandeur_physique_id, pas de dimension_id	Contrôle fin par grandeur (ex. définitions distinctes pour POWER, TORQUE…)<br>Pas d’approximation dimensionnelle	Beaucoup plus de lignes redondantes (chaque dimension apparait dans plusieurs grandeurs)<br>Complexité accrue
Mixte (dimension ou grandeur)	dimension_id et grandeur_physique_id (contraintères en XOR)	Flexibilité : préférences globales (dimension) ou spécifiques (grandeur)<br>Évolutif	Gestion plus complexe (vérifier qu’un seul champ est rempli)<br>Impossible d’avoir deux préférences «semblables» (XOR empêche deux entrées identiques)
Contexte monotype	contexte_type, object_id (concept polymorphe unique)	Très extensible (tout contexte possible)<br>Peu de colonnes indexées	Pas de contrainte FK, complexité applicative pour interpréter<br>Moins lisible dans SQL classique
Contexte multi-colonnes	Champs séparés : utilisateur_id, client_id, projet_id, etc.	Référentiel strict (FK possibles)<br>Clair et normalisé (une table, plusieurs colonnes)	Nouvelles colonnes si nouveaux types de contexte<br>Nullité étendue (plusieurs champs vides)

Note : Nous avons choisi l’approche mixte (XOR) pour pouvoir gérer les deux cas (par dimension ou par grandeur) dans une seule table, et le modèle multi-colonnes pour les contextes (facilitant les FK). Les tableaux ci-dessus illustrent les compromis : par exemple, un modèle uniquement “contexte générique” (type/id) est souple mais compliqué à contraindre au niveau SQL, alors que plusieurs colonnes dédiées restent simples à valider.

Diagramme de résolution des préférences
Le diagramme suivant illustre l’algorithme de résolution d’une unité préférée. On recherche d’abord une entrée pour l’utilisateur, puis on remonte la chaîne des contextes :

Oui

Non

Oui

Non

Oui

Non

Oui

Non

Oui

Non

Préférence UTILISATEUR?

Utiliser l'unité de l'utilisateur

Préférence PROJET?

Utiliser l'unité du projet

Préférence LOCAL/SITE?

Utiliser l'unité du site local

Préférence RÉGIONALE?

Utiliser l'unité de la région

Préférence CLIENT?

Utiliser l'unité du client

Contexte TECHNIQUE par défaut

Utiliser l'unité technique globale

(Si rien d'autre, utiliser l'unité SI interne)



Afficher le code
En pratique, les contextes LOCAL et RÉGIONAL dépendent de l’organisation (ex. site de chantier ou zone géographique) et peuvent être placés selon le besoin entre client et projet. Ce graphe montre un ordre de priorité possible :

powershell
Copier
UTILISATEUR → PROJET → LOCAL → RÉGIONAL → CLIENT → TECHNIQUE → SI
Ainsi, une préférence utilisateur prévaudra toujours sur une préférence plus globale (client ou technique). Si aucune entrée n’est trouvée à tous ces niveaux, on tombe sur l’unité SI par défaut associée à la dimension (implémentée via la ligne SI ou la valeur de base dans la table dimensions).

Conclusion
La table unites_preferences définit un socle flexible pour la personnalisation d’unités dans le CMS. Elle reste indépendante du métier (conforme à la règle M-016 : référentiels universels) et permet aux modules métiers (GMAO, GTB, BIM, etc.) d’utiliser un même référentiel métrologique. Les évolutions possibles (ajout de nouveaux contextes, nouvelles grandeurs dérivées) sont compatibles avec ce modèle. Les décisions clés (stockage interne SI, chaînes de contexte, codification standard) garantissent la cohérence et la maintenabilité du système.

Références : Notre approche suit les principes du «Unit of Measure» (stockage unitaire interne), les normes UCUM pour les codes d’unités, et les pratiques des plateformes métrologiques (unité de base par dimension). Les contraintes MySQL 8 (CHECK, UNIQUE, FK) assurent la robustesse du schéma, tandis que les index optimisent les requêtes de recherche de la préférence pertinente.
