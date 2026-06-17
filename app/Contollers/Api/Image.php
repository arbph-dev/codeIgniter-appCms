<?php
// app/Controllers/Api/Image.php
//
// Routes à ajouter dans app/Config/Routes.php (groupe 'api') :
//   $routes->get   ('image',        'Api\Image::index');
//   $routes->post  ('image',        'Api\Image::create');
//   $routes->put   ('image/(:num)', 'Api\Image::update/$1');
//   $routes->delete('image/(:num)', 'Api\Image::delete/$1');


namespace App\Controllers\Api;

use App\Models\ImageModel;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;

class Image extends ResourceController
{
    use ApiResponse;

    protected $modelName = ImageModel::class;
    protected $format    = 'json';

    /**
     * GET /api/image?id=1
     * GET /api/image?q=test&page=1&per_page=10
     */
    public function index()
    {
        $id       = $this->request->getGet('id');
        $q        = trim($this->request->getGet('q') ?? '');
        $status   = $this->request->getGet('status');

        $page     = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage  = max(1, (int) ($this->request->getGet('per_page') ?? 10));

        // ── Recherche par ID ─────────────────────────────────────────────
        if ($id) {
            $item = $this->model->find((int) $id);

            return $item
                ? $this->apiOk($item)
                : $this->apiNotFound("Image #{$id} introuvable.");
        }

        // ── Builder ──────────────────────────────────────────────────────
        $builder = $this->model;

        // Recherche texte
        if ($q !== '') {
            $builder = $builder->groupStart()
                ->like('filename', $q)
                ->orLike('alt', $q)
                ->orLike('path', $q)
                ->groupEnd();
        }

        // Filtre statut
        if ($status) {
            $builder = $builder->where('status', $status);
        }

        // Pagination
        $data = $builder
            ->orderBy('id', 'DESC')
            ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $this->model->pager);
    }

    /**
     * GET /api/image/5
     */
    public function show($id = null)
    {
        $item = $this->model->find((int) $id);

        return $item
            ? $this->apiOk($item)
            : $this->apiNotFound("Image #{$id} introuvable.");
    }

    /**
     * POST /api/image
     * multipart/form-data
     */
    public function create()
    {
        $file = $this->request->getFile('file');

        if (! $file || ! $file->isValid() || $file->hasMoved()) {
            return $this->apiBadRequest(
                'Fichier image requis et valide.'
            );
        }

        // ── MIME autorisés ───────────────────────────────────────────────
        $allowedMime = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
        ];

        if (! in_array($file->getMimeType(), $allowedMime, true)) {
            return $this->apiValidationError([
                'file' => 'Type MIME non autorisé : ' . $file->getMimeType()
            ]);
        }

        // ── Dossier upload ───────────────────────────────────────────────
        $uploadDir = FCPATH . 'assets/img/uploads/';

        if (! is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // ── Déplacement fichier ──────────────────────────────────────────
        $newName = $file->getRandomName();
        $file->move($uploadDir, $newName);

        $path = '/assets/img/uploads/' . $newName;

        // ── Dimensions image ─────────────────────────────────────────────
        $imageSize = @getimagesize($uploadDir . $newName);

        $width  = $imageSize[0] ?? 0;
        $height = $imageSize[1] ?? 0;

        $ratio = ($height > 0)
            ? round($width / $height, 6)
            : 0;

        // ── Payload ──────────────────────────────────────────────────────
        $data = [
            'user_id'  => (int) ($this->request->getPost('user_id') ?? 0),
            'width'    => $width,
            'height'   => $height,
            'ratio'    => $ratio,
            'extension'=> strtolower($file->getExtension()),
            'size_ko'  => round($file->getSize() / 1024, 2),

            'path'     => $path,
            'filename' => $newName,

            'alt'      => trim($this->request->getPost('alt') ?? ''),
            'status'   => $this->request->getPost('status') ?? 'pending',
        ];

        // ── Insert ───────────────────────────────────────────────────────
        $id = $this->model->insert($data);

        if (! $id) {

            // rollback fichier physique
            $fullPath = $uploadDir . $newName;

            if (is_file($fullPath)) {
                unlink($fullPath);
            }

            return $this->apiValidationError(
                $this->model->errors()
            );
        }

        return $this->apiCreated(
            $this->model->find($id),
            'Image créée.'
        );
    }

    /**
     * PUT /api/image/:id
     */
    public function update($id = null)
    {
        $item = $this->model->find((int) $id);

        if (! $item) {
            return $this->apiNotFound(
                "Image #{$id} introuvable."
            );
        }

        $body = $this->request->getJSON(true) ?? [];

        // whitelist update
        $data = array_intersect_key($body, array_flip([
            'alt',
            'status',
        ]));

        if (empty($data)) {
            return $this->apiBadRequest(
                'Aucune donnée à mettre à jour.'
            );
        }

        $updated = $this->model->update((int) $id, $data);

        if (! $updated) {
            return $this->apiValidationError(
                $this->model->errors()
            );
        }

        return $this->apiOk(
            $this->model->find((int) $id),
            null,
            "Image #{$id} mise à jour."
        );
    }

    /**
     * DELETE /api/image/:id
     */
    public function delete($id = null)
    {
        $item = $this->model->find((int) $id);

        if (! $item) {
            return $this->apiNotFound(
                "Image #{$id} introuvable."
            );
        }

        // ── Suppression fichier physique ────────────────────────────────
        $fullPath = FCPATH . ltrim($item['path'], '/');

        if (is_file($fullPath)) {
            unlink($fullPath);
        }

        // ── Suppression BDD ─────────────────────────────────────────────
        $this->model->delete((int) $id);

        return $this->apiDeleted(
            "Image #{$id} supprimée."
        );
    }

    /**
     * GET /api/image/like?q=test&len=10
     *
     * Endpoint léger autocomplete
     */
    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min(
            (int) ($this->request->getGet('len') ?? 10),
            50
        );

        if (strlen($q) < 2) {
            return $this->apiOk([]);
        }

        $data = $this->model
            ->select('id, filename, alt, path')
            ->groupStart()
                ->like('filename', $q)
                ->orLike('alt', $q)
            ->groupEnd()
            ->limit($len)
            ->find();

        return $this->apiOk($data);
    }
}
