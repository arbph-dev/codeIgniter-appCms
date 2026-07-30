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
     * Retourne la définition d'un composant.
     */
    public function get(string $type): ?ComponentDefinition
    {
        $row = $this->componentTypes->findByName($type);

        if ($row === null) {
            return null;
        }

        return new ComponentDefinition(
            type: $row['name'],
            description: $row['description'] ?? '',
            descriptorClass: '',
            rendererClass: '',
            adminRendererClass: ''
        );
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

        foreach ($this->componentTypes->findActive() as $row) {
            $definitions[] = new ComponentDefinition(
                type: $row['name'],
                description: $row['description'] ?? '',
                descriptorClass: '',
                rendererClass: '',
                adminRendererClass: ''
            );
        }

        return $definitions;
    }

    /**
     * Enregistrement manuel (tests).
     */
    public function register(ComponentDefinition $definition): self
    {
        // Temporairement inutilisé.
        // Conservé pour les tests unitaires et les futurs composants non persistés.

        return $this;
    }
}
