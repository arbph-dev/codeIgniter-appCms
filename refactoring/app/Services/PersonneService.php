<?php

namespace App\Services;

use App\Models\PersonneModel;
use App\Models\PersonneAliasModel;
use App\Models\PersonneParcoursModel;
use App\Models\RelationModel;
use App\Entities\Personne;
use CodeIgniter\Database\BaseConnection;

class PersonneService
{
    protected PersonneModel        $personneModel;
    protected PersonneAliasModel   $aliasModel;
    protected PersonneParcoursModel $parcoursModel;
    protected RelationService      $relationService;   // +
    protected BaseConnection       $db;

    public function __construct()
    {
        $this->personneModel    = model(PersonneModel::class);
        $this->aliasModel       = model(PersonneAliasModel::class);
        $this->parcoursModel    = model(PersonneParcoursModel::class);
        $this->relationService  = service('relation');              // +
        $this->db               = db_connect();
    }

    // =====================================================================
    // PERSONNE
    // =====================================================================

    public function find(int $id): ?Personne
    {
        return $this->personneModel->find($id);
    }

    /**
     * Retourne la personne avec toutes ses données liées.
     * 'relations' est enrichi (Relation + RelationType) via RelationService.
     */
    public function findWithRelations(int $id): ?array
    {
        $personne = $this->personneModel->find($id);

        if (! $personne) {
            return null;
        }

        return [
            'personne'  => $personne,
            'aliases'   => $this->getAliases($id),
            'parcours'  => $this->getParcours($id),
            'relations' => $this->relationService->getForEntity('personne', $id), // +
        ];
    }

    public function search(string $term, int $limit = 20): array
    {
        $term = trim($term);

        return $this->personneModel
            ->groupStart()
                ->like('nom', $term)
                ->orLike('prenoms', $term)
                ->orLike('nom_complet', $term)
                ->orLike('nom_naissance', $term)
            ->groupEnd()
            ->orderBy('nom_complet', 'ASC')
            ->findAll($limit);
    }

    public function create(array $data, array $aliases = [], array $parcours = []): Personne|false
    {
        $this->db->transStart();

        try {
            $personneId = $this->personneModel->insert($data);

            if (! $personneId) {
                $this->db->transRollback();
                return false;
            }

            $this->syncAliases($personneId, $aliases);
            $this->syncParcours($personneId, $parcours);

            $this->db->transComplete();

            return $this->personneModel->find($personneId);
        } catch (\Throwable $e) {
            $this->db->transRollback();
            log_message('error', '[PersonneService::create] ' . $e->getMessage());
            return false;
        }
    }

    public function update(int $id, array $data, ?array $aliases = null, ?array $parcours = null): Personne|false
    {
        $this->db->transStart();

        try {
            if (! $this->personneModel->update($id, $data)) {
                $this->db->transRollback();
                return false;
            }

            if (is_array($aliases)) {
                $this->syncAliases($id, $aliases);
            }

            if (is_array($parcours)) {
                $this->syncParcours($id, $parcours);
            }

            $this->db->transComplete();

            return $this->personneModel->find($id);
        } catch (\Throwable $e) {
            $this->db->transRollback();
            log_message('error', '[PersonneService::update] ' . $e->getMessage());
            return false;
        }
    }

    public function delete(int $id): bool
    {
        // Les FK en CASCADE s'occupent des alias et parcours.
        // Les relations (table polymorphique sans CASCADE) sont gérées
        // manuellement via deactivate dans RelationService si besoin.
        return $this->personneModel->delete($id);
    }

