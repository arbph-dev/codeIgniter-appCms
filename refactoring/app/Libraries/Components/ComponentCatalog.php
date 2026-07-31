<?php

namespace App\Libraries\Components;

use App\Models\ComponentTypeModel;

final class ComponentCatalog
{
    protected ComponentTypeModel $componentTypes;

    public function __construct()
    {
        $this->componentTypes = new ComponentTypeModel();
    }

    /**
     * Retourne la définition d'un composant à partir de son nom.
     */
    public function get(string $type): ?ComponentDefinition
    {
        $row = $this->componentTypes->findByName($type);

        return $row ? $this->createDefinition($row) : null;
    }

    /**
     * Retourne la définition d'un composant à partir de son identifiant.
     */
    public function getById(int $id): ?ComponentDefinition
    {
        $row = $this->componentTypes->find($id);

        return $row ? $this->createDefinition($row) : null;
    }

    /**
     * Indique si un composant existe.
     */
    public function has(string $type): bool
    {
        return $this->componentTypes->findByName($type) !== null;
    }

    /**
     * Retourne toutes les définitions.
     *
     * @return ComponentDefinition[]
     */
    public function all(): array
    {
        $definitions = [];

        foreach ($this->componentTypes->findActive() as $row)
        {
            $definitions[] = $this->createDefinition($row);
        }

        return $definitions;
    }

    /**
     * Enregistrement manuel (tests).
     */
    public function register(ComponentDefinition $definition): self
    {
        return $this;
    }

    /**
     * Construit une définition à partir d'une ligne SQL.
     */
    protected function createDefinition(array $row): ComponentDefinition
    {
        $label = ucfirst($row['name']);
        $icon = '🧩';

        switch ($row['name'])
        {
            case 'raw':
                $label = 'Texte';
                $icon = '📝';
                break;

            case 'callout':
                $label = 'Callout';
                $icon = '📢';
                break;

            case 'codeval':
                $label = 'CodeVal';
                $icon = '💻';
                break;

            case 'apex':
                $label = 'Apex';
                $icon = '📈';
                break;

            case 'mermaid':
                $label = 'Mermaid';
                $icon = '🧭';
                break;
        }

        return new ComponentDefinition(
            type: $row['name'],
            description: $row['description'] ?? '',

            label: $label,
            icon: $icon,
            cssClass: 'component-' . $row['name'],

            descriptorClass: '',
            rendererClass: '',
            adminRendererClass: '',
        );
    }
}
