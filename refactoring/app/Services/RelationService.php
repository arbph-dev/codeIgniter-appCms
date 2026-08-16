<?php

namespace App\Services;

use App\Models\RelationModel;
use App\Models\RelationTypeModel;
use App\Entities\Relation;
use App\Entities\RelationType;
use CodeIgniter\Database\BaseConnection;

class RelationService
{
    protected RelationModel     $relationModel;
    protected RelationTypeModel $relationTypeModel;
    protected BaseConnection    $db;

    public function __construct()
    {
        $this->relationModel     = model(RelationModel::class);
        $this->relationTypeModel = model(RelationTypeModel::class);
        $this->db                = db_connect();
    }

    // =====================================================================
    // LECTURE
    // =====================================================================

    public function find(int $id): ?Relation
    {
        return $this->relationModel->find($id);
    }

    public function getForEntity(string $entityType, int $entityId): array
    {
        $relations = $this->relationModel->findForEntity($entityType, $entityId);
        return array_map(fn(Relation $r) => $this->enrich($r), $relations);
    }

    public function getBySource(string $sourceType, int $sourceId, ?int $relationTypeId = null): array
    {
        $relations = $this->relationModel->findBySource($sourceType, $sourceId, $relationTypeId);
        return array_map(fn(Relation $r) => $this->enrich($r), $relations);
    }

    public function getByTarget(string $targetType, int $targetId, ?int $relationTypeId = null): array
    {
        $relations = $this->relationModel->findByTarget($targetType, $targetId, $relationTypeId);
        return array_map(fn(Relation $r) => $this->enrich($r), $relations);
    }

    // =====================================================================
    // ÉCRITURE
    // =====================================================================

    /**
     * Crée une relation après résolution et validation métier.
     *
     * Ordre des opérations :
     *   1. applyTargetResolution() — bascule organisation → etablissement si etablissement_id fourni
     *   2. validateRelationType()  — accepte etablissement quand le type attend organisation
     *   3. insert()
     *
     * $data attendu :
     * [
     *   'relation_type_id' => int,
     *   'source_type'      => 'personne'|'organisation'|'etablissement',
     *   'source_id'        => int,
     *   'target_type'      => 'personne'|'organisation'|'etablissement',
     *   'target_id'        => int,
     *   'etablissement_id' => int,    // optionnel, bascule target sur etablissement
     *   'date_debut'       => '2024-01-01',
     *   'date_fin'         => null,
     *   'commentaire'      => string,
     *   'ordre'            => int,
     * ]
     */
    public function create(array $data): Relation|false
    {
        $this->db->transStart();

        try {
            // 1. Résolution organisation → etablissement si applicable
            $data = $this->applyTargetResolution($data);

            // 2. Validation cohérence type / paire source-target
            if (! $this->validateRelationType(
                $data['relation_type_id'],
                $data['source_type'],
                $data['target_type']
            )) {
                $this->db->transRollback();
                return false;
            }

            $id = $this->relationModel->insert($data);

            if (! $id) {
                $this->db->transRollback();
                return false;
            }

            $this->db->transComplete();
            return $this->relationModel->find($id);
        } catch (\Throwable $e) {
            $this->db->transRollback();
            log_message('error', '[RelationService::create] ' . $e->getMessage());
            return false;
        }
    }

    public function update(int $id, array $data): Relation|false
    {
        $relation = $this->relationModel->find($id);

        if (! $relation) {
            return false;
        }

        $this->db->transStart();

        try {
            if (isset($data['source_type']) || isset($data['target_type']) || isset($data['relation_type_id'])) {
                $merged = array_merge([
                    'relation_type_id' => $relation->relation_type_id,
                    'source_type'      => $relation->source_type,
                    'source_id'        => $relation->source_id,
                    'target_type'      => $relation->target_type,
                    'target_id'        => $relation->target_id,
                ], $data);

                $merged = $this->applyTargetResolution($merged);

                if (! $this->validateRelationType(
                    $merged['relation_type_id'],
                    $merged['source_type'],
                    $merged['target_type']
                )) {
                    $this->db->transRollback();
                    return false;
                }

                $data = $merged;
            }

            if (! $this->relationModel->update($id, $data)) {
                $this->db->transRollback();
                return false;
            }

            $this->db->transComplete();
            return $this->relationModel->find($id);
        } catch (\Throwable $e) {
            $this->db->transRollback();
            log_message('error', '[RelationService::update] ' . $e->getMessage());
            return false;
        }
    }

    public function delete(int $id): bool
    {
        return $this->relationModel->find($id)
            ? $this->relationModel->delete($id)
            : false;
    }

    public function deactivate(int $id): bool
    {
        return (bool) $this->relationModel->update($id, ['actif' => 0]);
    }

    // =====================================================================
    // LOGIQUE MÉTIER
    // =====================================================================

    /**
     * Résolution organisation → etablissement.
     * etablissement_id est consommé et retiré du payload avant l'INSERT.
     */
    public function applyTargetResolution(array $data): array
    {
        $etablissementId = $data['etablissement_id'] ?? null;
        unset($data['etablissement_id']);

        if (
            $etablissementId
            && isset($data['target_type'])
            && $data['target_type'] === 'organisation'
        ) {
            $data['target_type'] = 'etablissement';
            $data['target_id']   = (int) $etablissementId;
        }

        return $data;
    }

    /**
     * Vérifie que le RelationType est applicable pour la paire source/target.
     *
     * Règle de compatibilité etablissement :
     *   Un type défini personne→organisation est valide pour personne→etablissement.
     *   etablissement est une sous-entité d'organisation — applyTargetResolution()
     *   peut avoir résolu 'organisation' en 'etablissement' avant cet appel.
     */
    public function validateRelationType(int $relationTypeId, string $sourceType, string $targetType): bool
    {
        $type = $this->relationTypeModel->find($relationTypeId);

        if (! $type) {
            log_message('warning', "[RelationService] relation_type_id {$relationTypeId} introuvable.");
            return false;
        }

        $sourceMatch = $type->source_type === $sourceType;

        // etablissement est une sous-entité d'organisation
        $targetMatch = $type->target_type === $targetType
            || ($targetType === 'etablissement' && $type->target_type === 'organisation');

        if (! $sourceMatch || ! $targetMatch) {
            log_message('warning', sprintf(
                '[RelationService] Type %s attend %s→%s, reçu %s→%s.',
                $type->code,
                $type->source_type, $type->target_type,
                $sourceType, $targetType
            ));
            return false;
        }

        return true;
    }

    public function getInverseType(Relation $relation): ?RelationType
    {
        $type = $this->relationTypeModel->find($relation->relation_type_id);

        if (! $type || ! $type->inverse_code) {
            return null;
        }

        return $this->relationTypeModel->findByCode($type->inverse_code);
    }

    // =====================================================================
    // ENRICHISSEMENT
    // =====================================================================

    protected function enrich(Relation $relation): array
    {
        return [
            'relation'      => $relation,
            'relation_type' => $this->relationTypeModel->find($relation->relation_type_id),
        ];
    }
}
