table réductrice pour certains, luxueuse pour d'autres
## Table `personne_ideologies`
```sql
CREATE TABLE personne_ideologies (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	personne_id BIGINT UNSIGNED NOT NULL,
	ideologie VARCHAR(255) NOT NULL,
	orientation ENUM( 'gauche','droite','centre','libertaire','technocratique','nationaliste','écologiste','conspirationniste','anti_systeme','autre'

) NULL,
intensite TINYINT NULL,
source_id BIGINT UNSIGNED NULL,
commentaire TEXT NULL

);
