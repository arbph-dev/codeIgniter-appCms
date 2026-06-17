Table polymorphe.

Permet d'attacher un PDF à :

- équipement
- intervention
- fournisseur
- article
- établissement
## Structure

| nom     | type    |
| ------- | ------- |
| id      | INTEGER |
| docid   | INTEGER |
| objet   | TEXT    |
| objetid | INTEGER |


## Relations
[[METIERS/maintenance/GMAO/document]]

## Migration 
```sql
CREATE TABLE documentobjet (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 docid BIGINT UNSIGNED NOT NULL,
 objet VARCHAR(50) NOT NULL,
 objetid BIGINT UNSIGNED NOT NULL,
 KEY idx_objet(objet,objetid),
 FOREIGN KEY (docid) REFERENCES document(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO documentobjet
(docid,objet,objetid)
VALUES
(1,'equipement',2),
(2,'equipement',1);

```