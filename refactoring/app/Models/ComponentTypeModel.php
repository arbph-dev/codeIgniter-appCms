<?php
// app/Models/ComponentTypeModel.php

namespace App\Models;

use CodeIgniter\Model;

class ComponentTypeModel extends Model
{
    protected $table      = 'component_types';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'name',
        'view',
        'description'
    ];

    public function getTypeMap(): array
    {
        $map = [];

        foreach ($this->findAll() as $row)
        {
            $map[$row['id']] = $row['name'];
        }

        return $map;
    }
}