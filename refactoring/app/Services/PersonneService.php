<?php
// App/Services/PersonneService.php
namespace App\Services;

use App\Models\PersonneModel;
use App\Models\PersonneAliasModel;
use App\Models\PersonneParcoursModel;
use App\Entities\Personne;
use CodeIgniter\Database\Exceptions\DatabaseException;

class PersonneService
{
    protected PersonneModel $personneModel;
    protected PersonneAliasModel $aliasModel;
    protected PersonneParcoursModel $parcoursModel;

    public function __construct()
    {
        $this->personneModel = model(PersonneModel::class);
        $this->aliasModel    = model(PersonneAliasModel::class);
        $this->parcoursModel = model(PersonneParcoursModel::class);
    }

    /**
     * Crée une personne avec ses alias éventuels
     */
    public function create(array $data, array $aliases = []): Personne|false
    {
        $db = db_connect();
        $db->transStart();

        try {
            $personneId = $this->personneModel->insert($data);

            if (!$personneId) {
                $db->transRollback();
                return false;
            }

            // Alias
            foreach ($aliases as $alias) {
                $alias['personne_id'] = $personneId;
                $this->aliasModel->insert($alias);
            }

            $db->transComplete();

            return $this->personneModel->find($personneId);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', '[PersonneService::create] ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Met à jour une personne + synchronise les alias
     */
    public function update(int $id, array $data, ?array $aliases = null): Personne|false
    {
        $db = db_connect();
        $db->transStart();

        try {
            if (!$this->personneModel->update($id, $data)) {
                $db->transRollback();
                return false;
            }

            if (is_array($aliases)) {
                // On supprime les anciens et on recrée (simple et sûr)
                $this->aliasModel->where('personne_id', $id)->delete();

                foreach ($aliases as $alias) {
                    $alias['personne_id'] = $id;
                    $this->aliasModel->insert($alias);
                }
            }

            $db->transComplete();

            return $this->personneModel->find($id);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', '[PersonneService::update] ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Récupère une personne avec ses relations
     */
    public function findWithRelations(int $id): ?array
    {
        $personne = $this->personneModel->find($id);

        if (!$personne) {
            return null;
        }

        return [
            'personne'  => $personne,
            'aliases'   => $this->aliasModel->where('personne_id', $id)->findAll(),
            'parcours'  => $this->parcoursModel->where('personne_id', $id)
                                                ->orderBy('date_debut', 'DESC')
                                                ->findAll(),
        ];
    }

    /**
     * Recherche simple (nom / prénoms / alias)
     */
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

    /**
     * Fusionne deux personnes (merge_into)
     */
    public function merge(int $sourceId, int $targetId): bool
    {
        if ($sourceId === $targetId) {
            return false;
        }

        $db = db_connect();
        $db->transStart();

        try {
            // On marque la source comme fusionnée
            $this->personneModel->update($sourceId, [
                'merge_into_id' => $targetId,
            ]);

            // On déplace les alias
            $this->aliasModel->where('personne_id', $sourceId)
                             ->set(['personne_id' => $targetId])
                             ->update();

            // On déplace les parcours
            $this->parcoursModel->where('personne_id', $sourceId)
                                ->set(['personne_id' => $targetId])
                                ->update();

            // Soft delete de la source
            $this->personneModel->delete($sourceId);

            $db->transComplete();

            return $db->transStatus();
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', '[PersonneService::merge] ' . $e->getMessage());
            return false;
        }
    }

    public function delete(int $id): bool
    {
        return $this->personneModel->delete($id);
    }
}