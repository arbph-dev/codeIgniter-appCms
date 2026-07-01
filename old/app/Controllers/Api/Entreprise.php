<?php
// app/Controllers/Api/Entreprise.php
//
// Routes (groupe 'api') :
//   $routes->get   ('entreprise',        'Api\Entreprise::index');
//   $routes->get   ('entreprise/like',   'Api\Entreprise::like');
//   $routes->get   ('entreprise/(:num)', 'Api\Entreprise::show/$1');
//   $routes->post  ('entreprise',        'Api\Entreprise::create');
//   $routes->put   ('entreprise/(:num)', 'Api\Entreprise::update/$1');
//   $routes->delete('entreprise/(:num)', 'Api\Entreprise::delete/$1');

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

    // GET /api/entreprise?q=...&page=1&per_page=20
    public function index()
    {
        $model   = $this->getModel();
        $q       = trim($this->request->getGet('q') ?? '');
        $page    = max(1, (int) ($this->request->getGet('page')     ?? 1));
        $perPage = max(1, min(100, (int) ($this->request->getGet('per_page') ?? 20)));

        $builder = $model->withRelations();

        if ($q !== '') {
            $builder->groupStart()
                ->like('o.nom',              $q)
                ->orLike('entreprises.siret', $q, 'after')
                ->orLike('o.siren',           $q, 'after')
            ->groupEnd();
        }

        $data = $builder
            ->orderBy('o.nom', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $model->pager);
    }

    // GET /api/entreprise/:id
    public function show($id = null)
    {
        $item = $this->getModel()->withRelations()->find((int) $id);
        return $item
            ? $this->apiOk($item)
            : $this->apiNotFound("Entreprise #{$id} introuvable.");
    }

    // POST /api/entreprise
    // Body : { nom, organisation_type_id?, site_web?, urlreg?,
    //          siret?, codenaf_id?, forme_juridique_id?,
    //          capital?, effectif_min?, effectif_max? }
    //
    // Crée l'organisation mère + l'enregistrement entreprise en une transaction.
    public function create()
    {
        $body = $this->request->getJSON(true) ?? [];
        $db   = \Config\Database::connect();

        $db->transStart();

        // ── 1. Organisation mère ──────────────────────────────
        $orgModel = new OrganisationModel();
        $orgData  = array_intersect_key($body, array_flip([
            'nom', 'slug', 'organisation_type_id',
            'description', 'site_web', 'urlreg',
            'email', 'telephone', 'siren',
            'lien_facebook', 'lien_instagram', 'lien_linkedin',
            'adresse_id', 'logo_id', 'cover_id',
        ]));

        // Type par défaut : ENTREPRISE (id=1)
        if (empty($orgData['organisation_type_id'])) {
            $orgData['organisation_type_id'] = 1;
        }

        if (empty($orgData['slug']) && ! empty($orgData['nom'])) {
            $orgData['slug'] = OrganisationModel::makeSlug($orgData['nom']);
        }

        $orgId = $orgModel->insert($orgData);

        if (! $orgId) {
            $db->transRollback();
            return $this->apiValidationError($orgModel->errors());
        }

        // ── 2. Entreprise ─────────────────────────────────────
        $entModel = $this->getModel();
        $entData  = array_intersect_key($body, array_flip([
            'siret', 'codenaf_id', 'forme_juridique_id',
            'capital', 'effectif_min', 'effectif_max',
        ]));
        $entData['organisation_id'] = $orgId;

        $entId = $entModel->insert($entData);

        if (! $entId) {
            $db->transRollback();
            return $this->apiValidationError($entModel->errors());
        }

        $db->transComplete();

        if (! $db->transStatus()) {
            return $this->apiError('Erreur de transaction.');
        }

        return $this->apiCreated(
            $this->getModel()->withRelations()->find($entId),
            'Entreprise créée.'
        );
    }

    // PUT /api/entreprise/:id
    // Met à jour l'organisation mère ET les champs entreprise.
    public function update($id = null)
    {
        $model = $this->getModel();
        $ent   = $model->find((int) $id);

        if (! $ent) {
            return $this->apiNotFound("Entreprise #{$id} introuvable.");
        }

        $body = $this->request->getJSON(true) ?? [];
        $db   = \Config\Database::connect();
        $db->transStart();

        // Organisation mère
        $orgFields = array_flip([
            'nom', 'slug', 'organisation_type_id',
            'description', 'site_web', 'urlreg',
            'email', 'telephone', 'siren',
            'lien_facebook', 'lien_instagram', 'lien_linkedin',
            'adresse_id', 'logo_id', 'cover_id',
        ]);
        $orgData = array_intersect_key($body, $orgFields);

        if (! empty($orgData)) {
            (new OrganisationModel())->update($ent['organisation_id'], $orgData);
        }

        // Entreprise
        $entFields = array_flip([
            'siret', 'codenaf_id', 'forme_juridique_id',
            'capital', 'effectif_min', 'effectif_max',
        ]);
        $entData = array_intersect_key($body, $entFields);

        if (! empty($entData) && ! $model->update((int) $id, $entData)) {
            $db->transRollback();
            return $this->apiValidationError($model->errors());
        }

        $db->transComplete();

        return $this->apiOk(
            $this->getModel()->withRelations()->find((int) $id),
            null, "Entreprise #{$id} mise à jour."
        );
    }

    // DELETE /api/entreprise/:id  (soft delete via organisation)
    public function delete($id = null)
    {
        $ent = $this->getModel()->find((int) $id);
        if (! $ent) {
            return $this->apiNotFound("Entreprise #{$id} introuvable.");
        }
        // Soft delete sur organisations (cascade logique)
        (new OrganisationModel())->delete($ent['organisation_id']);
        return $this->apiDeleted("Entreprise #{$id} supprimée.");
    }

    // GET /api/entreprise/like?q=henaff&len=10
    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);
        if (strlen($q) < 2) return $this->apiOk([]);
        return $this->apiOk($this->getModel()->suggest($q, $len));
    }
}
