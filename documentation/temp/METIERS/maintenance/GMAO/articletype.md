

## Relations
[[METIERS/maintenance/GMAO/articletype]]


## Structure

| nom   | type            | attributs                  | note                    |
| ----- | --------------- | -------------------------- | ----------------------- |
| rowid | BIGINT UNSIGNED | AUTO_INCREMENT PRIMARY KEY |                         |
| lbl   | VARCHAR(255)    | NOT NULL                   |                         |
| desc  | TEXT            | NULL                       |                         |
| atpid | BIGINT UNSIGNED | NULL                       | pour hiérarchie de type |



## Migration 
```sql
CREATE TABLE articletype (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL,
 `desc` TEXT NULL,
 atpid BIGINT UNSIGNED NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE articletype ADD CONSTRAINT fk_articletype_parent
FOREIGN KEY (atpid) REFERENCES articletype(id) ON DELETE SET NULL;

```

## Seeder :

```sql
INSERT INTO articletype (lbl,`desc`) VALUES
('Consommable','Consommables'),
('Pièce détachée','Pièces de rechange'),
('Composant électrique','Electricité'),
('Composant électronique','Electronique'),
('Lubrifiant','Lubrifiants'),
('Outillage','Outillage'),
('EPI','Equipements protection individuelle');

```