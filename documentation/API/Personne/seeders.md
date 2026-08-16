# Seeders — module Personne & Relations

---

## `parcours_types`

Seeder validé — aucune modification.
Tous les codes sous 50 caractères, labels sous 100, `NOT NULL` respectés.

```sql
INSERT INTO parcours_types (code, label, description, created_at, updated_at) VALUES
('naissance',   'Naissance',   'Naissance de la personne',                             NOW(), NOW()),
('formation',   'Formation',   'Études et formations',                                 NOW(), NOW()),
('activite',    'Activité',    'Activité professionnelle générale',                    NOW(), NOW()),
('fonction',    'Fonction',    'Fonctions occupées (ex : ministre, directeur)',         NOW(), NOW()),
('mandat',      'Mandat',      'Mandats électifs ou institutionnels',                  NOW(), NOW()),
('adhesion',    'Adhésion',    'Adhésions à des organisations, partis, associations',  NOW(), NOW()),
('publication', 'Publication', 'Livres, articles, rapports',                           NOW(), NOW()),
('distinction', 'Distinction', 'Prix, décorations, médailles',                         NOW(), NOW()),
('mission',     'Mission',     'Missions spécifiques, opérations, reportages',         NOW(), NOW()),
('evenement',   'Évènement',   'Évènements marquants divers',                          NOW(), NOW()),
('deces',       'Décès',       'Décès de la personne',                                 NOW(), NOW());
```

---

## `relation_types`

### Problèmes corrigés dans le seeder original

| Problème | Détail |
|---|---|
| Doublons | `conjoint` et `enfant` présents deux fois |
| Colonnes incomplètes | La plupart des lignes avaient 4 colonnes au lieu de 7 — `target_type`, `symetrique`, `description` manquants |
| ENUM invalide | `'mixte'` n'existe pas dans l'ENUM `('personne','organisation','etablissement')` → `INSERT IGNORE` silencieux |
| `'enfant'` absent | Inverse de `parent` déclaré mais pas inséré |
| Timestamps absents | `created_at`/`updated_at` présents dans `parcours_types`, absents ici |
| `appartient_a` retiré | Recouvre `membre` sémantiquement, `target_type='mixte'` invalide |

### Décision `employe` et établissements

`employe` est défini `personne→organisation`. La résolution vers `etablissement`
se fait dans `RelationService::applyTargetResolution()` au niveau de la relation concrète,
pas du référentiel. Voir note RelationService ci-dessous.

### Seeder corrigé

```sql
INSERT IGNORE INTO relation_types
    (code, label, inverse_code, source_type, target_type, symetrique, description, created_at, updated_at)
VALUES

-- ── Famille (personne ↔ personne) ────────────────────────────────────────
('parent',           'Parent',              'enfant',           'personne',      'personne',      0,
    'Relation parent–enfant',                                                   NOW(), NOW()),

('enfant',           'Enfant',              'parent',           'personne',      'personne',      0,
    'Relation enfant–parent',                                                   NOW(), NOW()),

('conjoint',         'Conjoint',            'conjoint',         'personne',      'personne',      1,
    'Relation de couple (mariage, PACS, union libre)',                          NOW(), NOW()),

('frere_soeur',      'Frère / Sœur',        'frere_soeur',      'personne',      'personne',      1,
    'Relation fraternelle ou sororale',                                         NOW(), NOW()),

-- ── Personne → Organisation ───────────────────────────────────────────────
('membre',           'Membre',              NULL,               'personne',      'organisation',  0,
    'Membre d\'une organisation, parti ou association',                         NOW(), NOW()),

('administrateur',   'Administrateur',      NULL,               'personne',      'organisation',  0,
    'Administrateur d\'une organisation',                                       NOW(), NOW()),

('employe',          'Employé',             NULL,               'personne',      'organisation',  0,
    'Employé d\'une organisation (résolu vers établissement si connu)',         NOW(), NOW()),

('dirige',           'Dirige',              NULL,               'personne',      'organisation',  0,
    'Dirige une organisation',                                                  NOW(), NOW()),

('represente_legal', 'Représentant légal',  NULL,               'personne',      'organisation',  0,
    'Représentant légal d\'une organisation',                                   NOW(), NOW()),

('elu_de',           'Élu de',              NULL,               'personne',      'organisation',  0,
    'Élu d\'une circonscription ou institution',                               NOW(), NOW()),

('preside',          'Préside',             NULL,               'personne',      'organisation',  0,
    'Préside une organisation ou institution',                                  NOW(), NOW()),

-- ── Organisation → Organisation ───────────────────────────────────────────
('filiale_de',       'Filiale de',          'maison_mere_de',   'organisation',  'organisation',  0,
    'Organisation filiale d\'une autre',                                        NOW(), NOW()),

('maison_mere_de',   'Maison mère de',      'filiale_de',       'organisation',  'organisation',  0,
    'Organisation mère d\'une filiale',                                         NOW(), NOW()),

('finance_par',      'Financée par',        'financeur_de',     'organisation',  'organisation',  0,
    'Organisation financée par une autre',                                      NOW(), NOW()),

('financeur_de',     'Financeur de',        'finance_par',      'organisation',  'organisation',  0,
    'Organisation finançant une autre',                                         NOW(), NOW()),

('fusion_avec',      'Issue d\'une fusion', NULL,               'organisation',  'organisation',  0,
    'Organisation issue d\'une fusion avec une autre',                          NOW(), NOW());
```

---

## `relations`

Pas de seed statique — table de données vivantes alimentée via l'API.

---

## Fix `RelationService` — bug ordre validation / résolution

### Problème

Dans `create()`, l'ordre actuel est :
```
1. applyTargetResolution()  ← bascule target_type 'organisation' → 'etablissement'
2. validateRelationType()   ← vérifie type.target_type ('organisation') === 'etablissement' → ÉCHEC
```

La validation échoue toujours quand un `etablissement_id` est fourni.

### Correction dans `validateRelationType()`

`etablissement` est une sous-entité d'`organisation` — un type défini
`personne→organisation` est valide pour une relation `personne→etablissement`.

```php
// Dans RelationService
public function validateRelationType(int $relationTypeId, string $sourceType, string $targetType): bool
{
    $type = $this->relationTypeModel->find($relationTypeId);

    if (! $type) {
        log_message('warning', "[RelationService] relation_type_id {$relationTypeId} introuvable.");
        return false;
    }

    $sourceMatch = $type->source_type === $sourceType;

    // etablissement est une sous-entité d'organisation :
    // un type personne→organisation est valide pour personne→etablissement
    $targetMatch = $type->target_type === $targetType
        || ($targetType === 'etablissement' && $type->target_type === 'organisation');

    if (! $sourceMatch || ! $targetMatch) {
        log_message('warning', sprintf(
            '[RelationService] Type %s attend %s→%s, reçu %s→%s.',
            $type->code,
            $type->source_type, $type->target_type,
            $sourceType, $targetType
        ));
        return false;
    }

    return true;
}
```

### Aucun changement dans `create()` — l'ordre reste correct

```
1. applyTargetResolution()  ← résolution organisation → etablissement
2. validateRelationType()   ← accepte établissement si type attend organisation ✓
3. insert()
```
