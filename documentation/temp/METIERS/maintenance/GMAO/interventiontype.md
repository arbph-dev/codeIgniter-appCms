

## Structure

|nom|type|
|---|---|
|id|INTEGER|
|lbl|TEXT|

Exemples :

- Préventive
- Curative
- Corrective
- Réglementaire
- Audit
- Contrôle

## Migration 
```sql
CREATE TABLE interventiontype (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL,
 `desc` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


## Seeder :

```sql
INSERT INTO interventiontype (lbl,`desc`) VALUES
('Préventive','Maintenance préventive'),
('Curative','Réparation suite panne'),
('Corrective','Remise en conformité'),
('Réglementaire','Contrôle réglementaire'),
('Inspection','Inspection périodique'),
('Audit','Audit technique'),
('Modification','Modification installation'),
('Installation','Mise en service'),
('Dépannage','Intervention urgente');

```