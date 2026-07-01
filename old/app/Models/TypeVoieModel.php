<?php
// app/Models/TypeVoieModel.php

namespace App\Models;

use CodeIgniter\Model;

class TypeVoieModel extends Model
{
    protected $table      = 'type_voies';
    protected $primaryKey = 'id';

    // PK fournie manuellement (pas d'auto-increment applicatif)
    protected $useAutoIncrement = false;

    //protected $allowedFields = ['id', 'nom'];
    protected $allowedFields = ['id', 'nom', 'nom_ban', 'status'];
    
    
    
    protected $returnType    = 'array';

    // ── Timestamps ─────────────────────────────────────────────────────────────
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // ── Validation ─────────────────────────────────────────────────────────────
    protected $validationRules = [
        'id'  => 'required|integer|greater_than[0]|less_than[256]'
                . '|is_unique[type_voies.id,id,{id}]',
        'nom' => 'required|min_length[1]|max_length[30]'
                . '|is_unique[type_voies.nom,id,{id}]',
        'nom_ban' => 'permit_empty|max_length[30]',
        'status'  => 'permit_empty|in_list[validated,pending]',                
    ];

    protected $validationMessages = [
        'id' => [
            'required'      => 'L\'identifiant est obligatoire.',
            'integer'       => 'L\'identifiant doit être un entier.',
            'greater_than'  => 'L\'identifiant doit être supérieur à 0.',
            'less_than'     => 'L\'identifiant doit être inférieur à 256.',
            'is_unique'     => 'Cet identifiant existe déjà.',
        ],
        'nom' => [
            'required'   => 'Le libellé est obligatoire.',
            'max_length' => 'Le libellé ne peut dépasser 30 caractères.',
            'is_unique'  => 'Ce libellé existe déjà.',
        ],
    ];

    protected $skipValidation = false;
}
