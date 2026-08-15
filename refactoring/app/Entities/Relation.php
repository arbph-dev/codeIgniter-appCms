<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class Relation extends Entity
{
    protected $dates = [
        'date_debut',   // dates métier : nullable, type date
        'date_fin',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'id'               => 'integer',
        'relation_type_id' => 'integer',
        'source_id'        => 'integer',
        'target_id'        => 'integer',
        'actif'            => 'boolean',  // tinyint(1) DEFAULT 1
        'ordre'            => 'integer',  // smallint DEFAULT 0
    ];
}
