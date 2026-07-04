# API Routes — Index et Inventaire

## 📑 Vue d'ensemble

Ce document liste tous les endpoints de l'API métier du CMS CodeIgniter 4.7, organisés par catégorie et niveau de priorité.

**Base :** `/api/`  
**Authentication :** Session OU Token  
**Format :** JSON

---

## 🏢 Modules métier (Priorité 1)

Ces modules constituent le cœur fonctionnel du système. Ils gèrent les structures organisationnelles et commerciales.

### Organisation
**Fichier de documentation :** [`documentation/API/Organisation.md`](./Organisation.md)

| Endpoint | Méthode | Paramètres | Description |
|----------|---------|-----------|-------------|
| `/organisation` | GET | `q`, `type`, `page`, `per_page` | Liste des organisations (paginée, filtrable) |
| `/organisation/like` | GET | `q`, `len` | Autocomplétion par nom |
| `/organisation/:id` | GET | `id` | Détail d'une organisation |
| `/organisation` | POST | JSON body | Créer une organisation |
| `/organisation/:id` | PUT | `id`, JSON body | Mettre à jour une organisation |
| `/organisation/:id` | DELETE | `id` | Supprimer (soft delete) |

**Status :** ✅ Documentée

---

### Entreprise
**Fichier de documentation :** [`documentation/API/Entreprise.md`](./Entreprise.md)

| Endpoint | Méthode | Paramètres | Description |
|----------|---------|-----------|-------------|
| `/entreprise` | GET | `q`, `page`, `per_page` | Liste des entreprises (paginée, filtrable) |
| `/entreprise/like` | GET | `q`, `len` | Autocomplétion par nom/SIRET |
| `/entreprise/:id` | GET | `id` | Détail d'une entreprise |
| `/entreprise` | POST | JSON body | Créer une entreprise + organisation |
| `/entreprise/:id` | PUT | `id`, JSON body | Mettre à jour (org + entreprise) |
| `/entreprise/:id` | DELETE | `id` | Supprimer (soft delete via org) |

**Status :** ✅ Documentée  
**Spécificité :** Crée automatiquement l'organisation mère en transaction atomique

---

### Établissement
**Fichier de documentation :** ⏳ À créer

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/etablissement` | GET | Liste des établissements (par SIREN/SIRET) |
| `/etablissement/like` | GET | Autocomplétion |
| `/etablissement/:id` | GET | Détail d'un établissement |
| `/etablissement` | POST | Créer un établissement |
| `/etablissement/:id` | PUT | Mettre à jour |
| `/etablissement/:id` | DELETE | Supprimer |

**Status :** ⏳ À documenter

---

### Services et ServiceTypes
**Fichier de documentation :** ⏳ À créer

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/service` | GET | Liste des services |
| `/service/like` | GET | Autocomplétion |
| `/service/:id` | GET | Détail |
| `/service` | POST | Créer |
| `/service/:id` | PUT | Mettre à jour |
| `/service/:id` | DELETE | Supprimer |
| `/servicetype` | GET | Types de services (référentiel) |

**Status :** ⏳ À documenter

---

## 📊 Modules de Référentiel (Lecture seule ou R/W)

Données de base systématiques et classifications.

### CodeNaf
**Fichier de documentation :** ⏳ À créer

| Endpoint | Méthode | Paramètres | Description |
|----------|---------|-----------|-------------|
| `/codesnaf` | GET | `q`, `page`, `per_page` | Liste tous les codes NAF |
| `/codesnaf/tree` | GET | | Arborescence hiérarchique complète |
| `/codesnaf/like` | GET | `q`, `len` | Autocomplétion |
| `/codesnaf/:code` | GET | `code` | Détail d'un code NAF |
| `/codesnaf/:code/children` | GET | `code` | Codes enfants d'une branche |
| `/codesnaf/:code/hierarchy` | GET | `code` | Hiérarchie complète (remontée) |

**Status :** ⏳ À documenter  
**Type :** Lecture seule (référentiel INSEE)

---

### FormeJuridique
**Fichier de documentation :** ⏳ À créer

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/formejuridique` | GET | Liste des formes juridiques |
| `/formejuridique/like` | GET | Autocomplétion |
| `/formejuridique/:id` | GET | Détail |
| `/formejuridique` | POST | Créer |
| `/formejuridique/:id` | PUT | Mettre à jour |
| `/formejuridique/:id` | DELETE | Supprimer |

**Status :** ⏳ À documenter  
**Type :** Lecture/Écriture

---

### TypeVoie
**Fichier de documentation :** ⏳ À créer

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/typevoie` | GET | Liste des types de voie |
| `/typevoie/like` | GET | Autocomplétion |
| `/typevoie/:id` | GET | Détail |
| `/typevoie` | POST | Créer |
| `/typevoie/:id` | PUT | Mettre à jour |
| `/typevoie/:id` | DELETE | Supprimer |

**Status :** ⏳ À documenter  
**Type :** Lecture/Écriture

---

