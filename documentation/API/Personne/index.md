# Session 2026-08-15 — Module Personne & Relations

## Contexte

Éprouver une méthode de travail sur le module `Personne` :
la base de production est **toujours la source de vérité**.
Tout code incompatible avec la base est incorrect.
`DESCRIBE` avant de coder, pas après.

---

## Plan d'exécution

```
1. Corrections des fichiers existants     ← safe, non destructif
2. ParcoursTypeModel + Entity + Controller ← référentiel simple, échauffement
3. RelationTypeModel + Entity + Controller ← idem
4. RelationModel + Entity                 ← fondation
5. RelationService                        ← logique métier
6. RelationController                     ← API
7. Intégration dans PersonneService       ← findWithRelations() étendu
```

---

## 0. Préparation — inventaire des blocs

### Bloc `parcours_types`
- `ParcoursType` Entity
- `ParcoursTypeModel` — lecture seule, pas de soft delete
- Controller API `ParcoursTypes` — `index` + `show` uniquement

### Bloc `relation_types`
- `RelationType` Entity
- `RelationTypeModel`
- Controller API `RelationTypes` — `index` + `show`

### Bloc `relations`
- `Relation` Entity
- `RelationModel`
- `RelationService` — `getForEntity()`, `getBySource()`, `getByTarget()`, `create()`, `update()`, `delete()`, `deactivate()`, `getInverseType()`
- Controller API `Relations`

### Bloc `personnes`
- `PersonneService` — mise à jour uniquement

### Méthode de travail établie
- `DESCRIBE <table>` systématique avant tout nouveau fichier
- `SHOW INDEX FROM <table>` pour identifier FK non contraintes et patterns d'accès
- `SHOW TABLES LIKE '%<domaine>%'` pour découvrir les référentiels liés
- Diagramme ER SVG (phpMyAdmin) : exploitable pour la vue d'ensemble, insuffisant pour les types — `DESCRIBE` reste obligatoire

---

## 1. Corrections des fichiers existants

Quatre fichiers, corrections alignées sur `DESCRIBE` de production.

### [`app/Entities/Personne.php`](/refactoring/app/Entities/Personne.php)
| Champ | Avant | Après | Raison |
|---|---|---|---|
| `quality_score` cast | `?float` | `?integer` | `tinyint unsigned` en base |

### [`app/Entities/PersonneParcours.php`](/refactoring/app/Entities/PersonneParcours.php)
| Champ | Avant | Après | Raison |
|---|---|---|---|
| `type` cast | absent | `'type' => 'integer'` | FK `bigint unsigned` vers `parcours_types.id` |

### [`app/Models/PersonneAliasModel.php`](/refactoring/app/Models/PersonneAliasModel.php)
| Règle | Avant | Après | Raison |
|---|---|---|---|
| `alias_type` | `permit_empty\|max_length[50]` | `permit_empty\|in_list[pseudonyme,nom_naissance,nom_usage,nom_scene,nom_plume,translitteration,autre]` | ENUM exact de la base avec default `autre` |
| `is_principal` | `permit_empty\|in_list[0,1]` | `in_list[0,1]` | `NOT NULL DEFAULT 0` en base — `permit_empty` retiré |

### [`app/Models/PersonneParcoursModel.php`](/refactoring/app/Models/PersonneParcoursModel.php)
| Règle | Avant | Après | Raison |
|---|---|---|---|
| `titre` | `permit_empty\|max_length[255]` | `required\|max_length[255]` | `NOT NULL` en base |
| `type` | `permit_empty\|max_length[50]` | `required\|is_natural_no_zero` | FK `bigint unsigned NOT NULL` vers `parcours_types.id` |

> **Découverte clé :** `personne_parcours.type` est un FK orphelin (`bigint unsigned NOT NULL`, index `BTREE` sans contrainte référentielle). Identifié par `SHOW INDEX` + `information_schema`. La table cible `parcours_types` existe. La contrainte n'a pas été posée mais la colonne est fonctionnelle.

---

## 2. Bloc `parcours_types`

```
DESCRIBE parcours_types;
id          bigint unsigned  NO  PRI  auto_increment
code        varchar(50)      NO  UNI
label       varchar(100)     NO
description text             YES
created_at  datetime         YES
updated_at  datetime         YES
```

