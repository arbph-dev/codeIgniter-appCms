# Documentation des API PHP — Module Métier

Je vais vous proposer une **synthèse documentée du module MOT**, puis une **carte des autres modules** et les **patterns à généraliser**.

---

## 1. MODULE MOT — Documentation complète

### 1.1 Architecture générale

```
Routes (Routes.php)
    ↓
Api\Mot (ResourceController)
    ├─ use ApiResponse (Trait)
    └─ use MotModel
         ↓
    MotModel (Model)
         └─ Validation rules + helpers
```

### 1.2 Endpoints

```php
GET    /api/mot                 → index()      Lister (paginé ou recherche)
GET    /api/mot?id=42           → index()      Récupérer par ID
GET    /api/mot?q=alter&page=1  → index()      Recherche texte paginée
POST   /api/mot                 → create()     Créer un mot
PUT    /api/mot/:id             → update()     Modifier
DELETE /api/mot/:id             → delete()     Supprimer
GET    /api/mot/like?q=alt      → like()       Autocomplete léger
```

### 1.3 Contrôleur API : Api\Mot

| Méthode | Route | Entrée | Logique | Sortie |
|---------|-------|--------|---------|--------|
| **index()** | GET /api/mot | `?id`, `?q`, `?page`, `?per_page` | Si `id` → find(). Si `q` → like() + paginate(). Sinon → paginate() | `apiOk($data, $pager)` ou `apiNotFound()` |
| **create()** | POST /api/mot | JSON `{mot_lbl}` | Validation requis + unique. Insert. | `apiCreated($item)` ou `apiValidationError()` |
| **update()** | PUT /api/mot/:id | `:id` + JSON `{mot_lbl}` | Find + validate + update | `apiOk($item)` ou erreur |
| **delete()** | DELETE /api/mot/:id | `:id` | Find + delete | `apiDeleted()` ou `apiNotFound()` |
| **show()** | GET /api/mot/:id | `:id` | Find | `apiOk($item)` ou `apiNotFound()` |
| **like()** | GET /api/mot/like | `?q`, `?len` | SELECT id, label. LIKE. LIMIT. | `apiOk([])` ultra-léger |

### 1.4 Modèle : MotModel

```php
Table: mots
PK: mot_id (auto-increment)
Champs: mot_id, mot_lbl

Validation (appliquée dans le modèle):
  mot_lbl:
    - required
    - min_length[1]
    - max_length[255]
    - is_unique[mots.mot_lbl] (ignore sa propre ligne lors du update)

Helpers:
  getById($id)      → find($id)
  getByLabel($lbl)  → like('mot_lbl', $lbl) → retourne un Builder
```

### 1.5 Trait ApiResponse

**Centralise les réponses JSON** uniformes pour tous les contrôleurs API :

```php
// Succès
apiOk($data, ?$pager, $message)        // 200 + data + pager optionnel
apiCreated($data, $message)            // 201
apiDeleted($message)                   // 200 (pas 204 pour les SPA)

// Erreurs
apiBadRequest($message, $errors)       // 400
apiUnauthorized($message)              // 401
apiForbidden($message)                 // 403
apiNotFound($message)                  // 404
apiValidationError($errors, $message)  // 422
apiError($message)                     // 500
```

**Structure de réponse unifiée** :
```json
{
  "status": 200,
  "message": "OK",
  "data": [...] ou null,
  "pager": { currentPage, perPage, total, pageCount }  // si fourni
}
```

### 1.6 Flux complet : exemple POST

```
Client → POST /api/mot { "mot_lbl": "Électronique" }
  ↓
Mot::create()
  ├─ Récupère le JSON
  ├─ Valide : trim(), requis, unique
  ├─ MotModel::insert(['mot_lbl' => 'Électronique'])
  │   └─ Valide les règles (required, unique, length)
  │   └─ Si erreur → retourne false + $model->errors()
  ├─ Si succès → find($id) pour récupérer l'enregistrement créé
  └─ return apiCreated($item, message)
  ↓
Client ← {status: 201, message: "Mot créé", data: {mot_id: 42, mot_lbl: "Électronique"}}
```

