// app/Sources/NominatimSource.php
<?php

namespace App\Sources;

use App\Sources\Contracts\SourceInterface;
use Config\Services;
use Exception;

class NominatimSource extends AbstractSource implements SourceInterface
{
    protected string $baseUrl = 'https://nominatim.openstreetmap.org';
    protected string $userAgent;
    protected int $timeout = 12;
    protected bool $useCache = true;
    protected int $cacheTTL = 86400; // 24 heures

    public function __construct()
    {
        $this->userAgent = env('app.name', 'XXpert-System') . '/' . 
                          env('app.version', '1.0') . 
                          ' (contact@zealot.fr)'; // Change avec ton vrai contact
    }

    /**
     * Recherche par texte (Forward Geocoding)
     */
    public function search(
        string $query, 
        int $limit = 6, 
        string $country = 'fr',
        array $extraParams = []
    ): array
    {
        $cacheKey = "nominatim_search_" . md5($query . $country . $limit);

        if ($this->useCache && cache()->has($cacheKey)) {
            return cache()->get($cacheKey);
        }

        $client = Services::curlrequest();

        $params = array_merge([
            'q'              => trim($query),
            'format'         => 'json',
            'limit'          => $limit,
            'countrycodes'   => $country,
            'addressdetails' => 1,
            'namedetails'    => 1,
            'extratags'      => 1,
            'polygon_geojson' => 0,
        ], $extraParams);

        try {
            $response = $client->request('GET', $this->baseUrl . '/search', [
                'query'   => $params,
                'headers' => [
                    'User-Agent' => $this->userAgent,
                    'Accept'     => 'application/json'
                ],
                'timeout' => $this->timeout,
            ]);

            if ($response->getStatusCode() !== 200) {
                log_message('error', "Nominatim HTTP {$response->getStatusCode()}: " . $response->getBody());
                return [];
            }

            $results = json_decode($response->getBody(), true) ?? [];
            $parsed  = $this->parseResults($results);

            // Mise en cache
            if ($this->useCache && !empty($parsed)) {
                cache()->save($cacheKey, $parsed, $this->cacheTTL);
            }

            return $parsed;

        } catch (Exception $e) {
            log_message('error', 'Nominatim search error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Géocodage inverse (coordonnées → adresse)
     */
    public function reverse(float $lat, float $lon, int $zoom = 18): ?array
    {
        $cacheKey = "nominatim_reverse_{$lat}_{$lon}_{$zoom}";

        if ($this->useCache && cache()->has($cacheKey)) {
            return cache()->get($cacheKey);
        }

        $client = Services::curlrequest();

        try {
            $response = $client->request('GET', $this->baseUrl . '/reverse', [
                'query' => [
                    'lat'            => $lat,
                    'lon'            => $lon,
                    'format'         => 'json',
                    'zoom'           => $zoom,
                    'addressdetails' => 1,
                ],
                'headers' => [
                    'User-Agent' => $this->userAgent,
                ],
                'timeout' => $this->timeout,
            ]);

            if ($response->getStatusCode() !== 200) {
                return null;
            }

            $data = json_decode($response->getBody(), true);
            $result = $data ? $this->parseSingleResult($data) : null;

            if ($result && $this->useCache) {
                cache()->save($cacheKey, $result, $this->cacheTTL);
            }

            return $result;

        } catch (Exception $e) {
            log_message('error', 'Nominatim reverse error: ' . $e->getMessage());
            return null;
        }
    }

    // ===================================================================
    // Parsing
    // ===================================================================

    private function parseResults(array $results): array
    {
        return array_map([$this, 'parseSingleResult'], $results);
    }

    private function parseSingleResult(array $item): array
    {
        $address = $item['address'] ?? [];

        return [
            'source'       => 'nominatim',
            'nominatim_id' => $item['place_id'] ?? null,
            'osm_id'       => $item['osm_id'] ?? null,
            'osm_type'     => $item['osm_type'] ?? null,
            'label'        => $item['display_name'] ?? '',
            'importance'   => (float) ($item['importance'] ?? 0),

            // Adresse structurée
            'housenumber'  => $address['house_number'] ?? '',
            'street'       => $address['road'] ?? $address['pedestrian'] ?? $address['footway'] ?? '',
            'type_voie'    => $this->extractTypeFromStreet($address['road'] ?? ''),
            'nom_voie'     => $this->extractNomVoie($address['road'] ?? ''),
            'postcode'     => $address['postcode'] ?? '',
            'city'         => $address['city'] ?? $address['town'] ?? $address['village'] ?? $address['municipality'] ?? '',
            'citycode'     => $address['ISO3166-2-lvl4'] ?? '', // Code INSEE approximatif
            'country'      => $address['country_code'] ?? 'fr',

            'lat'          => (float) ($item['lat'] ?? 0),
            'lon'          => (float) ($item['lon'] ?? 0),

            'raw'          => $item,
            'address'      => $address
        ];
    }

    private function extractTypeFromStreet(?string $street): string
    {
        if (empty($street)) return '';
        $parts = explode(' ', trim($street));
        return ucfirst(strtolower($parts[0] ?? ''));
    }

    private function extractNomVoie(?string $street): string
    {
        if (empty($street)) return '';
        $parts = explode(' ', trim($street), 2);
        return $parts[1] ?? $street;
    }

    // ===================================================================
    // Configuration
    // ===================================================================

    public function setUserAgent(string $userAgent): self
    {
        $this->userAgent = $userAgent;
        return $this;
    }

    public function enableCache(bool $enable = true, int $ttl = 86400): self
    {
        $this->useCache = $enable;
        $this->cacheTTL = $ttl;
        return $this;
    }

    public function setTimeout(int $seconds): self
    {
        $this->timeout = $seconds;
        return $this;
    }

    //méthodes du contrat
    public function lookup( string $id, array $options = [] ): ?array 
    {
        return null;
    }

    public function getName(): string
    {
        return 'nominatim';
    }
}
