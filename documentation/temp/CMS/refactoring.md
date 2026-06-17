# cahier des charges

Gérer le contenu avec CodeIgniter 
voir [[PROJETS/CMS/brouillon]]


architecture des bases de données
modèles
Controller
Views

Les fichiers principaux du cms
- app/Controller/
	- Cms.php
	- User.php
	- Admin.php 

- app/Views/layouts/cms.php

- app/Views/cms/
	- index.php
	- userboard.php
	- admin.php

- app/Views/cms/components
	- user_list2.php
	- user_list.php
	- debug_overlay.php


commande Spark pour générer des pages statiques.
[[PROJETS/CMS/reflex1-seo]]


---
# Architecture de la base de données
## 1.1 Ebauche 

### Tables principales

| Table      | Champs                                                       | Description                             |
| ---------- | ------------------------------------------------------------ | --------------------------------------- |
| categories | id (PK), title, slug, description, catp_id (nullable FK)     | Rubriques et sous-rubriques             |
| articles   | id (PK), title, slug, description, cat_id (FK), is_published | Articles liés à une rubrique            |
| sections   | id (PK), title, slug , content , art_id (FK), pos, file      | Sections d’un article, ordre et fichier |
### categories
permet une gestion des catégories d'articles

champs
	id
	title
	slug
	description
	parent_id : catégorie parente

exemple
id = 1 , title = technologie , slug = techno , description =  , ensemble d'articles relatifs à des technologies courantes , catp_id = null
id = 2 , title = electronique , slug = eln, description = quelques notions d'electronique , catp_id = 1

```sql
-- =========================================================
-- Portail: Categories ->  -> Articles -> Sections
-- MySQL 8+ / MariaDB 10.4+ (InnoDB, utf8mb4)
-- =========================================================
-- ---------------------------------------------------------
-- TABLE: categories
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(80) NOT NULL,
  `description` TEXT NULL,
  `catp_id` BIGINT UNSIGNED NULL,  
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  KEY `idx_catp_id` (`catp_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### articles

champs
	id
	title
	slug
	description
	cat_id : catégorie
	is_published

```sql

-- ---------------------------------------------------------
-- TABLE: articles
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `articles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cat_id` BIGINT UNSIGNED NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `description` TEXT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `published_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_articles_slug` (`slug`),
  KEY `idx_articles_category` (`cat_id`),
  KEY `idx_articles_published_at` (`published_at`),
  CONSTRAINT `fk_articles_subcategory`
    FOREIGN KEY (`cat_id`) REFERENCES `categories` (`id`)
    ON DELETE NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

```

### sections

