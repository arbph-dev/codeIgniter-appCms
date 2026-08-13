<?php
// App/Models/PersonneParcoursModel.php
namespace App\Models;

use CodeIgniter\Model;
use App\Entities\PersonneParcours;

class PersonneParcoursModel extends Model
{
    protected $table            = 'personne_parcours';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = PersonneParcours::class;
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'personne_id',
        'type',
        'titre',
        'description',
        'date_debut',
        'precision_debut',
        'date_fin',
        'precision_fin',
        'structure_objet',
        'structure_id',
        'adresse_id',
        'source',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'personne_id' => 'required|is_natural_no_zero',
        'titre'       => 'permit_empty|max_length[255]',
        'type'        => 'permit_empty|max_length[50]',
    ];
}