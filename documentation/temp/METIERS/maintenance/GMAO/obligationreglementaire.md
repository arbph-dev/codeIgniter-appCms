

Exemple :

```
Contrôle extincteur
Vérification levage
Mesure isolement
Contrôle thermographie
```


## Structure

| nom         | type    |
| ----------- | ------- |
| id          | INTEGER |
| lbl         | TEXT    |
| reference   | TEXT    |
| periodicite | INTEGER |
| unite       | TEXT    |

## Migration 
```sql
CREATE TABLE obligationreglementaire (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL,
 reference VARCHAR(255) NULL,
 `desc` TEXT NULL,
 periodicite INT NULL,
 unite VARCHAR(50) NULL,
 actif TINYINT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```



## Seeder :

```sql
INSERT INTO obligationreglementaire
(lbl,reference,periodicite,unite,actif)
VALUES
('Contrôle extincteurs','APSAD R4',12,'mois',1),
('Contrôle électrique','Code du travail',12,'mois',1),
('Contrôle appareils levage','Arrêté levage',12,'mois',1),
('Contrôle portes coupe-feu','APSAD',12,'mois',1),
('Thermographie infrarouge','Prévention incendie',12,'mois',1),
('Mesure isolement électrique','NF C15-100',12,'mois',1),
('Contrôle éclairage sécurité','ERP',6,'mois',1),
('Contrôle groupes électrogènes','Constructeur',12,'mois',1);

```