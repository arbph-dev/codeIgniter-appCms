<?php
// app/Models/EtablissementModel.php

namespace App\Models;

use CodeIgniter\Model;

class EtablissementModel extends Model
{
    protected $table      = 'etablissements';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'organisation_id', 'parent_id', 'code',
        'telephone', 'email',
        'siret', 'nic', 'nom',
        'is_siege', 'actif', 'adresse_id',
    ];

    // ── Validation ─────────────────────────────────────────────────────
    protected $validationRules = [
        'organisation_id' => 'required|integer|is_not_unique[organisations.id]',
        'siret'           => 'required|exact_length[14]|numeric',
        'nic'             => 'required|exact_length[5]|numeric',
        'is_siege'        => 'permit_empty|in_list[0,1]',
        'actif'           => 'permit_empty|in_list[0,1]',
        'email'           => 'permit_empty|valid_email|max_length[255]',
        'telephone'       => 'permit_empty|max_length[50]',
    ];

    protected $validationMessages = [
        'siret' => [
            'required'     => 'Le SIRET est obligatoire.',
            'exact_length' => 'Le SIRET doit comporter exactement 14 chiffres.',
            'numeric'      => 'Le SIRET ne doit contenir que des chiffres.',
        ],
        'nic' => [
            'required'     => 'Le NIC est obligatoire.',
            'exact_length' => 'Le NIC doit comporter exactement 5 chiffres.',
        ],
    ];

    // ── Vue enrichie ───────────────────────────────────────────────────
    /**
     * Joins : organisation, adresses.
     * Adapte les colonnes de `adresses` à ton schéma si nécessaire.
     */
    public function withRelations(): static
    {
        return $this
            ->select('
                etablissements.*,
                o.nom            AS organisation_nom,
                o.siren,
                a.libelle        AS adresse_libelle,
                a.code_postal,
                a.ville,
                a.pays
            ')
            ->join('organisations o', 'o.id = etablissements.organisation_id', 'left')
            ->join('adresses       a', 'a.id = etablissements.adresse_id',      'left');
    }

    // ── Tous les établissements d'une organisation ─────────────────────
    /**
     * Retourne siège en premier, puis par nom.
     */
    public function byOrganisation(int $orgId): array
    {
        return $this
            ->withRelations()
            ->where('etablissements.organisation_id', $orgId)
            ->orderBy('etablissements.is_siege', 'DESC')
            ->orderBy('etablissements.nom',      'ASC')
            ->find();
    }

    // ── Autocomplete ───────────────────────────────────────────────────
    public function suggest(string $q, int $len = 10): array
    {
        return $this
            ->select('etablissements.id, etablissements.siret, etablissements.nom, o.nom AS organisation_nom')
            ->join('organisations o', 'o.id = etablissements.organisation_id', 'left')
            ->groupStart()
                ->like('etablissements.siret', $q, 'after')
                ->orLike('etablissements.nom',  $q)
                ->orLike('o.nom',               $q)
            ->groupEnd()
            ->orderBy('etablissements.nom', 'ASC')
            ->limit($len)
            ->find();
    }
}
