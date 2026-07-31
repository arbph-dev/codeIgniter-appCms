<?php
// app/Libraries/Components/ComponentDefinition.php
namespace App\Libraries\Components;

/**
 * Définition d'un composant.
 *
 * Cette classe décrit les métadonnées techniques d'un composant.
 *
 * Décision : D014
 */
final class ComponentDefinition
{
    public function __construct(
        public string  $type,
        public string  $description,

        public string  $label,
        public string  $icon,
        public string  $cssClass,

        public string  $descriptorClass,
        public string  $rendererClass,
        public string  $adminRendererClass,

        public array   $resources = [],
        public array   $features = [],
        public array   $connectors = [],
        
        public ?string $workbenchClass = null,
        
        public array   $metadata = [],
    ) {}
}
