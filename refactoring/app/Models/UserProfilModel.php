<?php
// app/Models/UserProfilModel.php
namespace App\Models;

use CodeIgniter\Model;
use App\Entities\UserProfil;

class UserProfilModel extends Model
{
    protected $table            = 'user_profils';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = UserProfil::class;
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'user_id',
        'tel_fixe',
        'tel_mobile',
        'personne_id',
        'adresse_id',
        'organisation_id',
        'defaut',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'user_id'         => 'required|is_natural_no_zero',
        'tel_fixe'        => 'permit_empty|max_length[20]',
        'tel_mobile'      => 'permit_empty|max_length[20]',
        'personne_id'     => 'permit_empty|is_natural_no_zero',
        'adresse_id'      => 'permit_empty|is_natural_no_zero',
        'organisation_id' => 'required|is_natural',          // 0 autorisé (DEFAULT 0)
        'defaut'          => 'permit_empty|in_list[0,1]',
    ];

    protected $validationMessages = [];
    protected $skipValidation     = false;

    // ----------------------------------------------------------------
    // Requêtes de base — logique métier dans un futur UserProfilService
    // ----------------------------------------------------------------

    /**
     * Tous les profils d'un utilisateur.
     */
    public function findByUser(int $userId): array
    {
        return $this->where('user_id', $userId)
                    ->orderBy('defaut', 'DESC')
                    ->orderBy('id', 'ASC')
                    ->findAll();
    }

    /**
     * Profil par défaut d'un utilisateur (defaut = 1).
     */
    public function findDefaultByUser(int $userId): ?UserProfil
    {
        return $this->where('user_id', $userId)
                    ->where('defaut', 1)
                    ->first();
    }

    /**
     * Profil unique pour le couple (user_id, organisation_id).
     * Respecte la contrainte UNIQUE uk_user_profils_user_org.
     */
    public function findByUserAndOrg(int $userId, int $organisationId): ?UserProfil
    {
        return $this->where('user_id', $userId)
                    ->where('organisation_id', $organisationId)
                    ->first();
    }
}