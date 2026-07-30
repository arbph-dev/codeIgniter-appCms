<?php
// app/Libraries/Components/DescriptorMapper.php

namespace App\Libraries\Components;

use App\Models\ComponentTypeModel;

class DescriptorMapper
{
    protected ComponentTypeModel $componentTypes;

    public function __construct()
    {
        $this->componentTypes = new ComponentTypeModel();
    }

    public function map(array $part): DescriptorDefinition
    {
        $type = $this->componentTypes->find($part['type_id']);

        return DescriptorDefinition::fromArray([
            'type' => $type['name'] ?? 'raw',
            'config' => json_decode(
                $part['config'] ?? '{}',
                true
            ) ?? []
        ]);
    }
}
