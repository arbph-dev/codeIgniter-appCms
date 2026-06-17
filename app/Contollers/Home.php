<?php

namespace App\Controllers;

class Home extends BaseController
{
    /* 2026-03-13 : modif vue acceuil :=  return view('welcome_message');  */

    /* vue classique tout intégré*/
    public function index(): string
    {
	    return view('home_index');
    }
    /* vue décomposée*/
    public function test(): string 
    { 
	    return view('pages/home'); 
    }
}
