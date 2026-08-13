<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class PersonneParcours extends Entity
{
    protected $dates = [
        'date_debut',
        'date_fin',
        'created_at',
        'updated_at',
    ];
    protected $casts = [
        'id'          => 'integer',
        'personne_id' => 'integer',
        'structure_id'=> '?integer',
        'adresse_id'  => '?integer',
    ];
}