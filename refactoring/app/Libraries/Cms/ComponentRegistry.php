<?php

namespace App\Libraries\Cms;

final class ComponentRegistry
{
    protected array $views = [

        'raw'     => 'components/raw',
        'codeval' => 'components/codeval',
        'apex'    => 'components/apex',
        'mermaid' => 'components/mermaid',

    ];

    public function getView(
        DescriptorDefinition $descriptor
    ): ?string {

        return $this->views[
            $descriptor->type
        ] ?? null;
    }

    public function render(
        DescriptorDefinition $descriptor
    ): string {

        $view = $this->getView($descriptor);

        if (!$view) {
            return "<pre>Unknown component : {$descriptor->type}</pre>";
        }

        return view(
            $view,
            $descriptor->config
        );
    }
}
