# Entreprises

Extension de la table `organisations` avec les données spécifiques aux entreprises.

---

## Concept

Une **entreprise** est une forme d'organisation caractérisée par :
- Un **SIREN** (9 chiffres) : identifiant unique au niveau national
- Un **CodeNAF** : classification de l'activité économique
- Une **Forme Juridique** : structure légale (SARL, SAS, EIRL, etc.)
- Un ou plusieurs **Établissements** : chaque établissement a un SIRET unique

---

## Hiérarchie : Class Table Inheritance

```
organisations (table mère)
└── entreprises (extension)
```

**Logique** :
- `organisations` : données universelles (nom, adresse, contacts, réseaux sociaux, images)
- `entreprises` : données métier (SIREN, SIRET, CodeNAF, FormeJuridique, capital, effectifs)

---

## Structure de la table

| Field              | Type            | Null | Key | Default | Description                          |
| ------------------ | --------------- | ---- | --- | ------- | ------------------------------------ |
| id                 | bigint unsigned | NO   | PRI | AUTO    | Clé primaire                         |
| organisation_id    | bigint unsigned | NO   | UNI |         | FK vers organisations (1:1)          |
| **siret**          | char(14)        | YES  | UNI |         | SIRET du siège social                |
| codenaf_id         | varchar(10)     | YES  | MUL |         | FK vers codesnaf                     |
| forme_juridique_id | char(4)         | YES  | MUL |         | FK vers formesjuridiques             |
| capital            | decimal(15,2)   | YES  |     |         | Capital social en euros              |
| effectif_min       | int unsigned    | YES  |     |         | Plage d'effectifs (min)              |
| effectif_max       | int unsigned    | YES  |     |         | Plage d'effectifs (max)              |
| created_at         | datetime        | YES  |     |         | Date de création                     |
| updated_at         | datetime        | YES  |     |         | Date de modification                 |

---

## SIREN / SIRET / Établissements

### SIREN (Système d'Identification du Répertoire des Entreprises)
- **9 chiffres** : identifie une entreprise au niveau siège social
- **Unique** : une entreprise = un SIREN
- Stocké dans `entreprises.siret` (premiers 9 caractères du SIRET du siège)

### SIRET (SIREN + NIC)
- **14 chiffres** : = SIREN (9) + NIC (5)
- **Unique** : chaque établissement a un SIRET unique
- **NIC** : Numéro d'Identifiant Comptable, différencie les établissements d'une même entreprise
- Stocké dans `etablissements.siret`

### Établissements
- **1 entreprise → N établissements**
- Chaque établissement peut avoir une adresse différente
- Un établissement est marqué `is_siege = true` : c'est le siège social (l'établissement principal)

**Modèle** :
```
Entreprise (SIREN)
├── Établissement 1 (is_siege = true) - Siège social
├── Établissement 2 - Succursale
└── Établissement 3 - Usine
```

---

## Migration MySQL

```sql
CREATE TABLE `entreprises` (
  `id` bigint UNSIGNED NOT NULL,
  `organisation_id` bigint UNSIGNED NOT NULL,
  `siret` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codenaf_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'FK → codesnaf.codenaf',
  `forme_juridique_id` char(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'FK → formesjuridiques.id',
  `capital` decimal(15,2) DEFAULT NULL,
  `effectif_min` int UNSIGNED DEFAULT NULL,
  `effectif_max` int UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Entreprises — extension de organisations';

ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `organisation_id` (`organisation_id`),
  ADD UNIQUE KEY `siret` (`siret`),
  ADD KEY `idx_siret` (`siret`),
  ADD KEY `idx_codenaf` (`codenaf_id`),
  ADD KEY `fk_ent_fj` (`forme_juridique_id`);

ALTER TABLE `entreprises`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `entreprises`
  ADD CONSTRAINT `fk_ent_codenaf` FOREIGN KEY (`codenaf_id`) REFERENCES `codesnaf` (`codenaf`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ent_fj` FOREIGN KEY (`forme_juridique_id`) REFERENCES `formesjuridiques` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ent_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations` (`id`) ON DELETE CASCADE;
```

---

## Index

| Key Name        | Type   | Colonnes               | Unique | Purpose                              |
| --------------- | ------ | ---------------------- | ------ | ------------------------------------ |
| PRIMARY         | BTREE  | id                     | ✓      | Clé primaire                         |
| organisation_id | BTREE  | organisation_id        | ✓      | 1:1 avec organisations               |
| siret           | BTREE  | siret                  | ✓      | Recherche SIRET                      |
| idx_siret       | BTREE  | siret                  |        | Accélère les recherches SIRET        |
| idx_codenaf     | BTREE  | codenaf_id             |        | Recherche par activité               |
| fk_ent_fj       | BTREE  | forme_juridique_id     |        | Recherche par forme juridique        |

---

## Relations

- **organisations** (1:1) — Données universelles
- **codesnaf** (N:1) — Classification d'activité
- **formesjuridiques** (N:1) — Type d'organisation légale
- **etablissements** (1:N) — Établissements de l'entreprise

---

## Fichiers backend

- `app/Models/EntrepriseModel.php`
- `app/Controllers/Api/Entreprise.php`

## Fichiers frontend

- `assets/js/features/entreprise/entreprise.controller.js`
- `assets/js/features/entreprise/entreprise.form.js`
- `assets/js/features/entreprise/entreprise.renderer.js`
- `assets/js/features/entreprise/entreprise.service.js`
- `assets/js/features/entreprise/entreprise.store.js`
- `assets/js/features/entreprise/index.js`

---

**Référence** : [INSEE - Répertoire des Entreprises](https://www.insee.fr/)
