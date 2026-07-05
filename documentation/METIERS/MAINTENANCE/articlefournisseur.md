
## Relation
[[Z/METIERS/maintenance/GMAO/article]]
[[Z/METIERS/maintenance/GMAO/fournisseur]]


Exemple :

```
Relais Finder 40.52
Rexel      -> REF A123 -> 8.10€
RS         -> REF B456 -> 7.80€
Farnell    -> REF C789 -> 8.45€
```

## Structure

|nom|type|
|---|---|
|id|INTEGER|
|artid|INTEGER|
|fourid|INTEGER|
|ref_four|TEXT|
|prix|REAL|
|devise|TEXT|
|delai|INTEGER|

## Migration 
```sql
CREATE TABLE articlefournisseur (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 artid BIGINT UNSIGNED NOT NULL,
 fourid BIGINT UNSIGNED NOT NULL,
 ref_four VARCHAR(255) NULL,
 prix DECIMAL(15,2) NULL,
 devise VARCHAR(3) DEFAULT 'EUR',
 delai INT NULL,
 actif TINYINT DEFAULT 1,
 FOREIGN KEY (artid) REFERENCES article(id) ON DELETE CASCADE,
 FOREIGN KEY (fourid) REFERENCES fournisseur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


## Seeder :

```sql
INSERT INTO articlefournisseur
(artid,fourid,ref_four,prix,devise,delai)
VALUES
(1,1,'A9F74216',24.50,'EUR',3),
(2,1,'LC1D18',32.00,'EUR',3),
(3,3,'40.52',8.50,'EUR',5),
(4,2,'LED24',4.20,'EUR',2),
(5,10,'HUILE-COMP',65.00,'EUR',7);
```