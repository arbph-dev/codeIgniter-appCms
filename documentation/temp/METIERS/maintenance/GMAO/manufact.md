## strucutre

| nom   | type    | attributs   | note |
| ----- | ------- | ----------- | ---- |
| rowid | INTEGER | PRIMARY KEY |      |
| lbl   | TEXT    |             |      |

```
manufact---------
id
lbl
web
country
notes
```

Car ensuite tu pourras récupérer :

- notices
- catalogues
- pièces détachées


## Migration 
voir 
[[METIERS/economie/organisation|organisation]]
[[METIERS/economie/entreprise|entreprise]]

```
CREATE TABLE manufact (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL,
 web VARCHAR(255) NULL,
 pays VARCHAR(100) NULL,
 contact VARCHAR(255) NULL,
 tel VARCHAR(50) NULL,
 email VARCHAR(255) NULL,
 notes TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```



## Seeder :

```sql
INSERT INTO manufact (lbl,web,pays) VALUES
('Schneider Electric','https://www.se.com','France'),
('Siemens','https://www.siemens.com','Allemagne'),
('ABB','https://www.abb.com','Suisse'),
('Legrand','https://www.legrand.com','France'),
('Phoenix Contact','https://www.phoenixcontact.com','Allemagne'),
('Wago','https://www.wago.com','Allemagne'),
('Finder','https://www.findernet.com','Italie'),
('Mitsubishi Electric','https://www.mitsubishielectric.com','Japon'),
('Danfoss','https://www.danfoss.com','Danemark'),
('Rockwell Automation','https://www.rockwellautomation.com','USA');

```