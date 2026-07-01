<?php
// app/Controllers/Api/FormeJuridique.php
//
// Routes à ajouter dans app/Config/Routes.php (groupe 'api') :
//   $routes->get   ('formejuridique',        'Api\FormeJuridique::index');
//   $routes->get   ('formejuridique/like',   'Api\FormeJuridique::like');
//   $routes->get   ('formejuridique/(:any)', 'Api\FormeJuridique::show/$1');
//   $routes->post  ('formejuridique',        'Api\FormeJuridique::create');
//   $routes->put   ('formejuridique/(:any)', 'Api\FormeJuridique::update/$1');
//   $routes->delete('formejuridique/(:any)', 'Api\FormeJuridique::delete/$1');
//
// (:any) et non (:num) — la PK est un CHAR(4), pas un entier.
//
// Exemples :
//   GET  /api/formejuridique                      → liste paginée
//   GET  /api/formejuridique?q=soci&page=1        → recherche
//   GET  /api/formejuridique?id=5499              → par code
//   GET  /api/formejuridique/5499                 → par code (REST)
//   GET  /api/formejuridique/like?q=soci&len=10   → autocomplete
//   POST /api/formejuridique                      → créer
//   PUT  /api/formejuridique/5499                 → modifier
//   DELETE /api/formejuridique/5499               → supprimer

namespace App\Controllers\Api;

use App\Models\FormeJuridiqueModel;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;

class FormeJuridique extends ResourceController
{
    use ApiResponse;

    protected $modelName = FormeJuridiqueModel::class;
    protected $format    = 'json';

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/formejuridique
    // GET /api/formejuridique?id=5499
    // GET /api/formejuridique?q=soci&page=1&per_page=20
    // ─────────────────────────────────────────────────────────────────────────
    public function index()
    {
        $id      = $this->request->getGet('id');
        $q       = trim($this->request->getGet('q') ?? '');
        $page    = max(1, (int) ($this->request->getGet('page')     ?? 1));
        $perPage = max(1, (int) ($this->request->getGet('per_page') ?? 20));

        // ── Recherche par code exact ──────────────────────────────────────────
        if ($id !== null) {
            $item = $this->model->find($this->padId($id));
            return $item
                ? $this->apiOk($item)
                : $this->apiNotFound("Forme juridique « {$id} » introuvable.");
        }

        // ── Builder ───────────────────────────────────────────────────────────
        $builder = $q !== ''
            ? $this->model->like('description', $q)
            : $this->model;

        $data = $builder
            ->orderBy('id', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $this->model->pager);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/formejuridique/5499
    // ─────────────────────────────────────────────────────────────────────────
    public function show($id = null)
    {
        $item = $this->model->find($this->padId($id));
        return $item
            ? $this->apiOk($item)
            : $this->apiNotFound("Forme juridique « {$id} » introuvable.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/formejuridique   { "id": "9999", "description": "Mon libellé" }
    // ─────────────────────────────────────────────────────────────────────────
    public function create()
    {
        $body = $this->request->getJSON(true) ?? [];

        $id          = $this->padId($body['id'] ?? '');
        $description = trim($body['description'] ?? '');

        if ($id === '' || $description === '') {
            return $this->apiBadRequest('Les champs id (4 chiffres) et description sont requis.');
        }

        $inserted = $this->model->insert(['id' => $id, 'description' => $description]);

        if (! $inserted) {
            return $this->apiValidationError($this->model->errors());
        }

        return $this->apiCreated(
            $this->model->find($id),
            "Forme juridique « {$id} » créée."
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT /api/formejuridique/5499   { "description": "Nouveau libellé" }
    // ─────────────────────────────────────────────────────────────────────────
    public function update($id = null)
    {
        $id   = $this->padId($id);
        $item = $this->model->find($id);

        if (! $item) {
            return $this->apiNotFound("Forme juridique « {$id} » introuvable.");
        }

        $body        = $this->request->getJSON(true) ?? [];
        $description = trim($body['description'] ?? '');

        if ($description === '') {
            return $this->apiBadRequest('Le champ description est requis.');
        }

        $updated = $this->model->update($id, ['description' => $description]);

        if (! $updated) {
            return $this->apiValidationError($this->model->errors());
        }

        return $this->apiOk(
            $this->model->find($id),
            null,
            "Forme juridique « {$id} » mise à jour."
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE /api/formejuridique/5499
    // ─────────────────────────────────────────────────────────────────────────
    public function delete($id = null)
    {
        $id   = $this->padId($id);
        $item = $this->model->find($id);

        if (! $item) {
            return $this->apiNotFound("Forme juridique « {$id} » introuvable.");
        }

        $this->model->delete($id);

        return $this->apiDeleted("Forme juridique « {$id} » supprimée.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/formejuridique/like?q=soci&len=10
    // Autocomplete léger — id + description uniquement
    // ─────────────────────────────────────────────────────────────────────────
    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);

        if (strlen($q) < 2) {
            return $this->apiOk([]);
        }

        $data = $this->model
            ->select('id, description')
            ->like('description', $q)
            ->orderBy('id', 'ASC')
            ->limit($len)
            ->find();

        return $this->apiOk($data);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper — normalise le code sur 4 chiffres ("5" → "0005")
    // ─────────────────────────────────────────────────────────────────────────
    private function padId($id): string
    {
        return str_pad(trim((string) $id), 4, '0', STR_PAD_LEFT);
    }
}
