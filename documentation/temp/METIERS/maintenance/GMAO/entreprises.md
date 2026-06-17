
## Relations
[[METIERS/economie/organisation]]
[[METIERS/economie/entreprise]]
## Migration 

==cette migration ne sera pas appliquée== voir [[METIERS/economie/entreprise]] 

TABLE entreprises 
	`id` bigint UNSIGNED NOT NULL,

Les coordonnées mail,tel sont accessibles via l'établissement siège social
[[METIERS/economie/etablissements]]
is_siege

```
CREATE TABLE entreprises (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 raison VARCHAR(255) NOT NULL,
 siren VARCHAR(9) UNIQUE NULL,
 adresse TEXT NULL,
 cp VARCHAR(20) NULL,
 ville VARCHAR(100) NULL,
 pays VARCHAR(100) NULL,
 tel VARCHAR(50) NULL,
 email VARCHAR(255) NULL,
 KEY idx_raison (raison)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO entreprises
(raison,siren,adresse,cp,ville,pays,tel,email)
VALUES
('DEMO INDUSTRIE SAS','123456789',
 '1 Rue de l Industrie',
 '29000',
 'Quimper',
 'France',
 '0298000000',
 'contact@demo-industrie.fr');

```