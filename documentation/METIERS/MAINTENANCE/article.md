
description, les caractéristiques sont saisies en chaine, 
on peut prévoir une liste de caractéristique selon le type d'article

| nom   | type    | attributs   | note |
| ----- | ------- | ----------- | ---- |
| id    | INTEGER | PRIMARY KEY |      |
| lbl   | TEXT    |             |      |
| desc  | TEXT    |             |      |
| manid | INTEGER |             |      |
| mdl   | TEXT    |             |      |
| ean   | TEXT    |             |      |
| typid | INTEGER |             |      |
| ref   | TEXT    |             |      |

## Migration 
```sql
CREATE TABLE article (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL,
 `desc` TEXT NULL,
 manid BIGINT UNSIGNED NULL,
 mdl VARCHAR(255) NULL,
 ean VARCHAR(32) NULL,
 ref VARCHAR(255) NULL,
 typid BIGINT UNSIGNED NULL,
 stock DECIMAL(15,3) DEFAULT 0,
 stockmini DECIMAL(15,3) DEFAULT 0,
 stockmaxi DECIMAL(15,3) NULL,
 unite VARCHAR(20) NULL,
 emplacement VARCHAR(255) NULL,
 actif TINYINT DEFAULT 1,
 FOREIGN KEY (manid) REFERENCES manufact(id) ON DELETE SET NULL,
 FOREIGN KEY (typid) REFERENCES articletype(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO article
(lbl,ref,typid,stock,stockmini,unite)
VALUES
('Disjoncteur 16A','A9F74216',3,25,5,'pcs'),
('Contacteur 18A','LC1D18',3,10,2,'pcs'),
('Relais Finder','40.52',4,20,5,'pcs'),
('Lampe LED 24V','LED24',1,100,20,'pcs'),
('Huile compresseur','HUILE-COMP',5,40,10,'L'),
('Gants isolants','EPI-GANT',7,12,2,'pcs'),
('Automate de rechange','PLC-01',4,1,0,'pcs'),
('Capteur pression','PRESS-01',2,4,1,'pcs');

```