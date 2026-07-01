<?php
// app/Traits/ApiResponse.php
//
// Usage dans un contrôleur :
//
//   use App\Traits\ApiResponse;
//   class Mot extends ResourceController {
//       use ApiResponse;
//
//       public function index() {
//           $data = $this->model->paginate(20);
//           return $this->apiOk($data, $this->model->pager);
//       }
//
//       public function show($id) {
//           $item = $this->model->find($id);
//           if (! $item) return $this->apiNotFound("Mot #{$id} introuvable.");
//           return $this->apiOk($item);
//       }
//   }
//
// Structure de réponse :
// {
//   "status"  : 200,                // code HTTP
//   "message" : "OK",               // message lisible
//   "data"    : [...],              // payload (tableau, objet, ou null)
//   "pager"   : { ... }             // présent uniquement si paginator fourni
// }

namespace App\Traits;

// use CodeIgniter\Pager\PagerInterface;  // ← cette ligne doit être présente
use CodeIgniter\Pager\Pager; // Remplacer PagerInterface par la classe concrète

trait ApiResponse
{
    // ── Succès ────────────────────────────────────────────────────────────────

    /**
     * 200 OK avec données (et paginateur optionnel)
     *
     * @param mixed               $data
     * @param Pager|null $pager  Paginateur CI4 issu de ->paginate()
     * @param string              $message
     */
//    protected function apiOk($data, ?PagerInterface $pager = null, string $message = 'OK')
    protected function apiOk($data, ?Pager $pager = null, string $message = 'OK')
    {
        $body = [
            'status'  => 200,
            'message' => $message,
            'data'    => $data,
        ];

        if ($pager !== null) {
            $body['pager'] = $this->buildPager($pager);
        }

        return $this->response
            ->setStatusCode(200)
            ->setJSON($body);
    }

    /**
     * 201 Created
     */
    protected function apiCreated($data, string $message = 'Créé avec succès.')
    {
        return $this->response
            ->setStatusCode(201)
            ->setJSON([
                'status'  => 201,
                'message' => $message,
                'data'    => $data,
            ]);
    }

    /**
     * 204 No Content (DELETE)
     */
    protected function apiDeleted(string $message = 'Supprimé.')
    {
        return $this->response
            ->setStatusCode(200) // 204 n'a pas de body — on préfère 200 pour les SPA
            ->setJSON([
                'status'  => 200,
                'message' => $message,
                'data'    => null,
            ]);
    }

    // ── Erreurs ───────────────────────────────────────────────────────────────

    /**
     * 400 Bad Request (validation côté appelant)
     */
    protected function apiBadRequest(string $message = 'Requête invalide.', $errors = null)
    {
        $body = [
            'status'  => 400,
            'message' => $message,
            'data'    => null,
        ];
        if ($errors !== null) $body['errors'] = $errors;

        return $this->response->setStatusCode(400)->setJSON($body);
    }

    /**
     * 401 Unauthorized
     */
    protected function apiUnauthorized(string $message = 'Non authentifié.')
    {
        return $this->response
            ->setStatusCode(401)
            ->setJSON(['status' => 401, 'message' => $message, 'data' => null]);
    }

    /**
     * 403 Forbidden
     */
    protected function apiForbidden(string $message = 'Accès refusé.')
    {
        return $this->response
            ->setStatusCode(403)
            ->setJSON(['status' => 403, 'message' => $message, 'data' => null]);
    }

    /**
     * 404 Not Found
     */
    protected function apiNotFound(string $message = 'Ressource introuvable.')
    {
        return $this->response
            ->setStatusCode(404)
            ->setJSON(['status' => 404, 'message' => $message, 'data' => null]);
    }

    /**
     * 422 Unprocessable Entity (erreurs de validation modèle)
     */
    protected function apiValidationError(array $errors, string $message = 'Données invalides.')
    {
        return $this->response
            ->setStatusCode(422)
            ->setJSON([
                'status'  => 422,
                'message' => $message,
                'data'    => null,
                'errors'  => $errors,
            ]);
    }

    /**
     * 500 Internal Server Error
     */
    protected function apiError(string $message = 'Erreur serveur.')
    {
        return $this->response
            ->setStatusCode(500)
            ->setJSON(['status' => 500, 'message' => $message, 'data' => null]);
    }

    // ── Helper paginateur ────────────────────────────────────────────────────

    /**
     * Normalise le paginateur CI4 en tableau standard.
     * Compatible avec $model->pager après ->paginate().
     */
    private function buildPager(Pager $pager): array
    {
        return [
            'currentPage' => (int) $pager->getCurrentPage(),
            'perPage'     => (int) $pager->getPerPage(),
            'total'       => (int) $pager->getTotal(),
            'pageCount'   => (int) $pager->getPageCount(),
        ];
    }
}