**Pattern référentiel standard** — identique à `relation_types`, `service_types`, `organisation_types` :
`id | code (UNIQUE) | label | description | created_at | updated_at`

### Fichiers
- [`app/Entities/ParcoursType.php`](/refactoring/app/Entities/ParcoursType.php) — cast `id` uniquement, pas de `$dates` métier
- [`app/Models/ParcoursTypeModel.php`](/refactoring/app/Models/ParcoursTypeModel.php) — `findByCode()` + `toList()` au-delà du CRUD
- [`app/Controllers/Api/ParcoursTypes.php`](/refactoring/app/Controllers/Api/ParcoursTypes.php) — lecture seule, filtre `?code=`

### Routes
```php
$routes->get('parcours-types',        'ParcoursTypes::index');
$routes->get('parcours-types/(:num)', 'ParcoursTypes::show/$1');
```

---

## 3. Bloc `relation_types`

```
DESCRIBE relation_types;
id            bigint unsigned                               NO  PRI  auto_increment
code          varchar(100)                                  NO  UNI
label         varchar(255)                                  NO
inverse_code  varchar(100)                                  YES      — auto-référence
source_type   enum('personne','organisation','etablissement') NO  MUL
target_type   enum('personne','organisation','etablissement') NO  MUL
symetrique    tinyint(1)                                    NO       DEFAULT 0
description   text                                          YES
created_at    datetime                                      YES
updated_at    datetime                                      YES
```

### Fichiers
- [`app/Entities/RelationType.php`](/refactoring/app/Entities/RelationType.php) — cast `symetrique` en `boolean` (`tinyint(1) NOT NULL DEFAULT 0`)
- [`app/Models/RelationTypeModel.php`](/refactoring/app/Models/RelationTypeModel.php)
  - `findByCode()` — identifiant naturel
  - `findApplicable(string $sourceType, string $targetType)` — exploite les index MUL, filtre principal
  - `findInverse(string $code)` — résout `inverse_code`
  - constante `ENTITY_TYPES = ['personne', 'organisation', 'etablissement']`
- [`app/Controllers/Api/RelationTypes.php`](/refactoring/app/Controllers/Api/RelationTypes.php) — lecture seule, filtre `?source_type=&target_type=`

### Routes
```php
$routes->get('relation-types',        'RelationTypes::index');
$routes->get('relation-types/(:num)', 'RelationTypes::show/$1');
```

---

## 4. Bloc `relations`

```
DESCRIBE relations;
id               bigint unsigned                    NO  PRI  auto_increment
relation_type_id bigint unsigned                    NO  MUL  — FK relation_types.id
source_type      enum('personne','organisation')    NO  MUL
source_id        bigint unsigned                    NO
target_type      enum('personne','organisation')    NO  MUL
target_id        bigint unsigned                    NO
actif            tinyint(1)                         YES      DEFAULT 1
ordre            smallint                           YES      DEFAULT 0
date_debut       date                               YES      — date métier
date_fin         date                               YES      — date métier
commentaire      text                               YES
created_at       datetime                           YES
updated_at       datetime                           YES
```

### Divergence ENUM — décision actée

`relation_types.source_type/target_type` inclut `'etablissement'`.
`relations.source_type/target_type` ne l'incluait pas.

**Option A retenue** — règle métier : une personne peut être liée à l'organisation `Leclerc`. Si des établissements existent, on les propose. Si l'information établissement est disponible, on lie sur `etablissement` ; sinon sur `organisation`.

```sql
-- Migration à exécuter AVANT tout INSERT via RelationService
ALTER TABLE relations
    MODIFY source_type ENUM('personne','organisation','etablissement') NOT NULL,
    MODIFY target_type ENUM('personne','organisation','etablissement') NOT NULL;
```

### Fichiers
- [`app/Entities/Relation.php`](/refactoring/app/Entities/Relation.php)
  - `$dates` : `date_debut`, `date_fin`, `created_at`, `updated_at`
  - casts : `relation_type_id`, `source_id`, `target_id` → `integer` ; `actif` → `boolean` ; `ordre` → `integer`
