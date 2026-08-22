```sql
SHOW COLUMNS FROM entreprises;
SHOW INDEX FROM entreprises;
```

---

# Champs

| Field              | Type            | Null | Key | Default | Extra          |
| ------------------ | --------------- | ---- | --- | ------- | -------------- |
| id                 | bigint unsigned | NO   | PRI | _NULL_  | auto_increment |
| organisation_id    | bigint unsigned | NO   | UNI | _NULL_  |                |
| **siret**          | char(14)        | YES  | UNI | _NULL_  |                |
| codenaf_id         | varchar(10)     | YES  | MUL | _NULL_  |                |
| forme_juridique_id | char(4)         | YES  | MUL | _NULL_  |                |
| capital            | decimal(15,2)   | YES  |     | _NULL_  |                |
| effectif_min       | int unsigned    | YES  |     | _NULL_  |                |
| effectif_max       | int unsigned    | YES  |     | _NULL_  |                |
| created_at         | datetime        | YES  |     | _NULL_  |                |
| updated_at         | datetime        | YES  |     | _NULL_  |                |

# Index


| Table       | Non_unique | Key_name        | Seq_in_index | Column_name        | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
| ----------- | ---------- | --------------- | ------------ | ------------------ | --------- | ----------- | -------- | ------ | ---- | ---------- | ------- | ------------- | ------- | ---------- |
| entreprises | 0          | PRIMARY         | 1            | id                 | A         | 0           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 0          | organisation_id | 1            | organisation_id    | A         | 0           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 0          | siret           | 1            | siret              | A         | 0           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 1          | idx_siret       | 1            | siret              | A         | 0           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 1          | idx_codenaf     | 1            | codenaf_id         | A         | 0           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 1          | fk_ent_fj       | 1            | forme_juridique_id | A         | 0           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |

