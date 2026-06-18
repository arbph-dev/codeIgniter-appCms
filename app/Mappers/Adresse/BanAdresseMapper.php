<?php

namespace App\Mappers\Adresse;

use App\Libraries\FieldMapper;
use App\Services\AdresseService;

class BanAdresseMapper
{
    public function __construct(
        protected AdresseService $service
    ) {
    }

    public function build(): FieldMapper
    {
        $mapper = new FieldMapper('ban', 'adresse');

        $mapper->field(
                    'voienumero',
                    'housenumber',
                    'int',
                    fn($v) => $this->service->extractNumero($v)
                )
               ->field(
                    'voierpt',
                    'housenumber',
                    'string',
                    fn($v) => $this->service->extractRpt($v)
                )
               ->computed(
                    'voiecharniere',
                    ['nom_voie'],
                    fn($n) => $this->service->extractCharniere($n)
                )
               ->computed(
                    'voienom',
                    ['nom_voie', 'street'],
                    fn($n, $s) => $n ?: $s
                )
               ->computed(
                    'precision',
                    ['score'],
                    fn($s) => $s >= 0.7 ? 'numero' : 'voie'
                )
               ->resolve(
                    'voietype_id',
                    'type_voie',
                    [$this->service, 'resolve_type_voie']
                )
               ->resolve(
                    'codepostal_id',
                    'postcode',
                    [$this->service, 'fetch_codepostal_id'],
                    'int',
                    ['citycode' => 'citycode'],
                    true
                )
               ->field(
                    'acheminement',
                    'city',
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
                );

        return $mapper;
    }
}
