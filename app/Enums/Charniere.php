<?php
// app/Enums/Charniere.php
namespace App\Enums;

enum Charniere: int
{
    case De              = 0;
    case D_apostrophe    = 1;
    case Du              = 2;
    case De_la           = 3;
    case Des             = 4;
    case De_l_apostrophe = 5;
    case De_las          = 6;
    case De_los          = 7;

    public function label(): string
    {
        return match($this) {
            self::De              => 'de',
            self::D_apostrophe    => "d'",
            self::Du              => 'du',
            self::De_la           => 'de la',
            self::Des             => 'des',
            self::De_l_apostrophe => "de l'",
            self::De_las          => 'de las',
            self::De_los          => 'de los',
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
