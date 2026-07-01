<?php  
  
namespace App\Models;  
  
use CodeIgniter\Model;  
  
class ComptespcgModel extends Model  
{  
    protected $table = 'comptespcg';  
    protected $primaryKey = 'numpcg';  
    protected $returnType = 'array';
    protected $allowedFields = [
        'numpcg',
        'nom',
        'parentnum',
        'classe',
    ];
    protected $useTimestamps = true;
    protected $useAutoIncrement = false;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';
    
    /**  🔁 Parent (équivalent belongsTo)  */  
    public function getParent(string $numpcg)  
    {  
        $node = $this->find($numpcg);  
        
        if (!$node || !$node['parentnum']) { return null; }  
    
        return $this->find($node['parentnum']);  
    }  
    
    /** 🔁 Enfants (équivalent hasMany)  */  
    public function getChildren(string $numpcg)  
    {  
        /* MODIF return $this->where('parentnum', $numpcg)->findAll(); */
        return $this
        ->where('parentnum', $numpcg)
        ->orderBy('numpcg', 'ASC')
        ->findAll();
        
    }  
    
    /**  🌱 Racines (scope)  */  
    public function getRacines()  
    {  
        /* MODIF return $this->where('parentnum', null)->findAll(); */ 
        return $this
        ->where('parentnum IS NULL')
        ->orderBy('numpcg', 'ASC')
        ->findAll();
    }  
    
    /** 🍃 Feuilles (scope)  */  
    public function getFeuilles()  
    {  
       /* MODIF
        return $this->whereNotIn('numpcg', function($builder) {  
            return $builder->select('parentnum')
                ->from('numpcg')  
                ->where('parentnum IS NOT NULL');  
        })->findAll();  */
        return $this
            ->whereNotIn('numpcg', function ($builder) {

                return $builder
                    ->select('parentnum')
                    ->from('comptespcg')
                    ->where('parentnum IS NOT NULL');

            })
            ->orderBy('numpcg', 'ASC')
            ->findAll();

    }  
    
    /** 🌳 Hiérarchie complète (vers la racine) */  
    public function getHierarchy(string $numpcg)  
    {  
        /*
        $hierarchy = [];  
        $current = $this->find($numpcg);  
        
        while ($current) {  
            array_unshift($hierarchy, $current);  
        
            if (!$current['parentnum']) { break; }  
        
            $current = $this->find($current['parentnum']);  
        }  
        
        return $hierarchy; */ 
        $hierarchy = [];

        $current = $this->find($numpcg);

        while ($current) {

            array_unshift($hierarchy, $current);

            if (empty($current['parentnum'])) {
                break;
            }

            $current = $this->find($current['parentnum']);
        }

        return $hierarchy;        
    }
      
}