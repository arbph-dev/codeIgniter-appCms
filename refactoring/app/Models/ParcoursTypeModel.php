<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Entities\ParcoursType;

class ParcoursTypeModel extends Model
{
    protected $table            = 'parcours_types';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = ParcoursType::class;
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'code',
        'label',
        'description',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'code'  => 'required|max_length[50]|is_unique[parcours_types.code,id,{id}]',
        'label' => 'required|max_length[100]',
    ];

    protected $validationMessages = [];
    protected $skipValidation     = false;

    /**
     * Retourne un type par son code métier (ex: 'emploi', 'mandat')
     */
    public function findByCode(string $code): ?ParcoursType
    {
        return $this->where('code', $code)->first();
    }

    /**
     * Retourne tous les types sous forme code => label
     * Utile pour les selects et la validation côté service
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
