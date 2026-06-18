<?php

namespace App\Mappers\Adresse;

use App\Libraries\FieldMapper;
use App\Services\AdresseService;

class NominatimAdresseMapper
{
    public function __construct(
        protected AdresseService $service
    ) {
    }

    public function build(): FieldMapper
    {
        $mapper = new FieldMapper(
            'nominatim',
            'adresse'
        );

        $mapper->field(
                    'voienumero',
                    'address.house_number',
                    'int'
                )
               ->field(
                    'postcode',
                    'address.postcode',
                    'string'
                )
               ->field(
                    'city',
                    'address.city',
                    'string'
                )
               ->field(
                    'latitude',
                    'lat',
                    'float'
                )
               ->field(
                    'longitude',
                    'lon',
                    'float'
                )
               ->computed(
                    'voienom',
                    ['address.road', 'address.pedestrian'],
                    fn($road, $ped) => $road ?: $ped
                )
               ->computed(
                    'type_voie',
                    ['address.road'],
                    fn($road) => $this->service->extractTypeVoie($road)
                )
               ->computed(
                    'precision',
                    ['importance'],
                    fn($imp) => $imp > 0.6
                        ? 'voie'
                        : 'commune'
                )
               ->resolve(
                    'voietype_id',
                    'type_voie',
                    [$this->service, 'resolve_type_voie']
                )
               ->resolve(
                    'codepostal_id',
                    'address.postcode',
                    [$this->service, 'fetch_codepostal_id'],
                    'int',
                    [
                        'citycode' =>
                        'address.ISO3166-2-lvl4'
                    ],
                    true
                );

        return $mapper;
    }
}
