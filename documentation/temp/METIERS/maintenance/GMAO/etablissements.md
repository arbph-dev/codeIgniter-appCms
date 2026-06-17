
voir [[METIERS/economie/etablissements]]
[[METIERS/economie/entreprise]]

## Migration 
==cette migration en sera pas exécutée== voir [[METIERS/economie/etablissements|etablissements]]

`etablissement`, 
TABLE etablissements
  `id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)

relation
[[METIERS/economie/entreprise]]

`entreprise_id` bigint UNSIGNED NOT NULL,
  ADD KEY `idx_entreprise` (`entreprise_id`),
  ADD CONSTRAINT `fk_etab_entreprise` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE;


```
CREATE TABLE etablissements (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 entreprise_id BIGINT UNSIGNED NOT NULL,
 siret VARCHAR(14) UNIQUE NULL,
 lbl VARCHAR(255) NOT NULL,
 adresse TEXT NULL,
 cp VARCHAR(20) NULL,
 ville VARCHAR(100) NULL,
 KEY idx_entreprise (entreprise_id),
 CONSTRAINT fk_etab_entreprise FOREIGN KEY (entreprise_id)
 REFERENCES entreprises(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

```

## Seeder :

```sql
INSERT INTO etablissements
(entreprise_id,siret,lbl,adresse,cp,ville)
VALUES
(1,'12345678900011','Usine Quimper',
 '1 Rue de l Industrie','29000','Quimper'),
(1,'12345678900029','Dépôt Concarneau',
 '10 Rue du Port','29900','Concarneau');

```