---

## 2. SKILL MAP — Tous les modules API

### Tableau comparatif

| Module | Fichier | PK | Type | CRUD | Relations | Particularités |
|--------|---------|----|----|---------|-----------|---|
| **Mot** | Api/Mot.php | INT (auto) | Simple | ✅ CRD | Aucune | Basique, pattern standard |
| **Image** | Api/Image.php | INT (auto) | Métier | ✅ CRD | user_id | Upload fichier, calcul dimensions, rollback physique |
| **TypeVoie** | Api/TypeVoie.php | INT (PK custom) | Ref | ✅ CRD | — | Filtre `?status=`, aucune pagination requise |
| **CodePostal** | Api/CodePostal.php | INT (auto) | Ref | ⚠️ R-O | — | Lecture seule + méthode `search()` custom + `suggest()` |
| **CodeNaf** | Api/CodeNaf.php | CHAR(5) | Ref | ⚠️ R-O | Hiérarchie | Tree builder, `getHierarchie()`, `children()` |
| **FormeJuridique** | Api/FormeJuridique.php | CHAR(4) | Ref | ✅ CRD | — | PK padded (0-fill), méthode `padId()` |
| **Adresse** | Api/Adresse.php | INT (auto) | Métier | ✅ CRD | CodePostal, TypeVoie | Relations JOIN, auto-fill lat/lng, `enrich()` helper |
| **Entreprise** | Api/Entreprise.php | — | Métier | ✅ CRD | Multiple | À explorer |
| **Organisation** | Api/Organisation.php | — | Métier | ✅ CRD | Multiple | À explorer |
| **AuthController** | Api/AuthController.php | — | Auth | Special | — | À explorer |
| **Comptespcg** | Api/Comptespcg.php | — | Ref | ✅ ? | — | À explorer |

### Légende
- **Type** : Simple = 1 table seule. Métier = logique métier. Ref = référentiel.
- **CRUD** : ✅ = complète. ⚠️ R-O = lecture seule.
- **PK custom** : clé primaire non auto-incrémentée (manuellement fixée ou transformée).

---

## 3. PATTERNS À GÉNÉRALISER

### Pattern 1 : CRUD Standard (MOT, TYPEVOIE)

```php
class Mon ApiController extends ResourceController
{
    use ApiResponse;
    protected $modelName = MonModel::class;
    protected $format = 'json';

    public function index()
    {
        $id      = $this->request->getGet('id');
        $q       = trim($this->request->getGet('q') ?? '');
        $page    = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = max(1, (int) ($this->request->getGet('per_page') ?? 20));

        if ($id) {
            $item = $this->model->find((int) $id);
            return $item ? $this->apiOk($item) : $this->apiNotFound("Item #$id introuvable.");
        }

        $builder = $q !== '' ? $this->model->like('label_col', $q) : $this->model;
        $data = $builder->orderBy('id', 'ASC')->paginate($perPage, 'default', $page);
        return $this->apiOk($data, $this->model->pager);
    }

    public function create()
    {
        $body = $this->request->getJSON(true) ?? [];
        // Validation manuelle OU déléguée au modèle
        $id = $this->model->insert($body);
        return ! $id 
            ? $this->apiValidationError($this->model->errors())
            : $this->apiCreated($this->model->find($id), "Créé.");
    }

    public function update($id = null)
    {
        if (! $this->model->find((int) $id)) {
            return $this->apiNotFound("Item #$id introuvable.");
        }
        $body = $this->request->getJSON(true) ?? [];
        $updated = $this->model->update((int) $id, $body);
        return ! $updated
            ? $this->apiValidationError($this->model->errors())
            : $this->apiOk($this->model->find((int) $id), null, "Mis à jour.");
    }

    public function delete($id = null)
    {
        if (! $this->model->find((int) $id)) {
            return $this->apiNotFound("Item #$id introuvable.");
        }
        $this->model->delete((int) $id);
        return $this->apiDeleted("Supprimé.");
    }

    public function like()
    {
        $q = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);
        if (strlen($q) < 2) return $this->apiOk([]);
        
        $data = $this->model
            ->select('id, label_col')
            ->like('label_col', $q)
            ->limit($len)
            ->find();
        return $this->apiOk($data);
    }
}
```

