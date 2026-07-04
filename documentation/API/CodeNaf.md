# CodeNaf

## Vue d'ensemble

**CodeNaf** est un référentiel hiérarchique de classification des activités économiques selon la **NAF rév. 2, 2008** (Nomenclature d'Activités Française).

- Référentiel national normalisé avec **1728 codes**
- **Hiérarchie 5 niveaux** : Sections → Divisions → Groupes → Classes → Sous-classes
- **Lecture seule** (données INSEE)
- Une **activité** d'entreprise est désignée par un code NAF
- Une entreprise peut avoir **plusieurs activités** (via table pivot)
- Les **activités sont communes** à l'entreprise mais réparties au niveau établissement
- Navigation hiérarchique complète (parent, enfants, breadcrumb)

---

## Routes API

Routes groupées sous `/api/codesnaf` — **Lecture seule**

```
GET    /api/codesnaf                    Liste des codes NAF (paginée, recherche FULLTEXT)
GET    /api/codesnaf/:code              Détail d'un code NAF
GET    /api/codesnaf/:code/children     Enfants directs (pour tree lazy loading)
GET    /api/codesnaf/:code/hierarchy    Hiérarchie complète (chemin vers racine)
GET    /api/codesnaf/tree               Arbre complet
```

## Contrôleur

**Classe :** `App\Controllers\Api\CodeNaf`  
**Type :** ResourceController partiel (lecture seule + navigation)  
**Format :** JSON

### Méthodes

#### `index()` – GET /api/codesnaf

**Paramètres de requête :**
- `q` (string, optionnel) – Recherche FULLTEXT sur `nom` (min. 2 caractères)
- `page` (int, défaut: 1) – Numéro de page
- `perPage` (int, défaut: 20, max: 100) – Éléments par page

**Réponse (sans recherche) :**
```json
{
  "data": [
    {
      "codenaf": "A",
      "nom": "Agriculture, sylviculture et pêche",
      "parentcode": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "codenaf": "1",
      "nom": "Culture et production animale, chasse et services annexes",
      "parentcode": "A",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pager": {
    "currentPage": 1,
    "perPage": 20,
    "total": 1728
  }
}
```

**Réponse (avec recherche FULLTEXT) :**
```json
{
  "data": [
    {
      "codenaf": "62.01Z",
      "nom": "Programmation informatique",
      "parentcode": "62",
      "score": 2.5
    },
    {
      "codenaf": "6201Z",
      "nom": "Développement d'autres logiciels",
      "parentcode": "62.01",
      "score": 2.1
    }
  ],
  "pager": {
    "currentPage": 1,
    "perPage": 20,
    "total": 125
  }
}
```

**Recherche :** Utilise recherche FULLTEXT MySQL (mode NATURAL LANGUAGE)

#### `show($code)` – GET /api/codesnaf/:code

**Paramètres :**
- `code` (string) – Code NAF (ex: "6201Z", "62", "J")

**Réponse :**
```json
{
  "codenaf": "6201Z",
  "nom": "Programmation informatique",
  "parentcode": "62",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Erreur 404 :** Code NAF inexistant

#### `children($code)` – GET /api/codesnaf/:code/children

**Paramètres :**
- `code` (string) – Code NAF parent

**Réponse :** Enfants directs uniquement (pour lazy loading d'arbre)

```json
{
  "data": [
    {
      "codenaf": "62.01",
      "nom": "Programmation informatique",
      "parentcode": "62"
    },
    {
      "codenaf": "62.02",
      "nom": "Conseil en informatique",
      "parentcode": "62"
    },
    {
      "codenaf": "62.03",
      "nom": "Gestion d'installations informatiques",
      "parentcode": "62"
    }
  ]
}
```

**Usage :** Chargement progressif d'une arborescence (expansion d'un nœud)

#### `hierarchy($code)` – GET /api/codesnaf/:code/hierarchy

**Paramètres :**
- `code` (string) – Code NAF

**Réponse :** Chemin complet vers la racine (remontée hiérarchique)

```json
{
  "data": [
    {
      "codenaf": "J",
      "nom": "Information et communication",
      "parentcode": null
    },
    {
      "codenaf": "62",
      "nom": "Programmation, conseil et autres activités informatiques",
      "parentcode": "J"
    },
    {
      "codenaf": "62.01",
      "nom": "Programmation informatique",
      "parentcode": "62"
    },
    {
      "codenaf": "6201Z",
      "nom": "Développement d'autres logiciels",
      "parentcode": "62.01"
    }
  ]
}
```

**Usage :** Construire un breadcrumb ou afficher le contexte hiérarchique

#### `tree()` – GET /api/codesnaf/tree

**Paramètres :** Aucun

**Réponse :** Arbre hiérarchique complet (structure imbriquée)

```json
{
  "data": [
    {
      "codenaf": "A",
      "nom": "Agriculture, sylviculture et pêche",
      "parentcode": null,
      "children": [
        {
          "codenaf": "01",
          "nom": "Culture et production animale",
          "parentcode": "A",
          "children": [
            {
              "codenaf": "01.1",
              "nom": "Culture de céréales",
              "parentcode": "01",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "codenaf": "B",
      "nom": "Industries extractives",
      "parentcode": null,
      "children": []
    }
  ]
}
```

**⚠️ Volumétrie :** 1728 codes complets + imbrication. À utiliser avec précaution en production (cache recommandé).

---

## Modèle

**Classe :** `App\Models\CodeNafModel`

### Propriétés principales
- `table` – `codesnaf`
- `primaryKey` – `codenaf` (VARCHAR 10)
- `returnType` – `array`
- `useTimestamps` – `true`

### Champs
| Champ | Type | Remarque |
|-------|------|----------|
| `codenaf` | VARCHAR(10) | PK — Code NAF (A, 1, 62, 6201Z, etc.) |
| `nom` | TEXT | Libellé du code (non modifiable) |
| `parentcode` | VARCHAR(10) | FK autoréférentielle — NULL si racine |
| `created_at` | DATETIME | Timestamp création |
| `updated_at` | DATETIME | Timestamp dernière maj |

### Méthodes clés

#### `getParent($codenaf)` 
Récupère le code parent direct

```php
$parent = $model->getParent('6201Z');
// Retourne : ['codenaf' => '62', 'nom' => '...', ...]
```

#### `getChildren($codenaf)`
Retourne tous les enfants directs

```php
$children = $model->getChildren('62');
// Retourne : [['codenaf' => '62.01', ...], ['codenaf' => '62.02', ...], ...]
```

#### `getRacines()`
Retourne les codes racines (niveau 1)

```php
$racines = $model->getRacines();
// Retourne 21 codes racines (A, B, C, ..., U)
```

#### `getFeuilles()`
Retourne les codes feuilles (sans enfants)

```php
$feuilles = $model->getFeuilles();
// Retourne 732 codes feuilles
```

#### `getHierarchie($codenaf)`
Retourne le chemin complet vers la racine

```php
$hierarchy = $model->getHierarchie('6201Z');
// Retourne : [J, 62, 62.01, 6201Z] (du parent au code)
```

---

## Schéma de base de données

```sql
CREATE TABLE `codesnaf` (
  `codenaf` VARCHAR(10) COLLATE utf8mb4_general_ci NOT NULL,
  `nom` TEXT COLLATE utf8mb4_general_ci NOT NULL,
  `parentcode` VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`codenaf`),
  KEY `parentcode` (`parentcode`),
  FULLTEXT KEY `nom` (`nom`),
  CONSTRAINT `codesnaf_parentcode_foreign` 
    FOREIGN KEY (`parentcode`) 
    REFERENCES `codesnaf` (`codenaf`) 
    ON DELETE SET NULL 
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### Indices
- **PK** : `codenaf` (direct lookup)
- **FK** : `parentcode` (navigation hiérarchique)
- **FULLTEXT** : `nom` (recherche textuelle MySQL)

### Contraintes
- FK autoréférentielle : `parentcode` → `codesnaf.codenaf`
- ON DELETE SET NULL : suppression d'un parent libère les enfants
- Pas de CRUD — table en lecture seule après import

---

## Données d'import

### Source
**NAF rév. 2, 2008** — Nomenclature d'Activités Française

Fichiers CSV/TSV par niveau :
- Niveau 1 : Sections (21 codes)
- Niveau 2 : Divisions (88 codes)
- Niveau 3 : Groupes (271 codes)
- Niveau 4 : Classes (615 codes)
- Niveau 5 : Sous-classes (732 codes)

**Total : 1728 codes**

### Format import
Fichier TSV : `storage/app/import/naf.tsv`

Structure (1729 lignes = 1 en-tête + 1728 données) :
```
CodeNaf	        nom	                                          ParentCode
A	            Agriculture, sylviculture et pêche	
62	            Programmation, conseil...	                    J
6201Z	        Développement d'autres logiciels	            62.01
94.20Z	        Activités des syndicats de salariés	        94.20
```

**Séparateur :** Tab (non pas point-virgule, car texte peut contenir `;`)  
**Encoding :** UTF-8  
**Clé étrangère :** Vérification désactivée pendant import

### Statistiques post-import
- Total codes NAF : 1728
- Codes racines (sans parent) : 21
- Codes feuilles (sans enfants) : 732
- Relations parent/enfant : toutes valides

---

## Cas d'usage

### 1. Autocomplete lors création entreprise
```
GET /api/codesnaf?q=informatique&perPage=5
```
Retourne les 5 codes NAF les plus pertinents par score FULLTEXT

### 2. Breadcrumb d'un code
```
GET /api/codesnaf/6201Z/hierarchy
```
Affiche le chemin complet : J > 62 > 62.01 > 6201Z

### 3. Sélecteur dropdown (lazy loading)
```
GET /api/codesnaf/62/children
```
Charge les enfants directs pour expansion progressive

### 4. Visualisation arbre complet
```
GET /api/codesnaf/tree
```
Charger une fois, mettre en cache côté client

### 5. Recherche avancée
```
GET /api/codesnaf?q=industrie&page=2&perPage=50
```
Paginez dans les résultats de recherche

---

## Particularités métier

### Activité d'entreprise
- Une activité = un code NAF
- Une entreprise = **plusieurs activités possibles** (via table pivot : `entreprise_codenaf`)
- Les activités sont **communes** à l'entreprise mais **gérées au niveau établissement**

### Modèle de données futur
```
Entreprise (1:N) ←→ CodeNaf (pivot : entreprise_codenaf)
   ├── Établissement (1:N)
   │   └── CodeNaf (relation établissement-activités)
```

### Règles
- Libellé NAF **non modifiable** (données INSEE)
- Ajout/suppression d'activités via endpoints métier (Entreprise/Établissement)
- CodeNaf seul est **consultatif** (référentiel)

---

## Performance

### Recherche FULLTEXT
```sql
SELECT * FROM codesnaf 
WHERE MATCH(nom) AGAINST('industrie' IN NATURAL LANGUAGE MODE)
ORDER BY score DESC;
```

**Temps typique** : < 10ms sur 1728 enregistrements  
**Recommandation** : Implémenter cache côté client après première recherche

### Arbre complet
- **Taille** : ~150 KB JSON structuré
- **Génération** : ~50ms en PHP
- **Recommandation** : Cache côté serveur + invalidation lors import

### Pagination
- Défaut : 20 par page
- Max : 100 par page
- Index sur `parentcode` optimise filtrage hiérarchique

---

## Cycle de vie des données

1. **Import initial** : Chargement 1728 codes depuis TSV via Seeder
2. **Maintenance** : MAJ possible lors changement NAF (INSEE)
3. **Consultation** : Référence constante via API (lecture seule)
4. **Suppression** : Jamais directe — archivage recommandé

---

## Compatibilité

| Système | Support |
|---------|---------|
| MySQL 5.7+ | ✅ FULLTEXT NATURAL LANGUAGE |
| MariaDB 10.0+ | ✅ FULLTEXT |
| PostgreSQL | ⚠️ FULLTEXT via trigram/GIN |
| SQLite | ❌ Pas de FULLTEXT |

---

## Notes

- **Lecture seule** : Pas de POST/PUT/DELETE via API
- **Hiérarchie autoréférentielle** : Gérée via FK `parentcode`
- **Import TSV** : Plus flexible que CSV (séparateur spécial autorisé dans texte)
- **Vérification FK désactivée** lors import pour performance
- **Recherche FULLTEXT** : Syntaxe MySQL — adapter si changement de SGBD
- **Cache recommandé** : Arbre complet + résultats recherche fréquents

---

## Fichiers associés

- **Migration** : `app/Database/Migrations/xxxx_create_codesnaf_table.php`
- **Modèle** : `app/Models/CodeNafModel.php`
- **Contrôleur** : `app/Controllers/Api/CodeNaf.php`
- **Seeder** : `app/Database/Seeders/CodeNafSeeder.php`
- **Import** : `storage/app/import/naf.tsv`
