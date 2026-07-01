# Zealot v2 - Roadmap Architecture

## Objectif

Construire une plateforme SPA professionnelle permettant :

- gestion de données
- gestion de relations
- API cohérentes
- composants PHP
- composants JS
- système expert futur

---

## Architecture CMS
Structure validée :
```
categories
articles
sections
parts
```

---
### Part
Part devient l'unité de rendu.
Une part contient :
```php
[    
	'title' => '...',
	'type'  => '...',
]
```

Le contenu n'est plus obligatoirement du HTML.
Une part peut contenir :
- texte brut
- descripteur de composant
