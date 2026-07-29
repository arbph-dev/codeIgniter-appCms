<?php

namespace App\Libraries\Components;

/**
 * Registre des définitions de composants.
 *
 * Décision : D014
 */
final class ComponentCatalog
{
    /**
     * @var array<string, ComponentDefinition>
     */
    private array $definitions = [];

    public function __construct()
    {
    }

    public function register(ComponentDefinition $definition): self
    {
        $this->definitions[$definition->type] = $definition;

        return $this;
    }

    public function has(string $type): bool
    {
        return isset($this->definitions[$type]);
    }

    public function get(string $type): ?ComponentDefinition
    {
        return $this->definitions[$type] ?? null;
    }

    /**
     * @return array<string, ComponentDefinition>
     */
    public function all(): array
    {
        return $this->definitions;
    }
}
