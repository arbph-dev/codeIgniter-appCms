<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Entities\Relation;

class RelationModel extends Model
{
    protected $table            = 'relations';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = Relation::class;
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'relation_type_id',
        'source_type',
        'source_id',
        'target_type',
        'target_id',
        'actif',
        'ordre',
        'date_debut',
        'date_fin',
        'commentaire',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    /**
     * ENUM de la table `relations` — intentionnellement distinct de
     * RelationTypeModel::ENTITY_TYPES qui inclut 'etablissement'.
     *
     * TODO : décision à prendre — aligner les deux tables via ALTER TABLE.
     * Option A : ALTER TABLE relations MODIFY source_type ENUM('personne','organisation','etablissement')
     *            ALTER TABLE relations MODIFY target_type ENUM('personne','organisation','etablissement')
     * Option B : retirer 'etablissement' de relation_types.source_type / target_type
     *
     * En attendant, ce modèle reflète l'état réel de la base.
     */
    public const ENTITY_TYPES = ['personne', 'organisation'];

    protected $validationRules = [
        'relation_type_id' => 'required|is_natural_no_zero',
        'source_type'      => 'required|in_list[personne,organisation]',
        'source_id'        => 'required|is_natural_no_zero',
        'target_type'      => 'required|in_list[personne,organisation]',
        'target_id'        => 'required|is_natural_no_zero',
        'actif'            => 'permit_empty|in_list[0,1]',
        'ordre'            => 'permit_empty|integer',
        'date_debut'       => 'permit_empty|valid_date',
        'date_fin'         => 'permit_empty|valid_date',
    ];

    protected $validationMessages = [];
    protected $skipValidation     = false;

    // ----------------------------------------------------------------
    // Requêtes de base — la logique métier appartient à RelationService
    // ----------------------------------------------------------------

    /**
     * Toutes les relations où une entité est source OU cible.
     * Exploite les index MUL sur source_type/source_id et target_type/target_id.
     */
    public function findForEntity(string $entityType, int $entityId): array
    {
        return $this->groupStart()
                        ->where('source_type', $entityType)
                        ->where('source_id',   $entityId)
                    ->groupEnd()
                    ->orGroupStart()
                        ->where('target_type', $entityType)
                        ->where('target_id',   $entityId)
                    ->groupEnd()
                    ->where('actif', 1)
                    ->orderBy('ordre', 'ASC')
                    ->orderBy('date_debut', 'DESC')
                    ->findAll();
    }

    /**
     * Relations sortantes uniquement (source → target).
     */
    public function findBySource(string $sourceType, int $sourceId, ?int $relationTypeId = null): array
    {
        $this->where('source_type', $sourceType)
             ->where('source_id',   $sourceId);

        if ($relationTypeId) {
            $this->where('relation_type_id', $relationTypeId);
        }

        return $this->where('actif', 1)
                    ->orderBy('ordre', 'ASC')
                    ->findAll();
    }

    /**
     * Relations entrantes uniquement (source → target).
     */
    public function findByTarget(string $targetType, int $targetId, ?int $relationTypeId = null): array
    {
        $this->where('target_type', $targetType)
             ->where('target_id',   $targetId);

        if ($relationTypeId) {
            $this->where('relation_type_id', $relationTypeId);
        }

        return $this->where('actif', 1)
                    ->orderBy('ordre', 'ASC')
                    ->findAll();
    }
}
