<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class Personne extends Entity
{
    protected $datamap = [];
    protected $dates   = [
        'date_naissance',
        'date_deces',
        'verified_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    protected $casts   = [
        'id'                   => 'integer',
        'naissance_adresse_id' => '?integer',
        'deces_adresse_id'     => '?integer',
        'quality_score'        => '?integer',   // tinyint unsigned en base — était ?float
        'verified_by'          => '?integer',
        'merge_into_id'        => '?integer',
        'created_at'           => 'datetime',
        'updated_at'           => 'datetime',
        'deleted_at'           => 'datetime',
    ];
}