### Pattern 2 : Read-Only avec Filtres (CODEPOSTAL)

```php
class CodePostal extends ResourceController
{
    use ApiResponse;
    // ✅ Pas de create/update/delete
    
    public function index()
    {
        $q = trim($this->request->getGet('q') ?? '');
        $filterA = trim($this->request->getGet('filter_a') ?? '');
        $filterB = trim($this->request->getGet('filter_b') ?? '');
        $page = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = max(1, min(100, (int) ($this->request->getGet('per_page') ?? 20)));

        // ── Filtres exacts d'abord (rapides) ──
        if ($filterA !== '') {
            $data = $this->model->where('colA', $filterA)->paginate($perPage, 'default', $page);
            return $this->apiOk($data, $this->model->pager);
        }

        if ($filterB !== '') {
            $data = $this->model->where('colB', $filterB)->paginate($perPage, 'default', $page);
            return $this->apiOk($data, $this->model->pager);
        }

        // ── Recherche texte (peut être slow) ──
        if ($q !== '') {
            $data = $this->model->search($q)->paginate($perPage, 'default', $page);
            return $this->apiOk($data, $this->model->pager);
        }

        // ── Tout ──
        $data = $this->model->paginate($perPage, 'default', $page);
        return $this->apiOk($data, $this->model->pager);
    }

    public function like()
    {
        $q = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 15), 50);
        if (strlen($q) < 2) return $this->apiOk([]);
        
        return $this->apiOk($this->model->suggest($q, $len));
    }
}
```

### Pattern 3 : PK Custom / String (FORMEJURIDIQUE)

```php
class FormeJuridique extends ResourceController
{
    use ApiResponse;
    protected $modelName = FormeJuridiqueModel::class;
    // La PK est un CHAR(4) — il faut padId() pour la normaliser

    public function index()
    {
        $id = $this->request->getGet('id');
        if ($id !== null) {
            $item = $this->model->find($this->padId($id));
            return $item ? $this->apiOk($item) : $this->apiNotFound("Forme « {$id} » introuvable.");
        }
        // ... reste du code
    }

    public function show($id = null)
    {
        $item = $this->model->find($this->padId($id));
        return $item ? $this->apiOk($item) : $this->apiNotFound("Forme « {$id} » introuvable.");
    }

    private function padId($id): string
    {
        return str_pad(trim((string) $id), 4, '0', STR_PAD_LEFT);
    }
}
```

### Pattern 4 : Relations + Enrichissement (ADRESSE)

