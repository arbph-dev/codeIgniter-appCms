# API Relations — Implémentation Image ↔ Mot

## Objectif

Mettre en place et valider le premier cas de relation N–N du backend :

```text
Image ←→ Mot
```

Une Image possède plusieurs tags (`Mot`) et un Mot peut être associé à plusieurs Images.

Ce cas servira de référence avant la généralisation vers :

```text
Organisation ↔ Adresse
Personne ↔ Organisation
Organisation ↔ Organisation
```

---

# 1. Migration de la table pivot

Créer :

```text
image_mot
├── image_id
└── mot_id
```

Contraintes :

```text
PRIMARY KEY (image_id, mot_id)
FOREIGN KEY image_id → images.id
FOREIGN KEY mot_id   → mots.mot_id
```

Avec `ON DELETE CASCADE`.

Pas de timestamps : la table représente uniquement l'association.

---

# 2. Modèle du pivot

Créer :

```text
app/Models/ImageMotModel.php
```

Responsabilité :

- accès à `image_mot` ;
- lecture des associations ;
- insertion ;
- suppression.

Le pivot possède une clé primaire composée :

```text
(image_id, mot_id)
```

Il ne doit donc pas être traité comme une ressource CRUD classique de CodeIgniter.

---

# 3. Service de relation

Créer :

```text
app/Services/ImageMotService.php
```

Le service porte la logique de la relation.

Premières opérations :

```text
getMots(imageId)
attach(imageId, motId)
detach(imageId, motId)
sync(imageId, motIds)
```

Responsabilités :

- vérifier l'existence de l'Image ;
- vérifier l'existence du Mot ;
- éviter les doublons ;
- gérer la table pivot ;
- utiliser une transaction pour `sync()` ;
- retourner des résultats exploitables par l'API.

Ne pas créer encore de `RelationService` générique.

L'abstraction sera extraite après validation de plusieurs relations réelles.

---

# 4. Controller

Créer :

```text
app/Controllers/Api/ImageMot.php
```

Le Controller ne contient pas la logique métier.

Il :

```text
HTTP
 ↓
paramètres
 ↓
validation élémentaire
 ↓
ImageMotService
 ↓
réponse JSON
```

Endpoints :

```text
GET    /api/image/:id/mots
POST   /api/image/:id/mots
PUT    /api/image/:id/mots
DELETE /api/image/:id/mots/:motId
```

---

# 5. Lecture inverse

Prévoir également :

```text
app/Controllers/Api/MotImage.php
```

avec :

```text
GET /api/mot/:id/images
```

Cette route permet de valider que le modèle fonctionne dans les deux directions :

```text
Image → Mots
Mot   → Images
```

---

# 6. `include`

Adapter `ImageController::show()` pour accepter :

```text
GET /api/image/17?include=mots
```

Sans `include` :

```text
GET /api/image/17
```

retourne uniquement l'Image.

Avec :

```text
include=mots
```

le Controller délègue au même `ImageMotService`.

Les valeurs de `include` doivent être whitelistées.

---

# 7. Routes CodeIgniter

Ajouter au groupe `api` :

```php
$routes->get(
    'image/(:num)/mots',
    'Api\ImageMot::index/$1'
);

$routes->post(
    'image/(:num)/mots',
    'Api\ImageMot::attach/$1'
);

$routes->put(
    'image/(:num)/mots',
    'Api\ImageMot::sync/$1'
);

$routes->delete(
    'image/(:num)/mots/(:num)',
    'Api\ImageMot::detach/$1/$2'
);

$routes->get(
    'mot/(:num)/images',
    'Api\MotImage::index/$1'
);
```

---

# 8. Tests fonctionnels avec curl

Les tests doivent être réalisés dans cet ordre.

## 8.1 Vérifier les ressources

```bash
curl http://localhost/api/image/1
```

```bash
curl http://localhost/api/mot/1
```

Les deux ressources doivent exister.

---

## 8.2 Vérifier la relation initiale

```bash
curl http://localhost/api/image/1/mots
```

Puis :

```bash
curl http://localhost/api/mot/1/images
```

Vérifier les deux sens.

---

## 8.3 Ajouter une relation

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mot_id":1}' \
  http://localhost/api/image/1/mots
```

Vérifier ensuite :

```bash
curl http://localhost/api/image/1/mots
```

---

## 8.4 Tester le doublon

Répéter :

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mot_id":1}' \
  http://localhost/api/image/1/mots
```

Le système doit gérer proprement l'association déjà existante.

---

## 8.5 Supprimer une relation

```bash
curl -X DELETE \
  http://localhost/api/image/1/mots/1
```

Puis :

```bash
curl http://localhost/api/image/1/mots
```

Le Mot ne doit plus être associé à l'Image.

Le Mot lui-même doit toujours exister.

---

## 8.6 Tester `sync`

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{"ids":[1,3,5]}' \
  http://localhost/api/image/1/mots
```

Vérifier que l'ensemble final est exactement :

```text
1
3
5
```

et que les anciennes associations absentes de `ids` ont été supprimées.

---

## 8.7 Tester `include`

```bash
curl \
  "http://localhost/api/image/1?include=mots"
```

Vérifier que la réponse contient :

```json
{
    "data": {
        "...": "...",
        "mots": []
    }
}
```

Puis vérifier que :

```bash
curl http://localhost/api/image/1
```

ne charge pas les mots par défaut.

---

## 8.8 Tester l'autocomplete

```bash
curl \
  "http://localhost/api/mot/like?q=bre&len=10"
```

Vérifier que `Mot` reste indépendant du mécanisme de relation.

---

## 8.9 Tester le lazy loading par batch

```bash
curl \
  "http://localhost/api/mot/batch?ids=1,3,5"
```

Ce test valide le deuxième mécanisme nécessaire au futur frontend.

---

# 9. Critères de validation

Le premier cas est considéré comme stabilisé lorsque :

```text
[ ] migration image_mot fonctionnelle
[ ] contraintes FK fonctionnelles
[ ] doublons impossibles
[ ] Image → Mots fonctionnel
[ ] Mot → Images fonctionnel
[ ] attach fonctionnel
[ ] detach fonctionnel
[ ] sync fonctionnel
[ ] include=mots fonctionnel
[ ] include absent → relation non chargée
[ ] autocomplete Mot fonctionnel
[ ] batch Mot fonctionnel
[ ] suppression Image → relations supprimées
[ ] suppression Mot → relations supprimées
[ ] réponses API homogènes
```

---

# 10. Après validation

Une fois `Image ↔ Mot` stabilisé :

```text
Image ↔ Mot
     ↓
identifier les invariants
     ↓
RelationService
     ↓
Organisation ↔ Adresse
     ↓
Personne ↔ Organisation
     ↓
Organisation ↔ Organisation
```

Le **ImageTaggerWorkbench** sera le premier consommateur réel de cette API et servira donc également de validation frontend du contrat relationnel.