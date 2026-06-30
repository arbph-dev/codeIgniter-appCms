<?php
// app/Libraries/Components/DescriptorMapper.php
namespace App\Libraries\Components;

class DescriptorMapper
{
    protected array $types =
    [
        1 => 'raw',
        2 => 'codeval',
        3 => 'apex',
        4 => 'mermaid',
        5 => 'callout'
    ];

    public function map(array $part): DescriptorDefinition
    {
        return DescriptorDefinition::fromArray([
            'type'   => $this->types[$part['type_id']] ?? 'raw',
            'config' => json_decode(
                $part['config'] ?? '{}',
                true
            ) ?? []
        ]);
    }
}