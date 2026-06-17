<?php namespace App\Models;

use CodeIgniter\Model;
//
class MotModel extends Model
{
    protected $table = 'mots';
    protected $primaryKey = 'mot_id';
    protected $allowedFields = ['mot_lbl'];
    protected $returnType = 'array';

    // ── Timestamps automatiques ─────────────────────────────────────────────
    // Décommentez si vos colonnes created_at / updated_at existent 
    // == NON ==
    // protected $useTimestamps = true;

    // ── Validation ──────────────────────────────────────────────────────────
    protected $validationRules = [
        'mot_lbl' => 'required|min_length[1]|max_length[255]|is_unique[mots.mot_lbl,mot_id,{mot_id}]',
    ];

    protected $validationMessages = [
        'mot_lbl' => [
            'required'   => 'Le libellé est obligatoire.',
            'min_length' => 'Le libellé doit comporter au moins 1 caractère.',
            'max_length' => 'Le libellé ne peut dépasser 255 caractères.',
            'is_unique'  => 'Ce mot existe déjà.',
        ],
    ];

    protected $skipValidation = false;

    // ── Helpers ─────────────────────────────────────────────────────────────    
    // Recherche par id
    public function getById(int $id)
    {
        return $this->find($id);
    }

    // Recherche par label (exact ou partiel)
    public function getByLabel(string $label)
    {
        //return $this->like('mot_lbl', $label)->findAll();
        return $this->like( 'mot_lbl' , $label ); // ✅ retourne un builder
    }
}