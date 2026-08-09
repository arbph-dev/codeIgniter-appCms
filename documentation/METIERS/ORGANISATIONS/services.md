services
SHOW COLUMNS FROM services;
Records : 0

| Field           | Type            | Null | Key | Default | Extra          |
| --------------- | --------------- | ---- | --- | ------- | -------------- |
| id              | bigint unsigned | NO   | PRI | _NULL_  | auto_increment |
| entreprise_id   | bigint unsigned | NO   | MUL | _NULL_  |                |
| service_type_id | bigint unsigned | NO   | MUL | _NULL_  |                |
| nom             | varchar(100)    | YES  |     | _NULL_  |                |
| responsable_id  | bigint unsigned | YES  |     | _NULL_  |                |
| actif           | tinyint(1)      | NO   |     | 1       |                |
| created_at      | datetime        | YES  |     | _NULL_  |                |
| updated_at      | datetime        | YES  |     | _NULL_  |                |


