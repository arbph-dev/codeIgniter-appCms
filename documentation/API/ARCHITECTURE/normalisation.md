
Ce que les travaux récents sur `RelationField`, `RelationPickerDialog`, l'autocomplétion et les futurs Workbenches font apparaître, c'est qu'il nous manque une couche conceptuelle stable :

> **la gestion des relations côté backend/API doit être définie avant de figer les composants UI qui vont les exploiter.**

Le cas **Organisation → Entreprise → Établissement → Service**, auquel s'ajoutent les **Personnes**, est suffisamment riche pour servir de cas de référence.

### Le problème à résoudre

On a plusieurs types de relations :

```
Personne ─────────────── Personne
   ├──────────────────── Organisation
   │                         ├── Entreprise
   │                         │      └── Établissement
   │                         │               └── Service
   │                         └── ...
   └──────────────────── ...
```

Et ces relations ne doivent pas être traitées comme de simples `JOIN` systématiques.

Il faut distinguer au moins :

1. **l'identification d'une relation** ;
2. **la recherche d'une entité liée** ;
3. **le chargement de la relation** ;
4. **le chargement de l'entité liée** ;
5. **l'autocomplétion** ;
6. **la récupération du détail** ;
7. **la liste des relations** ;
8. **la création/suppression d'une relation**.

C'est précisément là que le **lazy fetch** devient important.

### Je proposerais donc de reprendre le backend dans cet ordre

```
1. Modèle de données
       ↓
2. Contrat des relations
       ↓
3. API Relation
       ↓
4. API autocomplete / recherche
       ↓
5. Lazy fetch
       ↓
6. RelationField
       ↓
7. RelationPickerDialog
       ↓
8. Workbenches
```

Et surtout, **ne pas commencer par l'API générique**.

Il faut d'abord reprendre notre modèle métier concret :

```
Personne
Organisation
Entreprise
Établissement
Service
```

et formaliser exactement ce que signifie chaque relation.

Par exemple, une personne peut être liée à une organisation avec un **rôle**, une **fonction**, une **période**, éventuellement un statut ; alors que :

```
Entreprise → Établissement
```

est une relation structurelle très différente.

De même :

```
Établissement → Service
```

n'est pas simplement une relation générique `entity_id / related_id`.

### Le point important

Je ne chercherais donc pas à construire maintenant un `RelationService` universel.

Je ferais d'abord une **cartographie des relations backend existantes et souhaitées**, notamment celles que nous avions déjà travaillées :

- personne ↔ personne ;
- personne ↔ organisation ;
- organisation ↔ entreprise ;
- entreprise ↔ établissement ;
- établissement ↔ service.

Puis, pour chacune :

```
Cardinalité
Direction
Table porteuse
Clé primaire
Clé étrangère
Attributs de la relation
API de lecture
API de recherche
API de création
API de suppression
Lazy-load nécessaire ?
Autocomplete nécessaire ?
```

À partir de là, on pourra dégager le **contrat commun des relations** sans tomber dans une abstraction prématurée.

Et je pense qu'il faut également traiter un sujet que nos travaux frontend viennent de révéler : **la différence entre `id` et `key` doit rester explicite**, notamment pour les PK. On avait justement commencé à toucher ce point avec `relationField` et les `properties`.

Je te propose donc qu'on reprenne **le backend des relations à partir de ce modèle Organisation / Entreprise / Établissement / Service + Personne**, et que nous reconstruisions le contrat API avant de toucher davantage à `RelationField`.



---




Deux angles : les **principes** pour la suite, puis le **stub Mot** qui les implémente.



### Conseils pour les API futures

**Le problème actuel en une ligne :** `withRelations()` charge tout, toujours, pour tout le monde. Une liste pour autocomplete charge autant qu'une fiche détail.

**Trois patterns à introduire progressivement :**

```
1. Sparse fields      ?fields=id,nom          → liste légère vs detail complet
2. Sub-resources      GET /api/org/:id/mots    → lazy loading par onglet TabSystem
3. Include control    GET /api/org/:id?include=adresse,type → eager optionnel
```

Le **lazy loading naturel** du TabSystem vient de `initFn` — il ne tire que sur activation. Il suffit que l'API expose des sous-ressources :

```js
tabs.addTab(
    'mots', 'Mots clés',
    () => this._buildMotsPane(),
    async (paneEl) => {           // ← appelé UNE SEULE FOIS, au premier clic
        const r = await fetchOrgMots(org.id)  // GET /api/organisation/1/mots
        this._renderMots(paneEl, r.data)
    }
)
```

