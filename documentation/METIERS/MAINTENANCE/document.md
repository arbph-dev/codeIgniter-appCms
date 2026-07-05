
## Structure

| nom       | type    |
| --------- | ------- |
| id        | INTEGER |
| lbl       | TEXT    |
| fichier   | TEXT    |
| mime      | TEXT    |
| dateajout | DATE    |
## Migration 
```sql
CREATE TABLE document (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL,
 fichier VARCHAR(500) NOT NULL,
 mime VARCHAR(100) NULL,
 taille BIGINT UNSIGNED NULL,
 version VARCHAR(50) NULL,
 dateajout DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO document
(lbl,fichier,mime,version)
VALUES
('Notice Compresseur',
 '/docs/compresseur.pdf',
 'application/pdf',
 '1.0'),
('Schéma TGBT',
 '/docs/tgbt.pdf',
 'application/pdf',
 '2.1');

```