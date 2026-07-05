Evolution
detail des MO /intervenant et compétence => cout global dans **intervention.coutmo** 
detail des articles  => cout global dans **intervention.coutmat**
detail des prestataires

```
cout_mo
cout_piece
cout_presta
```
---

Puis vue calculée :
```
Equipement
	coût maintenance annuel
	coût maintenance cumulé
```

# Relation
[[Z/METIERS/maintenance/GMAO/equipement]]
[[Z/METIERS/maintenance/GMAO/etablissements]]
[[Z/METIERS/maintenance/GMAO/interventiontype]]



## Structure

| nom      | type     | attributs            |
| -------- | -------- | -------------------- |
| id       | INTEGER  | PRIMARY KEY          |
| eqpid    | INTEGER  | FK equipement        |
| etbid    | INTEGER  | FK établissement     |
| dtdeb    | DATETIME |                      |
| dtfin    | DATETIME |                      |
| typid    | INTEGER  | FK type intervention |
| etat     | INTEGER  |                      |
| priorite | INTEGER  |                      |
| objet    | TEXT     |                      |
| rapport  | TEXT     |                      |
| coutmo   | REAL     |                      |
| coutmat  | REAL     |                      |
## Migration 
```sql
CREATE TABLE intervention (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 eqpid BIGINT UNSIGNED NOT NULL,
 etbid BIGINT UNSIGNED NOT NULL,
 typid BIGINT UNSIGNED NOT NULL,
 dtdeb DATETIME NULL,
 dtfin DATETIME NULL,
 rapport TEXT NULL,
 coutmo DECIMAL(15,2) NULL,
 coutmat DECIMAL(15,2) NULL,
 coutpresta DECIMAL(15,2) NULL,
 intervenant VARCHAR(255) NULL,
 created_at DATETIME NULL,
 updated_at DATETIME NULL,
 FOREIGN KEY (eqpid) REFERENCES equipement(id) ON DELETE CASCADE,
 FOREIGN KEY (etbid) REFERENCES etablissements(id) ON DELETE CASCADE,
 FOREIGN KEY (typid) REFERENCES interventiontype(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO intervention
(eqpid,etbid,typid,dtdeb,dtfin,rapport,
 coutmo,coutmat,coutpresta,intervenant)
VALUES
(
2,1,1,
'2026-01-15 08:00:00',
'2026-01-15 10:00:00',
'Vidange annuelle compresseur',
120,65,0,
'Technicien Maintenance'
),
(
1,1,4,
'2026-02-10 09:00:00',
'2026-02-10 11:00:00',
'Contrôle électrique annuel',
180,0,450,
'Organisme agréé'
);


```