```sql
-- ---------------------------------------------------------
-- TABLE: sections
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sections` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` BIGINT UNSIGNED NOT NULL,
  `slug` VARCHAR(140) NULL, -- utile si tu veux des ancres stables: #dimensionnement-intro
  `title` VARCHAR(180) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `position` INT UNSIGNED NOT NULL DEFAULT 1,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sections_article` (`article_id`),
  KEY `idx_sections_article_position` (`article_id`, `position`),
  KEY `idx_sections_article_published_position` (`article_id`, `is_published`, `position`),
  UNIQUE KEY uq_sections_article_slug (article_id, slug);
  CONSTRAINT `fk_sections_article`
    FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```


Le contrôleur **app/Controllers/Cms.php** sert de table temporaire
```
                // ── Article 9 — Vox ──────────────────────────────────────────
                [
                    'id'    => 9,
                    'title' => 'Vox',
                    'intro' => 'Synthèse vocale',
                    'sections' => [
                        [
                            'id'    => 10,
                            'title' => 'Composant vox',
                            'parts' => [
                                [
                                    'id'      => 18,
                                    'title'   => 'Synthèse vocale (event bus)',
                                    'content' => '<textarea class="cp_voxzone_textarea" id="TXT_VOX_1" rows="8">
Juliette: Bonjour, je suis Juliette.
Romeo: Bonjour, je suis Roméo.
											    </textarea>
											    <br/><br/>	
											    <div id="VOX_STATUS"></div>',
                                    'aside'   => '<button onclick="window.eventBusPublish(event, \'vox:speak\', { targetId:\'TXT_VOX_1\', statusId:\'VOX_STATUS\' })">Lire</button>
                                                <button onclick="window.eventBusPublish(event,\'vox:pause\')">Pause</button>
                                                <button onclick="window.eventBusPublish( event, \'vox:resume\' )">Resume</button>
                                                <button onclick="window.eventBusPublish( event, \'vox:stop\' )">Stop</button>
                                                <br/><br/>
                                                <label>Rate</label>
                                                <input type="range" min="0.5" max="2" step="0.1" value="0.9" onchange="window.eventBusPublish( event, \'vox:rate\',{value:this.value})">	
                                                <br/><br/>
                                                <label>Volume</label>
                                                <input type="range" min="0" max="1" step="0.1" value="1" onchange="window.eventBusPublish( event,\'vox:volume\',{ value:this.value })">	
                                                <br/><br/>
                                                <button onclick="window.eventBusPublish( event,\'vox:getVoices\')">Configurer les voix</button>
                                                <h3>Voix disponibles</h3>  
                                                <div id="VOX_VOICES_LIST"></div>
                                                '
                                ] // end part
                            ] // end parts
                        ] , // end section

                        [
                            'id'    => 25,
                            'title' => 'Composant vox',
                            'parts' => [
                                [
                                    'id'      => 35,
                                    'title'   => 'Reco vocale (event bus)',
                                    'content' => '<textarea class="cp_voxzone_textarea" id="TXT_RVOX_1" rows="8"></textarea>
											    <br/><br/>	
											    <div id="RVOX_STATUS_1"></div>',
                                    'aside'   => '<button onclick="window.eventBusPublish( event, \'listen:cmd:start\', { targetId:\'TXT_RVOX_1\' } )">▶ Lire</button>
                                                <button onclick="window.eventBusPublish(event, \'listen:cmd:stop\')">⏹ Stop</button>'
                                ] // end part
                            ] // end parts
                        ] // end section

                    ] // end sections
                ], // end article

```

Le contrôleur **app/Controllers/Cms.php** devient un **catalogue de descripteurs**
```php
[    
	'type' => 'codeval',
	'id' => 'CVG5',
	'config' => [
		'title' => 'Volume normal ISO 2533',
		'script' => '...'    
	]
]
```

### Part

champs
id
section_id
title
content
aside
type qui deviendra type_id

type qui deviendra certainement type_id car Il faudra gérer les types et leurs donnés comme config

On doit aussi stocker les descripteurs

**table descriptor**
	id
	title ou name pour par exemple 'couple moteur nsx'
	part_id
	key
	value

exemple:  
key = 'rows' ; value = '12' 
key = 'script' ; value = 'const P2_rel_bar = 0.3.....' 
key = 'chart' ; value = 'moteurCouple' 
key = 'height' ; value = '350' 



```
-- ---------------------------------------------------------
-- OPTION RECOMMANDEE: unicité des slugs "dans un parent"
-- Si tu préfères autoriser des slugs identiques dans des catégories différentes,
-- remplace l'unicité globale par une unicité composite.
-- (Dans ce cas, supprime les UNIQUE uq_*_slug ci-dessus avant d'ajouter ceux-ci.)
-- ---------------------------------------------------------
-- ALTER TABLE subcategories DROP INDEX uq_subcategories_slug;
-- ALTER TABLE subcategories ADD UNIQUE KEY uq_subcategories_category_slug (category_id, slug);

-- ALTER TABLE articles DROP INDEX uq_articles_slug;
-- ALTER TABLE articles ADD UNIQUE KEY uq_articles_subcategory_slug (subcategory_id, slug);

-- (Optionnel) Sections: unicité de slug par article si tu l'utilises
-- ALTER TABLE sections ADD UNIQUE KEY uq_sections_article_slug (article_id, slug);

-- ---------------------------------------------------------
-- SEED MINIMAL (optionnel)
-- ---------------------------------------------------------
-- INSERT INTO categories (slug, name, description, position) VALUES
-- ('home', 'Accueil', 'Page principale', 0),
-- ('news', 'Actualités', 'Dernières mises à jour', 1),
-- ('info', 'Infos', 'Références et documentation', 2),
-- ('techno', 'Technologie', 'Chimie, électricité, etc.', 3);

-- INSERT INTO subcategories (category_id, slug, name, description, position)
-- SELECT id, 'chimie', 'Chimie', 'Rubrique chimie', 0 FROM categories WHERE slug='techno';
-- INSERT INTO subcategories (category_id, slug, name, description, position)
-- SELECT id, 'electricite', 'Électricité', 'Rubrique électricité', 1 FROM categories WHERE slug='techno';</pre>
```









---










## 1.2 Proposition

component_types
categories
articles
sections
parts
### component_types


```sql
CREATE TABLE IF NOT EXISTS `component_types` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)  NOT NULL,     -- 'codeval' | 'apex' | 'mermaid' | 'raw'
  `view`        VARCHAR(120) NOT NULL,     -- 'components/codeval' etc.
  `description` TEXT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_component_types_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

