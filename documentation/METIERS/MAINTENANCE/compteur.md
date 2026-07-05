Très utile en industrie et marine.

Exemples :

- heures moteur
- kilomètres
- cycles
- démarrages
## Relation

[[Z/METIERS/maintenance/GMAO/equipement]]


## Structure

|nom|type|
|---|---|
|id|INTEGER|
|eqpid|INTEGER|
|lbl|TEXT|
|unite|TEXT|
|valeur|REAL|


## Migration 
```sql
CREATE TABLE compteur (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 eqpid BIGINT UNSIGNED NOT NULL,
 lbl VARCHAR(255) NOT NULL,
 unite VARCHAR(50) NULL,
 valeur DECIMAL(15,3) DEFAULT 0,
 datevaleur DATE NULL,
 created_at DATETIME NULL,
 updated_at DATETIME NULL,
 FOREIGN KEY (eqpid) REFERENCES equipement(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO compteur
(eqpid,lbl,unite,valeur,datevaleur)
VALUES
(2,'Heures fonctionnement','h',4520,'2026-01-01'),
(2,'Nombre démarrages','count',1875,'2026-01-01'),
(1,'Consommation énergie','kWh',154820,'2026-01-01');


```