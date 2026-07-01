Le contenu n'est plus obligatoirement du HTML.
Une part peut contenir :
- texte brut
- descripteur de composant
- config JSON

# parts
Part devient l'unité de rendu.

Une part contient :
```php
[    
	'title' => '...',
	'type'  => '...',
	'config'  => '...',
]
```
---
## config JSON
par type :

### type = 'codeval'
```
{ "rows": 12, "script": "const P2_rel_bar = 0.3\n..." }
```
### type = 'apex'
```
{ "chart": "moteurCouple", "height": 350, "payload": {} }
```
### type = 'mermaid'
```
{ "definition": "gantt\n  dateFormat YYYY-MM-DD\n  ...", "autorun": false }
```
### type = 'raw'
```
config NULL 
content et aside contiennent le HTML directement
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

La migration est détaillé ici : [migration cmsparts](/documentation/MIGRATIONS/cmsparts.md#migration)

## Model