    /**
     * Fusionne sourceId dans targetId.
     *
     * Ordre des opérations :
     * 1. Alias et parcours redirigés vers la cible
     * 2. Relations polymorphiques redirigées (source ET target)
     * 3. Auto-relations générées par la fusion supprimées
     * 4. Source marquée + soft-deleted
     */
    public function merge(int $sourceId, int $targetId): bool
    {
        if ($sourceId === $targetId) {
            return false;
        }

        $this->db->transStart();

        try {
            $relationModel = model(RelationModel::class);

            // --- Alias et parcours ---
            $this->aliasModel->where('personne_id', $sourceId)
                             ->set(['personne_id' => $targetId])
                             ->update();

            $this->parcoursModel->where('personne_id', $sourceId)
                                ->set(['personne_id' => $targetId])
                                ->update();

            // --- Relations polymorphiques ---
            // La personne source peut être source OU cible dans la table relations.

            $relationModel->where('source_type', 'personne')
                          ->where('source_id', $sourceId)
                          ->set(['source_id' => $targetId])
                          ->update();

            $relationModel->where('target_type', 'personne')
                          ->where('target_id', $sourceId)
                          ->set(['target_id' => $targetId])
                          ->update();

            // --- Nettoyage des auto-relations ---
            // La fusion peut créer des lignes personne X → personne X.
            $relationModel->where('source_type', 'personne')
                          ->where('source_id', $targetId)
                          ->where('target_type', 'personne')
                          ->where('target_id', $targetId)
                          ->delete();

            // --- Marquage + soft delete de la source ---
            $this->personneModel->update($sourceId, ['merge_into_id' => $targetId]);
            $this->personneModel->delete($sourceId);

            $this->db->transComplete();

            return $this->db->transStatus();
        } catch (\Throwable $e) {
            $this->db->transRollback();
            log_message('error', '[PersonneService::merge] ' . $e->getMessage());
            return false;
        }
    }

    // =====================================================================
    // ALIAS
    // =====================================================================

    public function getAliases(int $personneId): array
    {
        return $this->aliasModel
            ->where('personne_id', $personneId)
            ->orderBy('is_principal', 'DESC')
            ->orderBy('alias', 'ASC')
            ->findAll();
    }

    public function addAlias(int $personneId, array $data)
    {
        $data['personne_id'] = $personneId;
        return $this->aliasModel->insert($data) ? $this->aliasModel->find($this->aliasModel->getInsertID()) : false;
    }

    public function updateAlias(int $aliasId, array $data)
    {
        if (! $this->aliasModel->update($aliasId, $data)) {
            return false;
        }
        return $this->aliasModel->find($aliasId);
    }

    public function deleteAlias(int $aliasId): bool
    {
        return $this->aliasModel->delete($aliasId);
    }

    /**
     * Synchronise complètement la liste des alias d'une personne.
     * Stratégie : vider + recréer.
     */
    public function syncAliases(int $personneId, array $aliases): void
    {
        $this->aliasModel->where('personne_id', $personneId)->delete();

        foreach ($aliases as $alias) {
            $alias['personne_id'] = $personneId;
            $this->aliasModel->insert($alias);
        }
    }

    // =====================================================================
    // PARCOURS
    // =====================================================================

    /**
     * @param int|null $typeId  FK vers parcours_types.id (était string, corrigé)
     */
    public function getParcours(int $personneId, ?int $typeId = null): array
    {
        $builder = $this->parcoursModel->where('personne_id', $personneId);

        if ($typeId) {
            $builder->where('type', $typeId);
        }

        return $builder->orderBy('date_debut', 'DESC')->findAll();
    }

    public function addParcours(int $personneId, array $data)
    {
        $data['personne_id'] = $personneId;
        return $this->parcoursModel->insert($data)
            ? $this->parcoursModel->find($this->parcoursModel->getInsertID())
            : false;
    }

    public function updateParcours(int $parcoursId, array $data)
    {
        if (! $this->parcoursModel->update($parcoursId, $data)) {
            return false;
        }
        return $this->parcoursModel->find($parcoursId);
    }

    public function deleteParcours(int $parcoursId): bool
    {
        return $this->parcoursModel->delete($parcoursId);
    }

    /**
     * Synchronise complètement la liste des parcours.
     * Stratégie : vider + recréer.
     */
    public function syncParcours(int $personneId, array $parcours): void
    {
        $this->parcoursModel->where('personne_id', $personneId)->delete();

        foreach ($parcours as $item) {
            $item['personne_id'] = $personneId;
            $this->parcoursModel->insert($item);
        }
    }
}
