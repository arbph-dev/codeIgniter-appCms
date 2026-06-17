<?php
// app/Controllers/Api/CodePostal.php
//
// Référentiel en LECTURE SEULE — pas de create/update/delete.
//
// Routes (groupe 'api') :
//   $routes->get('codepostal',        'Api\CodePostal::index');
//   $routes->get('codepostal/like',   'Api\CodePostal::like');   // ← avant (:num)
//   $routes->get('codepostal/(:num)', 'Api\CodePostal::show/$1');
//
// Exemples :
//   GET /api/codepostal?q=29&page=1&per_page=20   → code postal ou commune
//   GET /api/codepostal?q=quimper                 → recherche commune
//   GET /api/codepostal?codepostal=29000          → exact code postal
//   GET /api/codepostal?codeinsee=29232           → exact code INSEE
//   GET /api/codepostal/42                        → par id interne
//   GET /api/codepostal/like?q=29&len=15          → autocomplete

namespace App\Controllers\Api;

use App\Models\CodePostalModel;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;

class CodePostal extends ResourceController
{
    use ApiResponse;

    protected $modelName = CodePostalModel::class;
    protected $format    = 'json';

    // ── GET /api/codepostal ───────────────────────────────────────────────────
    public function index()
    {
        $q          = trim($this->request->getGet('q')          ?? '');
        $codepostal = trim($this->request->getGet('codepostal') ?? '');
        $codeinsee  = trim($this->request->getGet('codeinsee')  ?? '');
        $page       = max(1, (int) ($this->request->getGet('page')     ?? 1));
        $perPage    = max(1, min(100, (int) ($this->request->getGet('per_page') ?? 20)));

        // ── Filtre code INSEE exact ───────────────────────────────────────────
        if ($codeinsee !== '') {
            $data = $this->model
                ->where('codeinsee', $codeinsee)
                ->orderBy('codepostal', 'ASC')
                ->paginate($perPage, 'default', $page);

            return $this->apiOk($data, $this->model->pager);
        }

        // ── Filtre code postal exact ──────────────────────────────────────────
        if ($codepostal !== '') {
            $data = $this->model
                ->where('codepostal', $codepostal)
                ->orderBy('commune', 'ASC')
                ->paginate($perPage, 'default', $page);

            return $this->apiOk($data, $this->model->pager);
        }

        // ── Recherche texte libre (code postal OU commune) ────────────────────
        if ($q !== '') {
            if (strlen($q) < 2) {
                return $this->apiBadRequest('La recherche doit contenir au moins 2 caractères.');
            }

            $data = $this->model
                ->search($q)
                ->orderBy('codepostal', 'ASC')
                ->paginate($perPage, 'default', $page);

            return $this->apiOk($data, $this->model->pager);
        }

        // ── Liste paginée (sans filtre) ───────────────────────────────────────
        $data = $this->model
            ->orderBy('codepostal', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $this->model->pager);
    }

    // ── GET /api/codepostal/:id ───────────────────────────────────────────────
    public function show($id = null)
    {
        $item = $this->model->find((int) $id);
        return $item
            ? $this->apiOk($item)
            : $this->apiNotFound("Code postal #$id introuvable.");
    }

    // ── GET /api/codepostal/like?q=29&len=15 ─────────────────────────────────
    // Autocomplete — priorise les codes postaux puis les communes
    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 15), 50);

        if (strlen($q) < 2) {
            return $this->apiOk([]);
        }

        return $this->apiOk(
            $this->model->suggest($q, $len)
        );
    }
}
