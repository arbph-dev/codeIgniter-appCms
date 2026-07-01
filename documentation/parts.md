Le contenu n'est plus obligatoirement du HTML.
Une part peut contenir :
- texte brut
- descripteur de composant

# parts
Part devient l'unité de rendu.

Une part contient :
```php
[    
	'title' => '...',
	'type'  => '...',
]
```
---

Le CMS devient un moteur de rendu basé sur les descripteurs.
Ainsi dans une Vue PHP

```php
$type = $part['type'] ?? 'raw';

if ($type === 'raw') {
    echo $part['content'];
}
else {
    echo view( "components/{$type}", $part );
}
```

## Migrations
Les parts sont stockées dans la table cmsparts.

La migration est détaillé ici : 

## Model

