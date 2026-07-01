<?php
// app/Models/AdresseModel.php

namespace App\Models;

use App\Enums\Charniere;
use App\Enums\GeocodePrecision;
use App\Enums\IndiceRepetition;
use CodeIgniter\Model;

class AdresseModel extends Model
{
    protected $table      = 'adresses';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'complement',
        'voienumero',
        'voierpt',
        'voietype_id',
        'voiecharniere',
        'voienom',
        'infodistribution',
        'codepostal_id',
        'acheminement',
        'latitude',
        'longitude',
        'precision',
    ];

    protected $returnType = 'array';

    // ── Timestamps ─────────────────────────────────────────────────────────────
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // ── Validation ─────────────────────────────────────────────────────────────
    protected $validationRules = [
        'voienom'      => 'required|min_length[1]|max_length[60]',
        'codepostal_id'=> 'required|integer|is_not_unique[codes_postaux.id]',
        'voietype_id'  => 'permit_empty|integer|is_not_unique[type_voies.id]',
        'voierpt'      => 'permit_empty|in_list[B,T,Q,C]',
        'voiecharniere'=> 'permit_empty|integer|less_than[8]',
        'precision'    => 'permit_empty|in_list[numero,voie,commune,approx]',
        'latitude'     => 'permit_empty|decimal',
        'longitude'    => 'permit_empty|decimal',
    ];

    protected $validationMessages = [
        'voienom'       => ['required' => 'Le nom de voie est obligatoire.'],
        'codepostal_id' => [
            'required'       => 'Le code postal est obligatoire.',
            'is_not_unique'  => 'Ce code postal n\'existe pas en base.',
        ],
    ];

    protected $skipValidation = false;

    // ── Requête enrichie (JOIN) ────────────────────────────────────────────────
    /**
     * Retourne un builder avec les champs dénormalisés des tables liées :
     *   voietype_nom   ← type_voies.nom
     *   cp_codepostal  ← codes_postaux.codepostal
     *   cp_commune     ← codes_postaux.commune
     *
     * Usage :
     *   $data = (new AdresseModel)->withRelations()->paginate(20);
     */
    public function withRelations(): static
    {
        return $this
            ->select('
                adresses.*,
                tv.nom        AS voietype_nom,
                cp.codepostal AS cp_codepostal,
                cp.commune    AS cp_commune
            ')
            ->join('type_voies    tv', 'tv.id = adresses.voietype_id',  'left')
            ->join('codes_postaux cp', 'cp.id = adresses.codepostal_id', 'left');
    }

    // ── Helpers statiques — dénormalisation des Enums ─────────────────────────

    /**
     * Convertit voirpt (B/T/Q/C) en libellé lisible.
     * Utilisable côté PHP pour les exports/rendus serveur.
     */
    public static function rptLabel(?string $value): string
    {
        if (! $value) return '';
        $enum = IndiceRepetition::tryFrom($value);
        return $enum ? $enum->label() : $value;
    }

    /**
     * Convertit voiecharniere (int 0-7) en libellé.
     */
    public static function charniereLabel(?int $value): string
    {
        if ($value === null) return '';
        $enum = Charniere::tryFrom($value);
        return $enum ? $enum->label() : '';
    }

    /**
     * Construit la ligne 4 formatée de l'adresse.
     * Ex : "125 Bis RUE des Lilas"
     */
    public static function formatLigne4(array $row): string
    {
        return trim(implode(' ', array_filter([
            $row['voienumero']   ?? null,
            self::rptLabel($row['voierpt'] ?? null),
            $row['voietype_nom'] ?? null,
            self::charniereLabel(isset($row['voiecharniere']) ? (int)$row['voiecharniere'] : null),
            $row['voienom']      ?? null,
        ])));
    }

    // ── Autocomplete ───────────────────────────────────────────────────────────
    public function suggest(string $q, int $len = 10): array
    {
        return $this
            ->withRelations()
            ->select('adresses.id, adresses.voienom, adresses.voienumero,
                      tv.nom AS voietype_nom, cp.codepostal AS cp_codepostal,
                      cp.commune AS cp_commune')
            ->groupStart()
                ->like('adresses.voienom', $q)
                ->orLike('cp.commune',     $q)
                ->orLike('cp.codepostal',  $q, 'after')
            ->groupEnd()
            ->limit($len)
            ->find();
    }
}
