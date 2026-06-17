
## Relation

[[METIERS/maintenance/GMAO/equipement]]

Exemples :

```
Tous les 3 mois
Tous les 500h
Tous les ans
```
## Structure

| nom       | type    |
| --------- | ------- |
| id        | INTEGER |
| eqpid     | INTEGER |
| lbl       | TEXT    |
| frequence | INTEGER |
| unite     | TEXT    |
| prochaine | DATE    |
## Migration 
```sql
CREATE TABLE planmaintenance (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 eqpid BIGINT UNSIGNED NOT NULL,
 lbl VARCHAR(255) NOT NULL,
 frequence INT NOT NULL,
 unite VARCHAR(50) NOT NULL,
 prochaine DATE NULL,
 actif TINYINT DEFAULT 1,
 FOREIGN KEY (eqpid) REFERENCES equipement(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder

```sql
INSERT INTO planmaintenance
(eqpid,lbl,frequence,unite,prochaine,actif)
VALUES
(2,'Vidange compresseur',12,'mois','2026-12-01',1),
(2,'Remplacement filtre',6,'mois','2026-09-01',1),
(1,'Contrôle serrage connexions',12,'mois','2026-11-01',1),
(3,'Sauvegarde automate',3,'mois','2026-08-01',1);

```