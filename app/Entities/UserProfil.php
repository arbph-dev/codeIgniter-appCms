<?php
// app/Entities/UserProfil.php
namespace App\Entities;

use CodeIgniter\Entity\Entity;

class UserProfil extends Entity
{
    protected $dates = [
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'id'              => 'integer',
        'user_id'         => 'integer',
        'personne_id'     => '?integer',
        'adresse_id'      => '?integer',
        'organisation_id' => 'integer',
        'defaut'          => 'boolean',   // BOOLEAN / tinyint(1) DEFAULT TRUE
    ];
}
