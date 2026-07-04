Une personne peut avoir un nom de scène : Johny Halliday et Philipe SMET
```sql
-- =========================================================  
-- PERSONNE ALIAS  
-- =========================================================  
  
CREATE TABLE personne_alias (  
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  
  
personne_id BIGINT UNSIGNED NOT NULL,  
  
alias VARCHAR(255) NOT NULL,  
  
type ENUM(  
'pseudonyme',  
'nom_naissance',  
'nom_usage',  
'translitteration',  
'autre'  
) DEFAULT 'autre',  
  
created_at DATETIME NULL,  
updated_at DATETIME NULL,  
  
CONSTRAINT fk_alias_personne  
FOREIGN KEY (personne_id)  
REFERENCES personnes(id)  
ON DELETE CASCADE,  
  
INDEX idx_alias (alias),  
INDEX idx_type (type)  
)  
ENGINE=InnoDB  
DEFAULT CHARSET=utf8mb4  
COLLATE=utf8mb4_unicode_ci;
```
