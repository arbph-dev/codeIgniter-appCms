

service_types -- Référentiel des types (enum enrichi) 


## table service_types

| Field       | Type            | Null | Key | Default | Extra          |
| ----------- | --------------- | ---- | --- | ------- | -------------- |
| id          | bigint unsigned | NO   | PRI | _NULL_  | auto_increment |
| code        | varchar(50)     | NO   | UNI | _NULL_  |                |
| label       | varchar(100)    | NO   |     | _NULL_  |                |
| description | text            | YES  |     | _NULL_  |                |
| created_at  | datetime        | YES  |     | _NULL_  |                |
| updated_at  | datetime        | YES  |     | _NULL_  |                |

  id, code, label, description
  → 'COMPTA',  'Comptabilité'
  → 'DRH',     'Ressources Humaines'
  → 'DSI',     'Systèmes d\'Information'
  → 'MAINT',   'Maintenance'
  → 'DIRECTION','Direction Générale'
  → ...