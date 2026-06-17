<?php
// app/Models/FormeJuridiqueModel.php

namespace App\Models;

use CodeIgniter\Model;

class FormeJuridiqueModel extends Model
{
    protected $table      = 'formesjuridiques';
    protected $primaryKey = 'id';

    // La PK est un CHAR(4) — pas un int auto-increment
    protected $useAutoIncrement = false;

    protected $allowedFields = ['id', 'description'];

    protected $returnType = 'array';

    // ── Timestamps ─────────────────────────────────────────────────────────────
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // ── Validation ─────────────────────────────────────────────────────────────
    protected $validationRules = [
        'id'          => 'required|min_length[4]|max_length[4]|regex_match[/^\d{4}$/]'
                        . '|is_unique[formesjuridiques.id,id,{id}]',
        'description' => 'required|min_length[2]|max_length[200]',
    ];

    protected $validationMessages = [
        'id' => [
            'required'    => 'Le code INSEE est obligatoire.',
            'min_length'  => 'Le code doit comporter exactement 4 chiffres.',
            'max_length'  => 'Le code doit comporter exactement 4 chiffres.',
            'regex_match' => 'Le code doit être composé de 4 chiffres (ex : 5499).',
            'is_unique'   => 'Ce code INSEE existe déjà.',
        ],
        'description' => [
            'required'   => 'Le libellé est obligatoire.',
            'max_length' => 'Le libellé ne peut dépasser 200 caractères.',
        ],
    ];

    protected $skipValidation = false;

    // ── Helpers ─────────────────────────────────────────────────────────────────

    /**
     * Recherche partielle sur le libellé — retourne un builder chaînable.
     */
    public function search(string $q)
    {
        return $this->like('description', $q);
    }
}
