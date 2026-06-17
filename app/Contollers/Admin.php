<?php
// app/Controllers/Admin.php
namespace App\Controllers;

use App\Controllers\BaseController;

class Admin extends BaseController
{
    // ── Accès ────────────────────────────────────────────────────────────────

    private function requireAdmin(): void
    {
        if (!auth()->loggedIn()) {
            redirect()->to('/')->send(); exit;
        }
        $user = auth()->user();
        if (!$user->inGroup('admin') && !$user->inGroup('superadmin')) {
            redirect()->to('/user')->send(); exit;
        }
    }

    private function isSuperAdmin(): bool
    {
        return auth()->loggedIn() && auth()->user()->inGroup('superadmin');
    }

    // ── Extraction email depuis identities ───────────────────────────────────

    private function extractEmail($user): ?string
    {
        foreach ($user->identities ?? [] as $identity) {
            if ($identity->type === 'email_password') {
                return $identity->secret;
            }
        }
        return null;
    }

    // ── Index ────────────────────────────────────────────────────────────────

    public function index()
    {
        $this->requireAdmin();

        $provider = auth()->getProvider();

        $rawUsers = $provider
            ->withIdentities()
            ->withGroups()
            ->withPermissions()
            ->findAll(100);

        $users = array_values(array_map(function ($u) {

            return [
                'id'          => $u->id,
                'username'    => $u->username,//  20260508-001  pour debug $u->username,
                'email'       => $this->extractEmail($u),
        
                'groups'      => $u->getGroups(),

                'permissions' => array_keys($u->getPermissions()),
        
                'active'      => $u->active ?? false,
                //'created_at'  => $u->created_at->toDateString(),//$u->created_at ?? null,
                'created_at'  => $u->created_at->setTimezone('Europe/Paris')->toDateTimeString(),
                               
                'last_active' => $u->last_active ?? null,
            ];
        
        }, $rawUsers));        

        // ── Données debug overlay ────────────────────────────────────────────
        $me = auth()->user();
        $debugData = $this->buildDebugData($me);
        
        // dd(get_class(auth()->getProvider())); => "CodeIgniter\Shield\Models\UserModel"
        
        return view('cms/admin', [
            'users'        => $users,
            'isSuperAdmin' => $this->isSuperAdmin(),
            'debugData'    => $debugData,
        ]);
    }

    // ── Debug data (réutilisable depuis User controller) ─────────────────────

    public static function buildDebugData($user): array
    {
        if (!$user) return [];

        $data = $user->toArray();

        return [
            'id'          => $data['id']       ?? '—',
            'username'    => $data['username']  ?? '—',
            'active'      => $data['active']    ?? false,
            'created_at'  => $data['created_at'] ?? '—',
            'groups'      => array_column($data['groups']      ?? [], 'name'),
            'permissions' => array_column($data['permissions'] ?? [], 'name'),
            'session_id'  => session_id(),
            'environment' => ENVIRONMENT,
            'ci_version'  => \CodeIgniter\CodeIgniter::CI_VERSION,
            'php_version' => PHP_VERSION,
        ];
    }
}
