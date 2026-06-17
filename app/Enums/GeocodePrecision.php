<?php
// app/Enums/GeocodePrecision.php
namespace App\Enums;

enum GeocodePrecision: string
{
    case Numero      = 'numero';   // Précis au numéro
    case Voie        = 'voie';     // Centre de la rue
    case Commune     = 'commune';  // Centre ville
    case Approximatif = 'approx';  // Estimé

    public function label(): string
    {
        return match($this) {
            self::Numero       => 'Au numéro',
            self::Voie         => 'À la voie',
            self::Commune      => 'À la commune',
            self::Approximatif => 'Approximatif',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn($e) => ['value' => $e->value, 'label' => $e->label()],
            self::cases()
        );
    }
}
