<?php
// app/Controllers/Api/Etablissement.php
//
// Routes (groupe 'api') :
//   GET    etablissement                             → index
//   GET    etablissement/like                        → like
//   GET    etablissement/(:num)                      → show/$1
//   POST   etablissement                             → create
//   PUT    etablissement/(:num)                      → update/$1
//   DELETE etablissement/(:num)                      → delete/$1
//   GET    organisation/(:num)/etablissements        → byOrganisation/$1
//   POST   organisation/(:num)/etablissement         → siege/$1

namespace App\Controllers\Api;

use App\Models\EtablissementModel;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;

class Etablissement extends ResourceController
{
    use ApiResponse;

    protected $format = 'json';

    private function getModel(): EtablissementModel
    {
        return new EtablissementModel();
    }

    // ── GET /api/etablissement ──────────────────────────────────────────
    // ?q=       recherche siret / nom / org.nom
    // ?org=     filtre organisation_id
    // ?siege=1  filtre is_siege
    // ?actif=1  filtre actif
    // ?page=  &per_page=

    public function index()
    {
        $model   = $this->getModel();
        $q       = trim($this->request->getGet('q')       ?? '');
        $orgId   = $this->request->getGet('org');
        $siege   = $this->request->getGet('siege');
        $actif   = $this->request->getGet('actif');
        $page    = max(1, (int) ($this->request->getGet('page')     ?? 1));
        $perPage = max(1, min(100, (int) ($this->request->getGet('per_page') ?? 20)));

        $builder = $model->withRelations();

        if ($q !== '') {
            $builder->groupStart()
                ->like('etablissements.siret', $q, 'after')
                ->orLike('etablissements.nom',  $q)
                ->orLike('o.nom',               $q)
            ->groupEnd();
        }

        if ($orgId !== null) {
            $builder->where('etablissements.organisation_id', (int) $orgId);
        }

        if ($siege !== null) {
            $builder->where('etablissements.is_siege', (int) $siege);
        }

        if ($actif !== null) {
            $builder->where('etablissements.actif', (int) $actif);
        }

        $data = $builder
            ->orderBy('etablissements.is_siege', 'DESC')
            ->orderBy('etablissements.nom',      'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->apiOk(
            EtablissementModel::enrichAll($data),
            $model->pager
        );
    }

    // ── GET /api/etablissement/:id ──────────────────────────────────────

    public function show($id = null)
    {
        $item = $this->getModel()->withRelations()->find((int) $id);

        return $item
            ? $this->apiOk(EtablissementModel::enrich($item))
            : $this->apiNotFound("Établissement #{$id} introuvable.");
    }

    // ── POST /api/etablissement ─────────────────────────────────────────
    // Création directe d'un établissement (pas nécessairement un siège).
    // Pour créer / mettre à jour un siège, utiliser POST /organisation/:id/etablissement.

    public function create()
    {
        $body  = $this->request->getJSON(true) ?? [];
        $model = $this->getModel();

        // NIC dérivé automatiquement du SIRET si absent
        if (empty($body['nic']) && ! empty($body['siret'])) {
            $siret = preg_replace('/\D/', '', (string) $body['siret']);
            if (strlen($siret) === 14) {
                $body['nic'] = substr($siret, 9, 5);
            }
        }

        $id = $model->insert(array_intersect_key($body, array_flip($model->allowedFields)));

        if (! $id) {
            return $this->apiValidationError($model->errors());
        }

        $created = $this->getModel()->withRelations()->find($id);

        return $this->apiCreated(
            EtablissementModel::enrich($created),
            'Établissement créé.'
        );
    }

    // ── PUT /api/etablissement/:id ──────────────────────────────────────

    public function update($id = null)
    {
        $model = $this->getModel();

        if (! $model->find((int) $id)) {
            return $this->apiNotFound("Établissement #{$id} introuvable.");
        }

        $body = $this->request->getJSON(true) ?? [];
        $data = array_intersect_key($body, array_flip($model->allowedFields));

        // Recalcul NIC si le SIRET change
        if (! empty($data['siret']) && empty($data['nic'])) {
            $siret = preg_replace('/\D/', '', (string) $data['siret']);
            if (strlen($siret) === 14) {
                $data['nic'] = substr($siret, 9, 5);
            }
        }

        if (! $model->update((int) $id, $data)) {
            return $this->apiValidationError($model->errors());
        }

        $updated = $this->getModel()->withRelations()->find((int) $id);

        return $this->apiOk(
            EtablissementModel::enrich($updated),
            null,
            "Établissement #{$id} mis à jour."
        );
    }

    // ── DELETE /api/etablissement/:id ───────────────────────────────────
    // Hard delete (pas de deleted_at pour l'instant — priorité basse).
    // Si tu ajoutes le soft delete : activer $useSoftDeletes dans le model,
    // ajouter la colonne deleted_at, et supprimer ce commentaire.

    public function delete($id = null)
    {
        $model = $this->getModel();

        if (! $model->find((int) $id)) {
            return $this->apiNotFound("Établissement #{$id} introuvable.");
        }

        $model->delete((int) $id);
        return $this->apiDeleted("Établissement #{$id} supprimé.");
    }

    // ── GET /api/etablissement/like?q=…&len=10 ──────────────────────────

    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);

        if (strlen($q) < 2) {
            return $this->apiOk([]);
        }

        // suggest() retourne id+siret+nom+organisation_nom : pas d'adresse → pas d'enrich
        return $this->apiOk($this->getModel()->suggest($q, $len));
    }

    // ── GET /api/organisation/:orgId/etablissements ─────────────────────
    // Liste tous les établissements d'une organisation (siège en tête).

    public function byOrganisation($orgId = null)
    {
        $rows = $this->getModel()->byOrganisation((int) $orgId);

        return $this->apiOk(EtablissementModel::enrichAll($rows));
    }

    // ── POST /api/organisation/:orgId/etablissement ─────────────────────
    // Crée ou met à jour le siège social via EntrepriseService::ensureSiege().
    // Corps attendu : siret (obligatoire), adresse_id?, nom?, siren?

    public function siege($orgId = null)
    {
        $body = $this->request->getJSON(true) ?? [];

        if (empty($body['siret'])) {
            return $this->apiError('Le champ siret est obligatoire.', 422);
        }

        try {
            $raw = service('entreprise')->ensureSiege(
                (int) $orgId,
                (string) $body['siret'],
                isset($body['adresse_id']) ? (int) $body['adresse_id'] : null,
                $body['nom']   ?? null,
                $body['siren'] ?? null
            );

            // ensureSiege() retourne find() sans join : on refetch avec withRelations()
            $full = $this->getModel()->withRelations()->find((int) $raw['id']);

            return $this->apiCreated(
                EtablissementModel::enrich($full),
                'Siège créé / mis à jour.'
            );
        } catch (\InvalidArgumentException $e) {
            return $this->apiError($e->getMessage(), 422);
        } catch (\RuntimeException $e) {
            $code = str_contains($e->getMessage(), 'introuvable') ? 404 : 422;
            return $this->apiError($e->getMessage(), $code);
        } catch (\Throwable $e) {
            return $this->apiError($e->getMessage(), 500);
        }
    }
}
