
## Relations
[[Z/METIERS/maintenance/GMAO/equipement]]
[[Z/METIERS/maintenance/GMAO/caracteristique]]

Exemple :

```
Puissance = 15
Unité = kW

Tension = 400
Unité = V

Courant = 28
Unité = A
```

## Structure

|nom|type|
|---|---|
|id|INTEGER|
|eqpid|INTEGER|
|carid|INTEGER|
|valeur|TEXT|

## Migration 
```sql
CREATE TABLE equipementcaracteristique (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 eqpid BIGINT UNSIGNED NOT NULL,
 carid BIGINT UNSIGNED NOT NULL,
 valeur TEXT NOT NULL,
 FOREIGN KEY (eqpid) REFERENCES equipement(id) ON DELETE CASCADE,
 FOREIGN KEY (carid) REFERENCES caracteristique(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :
equipement(id) : 

```sql
INSERT INTO equipementcaracteristique
(eqpid,carid,valeur)
VALUES
(1,2,'400'),
(1,3,'630'),
(2,1,'15'),
(2,6,'8'),
(3,2,'24'),
(4,2,'230');

```