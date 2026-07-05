
## Relations
[[Z/METIERS/maintenance/GMAO/article]]
[[Z/METIERS/maintenance/GMAO/caracteristique]]

---
## Structure

|nom|type|
|---|---|
|id|INTEGER|
|artid|INTEGER|
|carid|INTEGER|
|valeur|TEXT|

---
## Migration 
```sql
CREATE TABLE articlecaracteristique (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 artid BIGINT UNSIGNED NOT NULL,
 carid BIGINT UNSIGNED NOT NULL,
 valeur TEXT NOT NULL,
 UNIQUE KEY uk_article_car (artid,carid),
 FOREIGN KEY (artid) REFERENCES article(id) ON DELETE CASCADE,
 FOREIGN KEY (carid) REFERENCES caracteristique(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

```

## Seeder :

```sql


```