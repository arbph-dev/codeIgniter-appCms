
# cmssections

## Migration

```sql
CREATE TABLE IF NOT EXISTS `cmssections` (  
`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,  
`article_id` BIGINT UNSIGNED NOT NULL,  
`slug` VARCHAR(140) NULL,  
`title` VARCHAR(180) NOT NULL,  
`position` INT UNSIGNED NOT NULL DEFAULT 1,  
`is_published` TINYINT(1) NOT NULL DEFAULT 1,  
`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
`updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,  
  
PRIMARY KEY (`id`),  
KEY `idx_sections_article` (`article_id`),  
KEY `idx_sections_article_position` (`article_id`,`position`),  
KEY `idx_sections_article_published_position` (`article_id`,`is_published`,`position`),  
UNIQUE KEY `uq_sections_article_position`(`article_id`,`position`),  
UNIQUE KEY `uq_sections_article_slug` (`article_id`,`slug`),  

CONSTRAINT `fk_sections_article`  
FOREIGN KEY (`article_id`)  
REFERENCES `cmsarticles` (`id`)  
ON DELETE CASCADE  
ON UPDATE CASCADE  
  
)
ENGINE=InnoDB  
DEFAULT CHARSET=utf8mb4  
COLLATE=utf8mb4_unicode_ci;
```

## Structure
| Field        | Type            | Null | Key | Default           | Extra                       |
| ------------ | --------------- | ---- | --- | ----------------- | --------------------------- |
| id           | bigint unsigned | NO   | PRI | _NULL_            | auto_increment              |
| article_id   | bigint unsigned | NO   | MUL | _NULL_            |                             |
| slug         | varchar(140)    | YES  |     | _NULL_            |                             |
| title        | varchar(180)    | NO   |     | _NULL_            |                             |
| position     | int unsigned    | NO   |     | 1                 |                             |
| is_published | tinyint(1)      | NO   |     | 1                 |                             |
| created_at   | datetime        | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED           |
| updated_at   | datetime        | YES  |     | _NULL_            | on update CURRENT_TIMESTAMP |



# Seeder

## préparation 

avec SELECT * FROM component_types

| [id] | [name]  | [view]             | [description]                 | [is_active] | [created_at]        |
| ---- | ------- | ------------------ | ----------------------------- | ----------- | ------------------- |
| 1    | raw     | components/raw     | HTML brut                     | 1           | 2026-06-21 03:59:01 |
| 2    | codeval | components/codeval | Bloc CodeVal                  | 1           | 2026-06-21 03:59:01 |
| 3    | apex    | components/apex    | Graphique ApexCharts          | 1           | 2026-06-21 03:59:01 |
| 4    | mermaid | components/mermaid | Diagramme Mermaid             | 1           | 2026-06-21 03:59:01 |
| 5    | callout | components/callout | Bloc callout                  | 1           | 2026-06-21 03:59:01 |
| 6    | leaflet | components/leaflet | Carte Leaflet / OpenStreetMap | 1           | 2026-07-12 03:29:28 |
| 7    | threejs | components/threejs | scene threejs                 | 1           | 2026-07-13 01:24:22 |

Requete de vérification avant

| article_slug | article_title | section_id | section_slug | section_title   | position | nb_parts |
| ------------ | ------------- | ---------- | ------------ | --------------- | -------- | -------- |
| test-art     | testArt       | 999        | test-sec     | Section de test | 1        | 11       |


## Code

```sql
-- =============================================================================
-- Seed Iter006.2.1 — Test TabSystem CmsArticleWorkbench
-- =============================================================================
-- Objectif : créer ≥ 2 sections avec parts sur l'article 'test-art'
--            pour déclencher le mode onglets dans CmsArticleWorkbench.
--
-- Prérequis : l'article slug='test-art' doit exister dans cmsarticles
--             et is_published = 1.
--
-- Type IDs supposés (à vérifier avec SELECT * FROM component_types) :
--   1 = raw       (texte/HTML brut)
--   2 = callout
--   3 = codeval
--   4 = apex
--   5 = mermaid
--
-- ⚠ [vigilance 1] Les slugs de section doivent être uniques en base pour
--   éviter les collisions d'id HTML dans section.php.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 0. Récupérer l'id de l'article test-art (pour référence manuelle si besoin)
-- -----------------------------------------------------------------------------
-- SELECT id, slug, title FROM cmsarticles WHERE slug = 'test-art';


