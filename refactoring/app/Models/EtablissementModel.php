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

    // ── Soft delete (priorité basse) ───────────────────────────────────
    // Décommenter + ajouter la colonne deleted_at si besoin :
    // protected $useSoftDeletes = true;
    // protected $deletedField   = 'deleted_at';

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
     * Joints :
     *   organisations            → organisation_nom, siren
     *   adresses                 → champs bruts pour formatLigne4
     *   type_voies (via adresse) → voietype_nom
     *   codes_postaux (via adresse) → cp_codepostal, cp_commune
     *
     * Note : vérifie que tes FK dans `adresses` s'appellent bien
     *   adresses.voietype_id  et  adresses.code_postal_id
     * (noms habituels dans ton schéma, à ajuster si différent).
     *
     * Pays : non présent dans le schéma actuel — décommenter le select
     *   et ajouter la colonne quand ce sera fait.
     */
    public function withRelations(): static
    {
        return $this
            ->select('
                etablissements.*,
                o.nom                AS organisation_nom,
                o.siren,
                a.voienumero,
                a.voierpt,
                a.voiecharniere,
                a.voienom,
                tv.nom               AS voietype_nom,
                cp.codepostal        AS cp_codepostal,
                cp.commune           AS cp_commune
            ')
            ->join('organisations   o',  'o.id  = etablissements.organisation_id', 'left')
            ->join('adresses        a',  'a.id  = etablissements.adresse_id',       'left')
            ->join('type_voies      tv', 'tv.id = a.voietype_id',                   'left')
            ->join('codes_postaux   cp', 'cp.id = a.code_postal_id',                'left');
    }

    // ── Tous les établissements d'une organisation ─────────────────────
    /**
     * Retourne les lignes brutes (withRelations).
     * L'enrichissement ligne4 est délégué au controller via enrichAll().
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

    // ── Enrichissement ligne4 ──────────────────────────────────────────
    /**
     * Ajoute la clé `ligne4` (adresse formatée) sur un enregistrement.
     * Délègue à AdresseModel::formatLigne4() pour cohérence.
     *
     * Utilisable sur tout tableau issu de withRelations() :
     *   $row = EtablissementModel::enrich($row);
     */
    public static function enrich(array $row): array
    {
        $row['ligne4'] = AdresseModel::formatLigne4($row);
        return $row;
    }

    /**
     * Version tableau : applique enrich() sur chaque élément.
     *   $rows = EtablissementModel::enrichAll($rows);
     */
    public static function enrichAll(array $rows): array
    {
        return array_map([self::class, 'enrich'], $rows);
    }
}
