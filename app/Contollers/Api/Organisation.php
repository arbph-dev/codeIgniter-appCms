<?php
// app/Controllers/Api/Organisation.php
//
// Routes (groupe 'api') :
//   $routes->get   ('organisation',        'Api\Organisation::index');
//   $routes->get   ('organisation/like',   'Api\Organisation::like');
//   $routes->get   ('organisation/(:num)', 'Api\Organisation::show/$1');
//   $routes->post  ('organisation',        'Api\Organisation::create');
//   $routes->put   ('organisation/(:num)', 'Api\Organisation::update/$1');
//   $routes->delete('organisation/(:num)', 'Api\Organisation::delete/$1');

namespace App\Controllers\Api;

use App\Models\OrganisationModel;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;

class Organisation extends ResourceController
{
    use ApiResponse;
    protected $format = 'json';

    private function getModel(): OrganisationModel
    {
        return new OrganisationModel();
    }

    // GET /api/organisation?q=...&type=1&page=1&per_page=20
    public function index()
    {
        $model   = $this->getModel();
        $q       = trim($this->request->getGet('q')       ?? '');
        $typeId  = $this->request->getGet('type');
        $page    = max(1, (int) ($this->request->getGet('page')     ?? 1));
        $perPage = max(1, min(100, (int) ($this->request->getGet('per_page') ?? 20)));

        $builder = $model->withRelations();

        if ($q !== '') {
            $builder->groupStart()
                ->like('organisations.nom', $q)
                ->orLike('organisations.siren', $q)
            ->groupEnd();
        }

        if ($typeId !== null) {
            $builder->where('organisations.organisation_type_id', (int) $typeId);
        }

        $data = $builder
            ->orderBy('organisations.nom', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $model->pager);
    }

    // GET /api/organisation/:id
    public function show($id = null)
    {
        $item = $this->getModel()->withRelations()->find((int) $id);
        return $item
            ? $this->apiOk($item)
            : $this->apiNotFound("Organisation #{$id} introuvable.");
    }

    // POST /api/organisation
    public function create()
    {
        $body = $this->request->getJSON(true) ?? [];
        $model = $this->getModel();

        // Slug auto si absent
        if (empty($body['slug']) && !empty($body['nom'])) {
            $body['slug'] = OrganisationModel::makeSlug($body['nom']);
        }

        $id = $model->insert(array_intersect_key($body, array_flip($model->allowedFields)));

        if (! $id) {
            return $this->apiValidationError($model->errors());
        }

        return $this->apiCreated(
            $this->getModel()->withRelations()->find($id),
            'Organisation créée.'
        );
    }

    // PUT /api/organisation/:id
    public function update($id = null)
    {
        $model = $this->getModel();
        if (! $model->find((int) $id)) {
            return $this->apiNotFound("Organisation #{$id} introuvable.");
        }

        $body = $this->request->getJSON(true) ?? [];
        $data = array_intersect_key($body, array_flip($model->allowedFields));

        if (! $model->update((int) $id, $data)) {
            return $this->apiValidationError($model->errors());
        }

        return $this->apiOk(
            $this->getModel()->withRelations()->find((int) $id),
            null, "Organisation #{$id} mise à jour."
        );
    }

    // DELETE /api/organisation/:id  (soft delete)
    public function delete($id = null)
    {
        $model = $this->getModel();
        if (! $model->find((int) $id)) {
            return $this->apiNotFound("Organisation #{$id} introuvable.");
        }
        $model->delete((int) $id);
        return $this->apiDeleted("Organisation #{$id} supprimée.");
    }

    // GET /api/organisation/like?q=henaff&len=10
    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);
        if (strlen($q) < 2) return $this->apiOk([]);
        return $this->apiOk($this->getModel()->suggest($q, $len));
    }
}
