<?php

namespace App\Libraries\Cms;

final class DescriptorFactory
{
    public static function fromArray(
        string $type,
        array $config
    ): DescriptorDefinition {

        return new DescriptorDefinition(
            type   : $type,
            id     : $config['id'] ?? uniqid(),
            config : $config
        );
    }

    public static function fromPart(
        array $part,
        string $type
    ): DescriptorDefinition {

        $config = [];

        if (!empty($part['config'])) {
            $config = json_decode(
                $part['config'],
                true
            ) ?? [];
        }

        return self::fromArray(
            $type,
            $config
        );
    }
}