### CodePostal
**Fichier de documentation :** ⏳ À créer

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/codepostal` | GET | Liste des codes postaux |
| `/codepostal/like` | GET | Autocomplétion |
| `/codepostal/:id` | GET | Détail |

**Status :** ⏳ À documenter  
**Type :** Lecture seule

---

## 🌐 Modules Transversaux

Données utilisées par plusieurs modules métier.

### Adresse
**Fichier de documentation :** ⏳ À créer

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/adresse` | GET | Liste des adresses |
| `/adresse/like` | GET | Autocomplétion par rue/ville |
| `/adresse/:id` | GET | Détail |
| `/adresse` | POST | Créer |
| `/adresse/:id` | PUT | Mettre à jour |
| `/adresse/:id` | DELETE | Supprimer |

**Status :** ⏳ À documenter  
**Utilisée par :** Organisation, Établissement

---

### Image
[Fichier de documentation](/documentation/API/Image.md)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/image` | GET | Liste des images |
| `/image/like` | GET | Autocomplétion |
| `/image/:id` | GET | Détail (métadonnées) |
| `/image` | POST | Uploader une image |
| `/image/:id` | PUT | Mettre à jour métadonnées |
| `/image/:id` | DELETE | Supprimer |

**Status :** ⏳ À documenter  
**Utilisée par :** Organisation (logo, cover)

---

## 💼 Modules Comptabilité

Gestion du Plan Comptable Général et des écritures.

### ComptespcG
**Fichier de documentation :** ⏳ À créer

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/comptespcg` | GET | Liste des comptes |
| `/comptespcg/:id` | GET | Détail d'un compte |
| `/comptespcg` | POST | Créer |
| `/comptespcg/:id` | PUT | Mettre à jour |
| `/comptespcg/:id` | DELETE | Supprimer |
| `/comptespcg/tree` | GET | Arborescence hiérarchique |
| `/comptespcg/:segment/children` | GET | Comptes enfants |
| `/comptespcg/:segment/hierarchy` | GET | Hiérarchie complète |

**Status :** ⏳ À documenter  
**Type :** Lecture/Écriture avec hiérarchie

---

## 🏷️ Modules Utilitaires

Données de support et gestion générale.

### Mot
**Fichier de documentation :** ⏳ À créer

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/mot` | GET | Liste des mots-clés/termes |
| `/mot/like` | GET | Autocomplétion |
| `/mot` | POST | Créer |
| `/mot/:id` | PUT | Mettre à jour |
| `/mot/:id` | DELETE | Supprimer |

**Status :** ⏳ À documenter  
**Usage :** Tags, catégories, vocabulaire

---

## 🔐 Authentification

**Fichier de documentation :** Voir `app/Config/Routes.php` (groupe `/api/auth`)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/auth/login` | POST | Authentifier un utilisateur |
| `/auth/profile` | GET | Profil actif |
| `/auth/me` | GET | Données de l'utilisateur courant |
| `/auth/logout` | POST | Déconnexion |

**Status :** ⏳ À documenter (hors module métier)

---

## 📋 Résumé par Status

### ✅ Documentée (2/13)
- Organisation
- Entreprise

### ⏳ À documenter (11/13)
- Établissement
- Services & ServiceTypes
- CodeNaf
- FormeJuridique
- TypeVoie
- CodePostal
- Adresse
- Image
- ComptespcG
- Mot
- Authentification

---

## 🗂️ Structure des fichiers

```
documentation/
├── API/
│   ├── index.md                          ← Vous êtes ici
│   ├── Organisation.md                   ✅
│   ├── Entreprise.md                     ✅
│   ├── Etablissement.md                  ⏳
│   ├── Services.md                       ⏳
│   ├── CodeNaf.md                        ⏳
│   ├── FormeJuridique.md                 ⏳
│   ├── TypeVoie.md                       ⏳
│   ├── CodePostal.md                     ⏳
│   ├── Adresse.md                        ⏳
│   ├── Image.md                          ⏳
│   ├── ComptespcG.md                     ⏳
│   └── Mot.md                            ⏳
└── METIERS/
    └── index.md                          (concepts)
```

---

## 🎯 Progression

**Complété :** 2/13 (15%)  
**Restant :** 11/13 (85%)

---

## 📝 Notes de priorité

1. **Métier (Priorité 1) :** Organisation, Entreprise, Établissement, Services
   - Cœur fonctionnel du système
   
2. **Référentiels (Priorité 2) :** CodeNaf, FormeJuridique, TypeVoie, CodePostal
   - Données de classification et dénomination
   
3. **Transversaux (Priorité 3) :** Adresse, Image
   - Utilisés par plusieurs modules
   
4. **Comptabilité (Priorité 4) :** ComptespcG
   - Module spécialisé, dépend de la stratégie métier
   
5. **Utilitaires (Priorité 5) :** Mot, Authentification
   - Support et infrastructure

---

## 🔗 Lien vers Routes

Source complète : [`old/app/Config/Routes.php`](../../old/app/Config/Routes.php)
