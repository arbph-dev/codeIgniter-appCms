<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class RelationType extends Entity
{
    protected $casts = [
        'id'         => 'integer',
        'symetrique' => 'boolean',  // tinyint(1) NOT NULL DEFAULT 0
    ];
}
