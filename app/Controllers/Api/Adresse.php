<?php
// app/Controllers/Api/Adresse.php
//
// Routes (groupe 'api') :
//   $routes->get   ('adresse',        'Api\Adresse::index');
//   $routes->get   ('adresse/like',   'Api\Adresse::like');      // ← avant (:num)
//   $routes->get   ('adresse/(:num)', 'Api\Adresse::show/$1');
//   $routes->post  ('adresse',        'Api\Adresse::create');
//   $routes->put   ('adresse/(:num)', 'Api\Adresse::update/$1');
//   $routes->delete('adresse/(:num)', 'Api\Adresse::delete/$1');

namespace App\Controllers\Api;

use App\Models\AdresseModel;
use App\Models\CodePostalModel;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;

class Adresse extends ResourceController
{
    use ApiResponse;

    protected $format = 'json';

    private function getModel(): AdresseModel
    {
        return new AdresseModel();
    }

    private function getCpModel(): CodePostalModel
    {
        return new CodePostalModel();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/adresse?q=...&page=1&per_page=20
    // GET /api/adresse?id=42
    // ─────────────────────────────────────────────────────────────────────────
    public function index()
    {
        $model   = $this->getModel();
        $id      = $this->request->getGet('id');
        $q       = trim($this->request->getGet('q') ?? '');
        $page    = max(1, (int) ($this->request->getGet('page')     ?? 1));
        $perPage = max(1, min(100, (int) ($this->request->getGet('per_page') ?? 20)));

        // ── Par id ────────────────────────────────────────────────────────────
        if ($id !== null) {
            $item = $model->withRelations()->find((int) $id);
            return $item
                ? $this->apiOk($this->enrich($item))
                : $this->apiNotFound("Adresse #{$id} introuvable.");
        }

        // ── Recherche texte ───────────────────────────────────────────────────
        if ($q !== '') {
            $data = $model
                ->withRelations()
                ->groupStart()
                    ->like('adresses.voienom',   $q)
                    ->orLike('cp.commune',        $q)
                    ->orLike('cp.codepostal',     $q, 'after')
                    ->orLike('adresses.complement', $q)
                ->groupEnd()
                ->orderBy('cp.codepostal', 'ASC')
                ->paginate($perPage, 'default', $page);

            return $this->apiOk(
                array_map([$this, 'enrich'], $data),
                $model->pager
            );
        }

        // ── Liste paginée ─────────────────────────────────────────────────────
        $data = $model
            ->withRelations()
            ->orderBy('adresses.id', 'DESC')
            ->paginate($perPage, 'default', $page);

        return $this->apiOk(
            array_map([$this, 'enrich'], $data),
            $model->pager
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/adresse/:id
    // ─────────────────────────────────────────────────────────────────────────
    public function show($id = null)
    {
        $item = $this->getModel()->withRelations()->find((int) $id);
        return $item
            ? $this->apiOk($this->enrich($item))
            : $this->apiNotFound("Adresse #{$id} introuvable.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/adresse
    // Body JSON : { voienom, codepostal_id, voietype_id?, voienumero?,
    //               voierpt?, voiecharniere?, complement?,
    //               infodistribution?, precision? }
    // ─────────────────────────────────────────────────────────────────────────
    public function create()
    {
        $body = $this->request->getJSON(true) ?? [];

        // ── Récupération du code postal pour auto-remplissage ─────────────────
        $cpId = (int) ($body['codepostal_id'] ?? 0);
        $cp   = $cpId ? $this->getCpModel()->find($cpId) : null;

        if (! $cp) {
            return $this->apiBadRequest('codepostal_id invalide ou introuvable.');
        }

        // ── Construction du payload avec valeurs par défaut depuis CodePostal ──
        $data = $this->buildPayload($body, $cp);

        $id = $this->getModel()->insert($data);

        if (! $id) {
            return $this->apiValidationError($this->getModel()->errors());
        }

        $item = $this->getModel()->withRelations()->find($id);
        return $this->apiCreated($this->enrich($item), 'Adresse créée.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT /api/adresse/:id
    // ─────────────────────────────────────────────────────────────────────────
    public function update($id = null)
    {
        $model = $this->getModel();
        $item  = $model->find((int) $id);

        if (! $item) {
            return $this->apiNotFound("Adresse #{$id} introuvable.");
        }

        $body = $this->request->getJSON(true) ?? [];

        // Si codepostal_id change → re-déclenche l'auto-remplissage
        $cpId = isset($body['codepostal_id']) ? (int) $body['codepostal_id'] : null;
        $cp   = $cpId ? $this->getCpModel()->find($cpId) : null;

        $data = $this->buildPayload($body, $cp, true);

        if (! $model->update((int) $id, $data)) {
            return $this->apiValidationError($model->errors());
        }

        return $this->apiOk(
            $this->enrich($this->getModel()->withRelations()->find((int) $id)),
            null,
            "Adresse #{$id} mise à jour."
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE /api/adresse/:id
    // ─────────────────────────────────────────────────────────────────────────
    public function delete($id = null)
    {
        $model = $this->getModel();
        $item  = $model->find((int) $id);

        if (! $item) {
            return $this->apiNotFound("Adresse #{$id} introuvable.");
        }

        $model->delete((int) $id);
        return $this->apiDeleted("Adresse #{$id} supprimée.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/adresse/like?q=brest&len=10
    // ─────────────────────────────────────────────────────────────────────────
    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);

        if (strlen($q) < 2) return $this->apiOk([]);

        return $this->apiOk($this->getModel()->suggest($q, $len));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers privés
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Construit le payload d'insert/update.
     * Auto-remplit acheminement, lat/lng, infodistribution depuis CodePostal.
     *
     * @param array      $body     Corps de la requête
     * @param array|null $cp       Enregistrement codes_postaux (null = pas de changement CP)
     * @param bool       $isUpdate Mode update — ne force pas les valeurs déjà présentes
     */
    private function buildPayload(array $body, ?array $cp, bool $isUpdate = false): array
    {
        $data = array_intersect_key($body, array_flip([
            'complement', 'voienumero', 'voierpt', 'voietype_id',
            'voiecharniere', 'voienom', 'infodistribution',
            'codepostal_id', 'acheminement', 'latitude', 'longitude', 'precision',
        ]));

        if ($cp) {
            // acheminement : depuis cp.acheminement ou cp.commune si vide
            if (! isset($data['acheminement']) || $data['acheminement'] === '') {
                $data['acheminement'] = $cp['acheminement'] ?: $cp['commune'];
            }

            // infodistribution : depuis cp.ligne5 si non fourni et non vide
            if (! isset($data['infodistribution']) || $data['infodistribution'] === '') {
                if (! empty($cp['ligne5'])) {
                    $data['infodistribution'] = $cp['ligne5'];
                }
            }

            // latitude / longitude : depuis cp si non fournis
            if (! isset($data['latitude']) && ! empty($cp['latitude'])) {
                $data['latitude']  = $cp['latitude'];
                $data['longitude'] = $cp['longitude'];
                // Précision par défaut = commune (coordonnées du CP)
                if (! isset($data['precision'])) {
                    $data['precision'] = 'commune';
                }
            }
        }

        return $data;
    }

    /**
     * Enrichit un enregistrement avec la ligne 4 formatée.
     * Ex : "125 Bis RUE des Lilas"
     */
    private function enrich(array $row): array
    {
        $row['ligne4'] = AdresseModel::formatLigne4($row);
        return $row;
    }
}
