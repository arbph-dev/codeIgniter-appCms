# Établissements

Les établissements d'une entreprise : siège social et succursales.

---

## Concept

Un **établissement** est une unité de production ou de prestation de services localisée géographiquement. Une entreprise peut avoir un ou plusieurs établissements.

**Exemples** :
- Une boulangerie à Paris + une boulangerie à Lyon = 2 établissements
- Une banque avec siège à Paris et 500 agences = 501 établissements

---

## SIRET (Système d'Identification du Répertoire des Établissements)

### Structure
- **14 chiffres** = SIREN (9) + NIC (5)
- **SIREN** : Numéro unique de l'entreprise
- **NIC** : Numéro d'Identification Comptable, différencie les établissements

### Exemple
```
SIREN : 123 456 789
NIC   :          00001 (siège social = 00001, succursales = 00002, 00003, etc.)
SIRET : 123 456 789 00001
```

---

## Siège social vs Succursales

### Siège social (`is_siege = true`)
- Premier établissement créé
- Correspond généralement au NIC = 00001
- Responsable administratif et fiscal principal
- Adresse du siège social

### Succursales (`is_siege = false`)
- Établissements supplémentaires
- NIC ≥ 00002
- Peuvent avoir des adresses différentes
- Peuvent avoir des activités différentes

---

## Structure de la table

| Field          | Type            | Null | Key | Default | Description                      |
| -------------- | --------------- | ---- | --- | ------- | -------------------------------- |
| id             | bigint unsigned | NO   | PRI | AUTO    | Clé primaire                     |
| entreprise_id  | bigint unsigned | NO   | MUL |         | FK vers entreprises              |
| **siret**      | char(14)        | NO   | UNI |         | SIRET unique                     |
| nic            | char(5)         | YES  |     |         | NIC (5 derniers chiffres du SIRET) |
| **is_siege**   | tinyint(1)      | NO   |     | 0       | Flag : siège social ?            |
| nom            | varchar(255)    | YES  |     |         | Nom de l'établissement           |
| adresse_id     | bigint unsigned | YES  | MUL |         | FK vers adresses                 |
| codenaf_id     | varchar(10)     | YES  | MUL |         | CodeNAF spécifique à cet établissement (peut différer) |
| date_debut     | date            | YES  |     |         | Date de création de l'établissement |
| date_fermeture | date            | YES  |     |         | Date de fermeture (NULL = actif) |
| created_at     | datetime        | YES  |     |         | Date de création                 |
| updated_at     | datetime        | YES  |     |         | Date de modification             |

---

## Migration MySQL

```sql
CREATE TABLE `etablissements` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `entreprise_id` bigint UNSIGNED NOT NULL,
  `siret` char(14) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `nic` char(5) COLLATE utf8mb4_unicode_ci,
  `is_siege` tinyint(1) NOT NULL DEFAULT 0,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci,
  `adresse_id` bigint UNSIGNED,
  `codenaf_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `date_debut` date,
  `date_fermeture` date,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `siret` (`siret`),
  KEY `idx_entreprise` (`entreprise_id`),
  KEY `idx_is_siege` (`is_siege`),
  KEY `fk_etab_adresse` (`adresse_id`),
  KEY `fk_etab_codenaf` (`codenaf_id`),
  CONSTRAINT `fk_etab_entreprise` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_etab_adresse` FOREIGN KEY (`adresse_id`) REFERENCES `adresses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_etab_codenaf` FOREIGN KEY (`codenaf_id`) REFERENCES `codesnaf` (`codenaf`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Index

| Key Name      | Type | Colonnes      | Unique | Purpose                       |
| ------------- | ---- | ------------- | ------ | ----------------------------- |
| PRIMARY       | BTREE | id            | ✓      | Clé primaire                  |
| siret         | BTREE | siret         | ✓      | Recherche par SIRET           |
| idx_entreprise | BTREE | entreprise_id |        | Récupérer les établissements de l'entreprise |
| idx_is_siege  | BTREE | is_siege      |        | Trouver le siège social       |
| fk_etab_adresse | BTREE | adresse_id   |        | Recherche par adresse         |
| fk_etab_codenaf | BTREE | codenaf_id   |        | Recherche par activité        |

---

## Requêtes courantes

### Trouver le siège social d'une entreprise
```sql
SELECT * FROM etablissements 
WHERE entreprise_id = ? AND is_siege = true;
```

### Lister tous les établissements d'une entreprise
```sql
SELECT * FROM etablissements 
WHERE entreprise_id = ?
ORDER BY is_siege DESC, nic ASC;
```

### Vérifier si un SIRET existe
```sql
SELECT * FROM etablissements 
WHERE siret = '12345678900001';
```

---

## Relations

- **entreprises** (N:1) — L'entreprise propriétaire de l'établissement
- **adresses** (N:1) — Localisation de l'établissement
- **codesnaf** (N:1) — Activité économique de l'établissement
