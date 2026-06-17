<?php
// app/Enums/IndiceRepetition.php
namespace App\Enums;

enum IndiceRepetition: string
{
    case Bis       = 'B';
    case Ter       = 'T';
    case Quater    = 'Q';
    case Quinquies = 'C';

    public function label(): string
    {
        return match($this) {
            self::Bis       => 'Bis',
            self::Ter       => 'Ter',
            self::Quater    => 'Quater',
            self::Quinquies => 'Quinquies',
        };
    }

    /** Tableau [value => label] pour les selects */
    public static function options(): array
    {
        return array_map(
            fn($e) => ['value' => $e->value, 'label' => $e->label()],
            self::cases()
        );
    }
}
