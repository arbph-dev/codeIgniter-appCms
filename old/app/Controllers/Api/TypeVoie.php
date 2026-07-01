<?php
// app/Controllers/Api/TypeVoie.php
//
// Routes (groupe 'api') — à ajouter dans app/Config/Routes.php :
//   $routes->get   ('typevoie',        'Api\TypeVoie::index');
//   $routes->get   ('typevoie/like',   'Api\TypeVoie::like');    // ← avant (:num)
//   $routes->get   ('typevoie/(:num)', 'Api\TypeVoie::show/$1');
//   $routes->post  ('typevoie',        'Api\TypeVoie::create');
//   $routes->put   ('typevoie/(:num)', 'Api\TypeVoie::update/$1');
//   $routes->delete('typevoie/(:num)', 'Api\TypeVoie::delete/$1');
//
// Exemples :
//   GET  /api/typevoie               → liste complète paginée
//   GET  /api/typevoie?q=rue         → recherche libellé
//   GET  /api/typevoie?id=50         → par id
//   GET  /api/typevoie/50            → par id (REST)
//   GET  /api/typevoie/like?q=av     → autocomplete

namespace App\Controllers\Api;

use App\Models\TypeVoieModel;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;

class TypeVoie extends ResourceController
{
    use ApiResponse;

    protected $modelName = TypeVoieModel::class;
    protected $format    = 'json';

    // ── GET /api/typevoie ─────────────────────────────────────────────────────
    public function index()
    {
        $id      = $this->request->getGet('id');
        $q       = trim($this->request->getGet('q') ?? '');
        $page    = max(1, (int) ($this->request->getGet('page')     ?? 1));
        $perPage = max(1, (int) ($this->request->getGet('per_page') ?? 20));
        $status = $this->request->getGet('status');// GET /api/typevoie?status=pending

        if ($id !== null) {
            $item = $this->model->find((int) $id);
            return $item
                ? $this->apiOk($item)
                : $this->apiNotFound("Type de voie #{$id} introuvable.");
        }
        
        if ($status !== null) {
            $builder = $this->model->where('status', $status);
            $data = $builder
                ->orderBy('nom', 'ASC')
                ->paginate($perPage, 'default', $page);
            return $this->apiOk($data, $this->model->pager);
        }

        $builder = $q !== ''
            ? $this->model->like('nom', $q)
            : $this->model;

        $data = $builder
            ->orderBy('nom', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $this->model->pager);
    }

    // ── GET /api/typevoie/:id ─────────────────────────────────────────────────
    public function show($id = null)
    {
        $item = $this->model->find((int) $id);
        return $item
            ? $this->apiOk($item)
            : $this->apiNotFound("Type de voie #{$id} introuvable.");
    }

    // ── POST /api/typevoie   { "id": 64, "nom": "Voie verte" } ───────────────
    public function create()
    {
        $body = $this->request->getJSON(true) ?? [];
        $id   = isset($body['id']) ? (int) $body['id'] : null;
        $nom  = trim($body['nom'] ?? '');

        if (! $id || $nom === '') {
            return $this->apiBadRequest('Les champs id (entier) et nom sont requis.');
        }

        $inserted = $this->model->insert(['id' => $id, 'nom' => $nom]);

        if (! $inserted) {
            return $this->apiValidationError($this->model->errors());
        }

        return $this->apiCreated(
            $this->model->find($id),
            "Type de voie #{$id} créé."
        );
    }

    // ── PUT /api/typevoie/:id   { "nom": "Nouveau libellé" } ─────────────────
    public function update($id = null)
    {
        $id   = (int) $id;
        $item = $this->model->find($id);

        if (! $item) {
            return $this->apiNotFound("Type de voie #{$id} introuvable.");
        }

        $body = $this->request->getJSON(true) ?? [];
        $nom  = trim($body['nom'] ?? '');

        if ($nom === '') {
            return $this->apiBadRequest('Le champ nom est requis.');
        }

        $updated = $this->model->update($id, ['nom' => $nom]);

        if (! $updated) {
            return $this->apiValidationError($this->model->errors());
        }

        return $this->apiOk(
            $this->model->find($id),
            null,
            "Type de voie #{$id} mis à jour."
        );
    }

    // ── DELETE /api/typevoie/:id ──────────────────────────────────────────────
    public function delete($id = null)
    {
        $id   = (int) $id;
        $item = $this->model->find($id);

        if (! $item) {
            return $this->apiNotFound("Type de voie #{$id} introuvable.");
        }

        $this->model->delete($id);

        return $this->apiDeleted("Type de voie #{$id} supprimé.");
    }

    // ── GET /api/typevoie/like?q=av&len=10 ───────────────────────────────────
    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 63);

        if (strlen($q) < 1) {
            return $this->apiOk([]);
        }

        $data = $this->model
            ->select('id, nom')
            ->like('nom', $q)
            ->orderBy('nom', 'ASC')
            ->limit($len)
            ->find();

        return $this->apiOk($data);
    }
}
