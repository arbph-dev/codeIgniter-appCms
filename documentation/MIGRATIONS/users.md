users est crée par CodeIgniter


DESCRIBE users;

| Field          | Type         | Null | Key | Default | Extra          |
| -------------- | ------------ | ---- | --- | ------- | -------------- |
| id             | int unsigned | NO   | PRI | _NULL_  | auto_increment |
| username       | varchar(30)  | YES  | UNI | _NULL_  |                |
| status         | varchar(255) | YES  |     | _NULL_  |                |
| status_message | varchar(255) | YES  |     | _NULL_  |                |
| active         | tinyint(1)   | NO   |     | 0       |                |
| last_active    | datetime     | YES  |     | _NULL_  |                |
| created_at     | datetime     | YES  |     | _NULL_  |                |
| updated_at     | datetime     | YES  |     | _NULL_  |                |
| deleted_at     |  datetime     | YES  |     | _NULL_  |                |
