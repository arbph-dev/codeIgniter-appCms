
## Structure

| nom      | type        |      |
| -------- | ----------- | ---- |
| id       | INTEGER     |      |
| lbl      | TEXT        |      |
| unite    | TEXT        |      |
| datatype | VARCHAR(50) |      |
| desc     | TEXT        | NULL |




## Migration 
```sql
CREATE TABLE caracteristique (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL,
 unite VARCHAR(50) NULL,
 datatype VARCHAR(50) NULL,
 `desc` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

```

## Seeder :

```sql
INSERT INTO caracteristique (lbl,unite,datatype,`desc`) VALUES
('Puissance','kW','DECIMAL','Puissance nominale'),
('Tension','V','DECIMAL','Tension nominale'),
('Courant','A','DECIMAL','Courant nominal'),
('Fréquence','Hz','DECIMAL','Fréquence'),
('Débit','m3/h','DECIMAL','Débit'),
('Pression','bar','DECIMAL','Pression'),
('Température','°C','DECIMAL','Température'),
('Poids','kg','DECIMAL','Poids'),
('Longueur','mm','DECIMAL','Longueur'),
('Largeur','mm','DECIMAL','Largeur'),
('Hauteur','mm','DECIMAL','Hauteur'),
('Indice IP',NULL,'TEXT','Indice protection'),
('Classe isolation',NULL,'TEXT','Classe isolation'),
('Puissance moteur','kW','DECIMAL','Puissance moteur');


```