Zéro fetch si l'utilisateur ne visite jamais l'onglet.

**`meta` enrichi** — remplacer `pager` par `meta` qui echo les paramètres de la requête :

```js
"meta": {
    "page"     : 1,
    "per_page" : 20,
    "total"    : 150,
    "pages"    : 8,
    "q"        : "lilas",
    "sort"     : "mot_lbl",
    "fields"   : ["mot_id", "mot_lbl"]
}
```




Utile pour le débogage, la navigation et le cache côté client.

# STUB amélioration

```php
// app/Controllers/Api/Mot.php  — STUB amélioration
// ─────────────────────────────────────────────────────────────────────────────
// Patterns introduits vs version actuelle :
//
//   ?fields=mot_id,mot_lbl    Sparse fields — ne retourner que les colonnes utiles
//   ?sort=mot_lbl&order=asc   Tri contrôlé par le client
//   /like                     Retourne total en plus de data[]
//   /batch?ids=1,2,3          Multi-IDs en un seul appel (lazy load par lot)
//   /:id?include=usages        Include optionnel — prépare les sous-ressources  meta{} Remplace pager — echo des params + infos de page
//
// Routes :
//   GET    /api/mot                  index()
//   GET    /api/mot/like             like()
//   GET    /api/mot/batch            batch()
//   GET    /api/mot/(:num)           show($id)
//   POST   /api/mot                  create()
//   PUT    /api/mot/(:num)           update($id)
//   DELETE /api/mot/(:num)           delete($id)
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Controllers\Api;

use App\Models\MotModel;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;

class Mot extends ResourceController
{
    use ApiResponse;
    protected $format = 'json';

    // ── Champs autorisés pour ?fields= ────────────────────────────────────────

    private const ALLOWED_FIELDS = ['mot_id', 'mot_lbl', 'created_at'];
    private const DEFAULT_FIELDS = ['mot_id', 'mot_lbl'];

    // ── Tris autorisés pour ?sort= ────────────────────────────────────────────

    private const ALLOWED_SORTS  = ['mot_id', 'mot_lbl'];

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function getModel(): MotModel { return new MotModel(); }

    /**
     * Résout ?fields=mot_id,mot_lbl → colonnes SQL validées.
     */
    private function resolveFields(): array
    {
        $raw = $this->request->getGet('fields') ?? '';
        if (! $raw) return self::DEFAULT_FIELDS;

        $requested = array_map('trim', explode(',', $raw));
        $valid     = array_intersect($requested, self::ALLOWED_FIELDS);

        return $valid ?: self::DEFAULT_FIELDS;
    }

    /**
     * Résout ?sort= + ?order= avec whitelist.
     */
    private function resolveSort(): array
    {
        $sort  = $this->request->getGet('sort')  ?? 'mot_lbl';
        $order = $this->request->getGet('order') ?? 'asc';

        return [
            'field' => in_array($sort, self::ALLOWED_SORTS) ? $sort : 'mot_lbl',
            'dir'   => strtolower($order) === 'desc' ? 'DESC' : 'ASC',
        ];
    }

    /**
     * Construit le meta enrichi (remplace pager).
     * Echo des paramètres de la requête + infos de page.
     */
    private function buildMeta(\CodeIgniter\Pager\Pager $pager, array $extras = []): array
    {
        $pi = $pager->getDetails()['default'] ?? [];

        return array_merge([
            'page'     => (int) ($pi['currentPage']  ?? 1),
            'per_page' => (int) ($pi['perPage']       ?? 20),
            'total'    => (int) ($pi['total']         ?? 0),
            'pages'    => (int) ($pi['pageCount']     ?? 1),
        ], $extras);
    }

    // ── GET /api/mot ──────────────────────────────────────────────────────────

    public function index()
    {
        $q       = trim($this->request->getGet('q') ?? '');
        $page    = max(1, (int) ($this->request->getGet('page')     ?? 1));
        $perPage = max(1, min(100, (int) ($this->request->getGet('per_page') ?? 20)));
        $fields  = $this->resolveFields();
        $sort    = $this->resolveSort();

        $model   = $this->getModel()->select(implode(',', $fields));

        if ($q !== '') {
            $model->like('mot_lbl', $q);
        }

        $data = $model
            ->orderBy($sort['field'], $sort['dir'])
            ->paginate($perPage, 'default', $page);

        return $this->respond([
            'status' => 200,
            'data'   => $data,
            'meta'   => $this->buildMeta($model->pager, [
                // Echo des paramètres — utile pour le cache et le débogage client
                'q'      => $q      ?: null,
                'sort'   => $sort['field'],
                'order'  => strtolower($sort['dir']),
                'fields' => $fields,
            ]),
        ]);
    }

    // ── GET /api/mot/like?q=bre&len=10 ───────────────────────────────────────

    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);

        if (strlen($q) < 1) {
            return $this->respond(['status' => 200, 'data' => [], 'meta' => ['total' => 0]]);
        }

        // Sparse fields : autocomplete n'a besoin que de mot_id + mot_lbl
        $fields = $this->resolveFields();

        $items = $this->getModel()
            ->select(implode(',', $fields))
            ->like('mot_lbl', $q)
            ->orderBy('mot_lbl', 'ASC')
            ->limit($len)
            ->find();

        // Compte total (sans limit) — utile pour signaler "X autres résultats"
        $total = $this->getModel()->like('mot_lbl', $q)->countAllResults();

        return $this->respond([
            'status' => 200,
            'data'   => $items,
            'meta'   => [
                'q'       => $q,
                'len'     => $len,
                'total'   => $total,       // ← nouveau : total sans limit
                'has_more'=> $total > $len, // ← indicateur "il y a plus"
            ],
        ]);
    }

    // ── GET /api/mot/batch?ids=1,2,3 ─────────────────────────────────────────
    // Récupère plusieurs mots en un seul appel.
    // Utile pour lazy loading par lot (ex : tags d'une organisation).

    public function batch()
    {
        $raw = $this->request->getGet('ids') ?? '';
        if (! $raw) {
            return $this->respond(['status' => 200, 'data' => [], 'meta' => ['count' => 0]]);
        }

        $ids    = array_filter(array_map('intval', explode(',', $raw)));
        $fields = $this->resolveFields();

        if (empty($ids)) {
            return $this->fail('ids invalides.', 400);
        }

        // Limite de sécurité
        $ids   = array_slice($ids, 0, 50);
        $items = $this->getModel()
            ->select(implode(',', $fields))
            ->whereIn('mot_id', $ids)
            ->orderBy('mot_lbl', 'ASC')
            ->find();

        return $this->respond([
            'status' => 200,
            'data'   => $items,
            'meta'   => ['count' => count($items), 'ids' => $ids],
        ]);
    }

    // ── GET /api/mot/:id?include=usages ──────────────────────────────────────

    public function show($id = null)
    {
        $item = $this->getModel()->find((int) $id);
        if (! $item) {
            return $this->failNotFound("Mot #{$id} introuvable.");
        }

        // ?include= — sous-ressources optionnelles (stub : prépare le pattern)
        $include = array_filter(explode(',', $this->request->getGet('include') ?? ''));

        if (in_array('usages', $include)) {
            // STUB : retourne un tableau vide pour l'instant.
            // Implémentation future : requête vers tables pivot (org_mots, etc.)
            $item['usages'] = [];   // [] → à remplacer par un vrai modèle pivot
        }

        return $this->respond(['status' => 200, 'data' => $item]);
    }

    // ── POST /api/mot ─────────────────────────────────────────────────────────

    public function create()
    {
        $body  = $this->request->getJSON(true) ?? [];
        $model = $this->getModel();

        $id = $model->insert(array_intersect_key($body, array_flip($model->allowedFields)));

        if (! $id) {
            return $this->failValidationErrors($model->errors());
        }

        return $this->respondCreated([
            'status'  => 201,
            'data'    => $model->find($id),
            'message' => 'Mot créé.',
        ]);
    }

    // ── PUT /api/mot/:id ──────────────────────────────────────────────────────

    public function update($id = null)
    {
        $model = $this->getModel();

        if (! $model->find((int) $id)) {
            return $this->failNotFound("Mot #{$id} introuvable.");
        }

        $body = $this->request->getJSON(true) ?? [];
        $data = array_intersect_key($body, array_flip($model->allowedFields));

        if (! $model->update((int) $id, $data)) {
            return $this->failValidationErrors($model->errors());
        }

        return $this->respond([
            'status'  => 200,
            'data'    => $model->find((int) $id),
            'message' => "Mot #{$id} mis à jour.",
        ]);
    }

    // ── DELETE /api/mot/:id ───────────────────────────────────────────────────

    public function delete($id = null)
    {
        $model = $this->getModel();

        if (! $model->find((int) $id)) {
            return $this->failNotFound("Mot #{$id} introuvable.");
        }

        $model->delete((int) $id);

        return $this->respond([
            'status'  => 200,
            'message' => "Mot #{$id} supprimé.",
        ]);
    }
}
```
