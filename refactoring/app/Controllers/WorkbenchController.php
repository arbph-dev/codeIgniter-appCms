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
}
