<?php

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
        'description',
        'is_active',
    ];

    /**
     * Retourne tous les types actifs.
     */
    public function findActive(): array
    {
        return $this->where('is_active', 1)
                    ->orderBy('name', 'ASC')
                    ->findAll();
    }

    /**
     * Retourne un type à partir de son nom.
     */
    public function findByName(string $name): ?array
    {
        return $this->where('name', $name)
                    ->first();
    }

    /**
     * Retourne la correspondance id => name.
     */
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
