<?php
// app/Controllers/Api/Entreprise.php
//
// Routes (groupe 'api') :
//   GET    entreprise
//   GET    entreprise/like
//   GET    entreprise/(:num)
//   POST   entreprise
//   PUT    entreprise/(:num)
//   DELETE entreprise/(:num)
//   POST   organisation/(:num)/entreprise   → attach

namespace App\Controllers\Api;

use App\Models\EntrepriseModel;
use App\Models\OrganisationModel;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;

class Entreprise extends ResourceController
{
    use ApiResponse;

    protected $format = 'json';

    private function getModel(): EntrepriseModel
    {
        return new EntrepriseModel();
    }

    // ── GET /api/entreprise ─────────────────────────────────────────

    public function index()
    {
        $model   = $this->getModel();
        $q       = trim($this->request->getGet('q') ?? '');
        $page    = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = max(1, min(100, (int) ($this->request->getGet('per_page') ?? 20)));

        $builder = $model->withRelations();

        if ($q !== '') {
            $builder->groupStart()
                ->like('o.nom', $q)
                ->orLike('o.siren', $q, 'after')
            ->groupEnd();
        }

        $data = $builder
            ->orderBy('o.nom', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $model->pager);
    }

    // ── GET /api/entreprise/:id ─────────────────────────────────────

    public function show($id = null)
    {
        try {
            $item = service('entreprise')->find((int) $id);
            return $item
                ? $this->apiOk($item)
                : $this->apiNotFound("Entreprise #{$id} introuvable.");
        } catch (\Throwable $e) {
            return $this->apiError($e->getMessage(), 500);
        }
    }

    // ── POST /api/entreprise ────────────────────────────────────────
    // Crée organisation + entreprise + siège (si siret).

    public function create()
    {
        $body = $this->request->getJSON(true) ?? [];

        try {
            $result = service('entreprise')->createWithOrganisation($body);
            return $this->apiCreated($result, 'Entreprise créée.');
        } catch (\InvalidArgumentException $e) {
            return $this->apiError($e->getMessage(), 422);
        } catch (\RuntimeException $e) {
            return $this->apiError($e->getMessage(), 422);
        } catch (\Throwable $e) {
            return $this->apiError($e->getMessage(), 500);
        }
    }

    // ── POST /api/organisation/:id/entreprise ───────────────────────
    // Rattache une extension entreprise à une org existante.

    public function attach($orgId = null)
    {
        $body = $this->request->getJSON(true) ?? [];

        try {
            $result = service('entreprise')->attachToOrganisation((int) $orgId, $body);
            return $this->apiCreated($result, 'Entreprise rattachée.');
        } catch (\InvalidArgumentException $e) {
            return $this->apiError($e->getMessage(), 422);
        } catch (\RuntimeException $e) {
            return $this->apiError($e->getMessage(), 422);
        } catch (\Throwable $e) {
            return $this->apiError($e->getMessage(), 500);
        }
    }

    // ── PUT /api/entreprise/:id ─────────────────────────────────────

    public function update($id = null)
    {
        $body = $this->request->getJSON(true) ?? [];

        try {
            $result = service('entreprise')->update((int) $id, $body);
            return $this->apiOk($result, null, "Entreprise #{$id} mise à jour.");
        } catch (\InvalidArgumentException $e) {
            return $this->apiError($e->getMessage(), 422);
        } catch (\RuntimeException $e) {
            // introuvable ou règle métier
            $code = str_contains($e->getMessage(), 'introuvable') ? 404 : 422;
            return $this->apiError($e->getMessage(), $code);
        } catch (\Throwable $e) {
            return $this->apiError($e->getMessage(), 500);
        }
    }

    // ── DELETE /api/entreprise/:id ──────────────────────────────────
    // Soft delete via organisation mère (comportement historique).

    public function delete($id = null)
    {
        $ent = $this->getModel()->find((int) $id);
        if (! $ent) {
            return $this->apiNotFound("Entreprise #{$id} introuvable.");
        }

        (new OrganisationModel())->delete($ent['organisation_id']);

        return $this->apiDeleted("Entreprise #{$id} supprimée.");
    }

    // ── GET /api/entreprise/like?q=…&len=10 ─────────────────────────

    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);

        if (strlen($q) < 2) {
            return $this->apiOk([]);
        }

        return $this->apiOk($this->getModel()->suggest($q, $len));
    }
}
