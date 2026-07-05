## Relations
[[Z/METIERS/maintenance/GMAO/articlefournisseur]]


## Structure

| nom      | type    |                              |
| -------- | ------- | ---------------------------- |
| id       | INTEGER |                              |
| artfid   | INTEGER | id d'un article fournissseur |
| dateprix | DATE    |                              |
| prix     | REAL    |                              |


## Migration 
```sql
CREATE TABLE articleprix (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 artfid BIGINT UNSIGNED NOT NULL,
 dateprix DATE NOT NULL,
 prix DECIMAL(15,2) NOT NULL,
 devise VARCHAR(3) DEFAULT 'EUR',
 FOREIGN KEY (artfid) REFERENCES articlefournisseur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO articleprix
(artfid,dateprix,prix)
VALUES
(1,'2025-01-01',22.50),
(1,'2026-01-01',24.50),
(2,'2025-01-01',30.00),
(2,'2026-01-01',32.00);

```