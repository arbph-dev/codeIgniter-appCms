consigne de sécurité


## Structure

| nom           | type            | attributs                  | note |
| ------------- | --------------- | -------------------------- | ---- |
| rowid         | BIGINT UNSIGNED | AUTO_INCREMENT PRIMARY KEY |      |
| lbl           | VARCHAR(255)    | NOT NULL                   |      |
| desc          | TEXT            | NULL                       |      |
| niveau_risque | TINYINT         | NULL                       |      |
| actif         | TINYINT         | NOT NULL DEFAULT 1         |      |
## Migration 

```sql
CREATE TABLE cnssec (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL,
 `desc` TEXT NULL,
 niveau_risque TINYINT NULL,
 actif TINYINT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO cnssec (lbl,niveau_risque,actif) VALUES
('Port EPI obligatoire',2,1),
('Consignation électrique',4,1),
('Travail en hauteur',4,1),
('Permis feu',4,1),
('Atmosphère explosive ATEX',5,1),
('Espace confiné',5,1),
('Travaux sous tension interdits',5,1),
('Présence produits chimiques',3,1);

```