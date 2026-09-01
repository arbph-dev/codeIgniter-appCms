# Données

## Strucutre
- `DESCRIBE adresses` systématique avant tout nouveau fichier

| Field            | Type                                     | Null | Key | Default | Extra          |
| ---------------- | ---------------------------------------- | ---- | --- | ------- | -------------- |
| id               | bigint unsigned                          | NO   | PRI | _NULL_  | auto_increment |
| complement       | varchar(60)                              | YES  |     | _NULL_  |                |
| voienumero       | varchar(10)                              | YES  |     | _NULL_  |                |
| voierpt          | enum('B','T','Q','C')                    | YES  |     | _NULL_  |                |
| voietype_id      | tinyint unsigned                         | YES  | MUL | _NULL_  |                |
| voiecharniere    | tinyint unsigned                         | YES  |     | _NULL_  |                |
| voienom          | varchar(60)                              | NO   |     | _NULL_  |                |
| infodistribution | varchar(60)                              | YES  |     | _NULL_  |                |
| codepostal_id    | int unsigned                             | NO   | MUL | _NULL_  |                |
| acheminement     | varchar(100)                             | YES  |     | _NULL_  |                |
| latitude         | decimal(10,7)                            | YES  | MUL | _NULL_  |                |
| longitude        | decimal(10,7)                            | YES  |     | _NULL_  |                |
| precision        | enum('numero','voie','commune','approx') | YES  |     | _NULL_  |                |
| created_at       | timestamp                                | YES  |     | _NULL_  |                |
| updated_at       | timestamp                                | YES  |     | _NULL_  |                |

## Index

- `SHOW INDEX FROM adresses` pour identifier FK non contraintes et patterns d'accès

| Table    | Non_unique | Key_name          | Seq_in_index | Column_name   | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
| -------- | ---------- | ----------------- | ------------ | ------------- | --------- | ----------- | -------- | ------ | ---- | ---------- | ------- | ------------- | ------- | ---------- |
| adresses | 0          | PRIMARY           | 1            | id            | A         | 6           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| adresses | 1          | idx_codepostal_id | 1            | codepostal_id | A         | 5           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| adresses | 1          | idx_voietype_id   | 1            | voietype_id   | A         | 2           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| adresses | 1          | idx_lat_lng       | 1            | latitude      | A         | 6           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| adresses | 1          | idx_lat_lng       | 2            | longitude     | A         | 6           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
