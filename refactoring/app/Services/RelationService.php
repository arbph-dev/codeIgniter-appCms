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

    /**
     * Retourne toutes les relations actives d'une entité,
     * enrichies de leur RelationType.
     *
     * Appelé par PersonneService::findWithRelations()
     * et son équivalent Organisation.
     */
    public function getForEntity(string $entityType, int $entityId): array
    {
        $relations = $this->relationModel->findForEntity($entityType, $entityId);

        return array_map(
            fn(Relation $r) => $this->enrich($r),
            $relations
        );
    }

    /**
     * Relations sortantes uniquement (source → target), enrichies.
     */
    public function getBySource(string $sourceType, int $sourceId, ?int $relationTypeId = null): array
    {
        $relations = $this->relationModel->findBySource($sourceType, $sourceId, $relationTypeId);

        return array_map(fn(Relation $r) => $this->enrich($r), $relations);
    }

    /**
     * Relations entrantes uniquement, enrichies.
     */
    public function getByTarget(string $targetType, int $targetId, ?int $relationTypeId = null): array
    {
        $relations = $this->relationModel->findByTarget($targetType, $targetId, $relationTypeId);

        return array_map(fn(Relation $r) => $this->enrich($r), $relations);
    }

    // =====================================================================
    // ÉCRITURE
    // =====================================================================

    /**
     * Crée une relation après validation métier.
     *
     * $data attendu :
     * [
     *   'relation_type_id' => int,
     *   'source_type'      => 'personne'|'organisation'|'etablissement',
     *   'source_id'        => int,
     *   'target_type'      => 'personne'|'organisation'|'etablissement',
     *   'target_id'        => int,
     *   'date_debut'       => '2024-01-01',  // optionnel
     *   'date_fin'         => null,           // optionnel
     *   'commentaire'      => string,         // optionnel
     *   'ordre'            => int,            // optionnel, défaut 0
     * ]
     */
    public function create(array $data): Relation|false
    {
        $this->db->transStart();

        try {
            // Résolution organisation → etablissement si applicable
            $data = $this->applyTargetResolution($data);

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

    /**
     * Met à jour une relation existante.
     */
    public function update(int $id, array $data): Relation|false
    {
        $relation = $this->relationModel->find($id);

        if (! $relation) {
            return false;
        }

        $this->db->transStart();

        try {
            // Si source/target changent, on re-résout et re-valide
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

    /**
     * Supprime une relation.
     */
    public function delete(int $id): bool
    {
        return $this->relationModel->find($id)
            ? $this->relationModel->delete($id)
            : false;
    }

    /**
     * Désactive une relation sans la supprimer (actif = 0).
     */
    public function deactivate(int $id): bool
    {
        return (bool) $this->relationModel->update($id, ['actif' => 0]);
    }

    // =====================================================================
    // LOGIQUE MÉTIER
    // =====================================================================

    /**
     * Résolution organisation → etablissement.
     *
     * Règle : si la cible est une organisation ET qu'un etablissement_id
     * est fourni dans $data, on bascule la cible sur l'établissement.
     *
     * Le payload peut contenir :
     *   'target_type'       => 'organisation'
     *   'target_id'         => 42      (organisation Leclerc)
     *   'etablissement_id'  => 7       (établissement spécifique, optionnel)
     *
     * Si etablissement_id est présent, la relation est créée avec :
     *   'target_type' => 'etablissement'
     *   'target_id'   => 7
     *
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
     * Stocke l'erreur dans les logs si invalide.
     */
    public function validateRelationType(int $relationTypeId, string $sourceType, string $targetType): bool
    {
        $type = $this->relationTypeModel->find($relationTypeId);

        if (! $type) {
            log_message('warning', "[RelationService] relation_type_id {$relationTypeId} introuvable.");
            return false;
        }

        if ($type->source_type !== $sourceType || $type->target_type !== $targetType) {
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

    /**
     * Résout le type inverse d'une relation.
     * Utile pour l'affichage côté target : "vu depuis Leclerc, Robert est un employé".
     */
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

    /**
     * Attache le RelationType à une Relation pour éviter les N+1 côté contrôleur.
     */
    protected function enrich(Relation $relation): array
    {
        return [
            'relation'      => $relation,
            'relation_type' => $this->relationTypeModel->find($relation->relation_type_id),
        ];
    }
}
