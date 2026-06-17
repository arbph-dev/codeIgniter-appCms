# Adresses

Gestion des adresses postales pour les organisations et établissements.

---

## Concept

Une **adresse** est une localisation géographique postale et physique d'une organisation, établissement ou personne.

**Composants** :
- Voie (rue, avenue, boulevard, etc.)
- Numéro et complément (immeuble, bâtiment, etc.)
- Code postal
- Localité (commune)
- Pays

---

## Structure de la table

| Field           | Type            | Null | Key | Default | Description                  |
| --------------- | --------------- | ---- | --- | ------- | ---------------------------- |
| id              | bigint unsigned | NO   | PRI | AUTO    | Clé primaire                 |
| numero          | varchar(10)     | YES  |     |         | Numéro de voie               |
| complement      | varchar(100)    | YES  |     |         | Complément (immeuble, bâtiment, etc.) |
| type_voie       | varchar(50)     | YES  |     |         | Type (rue, avenue, boulevard, etc.) |
| libelle_voie    | varchar(255)    | NO   |     |         | Nom de la voie               |
| code_postal     | char(5)         | NO   |     |         | Code postal français (5 chiffres) |
| localite        | varchar(100)    | NO   |     |         | Commune/Ville                |
| pays            | varchar(100)    | NO   |     | France  | Pays                         |
| coordonnees_gps | point           | YES  |     | NULL    | Coordonnées GPS (latitude, longitude) |
| created_at      | datetime        | YES  |     |         | Date de création             |
| updated_at      | datetime        | YES  |     |         | Date de modification         |

---

## Format d'adresse complet

```
[Numéro] [Type de voie] [Nom de voie]
[Complément]
[Code postal] [Localité]
[Pays]
```

**Exemple** :
```
123 rue de la Paix
Immeuble A, Escalier 2
75002 Paris
France
```

---

## Types de voies courants

| Code | Libellé       |
| ---- | ------------- |
| R    | Rue           |
| AV   | Avenue        |
| BD   | Boulevard     |
| PL   | Place         |
| CHE  | Chemin        |
| IMP  | Impasse       |
| ALL  | Allée         |
| RUE  | Rue           |
| QUA  | Quai          |
| CTE  | Côte          |

---

## Migration MySQL

```sql
CREATE TABLE `adresses` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero` varchar(10) COLLATE utf8mb4_unicode_ci,
  `complement` varchar(100) COLLATE utf8mb4_unicode_ci,
  `type_voie` varchar(50) COLLATE utf8mb4_unicode_ci,
  `libelle_voie` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_postal` char(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `localite` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'France',
  `coordonnees_gps` point,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_code_postal` (`code_postal`),
  KEY `idx_localite` (`localite`),
  KEY `idx_voie` (`libelle_voie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Index

| Key Name          | Type | Colonnes      | Purpose                  |
| ----------------- | ---- | ------------- | ------------------------ |
| PRIMARY           | BTREE | id            | Clé primaire             |
| idx_code_postal   | BTREE | code_postal   | Recherche par CP         |
| idx_localite      | BTREE | localite      | Recherche par commune    |
| idx_voie          | BTREE | libelle_voie  | Recherche par nom voie   |

---

## Requêtes courantes

### Trouver une adresse par code postal
```sql
SELECT * FROM adresses WHERE code_postal = '75002' ORDER BY localite;
```

### Rechercher dans une localité
```sql
SELECT * FROM adresses WHERE localite = 'Paris' AND code_postal LIKE '75%';
```

### Construire l'adresse complète
```sql
SELECT CONCAT(
  IFNULL(numero, ''), ' ',
  IFNULL(type_voie, ''), ' ',
  libelle_voie, ' ',
  IFNULL(complement, ''),
  ' - ', code_postal, ' ', localite
) as adresse_complete
FROM adresses;
```

---

## Géocodage et validation

### Services de géocodage recommandés
- **API Gouv adresse.data.gouv.fr** : Gratuit, données INSEE
- **Google Maps API** : Payant, très complet
- **Nominatim (OpenStreetMap)** : Gratuit, open source

### Validation
- Vérifier le format du code postal (5 chiffres)
- Vérifier l'existence de la localité
- Normaliser les noms de voies
- Géocoder pour obtenir les coordonnées GPS

---

## Relations

- **organisations** (1:N) — Adresse principale des organisations
- **etablissements** (1:N) — Adresse des établissements
- **personnes** (1:N) — Adresse personnelle (future extension)
