<?php
//app/Controllers/Api/AuthController.php
namespace App\Controllers\Api;

use App\Controllers\BaseController;
//use App\Models\UserModel;
use CodeIgniter\Shield\Entities\User;

class AuthController extends BaseController
{



    // ─── POST /api/login ─────────────────────────────────────────
/*
Diagnostic
L'erreur vient de AuthController::login() : 
appel auth()->attempt() qui utilise l'authenticator Session par défaut
    il reste des données de session d'une connexion précédente.
    Le auth()->logout() en tête de méthode ne suffit pas 

La vraie solution pour un endpoint API token : ne pas toucher à l'authenticator Session du tout, et vérifier les credentials directement via le UserProvider.

*/

    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required|min_length[8]',
        ];

        if (! $this->validate($rules)) {
            return $this->response
                ->setStatusCode(422)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $credentials = [
            'email'    => $this->request->getVar('email'),
            'password' => $this->request->getVar('password'),
        ];

        // ✅ Vérifie les credentials SANS toucher à la session
        /** @var \CodeIgniter\Shield\Authentication\Authenticators\Session $authenticator */
        $authenticator = auth('session')->getAuthenticator();
        $result = $authenticator->check($credentials);

        if (! $result->isOK()) {
            return $this->response
                ->setStatusCode(401)
                ->setJSON(['error' => 'Email ou mot de passe invalide']);
        }

        // L'utilisateur validé est dans extraInfo()
        $user  = $result->extraInfo();
        $token = $user->generateAccessToken('webapp');


        return $this->response
            ->setStatusCode(200)
            ->setJSON([
                'token' => $token->raw_token,
                'user'  => [
                    'id'    => $user->id,
                    'username'    => $user->username, //20260508-001 ajout username
                    'email' => $user->email,
                    'groups'      => $user->getGroups(), //20260508-001 ajout groups
                    'permissions' => $user->getPermissions(), //20260508-001 ajout permissions
                ],
            ]);
    }

    // ─── POST /api/register ──────────────────────────────────────
    /*
    public function register()
    {
        $rules = [
            'username' => 'required|min_length[3]|is_unique[users.username]',
            'email'    => 'required|valid_email|is_unique[auth_identities.secret]',
            'password' => 'required|min_length[8]',
        ];

        if (! $this->validate($rules)) {
            return $this->response
                ->setStatusCode(422)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $userModel = model(UserModel::class);

        $user = new User([
            'username' => $this->request->getVar('username'),
            'email'    => $this->request->getVar('email'),
            'password' => $this->request->getVar('password'),
        ]);

        $userModel->save($user);
        $user = $userModel->findById($userModel->getInsertID());

        // Activer directement (ou laisser la vérification email selon config)
        $user->activate();

        // Ajouter au groupe par défaut
        $user->addGroup('user');

        // Retourner un token directement après register
        $token = $user->generateAccessToken('webapp');

        return $this->response
            ->setStatusCode(201)
            ->setJSON([
                'message' => 'Compte créé avec succès',
                'token'   => $token->raw_token,
                'user'    => [
                    'id'    => $user->id,
                    'email' => $user->email,
                ],
            ]);
    }
*/
    // ─── GET /api/profile (protégé ??) ──────────────────────────────

    public function me()
    {
        $user = auth('tokens')->user();
    
        if (!$user && auth()->loggedIn()) {
            $user = auth()->user();
        }
    
        if (!$user) {
            return $this->response
                ->setStatusCode(401)
                ->setJSON(['error' => 'Non authentifié']);
        }
    
        return $this->response->setStatusCode(200)->setJSON([
            'id'          => $user->id,
            'username'    => $user->username,
            'email'       => $user->email,
            'groups'      => $user->getGroups(),
            'permissions' => $user->getPermissions(),
        ]);
    }


    // ─── GET /api/profile (protégé) ──────────────────────────────
    public function profile()
    {
        $user = auth('tokens')->user();

        return $this->response
            ->setStatusCode(200)
            ->setJSON([
                'id'       => $user->id,
                'username' => $user->username,
                'email'    => $user->email,
                'groups'   => $user->getGroups(),
            ]);
    }

    // ─── POST /api/logout (protégé) ──────────────────────────────

    // 2026-05-09-003 : AuthController::logout() — check manuel + kill session Shield
    public function logout()
    {
        $rawToken = $this->request->getHeaderLine('Authorization');
        $rawToken = str_replace('Bearer ', '', trim($rawToken));
    
        if (!empty($rawToken)) {
            $result = auth('tokens')->check(['token' => $rawToken]);
            if ($result->isOK()) {
                $user = $result->extraInfo();
                $user->revokeAccessToken($rawToken);
            }
        }
    
        // Kill la session Shield aussi
        auth()->logout();
    
        return $this->response
            ->setStatusCode(200)
            ->setJSON(['message' => 'Déconnecté avec succès']);
    }            
}
