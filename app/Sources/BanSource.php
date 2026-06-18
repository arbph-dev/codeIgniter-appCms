<?php

namespace App\Sources;

use App\Sources\Contracts\SourceInterface;
use Config\Services;

class BanSource extends AbstractSource implements SourceInterface
{
    protected string $baseUrl = 'https://api-adresse.data.gouv.fr';

    public function search(
        string $query,
        array $options = []
    ): array {
        $limit = (int) ($options['limit'] ?? 6);

        $cacheKey = 'ban_search_' . md5($query . $limit);

        if ($this->useCache && cache()->has($cacheKey)) {
            return cache()->get($cacheKey);
        }

        $client = Services::curlrequest();

        try {
            $response = $client->request('GET', $this->baseUrl . '/search/', [
                'query' => [
                    'q'     => trim($query),
                    'limit' => $limit,
                ],
                'timeout' => $this->timeout,
            ]);

            if ($response->getStatusCode() !== 200) {
                return [];
            }

            $data = json_decode($response->getBody(), true);

            $results = $this->parseResults(
                $data['features'] ?? []
            );

            if ($this->useCache && !empty($results)) {
                cache()->save(
                    $cacheKey,
                    $results,
                    $this->cacheTTL
                );
            }

            return $results;
        } catch (\Throwable $e) {
            log_message(
                'warning',
                '[BAN] Search failed: ' . $e->getMessage()
            );

            return [];
        }
    }

    public function lookup(
        string $id,
        array $options = []
    ): ?array {
        return null;
    }

    public function getName(): string
    {
        return 'ban';
    }

    protected function parseResults(
        array $features
    ): array {
        return array_map(
            [$this, 'parseFeature'],
            $features
        );
    }

    protected function parseFeature(
        array $feature
    ): array {
        $props = $feature['properties'] ?? [];

        $coords = $feature['geometry']['coordinates']
            ?? [null, null];

        return [
            '_source' => 'ban',
            '_score'  => (float) ($props['score'] ?? 0),
            '_raw'    => $feature,

            'ban_id'      => $props['id'] ?? null,
            'label'       => $props['label'] ?? '',

            'housenumber' => $props['housenumber'] ?? '',
            'street'      => $props['street'] ?? '',

            'type_voie'   => $this->extractTypeVoie(
                $props['street'] ?? ''
            ),

            'nom_voie'    => $this->extractNomVoie(
                $props['street'] ?? ''
            ),

            'postcode'    => $props['postcode'] ?? '',
            'citycode'    => $props['citycode'] ?? '',
            'city'        => $props['city'] ?? '',

            'lat'         => (float) ($coords[1] ?? 0),
            'lon'         => (float) ($coords[0] ?? 0),
        ];
    }

    protected function extractTypeVoie(
        ?string $street
    ): string {
        if (empty($street)) {
            return '';
        }

        $parts = explode(
            ' ',
            trim($street)
        );

        return ucfirst(
            strtolower($parts[0] ?? '')
        );
    }

    protected function extractNomVoie(
        ?string $street
    ): string {
        if (empty($street)) {
            return '';
        }

        $parts = explode(
            ' ',
            trim($street),
            2
        );

        return $parts[1] ?? $street;
    }
}