- [`app/Models/RelationModel.php`](/refactoring/app/Models/RelationModel.php)
  - `findForEntity(string $entityType, int $entityId)` — bidirectionnel, filtre `actif = 1`
  - `findBySource()` + `findByTarget()` — cas orientés
  - constante `ENTITY_TYPES = ['personne', 'organisation']` — volontairement distincte de `RelationTypeModel::ENTITY_TYPES`, commentaire `TODO` alignement

---

## 5. `RelationService`

**Fichier :** [`app/Services/RelationService.php`](/refactoring/app/Services/RelationService.php)

### Méthodes publiques

| Méthode | Rôle |
|---|---|
| `find(int $id)` | Récupère une relation |
| `getForEntity(string $type, int $id)` | Toutes les relations enrichies, bidirectionnel |
| `getBySource()` | Relations sortantes enrichies |
| `getByTarget()` | Relations entrantes enrichies |
| `create(array $data)` | Création avec résolution + validation type |
| `update(int $id, array $data)` | Mise à jour avec re-validation si source/target changent |
| `delete(int $id)` | Suppression physique |
| `deactivate(int $id)` | `actif = 0` — préserver l'historique |
| `getInverseType(Relation $r)` | Résout le type inverse via `inverse_code` |
| `applyTargetResolution(array $data)` | Bascule `organisation` → `etablissement` si `etablissement_id` fourni |
| `validateRelationType(int $typeId, string $src, string $tgt)` | Vérifie la cohérence référentiel / paire source-target |

### `applyTargetResolution()` — règle métier centrale

Le front envoie `target_type=organisation + etablissement_id=7`.
Le service bascule vers `target_type=etablissement, target_id=7`.
`etablissement_id` est consommé avant l'INSERT — la base ne le voit jamais.

### `enrich()` — anti N+1

Toutes les méthodes de lecture retournent `['relation' => ..., 'relation_type' => ...]`.
Le contrôleur et le service consommateur n'ont pas à charger le type séparément.

### Enregistrement CI4 obligatoire
Dans `app/Config/Services.php` :
- Déclarer les services

```php
use App\Services\PersonneService;
use App\Services\RelationService;
```

- Ajouter les fonctions

```php
    public static function relation(bool $getShared = true): RelationService
    {
        if ($getShared) { return static::getSharedInstance('relation'); }
        return new \App\Services\RelationService();
    }

    public static function personne(bool $getShared = true): PersonneService
    {
        if ($getShared) { return static::getSharedInstance('personne');}
        return new \App\Services\PersonneService();
    }
```

---

## 6. `RelationController` — API

**Fichier :** [`app/Controllers/Api/Relations.php`](/refactoring/app/Controllers/Api/Relations.php)

### Modes de filtrage `GET /api/relations`

| Mode | Paramètres | Usage |
|---|---|---|
| Bidirectionnel | `?entity_type=personne&entity_id=12` | Fiche personne / organisation |
| Sortant | `?source_type=personne&source_id=12` | Graphe, export |
| Entrant | `?target_type=organisation&target_id=5` | Graphe, export |
| Filtre cumulable | `&relation_type_id=3` | Tous modes |

### `PATCH /api/relations/{id}/deactivate`

Route distincte de `DELETE`. Un `DELETE` physique d'une relation passée ("Robert a travaillé chez Leclerc 2010-2015") est une perte d'information. `deactivate()` pose `actif=0` et conserve l'historique.

---

## 7. `PersonneService` — intégration

**Fichier :** [`app/Services/PersonneService.php`](/refactoring/app/Services/PersonneService.php)

### Modifications

**`__construct()`** — ajouts :
```php
use App\Models\RelationModel;           // pour merge()
protected RelationService $relationService;
$this->relationService = service('relation');
```

**`findWithRelations()`** — une ligne :
```php
'relations' => $this->relationService->getForEntity('personne', $id),
```
Retourne `[['relation' => ..., 'relation_type' => ...], ...]`.
`Personne::show()` dans le contrôleur **n'a rien à modifier**.

**`merge()`** — trois opérations ajoutées dans la transaction :
```php
// Redirection source
$relationModel->where('source_type', 'personne')->where('source_id', $sourceId)
              ->set(['source_id' => $targetId])->update();
// Redirection target
$relationModel->where('target_type', 'personne')->where('target_id', $sourceId)
              ->set(['target_id' => $targetId])->update();
// Nettoyage auto-relations (X → X)
$relationModel->where('source_type', 'personne')->where('source_id', $targetId)
              ->where('target_type', 'personne')->where('target_id', $targetId)
              ->delete();
```

