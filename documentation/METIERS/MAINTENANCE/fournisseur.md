voir 
[[Z/METIERS/economie/organisation|organisation]]
[[Z/METIERS/economie/entreprise|entreprise]]


## Migration

==cette migration ne sera pas exécutée==
soit on utilise les codes ape/naf soit on crée une table pivot


```
CREATE TABLE fournisseur (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 siret VARCHAR(14) NULL,
 lbl VARCHAR(255) NOT NULL,
 adresse TEXT NULL,
 cp VARCHAR(20) NULL,
 ville VARCHAR(100) NULL,
 pays VARCHAR(100) NULL,
 contact VARCHAR(255) NULL,
 tel VARCHAR(50) NULL,
 email VARCHAR(255) NULL,
 web VARCHAR(255) NULL,
 notes TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO fournisseur (lbl,web,pays) VALUES
('Rexel','https://www.rexel.fr','France'),
('Sonepar','https://www.sonepar.fr','France'),
('RS Components','https://fr.rs-online.com','France'),
('Farnell','https://fr.farnell.com','France'),
('Conrad','https://www.conrad.fr','France'),
('Reichelt','https://www.reichelt.com','Allemagne'),
('TME','https://www.tme.eu','Pologne'),
('Mouser Electronics','https://www.mouser.fr','USA'),
('DigiKey','https://www.digikey.fr','USA'),
('Manutan','https://www.manutan.fr','France');

```