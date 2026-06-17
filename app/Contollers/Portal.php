<?php

namespace App\Controllers;

class Portal extends BaseController
{
    
    public function index(): string 
    { 
	    return view('pages/portal'); 
    }
    
}