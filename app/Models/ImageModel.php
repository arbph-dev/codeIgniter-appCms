<?php
// app/Models/ImageModel.php

namespace App\Models;

use CodeIgniter\Model;

class ImageModel extends Model
{
    protected $table = 'images';
    protected $primaryKey = 'id';
    //protected $allowedFields = ['user_id', 'width', 'height', 'ratio', 'extension', 'size_ko'];
	protected $allowedFields = ['user_id', 'width', 'height', 'ratio', 'extension', 'size_ko', 'path' ,'filename','alt','status' ];
	
    protected $validationRules = [
        'user_id' => 'required|integer',
        'width' => 'required|integer',
        'height' => 'required|integer',
        'ratio' => 'required|decimal',
        'extension' => 'required|string|max_length[10]',
        'size_ko' => 'required|decimal',
        'path' => 'required|string|max_length[255]',
        'filename' => 'required|string|max_length[128]',
		'alt'    => 'permit_empty|string|max_length[1000]',
		'status' => 'required|in_list[pending,validated,rejected]',        
    ];

    // Optionnel : gestion automatique des timestamps si ajoutés en base
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}