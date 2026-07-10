je voudrais rendre public mon portail
j'ai une page : https://zealot.fr/technologies/vap/requalification
mais elle affiche le login shield.
je dois  ajouter 'technologies au $globals dans filters ?
---

Le filtre `session` est appliqué sur toutes les routes, 

**sauf** 

celles qui matchent les patterns de `except`. voir [shield.codeigniter](https://shield.codeigniter.com/references/controller_filters/)  

La route `technologies/vap/requalification` ne match aucun des patterns 
```
(`login*`, `register*`, `auth/a/*`, `api/*`, `csrf`, `/`)
```
donc Shield redirige vers la page de login.[shield.codeigniter](https://shield.codeigniter.com/references/controller_filters/)

## Ce qu’il faut ajouter dans `$globals['before']['session']['except']`

Ajoute un pattern qui couvre ton portail public, par exemple :berasix.tistory+1


```php
`public array $globals = [
     'before' => [
        'cors',
        'session' =>
            ['except' => [
              'login*',
              'register*',
              'auth/a/*',
              'api/*',
              'csrf',
              '/', // page d'accueil anonyme
              'technologies*',    // ← toutes les pages sous /technologies
              ]
          ],
      ],
   'after' => [
        'toolbar' => ['except' => ['api/*']],
  ],
];`



Les routes sont :

```php
$routes->get('technologies', 'Technologies::index');
$routes->get('phpdebug', 'Technologies::debug');
$routes->get('technologies/(:segment)', 'Technologies::rubrique/$1');
$routes->get('technologies/(:segment)/(:segment)', 'Technologies::show/$1/$2');`
```


- Le pattern `technologies*` va couvrir :
    - `/technologies`
    - `/technologies/vap`
    - `/technologies/vap/requalification`
    - et toutes les autres URL sous ce préfixe.
 
voir [shield.codeigniter](https://shield.codeigniter.com/references/controller_filters/)