```

###  categories
###  articles
###  sections
###  parts

![[PROJETS/CMS/portail_allTables_sql]]

# Models

## 2. Modèles (Models)

Pour chaque table, un modèle correspondant :

- **RubriqueModel** : gérer les rubriques, récupérer les sous-rubriques, etc.
- **ArticleModel** : gérer les articles, récupérer par rubrique.
- **SectionModel** : gérer les sections, récupérer par article, ordonner par `pos`.

Exemple simplifié pour RubriqueModel :

```php
namespace App\Models;

use CodeIgniter\Model;

class RubriqueModel extends Model
{
    protected $table = 'rubriques';
    protected $primaryKey = 'id';
    protected $allowedFields = ['title', 'slug', 'description', 'parent_id'];

    public function getRubriquesWithChildrenAndArticles()
    {
        // Exemple de récupération avec sous-rubriques et articles associés
        // À adapter selon vos besoins et relations
    }
}
```

---
# Controller
## 3. Contrôleurs






### app/Controllers/Cms.php
### app/Controllers/Admin.php

préparer l'intégration de auth 
[[2026-04-21-shield_suite]] checkAuthentication => eventbus = Auth
[[DAILY/2026-04-21-shield_suite#test user]]
voir [[DAILY/2026-04-25-cmsViews|2026-04-25-cmsViews]]

TRAVAUX\OVH\www\app\Controllers\Admin.php

#### app\Controllers\Admin.php
##### Old
```

    public function index()
    {
        if (!auth()->loggedIn()) {
            return redirect()->to('/');
        }

        if (!auth()->user()->inGroup('admin')) {
            return redirect()->to('/user');
        }

        $provider = auth()->getProvider();

        $users = $provider
            ->withIdentities()
            ->withGroups()
            ->withPermissions()
            ->findAll(50);


        //var_dump($users);

        $users = array_values(array_map(function ($u) {
            $data = $u->toArray();
            return [
                'id'        => $data['id'],
                'username'  => $data['username'],
                'email'     => $this->extractEmail($u),
                'groups'    => array_column($data['groups'] ?? [], 'name'),
                'active'    => $data['active'] ?? null,
                'created_at'=> $data['created_at'] ?? null,
            ];

        }, $users));            

        return view('cms/admin', [
            'users' => $users
        ]);
    }
}
```

##### Controller Admin : cms/admin - Correction groupes
gestion utilisateurs

extractEmail 
$u->getGroups() est une fonction du model retournant array voir app/Config/AutGroups ??
$u->getPermissions()
==est-il possible d'accéder a cela You can access all of the user's tokens with the `accessTokens()` method on that user.==
```
`$tokens = $user->accessTokens(); foreach($tokens as $token) {     // }`
```

```php
	//---------------------------------
    private function extractEmail($user): ?string
    {
        foreach ($user->identities ?? [] as $identity) {
            if ($identity->type === 'email_password') {
                return $identity->secret;
            }
        }
        return null;
    }
	//------------------------------------------

    public function index()
    {
        $this->requireAdmin();

        $provider = auth()->getProvider();

        $rawUsers = $provider
            ->withIdentities()
            ->withGroups()
            ->withPermissions()
            ->findAll(100);


        $users = array_values(array_map(function ($u) {

            return [
                'id'          => $u->id,
                'username'    => $u->username,
                'email'       => $this->extractEmail($u),
        
                'groups'      => $u->getGroups(),

                'permissions' => array_keys($u->getPermissions()),
        
                'active'      => $u->active ?? false,
                'created_at'  => $u->created_at ?? null,
                'last_active' => $u->last_active ?? null,
            ];
        
        }, $rawUsers));        
/*
principale différence             
	// disparait : $data = $u->toArray(); 

	//on accede aux propriétés : 'id'          => $u->id,
	// et non plus : 'id'        => $data['id'],
	
	//'permissions' => array_keys($u->getPermissions()),
	


	
        $users = array_values(array_map(function ($u) {
            $data = $u->toArray();
            return [
                'id'        => $data['id'],
                'username'  => $data['username'],
                'email'     => $data['email'] ?? null,
                'groups'    => array_column($data['groups'] ?? [], 'name'),
                'active'    => $data['active'] ?? null,
                'created_at'=> $data['created_at'] ?? null,
            ];

        }, $users));        
*/
        // ── Données debug overlay ────────────────────────────────────────────
        $me = auth()->user();
        $debugData = $this->buildDebugData($me);
        
        // dd(get_class(auth()->getProvider())); => "CodeIgniter\Shield\Models\UserModel"
        
        return view('cms/admin', [
            'users'        => $users,
            'isSuperAdmin' => $this->isSuperAdmin(),
            'debugData'    => $debugData,
        ]);
    }