**`getParcours()`** — signature corrigée :
```php
// Avant
public function getParcours(int $personneId, ?string $type = null)
// Après
public function getParcours(int $personneId, ?int $typeId = null)
```
`type` est une FK entière — passer une chaîne `'emploi'` provoque désormais une erreur PHP typée. C'est voulu.

---

## Routes complètes du module

```php
$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function ($routes) {

    // Personnes (existant)
    $routes->resource('personnes', [
        'controller' => 'Personne',
        'only'       => ['index', 'show', 'create', 'update', 'delete'],
    ]);
    $routes->post('personnes/(:num)/merge/(:num)', 'Personne::merge/$1/$2');

    // Relations
    $routes->resource('relations', [
        'controller' => 'Relations',
        'only'       => ['index', 'show', 'create', 'update', 'delete'],
    ]);
    $routes->patch('relations/(:num)/deactivate', 'Relations::deactivate/$1');

    // Référentiels (lecture seule)
    $routes->get('relation-types',         'RelationTypes::index');
    $routes->get('relation-types/(:num)',  'RelationTypes::show/$1');
    $routes->get('parcours-types',         'ParcoursTypes::index');
    $routes->get('parcours-types/(:num)',  'ParcoursTypes::show/$1');
});
```
## Résumé des endpoints

|Méthode|Endpoint|Description|
|---|---|---|
| GET | `/api/personnes/` | Personne::index |
| GET | `/api/personnes/{id}` | Personne::show |
| POST | `/api/personnes` | Personne::create |
| PUT | `/api/personnes/{id}` | Personne::update |
| PATCH | `/api/personnes/{id}` | Personne::update | 
| DELETE | `/api/personnes/{id}` | Personne::delete |
| POST | `/api/personnes/{sourceId}/merge/{targetId}` | Personne::merge($sourceId = null, $targetId = null) |
	 


	 





---

## Fichiers produits

### Bloc `parcours_types`
- [`app/Entities/ParcoursType.php`](/refactoring/app/Entities/ParcoursType.php)
- [`app/Models/ParcoursTypeModel.php`](/refactoring/app/Models/ParcoursTypeModel.php)
- [`app/Controllers/Api/ParcoursTypes.php`](/refactoring/app/Controllers/Api/ParcoursTypes.php)

### Bloc `relation_types`
- [`app/Entities/RelationType.php`](/refactoring/app/Entities/RelationType.php)
- [`app/Models/RelationTypeModel.php`](/refactoring/app/Models/RelationTypeModel.php)
- [`app/Controllers/Api/RelationTypes.php`](/refactoring/app/Controllers/Api/RelationTypes.php)

### Bloc `relations`
- [`app/Entities/Relation.php](/refactoring/app/Entities/Relation.php)
- [`app/Models/RelationModel.php`](/refactoring/app/Models/RelationModel.php)
- [`app/Services/RelationService.php`](/refactoring/app/Services/RelationService.php)
- [`app/Controllers/Api/Relations.php`](/refactoring/app/Controllers/Api/Relations.php)

### Bloc `personnes` — corrections et mises à jour
- [`app/Entities/Personne.php`](/refactoring/app/Entities/Personne.php)
- [`app/Entities/PersonneParcours.php`](/refactoring/app/Entities/PersonneParcours.php)
- [`app/Models/PersonneAliasModel.php`](/refactoring/app/Models/PersonneAliasModel.php)
- [`app/Models/PersonneParcoursModel.php`](/refactoring/app/Models/PersonneParcoursModel.php)
- [`app/Services/PersonneService.php`](/refactoring/app/Services/PersonneService.php)

---

## À faire — prochaine session

- [X] Exécuter la migration ALTER TABLE `relations` (Option A)
- [X] Enregistrer `RelationService` dans `app/Config/Services.php`
- [ ] Seeders `parcours_types` et `relation_types`
- [ ] Tests API — séquence minimale : create personne → create relation → findWithRelations
- [ ] `view_personne_timeline` — SQL VIEW (fusion parcours + relations + distinctions)
- [ ] Documenter le pattern référentiel (`*_types`) pour les prochains modules
