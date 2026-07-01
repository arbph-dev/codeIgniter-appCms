<?php
// app/Models/OrganisationModel.php

namespace App\Models;

use CodeIgniter\Model;

class OrganisationModel extends Model
{
    protected $table      = 'organisations';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'nom', 'slug', 'organisation_type_id',
        'description', 'detail',
        'site_web', 'urlreg', 'email', 'telephone',
        'lien_facebook', 'lien_instagram', 'lien_linkedin',
        'adresse_id', 'logo_id', 'cover_id',
        'siren', 'rna', 'date_creation', 'date_dissolution',
    ];

    protected $returnType    = 'array';
    protected $useTimestamps = true;
    protected $useSoftDeletes = true;
    protected $deletedField  = 'deleted_at';

    // ── Validation ─────────────────────────────────────────────
    protected $validationRules = [
        'nom'  => 'required|min_length[2]|max_length[255]',
        'siren'=> 'permit_empty|exact_length[9]|numeric',
    ];

    protected $validationMessages = [
        'nom'   => ['required' => 'Le nom est obligatoire.'],
        'siren' => ['exact_length' => 'Le SIREN doit comporter exactement 9 chiffres.'],
    ];

    // ── Requête enrichie ───────────────────────────────────────
    public function withRelations(): static
    {
        return $this
            ->select('organisations.*, ot.label AS type_label')
            ->join('organisation_types ot', 'ot.id = organisations.organisation_type_id', 'left');
    }

    // ── Autocomplete ──────────────────────────────────────────
    public function suggest(string $q, int $len = 10): array
    {
        return $this
            ->select('id, nom, siren')
            ->like('nom', $q)
            ->orderBy('nom', 'ASC')
            ->limit($len)
            ->find();
    }

    // ── Slug auto ─────────────────────────────────────────────
    public static function makeSlug(string $nom): string
    {
        $slug = mb_strtolower($nom);
        $slug = preg_replace('/[àáâãäå]/u', 'a', $slug);
        $slug = preg_replace('/[éèêë]/u',   'e', $slug);
        $slug = preg_replace('/[îï]/u',     'i', $slug);
        $slug = preg_replace('/[ôö]/u',     'o', $slug);
        $slug = preg_replace('/[ùûü]/u',    'u', $slug);
        $slug = preg_replace('/[ç]/u',      'c', $slug);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        return trim($slug, '-');
    }
}
