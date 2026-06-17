<?php
// app/Models/EntrepriseModel.php

namespace App\Models;

use CodeIgniter\Model;

class EntrepriseModel extends Model
{
    protected $table      = 'entreprises';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'organisation_id', 'siret',
        'codenaf_id', 'forme_juridique_id',
        'capital', 'effectif_min', 'effectif_max',
    ];

    protected $returnType    = 'array';
    protected $useTimestamps = true;

    // ── Validation ─────────────────────────────────────────────
    protected $validationRules = [
        'organisation_id' => 'required|integer|is_not_unique[organisations.id]',
        'siret'           => 'permit_empty|exact_length[14]|numeric',
    ];

    // ── Vue complète (organisations + entreprises + relations) ─
    public function withRelations(): static
    {
        return $this
            ->select('
                entreprises.*,
                o.nom, o.slug, o.siren, o.site_web, o.urlreg,
                o.email, o.telephone, o.description,
                o.lien_facebook, o.lien_instagram, o.lien_linkedin,
                o.adresse_id, o.logo_id, o.cover_id,
                o.organisation_type_id,
                ot.label   AS type_label,
                naf.nom    AS codenaf_nom,
                fj.description AS forme_juridique_nom
            ')
            ->join('organisations        o',   'o.id   = entreprises.organisation_id',   'left')
            ->join('organisation_types   ot',  'ot.id  = o.organisation_type_id',        'left')
            ->join('codesnaf             naf', 'naf.codenaf = entreprises.codenaf_id',   'left')
            ->join('formesjuridiques     fj',  'fj.id  = entreprises.forme_juridique_id','left');
    }

    // ── Autocomplete ──────────────────────────────────────────
    public function suggest(string $q, int $len = 10): array
    {
        return $this
            ->select('entreprises.id, o.nom, entreprises.siret')
            ->join('organisations o', 'o.id = entreprises.organisation_id', 'left')
            ->like('o.nom', $q)
            ->orderBy('o.nom', 'ASC')
            ->limit($len)
            ->find();
    }
}
