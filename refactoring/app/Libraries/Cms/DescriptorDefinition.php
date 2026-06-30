<?php

namespace App\Libraries\Cms;

final class DescriptorDefinition
{
    public function __construct(
        public readonly string $type,
        public readonly string $id,
        public readonly array $config = []
    ) {
    }
}