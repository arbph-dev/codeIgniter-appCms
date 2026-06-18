<?php
//app/Services/AdresseService.php
namespace App\Services;

use App\Libraries\FieldMapper;
use App\Models\AdresseModel;
use App\Sources\BanSource;
use App\Sources\NominatimSource;
use Config\Services;

class AdresseService
{
    protected BanSource $ban;
    protected NominatimSource $nominatim;
    //protected NominatimService $nominatim;
    //protected AdresseModel $model;

    public function __construct()
    {
        $this->ban = new BanSource();
        $this->nominatim = new NominatimSource();

        //$this->nominatim = new NominatimService();
        //$this->model     = new AdresseModel();
    }

    /**
     * Recherche principale avec fallback intelligent BAN → Nominatim
     */
    public function search(string $query, int $limit = 6, string $prefer = 'ban'): array
    {
        $results = [];

        // 1. BAN en priorité (meilleure qualité pour la France)
        if (in_array($prefer, ['ban', 'both'])) {
        
            // $banResults = $this->searchBan($query, $limit); 
        //emploi des sources
            $banResults = $this->ban->search( $query, ['limit' => $limit] );
        
            $results = array_merge($results, $banResults);
        }

        // 2. Fallback Nominatim si besoin
        if (count($results) < $limit && in_array($prefer, ['nominatim', 'both'])) {
            $remaining = $limit - count($results);
            $nominatimResults = $this->nominatim->search($query, $remaining, 'fr');
            $results = array_merge($results, $nominatimResults);
        }

        // Tri par score/importance descendant
        usort($results, fn($a, $b) => 
            ($b['score'] ?? $b['importance'] ?? 0) <=> ($a['score'] ?? $a['importance'] ?? 0)
        );

        return array_slice($results, 0, $limit);
    }


    /**
     * Mapping unifié selon la source
     */
    public function mapToAdresse(array $result): array
    {
        $mapper = ($result['source'] ?? '') === 'ban' 
                ? $this->getBanToAdresseMapper() 
                : $this->getNominatimToAdresseMapper();

        $mapping = $mapper->apply($result);

        return [
            'success'  => $mapping['success'],
            'payload'  => $mapping['payload'],
            'warnings' => $mapping['warnings'],
            'source'   => $result['source'] ?? 'unknown'
        ];
    }

    // ===================================================================
    // Helpers d'extraction (utilisés par les mappers)
    // ===================================================================

    private function extractNumero($housenumber)
    {
        if (empty($housenumber)) return null;
        $parts = preg_split('/\s+/', trim($housenumber));
        return (int)$parts[0];
    }

    private function extractRpt($housenumber)
    {
        if (empty($housenumber)) return null;
        $parts = preg_split('/\s+/', trim($housenumber));
        return count($parts) > 1 ? strtoupper(substr($parts[1], 0, 1)) : null;
    }

    private function extractTypeVoie(string $street): string
    {
        if (empty($street)) return '';
        $parts = explode(' ', trim($street));
        return ucfirst(strtolower($parts[0] ?? ''));
    }

    private function extractNomVoie(string $street): string
    {
        if (empty($street)) return '';
        $parts = explode(' ', trim($street), 2);
        return $parts[1] ?? $street;
    }

    private function extractCharniere(?string $nomVoie): int
    {
        if (empty($nomVoie)) return 0;

        $lower = strtolower(trim($nomVoie));

        $patterns = [
            'de l\'' => 5, 'de l’' => 5, 'de la' => 3, 'de l' => 5,
            'des'    => 4, 'du'    => 2, 'de'    => 6,
            'aux'    => 7, 'au'    => 7,
            'les'    => 1, 'le'    => 1, 'la' => 1, 'l\'' => 1, 'l’' => 1,
        ];

        foreach ($patterns as $pattern => $code) {
            if (str_starts_with($lower, $pattern)) {
                $rest = trim(substr($nomVoie, strlen($pattern)));
                if (!empty($rest)) return $code;
            }
        }
        return 0;
    }

    // ===================================================================
    // Résolutions utilisées par FieldMapper
    // ===================================================================

    public function resolve_type_voie(string $typeVoie): array
    {
        if (empty($typeVoie)) {
            return [null, 'error', 'Type de voie vide'];
        }

        $normalized = trim(ucfirst(strtolower($typeVoie)));

        $db = \Config\Database::connect();
        $builder = $db->table('type_voies');

        $row = $builder->groupStart()
                        ->where('nom', $normalized)
                        ->orWhere('nom_abrege', $typeVoie)
                       ->groupEnd()
                       ->select('id, nom')
                       ->get(1)
                       ->getRowArray();

        if ($row) {
            return [(int)$row['id'], 'exact', $row['nom']];
        }

        $rowApprox = $builder->like('nom', $normalized, 'after')
                             ->select('id, nom')
                             ->get(1)
                             ->getRowArray();

        if ($rowApprox) {
            return [(int)$rowApprox['id'], 'approx', $rowApprox['nom']];
        }

        return [null, 'pending', "Type de voie non trouvé : {$typeVoie}"];
    }

    public function fetch_codepostal_id(string $postcode, ?string $citycode = null): array
    {
        if (empty($postcode)) {
            return [null, 'error', 'Code postal vide'];
        }

        $db = \Config\Database::connect();
        $builder = $db->table('codes_postaux');

        if (!empty($citycode)) {
            $row = $builder->where('code_insee', $citycode)
                           ->select('id, codepostal, commune')
                           ->get(1)
                           ->getRowArray();
            if ($row) return [(int)$row['id'], 'exact', $row['commune']];
        }

        $row = $builder->where('codepostal', $postcode)
                       ->select('id, codepostal, commune')
                       ->get(1)
                       ->getRowArray();

        if ($row) {
            return [(int)$row['id'], 'exact', $row['commune']];
        }

        return [null, 'pending', "Code postal non trouvé : {$postcode}"];
    }
}