```php
class Adresse extends ResourceController
{
    use ApiResponse;

    private function getModel(): AdresseModel { return new AdresseModel(); }
    private function getCpModel(): CodePostalModel { return new CodePostalModel(); }

    public function index()
    {
        $model = $this->getModel();
        $id = $this->request->getGet('id');
        $q = trim($this->request->getGet('q') ?? '');

        if ($id !== null) {
            $item = $model->withRelations()->find((int) $id);
            return $item 
                ? $this->apiOk($this->enrich($item))
                : $this->apiNotFound("Adresse #$id introuvable.");
        }

        if ($q !== '') {
            $data = $model->withRelations()
                ->groupStart()
                    ->like('adresses.voienom', $q)
                    ->orLike('cp.commune', $q)
                ->groupEnd()
                ->paginate($perPage, 'default', $page);
            
            return $this->apiOk(
                array_map([$this, 'enrich'], $data),
                $model->pager
            );
        }
        // ... etc
    }

    public function create()
    {
        $body = $this->request->getJSON(true) ?? [];
        
        // Auto-fill depuis relation (CodePostal)
        $cpId = (int) ($body['codepostal_id'] ?? 0);
        $cp = $cpId ? $this->getCpModel()->find($cpId) : null;
        if (! $cp) return $this->apiBadRequest('codepostal_id invalide.');

        $data = $this->buildPayload($body, $cp);
        $id = $this->getModel()->insert($data);
        if (! $id) return $this->apiValidationError($this->getModel()->errors());

        $item = $this->getModel()->withRelations()->find($id);
        return $this->apiCreated($this->enrich($item), 'Adresse créée.');
    }

    // Helper : construit le payload avec valeurs par défaut depuis relations
    private function buildPayload(array $body, ?array $cp, bool $isUpdate = false): array
    {
        $data = array_intersect_key($body, array_flip([
            'complement', 'voienumero', 'voietype_id', ...
        ]));

        if ($cp) {
            // Auto-remplit acheminement, lat/lng depuis CodePostal
            if (! isset($data['acheminement']) || $data['acheminement'] === '') {
                $data['acheminement'] = $cp['acheminement'] ?: $cp['commune'];
            }
            if (! isset($data['latitude'])) {
                $data['latitude']  = $cp['latitude'];
                $data['longitude'] = $cp['longitude'];
            }
        }
        return $data;
    }

    // Helper : enrichit la réponse (ex: formater une adresse)
    private function enrich(array $row): array
    {
        $row['ligne4'] = AdresseModel::formatLigne4($row);
        return $row;
    }
}
```

### Pattern 5 : Upload Fichier + Métadonnées (IMAGE)

```php
class Image extends ResourceController
{
    use ApiResponse;

    public function create()
    {
        $file = $this->request->getFile('file');
        if (! $file || ! $file->isValid()) {
            return $this->apiBadRequest('Fichier image requis.');
        }

        // ── Validation MIME ──
        $allowedMime = ['image/jpeg', 'image/png', 'image/gif'];
        if (! in_array($file->getMimeType(), $allowedMime, true)) {
            return $this->apiValidationError(['file' => 'MIME non autorisé.']);
        }

        // ── Dossier upload ──
        $uploadDir = FCPATH . 'assets/img/uploads/';
        if (! is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        // ── Move fichier ──
        $newName = $file->getRandomName();
        $file->move($uploadDir, $newName);
        $path = '/assets/img/uploads/' . $newName;

        // ── Métadonnées ──
        $imageSize = @getimagesize($uploadDir . $newName);
        $data = [
            'path' => $path,
            'filename' => $newName,
            'width' => $imageSize[0] ?? 0,
            'height' => $imageSize[1] ?? 0,
            'size_ko' => round($file->getSize() / 1024, 2),
            'alt' => trim($this->request->getPost('alt') ?? ''),
            'status' => $this->request->getPost('status') ?? 'pending',
        ];

        $id = $this->model->insert($data);
        if (! $id) {
            // ── Rollback physique ──
            if (is_file($uploadDir . $newName)) unlink($uploadDir . $newName);
            return $this->apiValidationError($this->model->errors());
        }

        return $this->apiCreated($this->model->find($id), 'Image créée.');
    }

    public function delete($id = null)
    {
        $item = $this->model->find((int) $id);
        if (! $item) return $this->apiNotFound("Image #$id introuvable.");

        // ── Suppression physique ──
        $fullPath = FCPATH . ltrim($item['path'], '/');
        if (is_file($fullPath)) unlink($fullPath);

        // ── Suppression BDD ──
        $this->model->delete((int) $id);
        return $this->apiDeleted("Image #$id supprimée.");
    }
}
```

---

## 4. SYNTHÈSE DES MÉTHODES À GÉNÉRALISER

