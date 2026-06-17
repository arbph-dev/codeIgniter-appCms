Une organisation peut avoir plusieurs noms :
NUPES → Nouvelle Union Populaire Écologique et Sociale
PS   → Parti Socialiste / Section française de l'Internationale ouvrière (historique)


Même structure que personne_alias : 
organisation_id, alias, type (sigle, ancien_nom, nom_commercial...).


```sql
-- =========================================================  
-- ORGANISATION ALIAS  
-- =========================================================  
  
CREATE TABLE organisation_alias (  
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  
organisation_id BIGINT UNSIGNED NOT NULL,  
alias VARCHAR(255) NOT NULL,  
type ENUM(  
'sigle',
'ancien_nom',
'nom_commercial',
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