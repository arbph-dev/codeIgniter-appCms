# Codes NAF

Classification des activités économiques françaises (Nomenclature d'Activités Française).

---

## Concept

Le **CodeNAF** (ou code APE - Activité Principale Exercée) est un code à 5 caractères (4 chiffres + 1 lettre) qui classifie l'activité principale d'une entreprise.

**Exemples** :
- `5814Z` : Édition de jeux informatiques
- `6202A` : Conseil en systèmes et logiciels informatiques
- `7711A` : Location et location-gérance de matériel agricole
- `4511Z` : Commerce de voitures automobiles

---

## Structure

### Format
- **4 chiffres** : classification hiérarchique (section → division → groupe → classe)
- **1 lettre** : sous-classe supplémentaire (A, B, C, etc.)

### Hiérarchie
```
6 (Section)
├── 62 (Division)
│   ├── 620 (Groupe)
│   │   ├── 6201 (Classe)
│   │   │   ├── 6201A (Sous-classe)
│   │   │   └── 6201B (Sous-classe)
```

---

## Table de référence

| Field      | Type        | Null | Key | Default | Description                |
| ---------- | ----------- | ---- | --- | ------- | -------------------------- |
| id         | int         | NO   | PRI |         | Clé primaire               |
| codenaf    | varchar(10) | NO   | UNI |         | Code NAF unique            |
| libelle    | varchar(255)| NO   |     |         | Libellé complet de l'activité |
| section    | char(1)     | YES  |     |         | Section (lettre)           |
| division   | char(2)     | YES  |     |         | Division (2 chiffres)      |
| groupe     | char(3)     | YES  |     |         | Groupe (3 chiffres)        |
| classe     | char(4)     | YES  |     |         | Classe (4 chiffres)        |
| sousclasse | char(5)     | YES  |     |         | Sous-classe (4 chiffres + 1 lettre) |
| created_at | datetime    | YES  |     |         | Date de création           |
| updated_at | datetime    | YES  |     |         | Date de modification       |

---

## Utilisation

### Lier une entreprise à son activité

```php
// Lors de la création/modification d'une entreprise
$entreprise->codenaf_id = '6202A'; // Conseil en informatique
$entreprise->save();
```

### Rechercher par activité

```php
// Trouver toutes les entreprises de conseil informatique
$consultants = $this->entrepriseModel
    ->where('codenaf_id', '6202A')
    ->findAll();
```

### Filtrer par section

```php
// Toutes les entreprises du secteur informatique (section 6)
$informatique = $this->entrepriseModel
    ->where('codenaf_id LIKE', '6%')
    ->findAll();
```

---

## Sources officielles

- [INSEE - Nomenclature NAF](https://www.insee.fr/fr/information/2406147)
- [SIRENE - Recherche d'entreprises](https://sirene.fr/)
- [Data.gouv - Codes NAF](https://www.data.gouv.fr/)

---

## Migration MySQL

```sql
CREATE TABLE `codesnaf` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codenaf` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `libelle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` char(1) COLLATE utf8mb4_unicode_ci,
  `division` char(2) COLLATE utf8mb4_unicode_ci,
  `groupe` char(3) COLLATE utf8mb4_unicode_ci,
  `classe` char(4) COLLATE utf8mb4_unicode_ci,
  `sousclasse` char(5) COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_codenaf` (`codenaf`),
  KEY `idx_section` (`section`),
  KEY `idx_division` (`division`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Relations

- **entreprises** (N:1) — Lien avec l'activité de l'entreprise
- **etablissements** (N:1) — Activité spécifique d'un établissement
