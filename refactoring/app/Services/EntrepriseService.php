<?php

namespace App\Services;

use App\Models\OrganisationModel;
use App\Models\EntrepriseModel;
use App\Models\EtablissementModel;
use CodeIgniter\Database\Exceptions\DatabaseException;

/**
 * EntrepriseService
 *
 * Règles métier :
 *  - SIREN porté par organisations.siren
 *  - SIRET uniquement sur etablissements (siège = is_siege = 1)
 *  - 1 organisation ↔ 0..1 entreprise (organisation_id UNIQUE)
 *  - createWithOrganisation : org + entreprise + siège (si siret)
 *  - attachToOrganisation  : extension entreprise sur org existante
 */
class EntrepriseService
{
    private OrganisationModel  $orgModel;
    private EntrepriseModel    $entModel;
    private EtablissementModel $etabModel;

    public function __construct()
    {
        $this->orgModel  = new OrganisationModel();
        $this->entModel  = new EntrepriseModel();
        $this->etabModel = new EtablissementModel();
    }

    // ═══════════════════════════════════════════════════════════════════
    // Création complète (nouvelle org + entreprise + siège optionnel)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @param array $data  nom (requis), siren?, organisation_type_id?,
     *                     siret?, adresse_id?,
     *                     codenaf_id?, forme_juridique_id?, capital?,
     *                     effectif_min?, effectif_max?, …
     * @return array       entreprise complète (withRelations + siège)
     * @throws \RuntimeException|\InvalidArgumentException|DatabaseException
     */
    public function createWithOrganisation(array $data): array
    {
        if (empty($data['nom'])) {
            throw new \InvalidArgumentException('Le nom est obligatoire.');
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // 1. Organisation
            $orgData = $this->filterOrg($data);
            if (empty($orgData['organisation_type_id'])) {
                $orgData['organisation_type_id'] = 1; // ENTREPRISE
            }
            if (empty($orgData['slug']) && ! empty($orgData['nom'])) {
                $orgData['slug'] = OrganisationModel::makeSlug($orgData['nom']);
            }

            $orgId = $this->orgModel->insert($orgData);
            if (! $orgId) {
                throw new \RuntimeException(
                    'Organisation : ' . implode(', ', $this->orgModel->errors() ?: ['insert échoué'])
                );
            }

            // 2. Entreprise (sans siret)
            $entData = $this->filterEnt($data);
            $entData['organisation_id'] = $orgId;

            $entId = $this->entModel->insert($entData);
            if (! $entId) {
                throw new \RuntimeException(
                    'Entreprise : ' . implode(', ', $this->entModel->errors() ?: ['insert échoué'])
                );
            }

            // 3. Siège si siret fourni
            if (! empty($data['siret'])) {
                $this->ensureSiege(
                    (int) $orgId,
                    (string) $data['siret'],
                    isset($data['adresse_id']) ? (int) $data['adresse_id'] : null,
                    $data['nom'] ?? null,
                    $data['siren'] ?? null
                );
            }

            $db->transComplete();
            if (! $db->transStatus()) {
                throw new DatabaseException('Transaction échouée.');
            }

            return $this->loadFull((int) $entId);
        } catch (\Throwable $e) {
            $db->transRollback();
            throw $e;
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // Rattachement à une organisation existante
    // ═══════════════════════════════════════════════════════════════════

    /**
     * POST /organisation/:id/entreprise
     *
     * @param int   $orgId
     * @param array $data  siren?, siret?, adresse_id?, codenaf_id?, …
     */
    public function attachToOrganisation(int $orgId, array $data): array
    {
        $org = $this->orgModel->find($orgId);
        if (! $org) {
            throw new \RuntimeException("Organisation #{$orgId} introuvable.");
        }

        $existing = $this->entModel->where('organisation_id', $orgId)->first();
        if ($existing) {
            throw new \RuntimeException(
                "Organisation #{$orgId} a déjà une entreprise (#{$existing['id']})."
            );
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // Optionnel : enrichir l'org (siren, etc.)
            $orgPatch = $this->filterOrg($data);
            // Ne pas écraser le nom s'il n'est pas fourni
            unset($orgPatch['nom'], $orgPatch['slug'], $orgPatch['organisation_type_id']);
            if ($orgPatch) {
                $this->orgModel->update($orgId, $orgPatch);
            }

            $entData = $this->filterEnt($data);
            $entData['organisation_id'] = $orgId;

            $entId = $this->entModel->insert($entData);
            if (! $entId) {
                throw new \RuntimeException(
                    'Entreprise : ' . implode(', ', $this->entModel->errors() ?: ['insert échoué'])
                );
            }

            if (! empty($data['siret'])) {
                $this->ensureSiege(
                    $orgId,
                    (string) $data['siret'],
                    isset($data['adresse_id']) ? (int) $data['adresse_id'] : null,
                    $data['nom'] ?? ($org['nom'] ?? null),
                    $data['siren'] ?? ($org['siren'] ?? null)
                );
            }

            $db->transComplete();
            if (! $db->transStatus()) {
                throw new DatabaseException('Transaction échouée.');
            }

            return $this->loadFull((int) $entId);
        } catch (\Throwable $e) {
            $db->transRollback();
            throw $e;
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // Mise à jour
    // ═══════════════════════════════════════════════════════════════════

    public function update(int $entrepriseId, array $data): array
    {
        $ent = $this->entModel->find($entrepriseId);
        if (! $ent) {
            throw new \RuntimeException("Entreprise #{$entrepriseId} introuvable.");
        }

        $orgId = (int) $ent['organisation_id'];

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            $orgData = $this->filterOrg($data);
            if ($orgData) {
                $this->orgModel->update($orgId, $orgData);
            }

            $entData = $this->filterEnt($data);
            if ($entData) {
                if (! $this->entModel->update($entrepriseId, $entData)) {
                    throw new \RuntimeException(
                        'Entreprise : ' . implode(', ', $this->entModel->errors() ?: ['update échoué'])
                    );
                }
            }

            if (! empty($data['siret'])) {
                $org = $this->orgModel->find($orgId);
                $this->ensureSiege(
                    $orgId,
                    (string) $data['siret'],
                    isset($data['adresse_id']) ? (int) $data['adresse_id'] : null,
                    $data['nom'] ?? null,
                    $data['siren'] ?? ($org['siren'] ?? null)
                );
            }

            $db->transComplete();
            if (! $db->transStatus()) {
                throw new DatabaseException('Transaction échouée.');
            }

            return $this->loadFull($entrepriseId);
        } catch (\Throwable $e) {
            $db->transRollback();
            throw $e;
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // Siège social
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Crée ou met à jour l'établissement siège.
     * Garantit un seul is_siege = 1 par organisation.
     * Vérifie cohérence SIRET / SIREN si siren connu.
     *
     * @return array  ligne etablissement
     */
    public function ensureSiege(
        int     $organisationId,
        string  $siret,
        ?int    $adresseId = null,
        ?string $nom = null,
        ?string $siren = null
    ): array {
        $siret = preg_replace('/\D/', '', $siret);
        if (strlen($siret) !== 14) {
            throw new \InvalidArgumentException('SIRET invalide (14 chiffres attendus).');
        }

        $nic         = substr($siret, 9, 5);
        $siretPrefix = substr($siret, 0, 9);

        if ($siren !== null && $siren !== '') {
            $siren = preg_replace('/\D/', '', $siren);
            if ($siretPrefix !== $siren) {
                throw new \InvalidArgumentException(
                    "SIRET {$siret} incompatible avec SIREN {$siren}."
                );
            }
        }

        // Désactiver les autres sièges de cette org
        $this->etabModel
            ->where('organisation_id', $organisationId)
            ->where('is_siege', 1)
            ->set(['is_siege' => 0])
            ->update();

        $payload = [
            'organisation_id' => $organisationId,
            'siret'           => $siret,
            'nic'             => $nic,
            'is_siege'        => 1,
            'actif'           => 1,
        ];
        if ($adresseId !== null) {
            $payload['adresse_id'] = $adresseId;
        }
        if ($nom !== null && $nom !== '') {
            $payload['nom'] = $nom;
        }

        $existing = $this->etabModel->where('siret', $siret)->first();

        if ($existing) {
            // S'assurer que l'établissement appartient à la bonne org
            if ((int) $existing['organisation_id'] !== $organisationId) {
                throw new \RuntimeException(
                    "SIRET {$siret} déjà rattaché à l'organisation #{$existing['organisation_id']}."
                );
            }
            $this->etabModel->update($existing['id'], $payload);
            return $this->etabModel->find($existing['id']);
        }

        $id = $this->etabModel->insert($payload);
        if (! $id) {
            throw new \RuntimeException(
                'Établissement : ' . implode(', ', $this->etabModel->errors() ?: ['insert échoué'])
            );
        }

        return $this->etabModel->find($id);
    }

    // ═══════════════════════════════════════════════════════════════════
    // Lecture
    // ═══════════════════════════════════════════════════════════════════

    public function findBySiren(string $siren): ?array
    {
        $siren = preg_replace('/\D/', '', $siren);
        if (strlen($siren) !== 9) {
            return null;
        }

        $org = $this->orgModel->where('siren', $siren)->first();
        if (! $org) {
            return null;
        }

        $ent = $this->entModel->where('organisation_id', $org['id'])->first();
        if (! $ent) {
            return null;
        }

        return $this->loadFull((int) $ent['id']);
    }

    public function find(int $entrepriseId): ?array
    {
        $ent = $this->entModel->find($entrepriseId);
        return $ent ? $this->loadFull($entrepriseId) : null;
    }

    // ═══════════════════════════════════════════════════════════════════
    // Helpers privés
    // ═══════════════════════════════════════════════════════════════════

    private function filterOrg(array $data): array
    {
        return array_intersect_key($data, array_flip([
            'nom', 'slug', 'organisation_type_id', 'description', 'detail',
            'site_web', 'urlreg', 'email', 'telephone', 'siren',
            'lien_facebook', 'lien_instagram', 'lien_linkedin',
            'adresse_id', 'logo_id', 'cover_id', 'rna', 'tva_intracom',
            'date_creation', 'date_dissolution', 'actif',
        ]));
    }

    /** Champs purement entreprise — pas de siret / siren. */
    private function filterEnt(array $data): array
    {
        return array_intersect_key($data, array_flip([
            'codenaf_id', 'forme_juridique_id',
            'capital', 'effectif_min', 'effectif_max',
        ]));
    }

    private function loadFull(int $entrepriseId): array
    {
        $ent = $this->entModel->withRelations()->find($entrepriseId);
        if (! $ent) {
            return [];
        }

        $siege = $this->etabModel
            ->where('organisation_id', $ent['organisation_id'])
            ->where('is_siege', 1)
            ->first();

        $ent['siege'] = $siege ?: null;

        return $ent;
    }
}