```

#### liste des users 
DAILY/2026-04-21-shield_suite#liste des users
2026-04-21-shield_suite
#### fichiers 
##### [[PROJETS/SPA/backend/Authentification  JS - API#js/features/auth/auth.ui.js|js/features/auth/auth.ui.js]]
##### [[PROJETS/SPA/backend/Authentification  JS - API#js/test_main.js|js/test_main.js]]
##### [[PROJETS/SPA/backend/Authentification  JS - API#js/features/auth/auth.controller.js|js/features/auth/auth.controller.js]]
cerveau du module, écoute le bus
##### [[PROJETS/SPA/backend/Authentification  JS - API#js/features/auth/auth.service.js|js/features/auth/auth.service.js]]
I/O pure, pas de bus

[[PROJETS/SPA/backend/Authentification  JS - API]]



### 3.1 HomeController

- Objectif : afficher la liste de toutes les rubriques principales (parent_id = null).

```php
namespace App\Controllers;

use App\Models\RubriqueModel;

class Home extends BaseController
{
    public function index()
    {
        $model = new RubriqueModel();
        $rubriques = $model->where('parent_id', null)->findAll();

        return view('home', ['rubriques' => $rubriques]);
    }
}
```

### 3.2 RubriqueController

- Objectif : afficher une rubrique, ses sous-rubriques, et tous les articles associés.

```php
namespace App\Controllers;

use App\Models\RubriqueModel;
use App\Models\ArticleModel;

class Rubrique extends BaseController
{
    public function show($slug)
    {
        $rubriqueModel = new RubriqueModel();
        $articleModel = new ArticleModel();

        $rubrique = $rubriqueModel->where('slug', $slug)->first();

        if (!$rubrique) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound("Rubrique non trouvée");
        }

        $sousRubriques = $rubriqueModel->where('parent_id', $rubrique['id'])->findAll();
        $articles = $articleModel->where('rub_id', $rubrique['id'])->findAll();

        return view('rubrique/show', [
            'rubrique' => $rubrique,
            'sousRubriques' => $sousRubriques,
            'articles' => $articles,
        ]);
    }
}
```

### 3.3 ArticleController

- Objectif : afficher les sections d’un article, ordonnées par `pos` ? .
==Revoir pos est supprimé de la structure==
```php
namespace App\Controllers;

use App\Models\ArticleModel;
use App\Models\SectionModel;

class Article extends BaseController
{
    public function show($slug)
    {
        $articleModel = new ArticleModel();
        $sectionModel = new SectionModel();

        $article = $articleModel->where('slug', $slug)->first();

        if (!$article) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound("Article non trouvé");
        }

        $sections = $sectionModel->where('art_id', $article['id'])->orderBy('pos', 'ASC')->findAll();

