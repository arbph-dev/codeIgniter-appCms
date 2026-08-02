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

    // {} => promotion des propriétés du constructeur introduite en PHP 8.
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

    /**
     * Exporte la définition sous forme de tableau.
     */
    public function toArray(): array
    {
        return [
            'type'               => $this->type,
            'description'        => $this->description,

            'label'              => $this->label,
            'icon'               => $this->icon,
            'cssClass'           => $this->cssClass,

            'descriptorClass'    => $this->descriptorClass,
            'rendererClass'      => $this->rendererClass,
            'adminRendererClass' => $this->adminRendererClass,

            'resources'          => $this->resources,
            'features'           => $this->features,
            'connectors'         => $this->connectors,

            'workbenchClass'     => $this->workbenchClass,

            'metadata'           => $this->metadata,
        ];
    }


}
