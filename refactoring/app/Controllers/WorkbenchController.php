<?php

namespace App\Controllers;

class WorkbenchController extends BaseController
{
    /**
     * Workbench de test du catalogue des composants.
     *
     * URL :
     *      /workbench/component-catalog
     */
    public function componentCatalog()
    {
        return view('workbench/component_catalog');
    }


    /**
     * Workbench de test — feature Mot.
     *
     * URL : /workbench/mot
     */
    public function mot()
    {
        return view('workbench/mot');
    }

    /** Workbench de test — feature Image ; URL : /workbench/image     */    
    public function image() { return view('workbench/image'); }    
    
    /** Workbench de test — feature Adresse  ; URL : /workbench/image     */    
    public function adresse() { return view('workbench/adresse'); }      
}