-- -----------------------------------------------------------------------------
-- 1. Sections — 3 sections sur test-art
-- -----------------------------------------------------------------------------
INSERT INTO cmssections
    (article_id, slug, title, content, position, is_published, created_at, updated_at)
SELECT
    a.id,
    'test-art-introduction',
    'Introduction',
    '',         -- champ content section (intro textuelle, optionnel)
    1,
    1,
    NOW(), NOW()
FROM cmsarticles a
WHERE a.slug = 'test-art'
LIMIT 1;

INSERT INTO cmssections
    (article_id, slug, title, content, position, is_published, created_at, updated_at)
SELECT
    a.id,
    'test-art-developpement',
    'Développement',
    '',
    2,
    1,
    NOW(), NOW()
FROM cmsarticles a
WHERE a.slug = 'test-art'
LIMIT 1;

INSERT INTO cmssections
    (article_id, slug, title, content, position, is_published, created_at, updated_at)
SELECT
    a.id,
    'test-art-conclusion',
    'Conclusion',
    '',
    3,
    1,
    NOW(), NOW()
FROM cmsarticles a
WHERE a.slug = 'test-art'
LIMIT 1;


-- -----------------------------------------------------------------------------
-- 2. Parts — une part raw par section
-- -----------------------------------------------------------------------------

-- Section 1 : Introduction
INSERT INTO cmsparts
    (section_id, type_id, title, content, aside, config, position, is_published, created_at, updated_at)
SELECT
    s.id,
    1,          -- raw
    'Présentation',
    '<p>Contenu de la section <strong>Introduction</strong>.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
    '',
    '{}',
    1,
    1,
    NOW(), NOW()
FROM cmssections s
WHERE s.slug = 'test-art-introduction'
LIMIT 1;

-- Section 2 : Développement — deux parts pour vérifier l'empilement
INSERT INTO cmsparts
    (section_id, type_id, title, content, aside, config, position, is_published, created_at, updated_at)
SELECT
    s.id,
    1,          -- raw
    'Corps principal',
    '<p>Premier paragraphe du <strong>Développement</strong>.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>',
    '',
    '{}',
    1,
    1,
    NOW(), NOW()
FROM cmssections s
WHERE s.slug = 'test-art-developpement'
LIMIT 1;

INSERT INTO cmsparts
    (section_id, type_id, title, content, aside, config, position, is_published, created_at, updated_at)
SELECT
    s.id,
    2,          -- callout (si type_id=2, sinon ajuster)
    'Note importante',
    '',
    '',
    '{"type":"info","text":"Ceci est un callout de test — vérifie que le composant callout s''initialise correctement dans ce pane."}',
    2,
    1,
    NOW(), NOW()
FROM cmssections s
WHERE s.slug = 'test-art-developpement'
LIMIT 1;

-- Section 3 : Conclusion
INSERT INTO cmsparts
    (section_id, type_id, title, content, aside, config, position, is_published, created_at, updated_at)
SELECT
    s.id,
    1,          -- raw
    'Synthèse',
    '<p>Contenu de la section <strong>Conclusion</strong>.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>',
    '',
    '{}',
    1,
    1,
    NOW(), NOW()
FROM cmssections s
WHERE s.slug = 'test-art-conclusion'
LIMIT 1;


-- -----------------------------------------------------------------------------
-- 3. Vérification
-- -----------------------------------------------------------------------------
SELECT
    a.slug   AS article_slug,
    a.title  AS article_title,
    s.id     AS section_id,
    s.slug   AS section_slug,
    s.title  AS section_title,
    s.position,
    COUNT(p.id) AS nb_parts
FROM cmsarticles a
JOIN cmssections s  ON s.article_id = a.id AND s.is_published = 1
LEFT JOIN cmsparts p ON p.section_id = s.id AND p.is_published = 1
WHERE a.slug = 'test-art'
GROUP BY s.id
ORDER BY s.position;

-- Résultat attendu :
-- | test-art | Test Article | 1 | test-art-introduction  | Introduction   | 1 | 1 |
-- | test-art | Test Article | 2 | test-art-developpement | Développement  | 2 | 2 |
-- | test-art | Test Article | 3 | test-art-conclusion    | Conclusion     | 3 | 1 |

```

## Resultat
