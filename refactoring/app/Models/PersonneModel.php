<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Entities\Personne;

class PersonneModel extends Model
{
    protected $table            = 'personnes';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = Personne::class;
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;

    protected $allowedFields = [
        'nom',
        'prenoms',
        'nom_complet',
        'nom_naissance',
        'civilite',
        'sexe',
        'date_naissance',
        'precision_naissance',
        'naissance_adresse_id',
        'date_deces',
        'precision_deces',
        'deces_adresse_id',
        'nationalite',
        'bio',
        'detail',
        'slug',
        'source',
        'quality_score',
        'verified_at',
        'verified_by',
        'merge_into_id',
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'nom'          => 'required|max_length[100]',
        'prenoms'      => 'permit_empty|max_length[150]',
        'nom_complet'  => 'permit_empty|max_length[255]',
        'civilite'     => 'permit_empty|in_list[M,Mme,Mlle,Dr,Pr,Me]',
        'sexe'         => 'permit_empty|in_list[H,F,A]',
        'slug'         => 'permit_empty|max_length[255]|is_unique[personnes.slug,id,{id}]',
        'date_naissance' => 'permit_empty|valid_date',
        'date_deces'     => 'permit_empty|valid_date',
    ];

    protected $validationMessages = [];
    protected $skipValidation     = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['generateNomComplet', 'generateSlug'];
    protected $beforeUpdate   = ['generateNomComplet', 'generateSlug'];

    protected function generateNomComplet(array $data): array
    {
        if (!isset($data['data']['nom_complet']) || empty($data['data']['nom_complet'])) {
            $prenoms = $data['data']['prenoms'] ?? '';
            $nom     = $data['data']['nom'] ?? '';
            $data['data']['nom_complet'] = trim($prenoms . ' ' . $nom);
        }
        return $data;
    }

    protected function generateSlug(array $data): array
    {
        if (empty($data['data']['slug']) && !empty($data['data']['nom_complet'])) {
            $data['data']['slug'] = url_title($data['data']['nom_complet'], '-', true);
        }
        return $data;
    }

    // Relations
    public function aliases()
    {
        return $this->hasMany(PersonneAliasModel::class, 'personne_id');
    }

    public function parcours()
    {
        return $this->hasMany(PersonneParcoursModel::class, 'personne_id');
    }
}