Une intervention peut consommer plusieurs articles.
Historisation du prix au moment de l'intervention.

## Relations
[[Z/METIERS/maintenance/GMAO/intervention]]
[[Z/METIERS/maintenance/GMAO/article]]


### Structure

| nom   | type    |
| ----- | ------- |
| id    | INTEGER |
| intid | INTEGER |
| artid | INTEGER |
| qte   | REAL    |
| pu    | REAL    |



## Migration 
```sql
CREATE TABLE interventionarticle (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 intid BIGINT UNSIGNED NOT NULL,
 artid BIGINT UNSIGNED NOT NULL,
 qte DECIMAL(15,3) DEFAULT 0,
 pu DECIMAL(15,2) NULL,
 montant DECIMAL(15,2) NULL,
 FOREIGN KEY (intid) REFERENCES intervention(id) ON DELETE CASCADE,
 FOREIGN KEY (artid) REFERENCES article(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


## Seeder :

```sql
INSERT INTO interventionarticle
(intid,artid,qte,pu,montant)
VALUES
(1,5,5,13,65);

```