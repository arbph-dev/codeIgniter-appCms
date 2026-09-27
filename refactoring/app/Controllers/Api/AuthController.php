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
    
    public function register()
    {
        // Champs attendus côté front (après fusion firstpassword/secondpassword → shield_password)
        $rules = [
            'shield_username' => 'required|min_length[3]|max_length[30]|is_unique[users.username]',
            'shield_email'    => 'required|valid_email|is_unique[auth_identities.secret]',
            'shield_password' => 'required|min_length[8]',
            // Stubs profil (ultérieur — validation souple pour l’instant)
            'client_profil_tel'    => 'permit_empty|max_length[20]',
            'client_profil_mobile' => 'permit_empty|max_length[20]',
            'client_profil_persid' => 'permit_empty|is_natural_no_zero',
            'client_profil_orgid'  => 'permit_empty|is_natural',          // 0 autorisé
        ];

        if (! $this->validate($rules)) {
            return $this->response
                ->setStatusCode(422)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $username = $this->request->getVar('shield_username');
        $email    = $this->request->getVar('shield_email');
        $password = $this->request->getVar('shield_password');

        // Stubs profil
        $telFixe        = $this->request->getVar('client_profil_tel')    ?: null;
        $telMobile      = $this->request->getVar('client_profil_mobile') ?: null;
        $personneId     = $this->request->getVar('client_profil_persid') ?: null;
        $organisationId = (int) ($this->request->getVar('client_profil_orgid') ?? 0);

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // ── 1. Création user Shield ──────────────────────────────────
            $userModel = model(\CodeIgniter\Shield\Models\UserModel::class);

            $user = new \CodeIgniter\Shield\Entities\User([
                'username' => $username,
                'email'    => $email,
                'password' => $password,
            ]);

            $userModel->save($user);
            $user = $userModel->findById($userModel->getInsertID());
            $userModel->addToDefaultGroup($user);   // groupe "user" par défaut

            // ── 2. Création user_profil ──────────────────────────────────
            // Règle métier : même personne_id autorisé si organisation_id différent
            // (contrainte UNIQUE déjà sur user_id + organisation_id)
            $profilModel = model(\App\Models\UserProfilModel::class);

            // Sécurité : un profil existe déjà pour ce couple ? (ne devrait pas arriver)
            $existing = $profilModel->findByUserAndOrg((int) $user->id, $organisationId);
            if ($existing) {
                $db->transRollback();
                return $this->response
                    ->setStatusCode(409)
                    ->setJSON(['error' => 'Un profil existe déjà pour cette organisation.']);
            }

            $profilModel->insert([
                'user_id'         => $user->id,
                'tel_fixe'        => $telFixe,
                'tel_mobile'      => $telMobile,
                'personne_id'     => $personneId,
                'adresse_id'      => null,          // stub futur
                'organisation_id' => $organisationId,
                'defaut'          => 1,             // premier profil = défaut
            ]);

            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON(['error' => 'Erreur lors de la création du compte.']);
            }

            // ── 3. EmailActivator (si configuré) ─────────────────────────
            $hasEmailActivation = setting('Auth.actions')['register'] !== null;

            if ($hasEmailActivation) {
                /** @var \CodeIgniter\Shield\Authentication\Authenticators\Session $authenticator */
                $authenticator = auth('session')->getAuthenticator();
                $authenticator->startLogin($user);
                $authenticator->startUpAction('register', $user);

                // Pas de token : compte non encore activé
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'message'        => 'Compte créé. Vérifiez votre email pour activer votre compte.',
                        'email_verified' => false,
                    ]);
            }

            // Pas de vérification email → activer + token immédiat
            $user->activate();
            $token = $user->generateAccessToken('webapp');

            return $this->response
                ->setStatusCode(201)
                ->setJSON([
                    'message'        => 'Compte créé avec succès.',
                    'email_verified' => true,
                    'token'          => $token->raw_token,
                    'user'           => [
                        'id'       => $user->id,
                        'username' => $user->username,
                        'email'    => $user->email,
                        'groups'   => $user->getGroups(),
                    ],
                ]);

        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', '[register] ' . $e->getMessage());

            return $this->response
                ->setStatusCode(500)
                ->setJSON(['error' => 'Erreur serveur lors de l\'inscription.']);
        }
    }

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
    /*
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
    */
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