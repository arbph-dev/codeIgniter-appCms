<?php  
  
namespace App\Models;  
  
use CodeIgniter\Model;  
  
class CodeNafModel extends Model  
{  
    protected $table = 'codesnaf';  
    protected $primaryKey = 'codenaf';  
    protected $returnType = 'array'; // ou Entity si tu veux aller plus loin  
    protected $allowedFields = [ 'codenaf', 'nom', 'parentcode' ];  
    protected $useTimestamps = false;
   

    
    /**  🔁 Parent (équivalent belongsTo)  */  
    public function getParent(string $codenaf)  
    {  
        $node = $this->find($codenaf);  
        
        if (!$node || !$node['parentcode']) { return null; }  
    
        return $this->find($node['parentcode']);  
    }  
    
    /** 🔁 Enfants (équivalent hasMany)  */  
    public function getChildren(string $codenaf)  
    {  
        return $this->where('parentcode', $codenaf)->findAll();  
    }  
    
    /**  🌱 Racines (scope)  */  
    public function getRacines()  
    {  
        return $this->where('parentcode', null)->findAll();  
    }  
    
    /** 🍃 Feuilles (scope)  */  
    public function getFeuilles()  
    {  
        return $this->whereNotIn('codenaf', function($builder) {  
            return $builder->select('parentcode')
                ->from('codesnaf')  
                ->where('parentcode IS NOT NULL');  
        })->findAll();  
    }  
    
    /** 🌳 Hiérarchie complète (vers la racine) */  
    public function getHierarchie(string $codenaf)  
    {  
        $hierarchy = [];  
        $current = $this->find($codenaf);  
        
        while ($current) {  
            array_unshift($hierarchy, $current);  
        
            if (!$current['parentcode']) { break; }  
        
            $current = $this->find($current['parentcode']);  
        }  
        
        return $hierarchy;  
    }
      
}