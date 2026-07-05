
# etablissements
```sql
CREATE TABLE etablissements (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 orgid BIGINT UNSIGNED NOT NULL,

 siret VARCHAR(14) UNIQUE NULL,

 lbl VARCHAR(255) NOT NULL,

 adresse TEXT NULL,
 cp VARCHAR(20) NULL,
 ville VARCHAR(100) NULL,

 created_at DATETIME NULL,
 updated_at DATETIME NULL,

 KEY idx_orgid (orgid),

 CONSTRAINT fk_etab_org
 FOREIGN KEY (orgid)
 REFERENCES organisations(id)
 ON DELETE CASCADE
);
```

Les règles deviennent alors très simples :

Entité	Possède des établissements
Entreprise	✅
Association	✅
Collectivité	✅
Syndicat	✅
Fondation	✅

Autre avantage : le SIRET devient optionnel.
En effet :

une entreprise possède un SIRET ;
une association peut avoir un SIRET ;
une mairie possède un SIRET ;
mais certaines organisations peuvent ne jamais en avoir.

remplacer entreprise_id par orgid
pour homogénéiser le modèle (orgid, etbid, eqpid, artid...).
