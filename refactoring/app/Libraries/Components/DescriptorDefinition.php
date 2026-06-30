<?php
// app/Libraries/Components/DescriptorDefinition.php

namespace App\Libraries\Components;

class DescriptorDefinition
{
    public string $type;

    public array $config = [];

    public function __construct(
        string $type,
        array $config = []
    ) {
        $this->type   = $type;
        $this->config = $config;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['type'] ?? 'raw',
            $data['config'] ?? []
        );
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->config[$key] ?? $default;
    }

    public function toArray(): array
    {
        return [
            'type'   => $this->type,
            'config' => $this->config
        ];
    }
}