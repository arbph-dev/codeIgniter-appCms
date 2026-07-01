<?php
// app/Models/CodePostalModel.php

namespace App\Models;

use CodeIgniter\Model;

class CodePostalModel extends Model
{
    protected $table      = 'codes_postaux';
    protected $primaryKey = 'id';

    // Référentiel — lecture seule en usage normal.
    // allowedFields vide = aucune écriture via le Model
    // (décommentez si vous souhaitez un import CI4 programmatique)
    protected $allowedFields = [
        'codeinsee', 'codepostal', 'commune',
        'acheminement', 'ligne5', 'latitude', 'longitude',
    ];

    protected $returnType = 'array';

    // ── Timestamps ─────────────────────────────────────────────────────────────
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // ── Pas de validation stricte — données importées, pas saisies ─────────────
    protected $skipValidation = true;

    // ── Helpers ────────────────────────────────────────────────────────────────

    /**
     * Recherche par code postal OU commune.
     * Retourne un builder chaînable (pour paginate).
     *
     * @param string $q  Code postal (début) ou nom de commune (LIKE)
     */
    public function search(string $q)
    {
        return $this
            ->groupStart()
                ->like('codepostal', $q, 'after')   // commence par $q
                ->orLike('commune', $q)
                ->orLike('acheminement', $q)
            ->groupEnd();
    }

    /**
     * Recherche légère pour autocomplete.
     * Priorise les codes postaux exacts, puis les communes.
     */
    public function suggest(string $q, int $len = 15): array
    {
        // Priorité 1 : code postal commençant par $q
        $byCode = $this
            ->select('id, codeinsee, codepostal, commune, latitude, longitude')
            ->like('codepostal', $q, 'after')
            ->orderBy('codepostal', 'ASC')
            ->limit($len)
            ->find();

        if (count($byCode) >= $len) return $byCode;

        // Priorité 2 : commune LIKE $q (complète les résultats)
        $remaining = $len - count($byCode);
        $existIds  = array_column($byCode, 'id');

        $builder = $this
            ->select('id, codeinsee, codepostal, commune, latitude, longitude')
            ->like('commune', $q);

        if ($existIds) {
            $builder = $builder->whereNotIn('id', $existIds);
        }

        $byName = $builder
            ->orderBy('commune', 'ASC')
            ->limit($remaining)
            ->find();

        return array_merge($byCode, $byName);
    }
}