### 4.1 Méthodes système (toutes les API)

| Méthode | Signature | Usage |
|---------|-----------|-------|
| **getGet()** | `$this->request->getGet($key, $default)` | Paramètres URL (`?q=val&id=42`) |
| **getJSON()** | `$this->request->getJSON(true)` | Body JSON avec `true` → array |
| **getFile()** | `$this->request->getFile($key)` | Multipart upload |
| **model->find()** | `$this->model->find($id)` | Récupérer 1 enregistrement |
| **model->paginate()** | `$this->model->paginate($perPage, 'default', $page)` | Lister paginé |
| **model->insert()** | `$this->model->insert($data)` | Crée + retourne ID |
| **model->update()** | `$this->model->update($id, $data)` | Modifie + retourne bool |
| **model->delete()** | `$this->model->delete($id)` | Supprime |
| **model->errors()** | `$this->model->errors()` | Erreurs de validation |
| **model->pager** | `$this->model->pager` | Objet paginateur |

### 4.2 Patterns de validation

```php
// ── Validation entrée ──
$q = trim($this->request->getGet('q') ?? '');          // String safe
$id = (int) $this->request->getGet('id');              // Int safe
$page = max(1, (int) ($this->request->getGet('page') ?? 1));  // Int positif
$perPage = max(1, min(100, (int) ($this->request->getGet('per_page') ?? 20)));  // Limité

// ── Vérifications ──
if ($id !== null) { ... }         // Si fourni
if (strlen($q) < 2) { ... }       // Min length
if ($item === null) { ... }       // Record exist check
if (! $id) { ... }                // Insert failed
```

### 4.3 Patterns de réponse

```php
// ── Succès ──
return $this->apiOk($data);
return $this->apiOk($data, $this->model->pager);
return $this->apiOk($data, null, "Message personnalisé");
return $this->apiCreated($item, "Créé avec succès");
return $this->apiDeleted("Supprimé.");

// ── Erreurs ──
return $this->apiNotFound("Item #$id introuvable.");
return $this->apiBadRequest("Données manquantes.");
return $this->apiValidationError($this->model->errors());
return $this->apiValidationError($errors, "Validation échouée.");
```

### 4.4 Ordre de route recommandé (Routes.php)

```php
// ⚠️ IMPORTANT : L'ordre doit être :
// 1. like() AVANT (:id)
// 2. Autres actions personnalisées
// 3. Ressources REST standard
$routes->group('api', function($routes) {
    $routes->get('mon-ressource/like',   'Api\MonRessource::like');    // ← avant
    $routes->get('mon-ressource',        'Api\MonRessource::index');
    $routes->post('mon-ressource',       'Api\MonRessource::create');
    $routes->get('mon-ressource/(:num)', 'Api\MonRessource::show/$1');  // ← après
    $routes->put('mon-ressource/(:num)', 'Api\MonRessource::update/$1');
    $routes->delete('mon-ressource/(:num)', 'Api\MonRessource::delete/$1');
});
```

---

## 5. CHECKLIST : Créer une nouvelle API

```php
☐ 1. Créer le fichier Api/MonModule.php (extends ResourceController)
☐ 2. Ajouter "use ApiResponse;"
☐ 3. Déclarer $modelName, $format
☐ 4. Implémenter index(), show(), create(), update(), delete()
☐ 5. Ajouter like() pour autocomplete
☐ 6. Ajouter les routes (like AVANT :id)
☐ 7. Tester avec Postman :
     GET  /api/mon-module
     POST /api/mon-module
     PUT  /api/mon-module/1
     DELETE /api/mon-module/1
☐ 8. Vérifier les réponses via ApiResponse
```

---

**Statut** : Documentation complète des API PHP (v1.0)  
**Date** : 2026-07-04  
**Prochaines étapes** : Documentation détaillée des modules Entreprise, Organisation, AuthController, Comptespcg
