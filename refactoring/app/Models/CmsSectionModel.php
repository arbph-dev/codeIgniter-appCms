<?php
// app/Models/CmsSectionModel.php
namespace App\Models;

use CodeIgniter\Model;

class CmsSectionModel extends Model
{
    protected $table      = 'cmssections';
    protected $primaryKey = 'id';

    protected $returnType = 'array';

    protected $allowedFields = [
        'article_id',
        'slug',
        'title',
        'content',
        'position',
        'is_published'
    ];

    protected $useTimestamps = true;

    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';


    public function findByArticle(int $articleId): array
    {
        return $this
            ->where('article_id', $articleId)
            ->where('is_published', 1)
            ->orderBy('position', 'ASC')
            ->findAll();
    }


    public function findBySlug(string $slug): ?array
    {
        return $this
            ->where('slug', $slug)
            ->first();
    }
}