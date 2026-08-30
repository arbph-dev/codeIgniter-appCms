<?php
// app/Models/EntrepriseModel.php

namespace App\Models;

use CodeIgniter\Model;

class EntrepriseModel extends Model
{
    protected $table         = 'entreprises';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useTimestamps = true;

    /** SIRET retiré : il vit sur etablissements (siège). */
    protected $allowedFields = [
        'organisation_id',
        'codenaf_id',
        'forme_juridique_id',
        'capital',
        'effectif_min',
        'effectif_max',
    ];

    protected $validationRules = [
        'organisation_id'    => 'required|integer|is_not_unique[organisations.id]',
        'codenaf_id'         => 'permit_empty|max_length[10]',
        'forme_juridique_id' => 'permit_empty|exact_length[4]',
        'capital'            => 'permit_empty|decimal',
        'effectif_min'       => 'permit_empty|integer',
        'effectif_max'       => 'permit_empty|integer',
    ];

    /**
     * Vue complète : entreprise + organisation + type + NAF + forme juridique.
     * Le siège (etablissements is_siege) est chargé par EntrepriseService::loadFull().
     */
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
                ot.label        AS type_label,
                naf.nom         AS codenaf_nom,
                fj.description  AS forme_juridique_nom
            ')
            ->join('organisations      o',   'o.id   = entreprises.organisation_id',    'left')
            ->join('organisation_types ot',  'ot.id  = o.organisation_type_id',         'left')
            ->join('codesnaf           naf', 'naf.codenaf = entreprises.codenaf_id',    'left')
            ->join('formesjuridiques   fj',  'fj.id  = entreprises.forme_juridique_id', 'left');
    }

    /**
     * Autocomplete : id + nom (+ siren org). Plus de siret ici.
     */
    public function suggest(string $q, int $len = 10): array
    {
        return $this
            ->select('entreprises.id, o.nom, o.siren')
            ->join('organisations o', 'o.id = entreprises.organisation_id', 'left')
            ->groupStart()
                ->like('o.nom', $q)
                ->orLike('o.siren', $q, 'after')
            ->groupEnd()
            ->orderBy('o.nom', 'ASC')
            ->limit($len)
            ->find();
    }
}
