<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Entities\RelationType;

class RelationTypeModel extends Model
{
    protected $table            = 'relation_types';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = RelationType::class;
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'code',
        'label',
        'inverse_code',
        'source_type',
        'target_type',
        'symetrique',
        'description',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // ENUM exact de la base
    public const ENTITY_TYPES = ['personne', 'organisation', 'etablissement'];

    protected $validationRules = [
        'code'         => 'required|max_length[100]|is_unique[relation_types.code,id,{id}]',
        'label'        => 'required|max_length[255]',
        'inverse_code' => 'permit_empty|max_length[100]',
        'source_type'  => 'required|in_list[personne,organisation,etablissement]',
        'target_type'  => 'required|in_list[personne,organisation,etablissement]',
        'symetrique'   => 'in_list[0,1]',
    ];

    protected $validationMessages = [];
    protected $skipValidation     = false;

    // ----------------------------------------------------------------
    // Méthodes utilitaires
    // ----------------------------------------------------------------

    /**
     * Trouve un type par son code métier (ex: 'parent', 'employe').
     */
    public function findByCode(string $code): ?RelationType
    {
        return $this->where('code', $code)->first();
    }

    /**
     * Retourne les types applicables entre deux types d'entités.
     * C'est la requête principale : quand on crée une relation
     * personne→organisation, on ne propose que les types valides.
     *
     * Exploite les index MUL sur source_type et target_type.
     */
    public function findApplicable(string $sourceType, string $targetType): array
    {
        return $this->where('source_type', $sourceType)
                    ->where('target_type', $targetType)
                    ->orderBy('label', 'ASC')
                    ->findAll();
    }

    /**
     * Résout le type inverse d'un code donné.
     * Ex: 'employe' → trouve le RelationType dont le code est
     * l'inverse_code de 'employe', soit 'employeur'.
     */
    public function findInverse(string $code): ?RelationType
    {
        // Cas 1 : ce type pointe vers son inverse via inverse_code
        $type = $this->findByCode($code);
        if (! $type || ! $type->inverse_code) {
            return null;
        }

        return $this->findByCode($type->inverse_code);
    }

    /**
     * Retourne tous les types sous forme code => label.
     * Utile pour les selects et seeders.
     */
    public function toList(): array
    {
        $rows = $this->orderBy('label', 'ASC')->findAll();

        $list = [];
        foreach ($rows as $row) {
            $list[$row->code] = $row->label;
        }
        return $list;
    }
}
