# Formes Juridiques

Types d'organisations légales et leurs caractéristiques.

---

## Concept

La **forme juridique** définit le cadre légal d'une entreprise :
- Nombre d'associés requis
- Responsabilité des propriétaires
- Régime fiscal
- Obligations administratives
- Capital social minimum

---

## Formes courantes en France

### EIRL (Entreprise Individuelle à Responsabilité Limitée)
- **Associés** : 1 seul (personne physique)
- **Responsabilité** : Limitée au patrimoine affecté à l'activité
- **Capital** : Aucun minimum
- **Régime fiscal** : Micro ou réel
- **Cotisations sociales** : Régime des indépendants

### Micro-Entreprise
- **Associés** : 1 seul (personne physique)
- **Responsabilité** : Illimitée (patrimoine personnel engagé)
- **Capital** : Aucun minimum
- **Régime fiscal** : Micro (simplifié)
- **Cotisations sociales** : Régime des indépendants

### SARL (Société à Responsabilité Limitée)
- **Associés** : Minimum 1 (maximum théoriquement illimité)
- **Responsabilité** : Limitée à l'apport
- **Capital** : Minimum 1€ (pas de minimum légal depuis 2015)
- **Régime fiscal** : Impôt sur les sociétés (IR sur option)
- **Cotisations sociales** : Gérant assimilé salarié, autres associés = indépendants

### SAS (Société par Actions Simplifiée)
- **Associés** : Minimum 1 (pas de maximum)
- **Responsabilité** : Limitée à l'apport
- **Capital** : Minimum 1€
- **Régime fiscal** : Impôt sur les sociétés (IR sur option)
- **Cotisations sociales** : Président assimilé salarié, autres associés = indépendants
- **Flexibilité** : Statuts très flexibles, peu de contraintes légales

### SARL-U (Entreprise Unipersonnelle à Responsabilité Limitée)
- **Associés** : 1 seul (SARL avec associé unique)
- **Responsabilité** : Limitée à l'apport
- **Capital** : Minimum 1€
- **Régime fiscal** : Impôt sur les sociétés (IR sur option)
- **Cotisations sociales** : Gérant assimilé salarié

### SCI (Société Civile Immobilière)
- **Associés** : Minimum 2
- **Responsabilité** : Solidaire et illimitée
- **Capital** : Pas de minimum légal
- **Régime fiscal** : Transparent (fiscalité des associés)
- **Usage** : Gestion immobilière collective

### Société Civile Professionnelle (SCP)
- **Associés** : Minimum 2 professionnels du même secteur
- **Responsabilité** : Solidaire et illimitée
- **Capital** : Pas de minimum
- **Régime fiscal** : Impôt sur les sociétés ou IR transparent
- **Usage** : Associés professionnels (médecins, avocats, etc.)

### SPRL (Société Privée à Responsabilité Limitée)
- Équivalent belge de la SARL
- **Associés** : Minimum 1
- **Responsabilité** : Limitée à l'apport

---

## Table de référence

| Field      | Type        | Null | Key | Default | Description               |
| ---------- | ----------- | ---- | --- | ------- | ------------------------- |
| id         | char(4)     | NO   | PRI |         | Code INSEE (ex : "5710")  |
| libelle    | varchar(255)| NO   |     |         | Nom complet de la forme   |
| abbrv      | varchar(20) | NO   |     |         | Abréviation (ex : "SARL") |
| min_associes | int       | YES  |     |         | Nombre minimum d'associés |
| responsabilite | varchar(50) | YES |   |         | Limitée / Illimitée       |
| created_at | datetime    | YES  |     |         | Date de création          |
| updated_at | datetime    | YES  |     |         | Date de modification      |

---

## Migration MySQL

```sql
CREATE TABLE `formesjuridiques` (
  `id` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `libelle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abbrv` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_associes` int DEFAULT NULL,
  `responsabilite` varchar(50) COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `abbrv` (`abbrv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `formesjuridiques` VALUES
('1000', 'Entrepreneur individuel', 'EI', 1, 'Illimitée', NOW(), NOW()),
('5710', 'SARL', 'SARL', 1, 'Limitée', NOW(), NOW()),
('5800', 'Société par Actions Simplifiée', 'SAS', 1, 'Limitée', NOW(), NOW()),
('5900', 'Société Coopérative', 'SCOP', 3, 'Limitée', NOW(), NOW()),
('5901', 'Micro-Entreprise', 'Auto-entrepreneur', 1, 'Illimitée', NOW(), NOW());
```

---

## Données de référence INSEE

Les codes sont définis par l'INSEE (Institut National de la Statistique et des Études Économiques).

**Référence** : [INSEE - Formes Juridiques](https://www.insee.fr/)

---

## Relations

- **entreprises** (N:1) — Forme juridique de l'entreprise
