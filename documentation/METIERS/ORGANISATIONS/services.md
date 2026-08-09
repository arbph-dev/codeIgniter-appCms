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

service_types
SHOW COLUMNS FROM service_types;
Records : 12

| Field       | Type            | Null | Key | Default | Extra          |
| ----------- | --------------- | ---- | --- | ------- | -------------- |
| id          | bigint unsigned | NO   | PRI | _NULL_  | auto_increment |
| code        | varchar(50)     | NO   | UNI | _NULL_  |                |
| label       | varchar(100)    | NO   |     | _NULL_  |                |
| description | text            | YES  |     | _NULL_  |                |
| created_at  | datetime        | YES  |     | _NULL_  |                |
| updated_at  | datetime        | YES  |     | _NULL_  |                |
```
"id";"code";"label";"description";"created_at";"updated_at"
"1";"DIRECTION";"Direction Générale";NULL;NULL;NULL
"2";"COMPTA";"Comptabilité / Finance";NULL;NULL;NULL
"3";"DRH";"Ressources Humaines";NULL;NULL;NULL
"4";"DSI";"Systèmes d'Information";NULL;NULL;NULL
"5";"MAINT";"Maintenance";NULL;NULL;NULL
"6";"COMMERCIAL";"Commercial / Ventes";NULL;NULL;NULL
"7";"MARKETING";"Marketing / Communication";NULL;NULL;NULL
"8";"LOGISTIQUE";"Logistique / Achats";NULL;NULL;NULL
"9";"JURIDIQUE";"Juridique";NULL;NULL;NULL
"10";"QUALITE";"Qualité / HSE";NULL;NULL;NULL
"11";"PRODUCTION";"Production / Exploitation";NULL;NULL;NULL
"12";"SECURITE";"Sécurité / Sûreté";NULL;NULL;NULL
```
