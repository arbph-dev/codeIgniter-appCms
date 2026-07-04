## personne_distinctions
### backend
#### Model 
app/Models/PersonneDistinctionModel.php

```sql
CREATE TABLE personne_distinctions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    personne_id BIGINT UNSIGNED NOT NULL,
    distinction_id BIGINT UNSIGNED NOT NULL,

    annee YEAR NULL,

    titre VARCHAR(255) NULL,
    resume TEXT NULL,

    created_at DATETIME NULL,
    updated_at DATETIME NULL,

    CONSTRAINT fk_pd_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id),

    CONSTRAINT fk_pd_distinction
        FOREIGN KEY (distinction_id)
        REFERENCES distinctions(id)
);


---

-- =========================================================  
-- PERSONNE DISTINCTIONS  
-- =========================================================  
  
CREATE TABLE personne_distinctions (  
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  
  
personne_id BIGINT UNSIGNED NOT NULL,  
  
distinction_id BIGINT UNSIGNED NOT NULL,  
  
date_remise DATE NULL,  
annee YEAR NULL,  
  
grade VARCHAR(100) NULL,  
  
resume TEXT NULL,  
  
source VARCHAR(100) NULL,  
source_id VARCHAR(255) NULL,  
  
created_at DATETIME NULL,  
updated_at DATETIME NULL,  
  
CONSTRAINT fk_pd_personne  
FOREIGN KEY (personne_id)  
REFERENCES personnes(id)  
ON DELETE CASCADE,  
  
CONSTRAINT fk_pd_distinction  
FOREIGN KEY (distinction_id)  
REFERENCES distinctions(id)  
ON DELETE CASCADE,  
  
INDEX idx_personne (personne_id),  
INDEX idx_distinction (distinction_id),  
  
INDEX idx_annee (annee)  
)  
ENGINE=InnoDB  
DEFAULT CHARSET=utf8mb4  
COLLATE=utf8mb4_unicode_ci;

```
