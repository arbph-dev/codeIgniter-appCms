<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class PersonneAlias extends Entity
{
    protected $dates = ['date_debut', 'date_fin', 'created_at', 'updated_at'];
    protected $casts = [
        'id'           => 'integer',
        'personne_id'  => 'integer',
        'is_principal' => 'boolean',
    ];
}