        return view('article/show', [
            'article' => $article,
            'sections' => $sections,
        ]);
    }
}
```

---
# Views

## Layout

- [ ] Documenter app/Views/layouts/cms.php
### app/Views/layouts/cms.php
le seul include est le **composant php** : app/Views/cms/components/debug_overlay.php

On peut commencer a séparer le code de ce fichier, mais quel option ? :  
- app/Views/layouts/cms/header.php
- app/Views/cms/components/header.php

Une section dialog peut s'avérer nécessaire mais a réserver pour l'application principale.
Chaque composant pourra employer des éléments dialog qui lui seront propre

```php
        <?= $this->renderSection('header') ?>
        <?= $this->renderSection('nav') ?>
        <?= $this->renderSection('main') ?> 
        <?= $this->renderSection('footer') ?>
        <?= $this->include('cms/components/debug_overlay') ?>
```

### sections du layout
head
- script si besoin
- title

header
main
footer

title
header

on prévoit une top bar ??
```
<?= $this->section('topbar') ?>
    <div class="w3-bar w3-black">
        <button class="w3-bar-item w3-button" onclick="openTabs('tab1')">tab1</button>
        <button class="w3-bar-item w3-button" onclick="openTabs('tab2')">tab2</button>
        <button class="w3-bar-item w3-button" onclick="openTabs('tab3')">tab3</button>
    </div>
<?= $this->endSection() ?>
```

main

nav



footer
## components (PHP)



## 4. Vues

[[INFORMATIQUE/CODEIGNITER/2026-03-23-CI-MVC]] Voir chimie

### 4.1 page Principale (app/Views/cms/index.php)
- Liste simple des rubriques principales avec liens vers leurs pages.

- correction : Les blocs part.aside des parts étaient mal gérés
Une erreur s'est glissé dans index.php ; vu le [[DAILY/2026-05-17#Bilan 3js|2026-05-17]] avec  threejs : les blocs aside des parts sont mal gérées. elles sont regroupés. 
On a du mettre les boutons dans les part.content au lieu des part.aside
Ce correctif permet de mettre les boutons des part.aside en corresondance avec les contenus des part.content
```php
<?php foreach ($section['parts'] as $part): ?>
	<div>
		<div>
			<h3><?= esc($part['title']) ?></h3>
            <?= $part['content'] /* HTML autorisé : pas de esc() */ ?>			
		</div>
		<?php if (!empty($part['aside'])): ?>
			<aside>
	            <?= $part['aside'] ?>
			</aside>	            
		<?php endif; ?>
	</div>
<?php endforeach; ?>
```


### Amélioration :  Sortir la définition des composants du contrôleur
le controleur `app/Controllers/Cms.php` contient beaucoup de HTML inline :

```
'content' => '<div id="CODEVAL_CVG5"...'
```

C’est le point faible actuel. Le contrôleur ne devrait fournir que des **descripteurs**.
Le contrôleur **app/Controllers/Cms.php** devient un **catalogue de descripteurs** :

```php
[    
	'type' => 'codeval',
	'id' => 'CVG5',
	'config' => [
		'title' => 'Volume normal ISO 2533',
		'script' => '...'    
	]
]
```
descripteurs qui sont transmis à la vue et employés par les composants
```php
<?= view('components/codeval', $part['config']) ?>
```
la vue**app/Views/cms/index.php**  fait le dispatch :
```php
// index.php — à la place de <?= $part['content'] ?>
<?php
$type = $part['type'] ?? 'raw';
if ($type === 'raw') {
    echo $part['content'];
} else {
    echo view("components/{$type}", $part);
}
?>
```

Crée les composants cms :
- `app/Views/components/codeval.php`
	[[DAILY/2026-05-19/codeval.php]]
- `app/Views/components/apex.php` 
	[[DAILY/2026-05-19/apex.php]]
- `app/Views/components/mermaid.php`
	[[DAILY/2026-05-19/mermaid.js]] *a revoir*
	[[DAILY/2026-05-19/mermaid.php]]

L'article `codeval` défini dans le contrôleur **app/Controllers/Cms.php** devient :
```php
[
    'type'   => 'codeval',
    'id'     => 'CVG5',
    'title'  => 'Volume normal ISO 2533',
    'rows'   => 12,
    'script' => <<<'PHP'
const P2_rel_bar = 0.3
const P2_abs_bar = P2_rel_bar + 1
...
const result = "Volume corrigé = " + V1
PHP,
    'aside'  => 'Déterminons le volume V1...',
]
```

Et dans `index.php`, le dispatch :
```php
<?php
$type = $part['type'] ?? 'raw';
echo $type === 'raw'
    ? $part['content']
    : view("components/{$type}", $part);
?>
```
