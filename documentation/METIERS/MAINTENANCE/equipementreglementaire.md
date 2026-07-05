
## Relations
[[Z/METIERS/maintenance/GMAO/equipement]]
[[Z/METIERS/maintenance/GMAO/obligationreglementaire]]


## Structure

| nom       | type    |
| --------- | ------- |
| id        | INTEGER |
| eqpid     | INTEGER |
| regid     | INTEGER |
| prochaine | DATE    |
| derniere  | DATE    |
## Migration 
```sql
CREATE TABLE equipementreglementaire (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 eqpid BIGINT UNSIGNED NOT NULL,
 regid BIGINT UNSIGNED NOT NULL,
 derniere DATE NULL,
 prochaine DATE NULL,
 FOREIGN KEY (eqpid) REFERENCES equipement(id) ON DELETE CASCADE,
 FOREIGN KEY (regid) REFERENCES obligationreglementaire(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO equipementreglementaire
(eqpid,regid,derniere,prochaine)
VALUES
(1,2,'2026-01-01','2027-01-01'),
(2,6,'2026-01-01','2027-01-01');

```