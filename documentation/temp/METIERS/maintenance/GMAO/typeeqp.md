

Le champ **typid** est associé à ==typeeqp== avec : teid pour hiérarchiser les types.
un arbre métier :

```
Electrique 
	├── Transformateur 
	├── Disjoncteur 
	└── ContacteurMécanique 
├── Pompe 
├── Moteur 
└── Réducteur
```


## Structure

| nom  | type            | attributs                  | note |
| ---- | --------------- | -------------------------- | ---- |
| id   | BIGINT UNSIGNED | AUTO_INCREMENT PRIMARY KEY |      |
| lbl  | TEXT            | NOT NULL                   |      |
| desc | TEXT            | NULL                       |      |
| teid | BIGINT UNSIGNED | NULL                       |      |

## Migration

### Mysql

```sql
CREATE TABLE typeeqp (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL,
 `desc` TEXT NULL,
 teid BIGINT UNSIGNED NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE typeeqp ADD CONSTRAINT fk_typeeqp_parent
FOREIGN KEY (teid) REFERENCES typeeqp(id) ON DELETE SET NULL;
```


### DATA
Sans relation de type

"G:\OBSIDIAN\WWW\WWW\METIERS\maintenance\APP\GMAO\TYPE_eq_utf.csv"



## Seeder :
Sans relation de type
```sql
INSERT INTO typeeqp (lbl,`desc`) VALUES
('Electrique','Equipements électriques'),
('Mécanique','Equipements mécaniques'),
('Hydraulique','Equipements hydrauliques'),
('Pneumatique','Equipements pneumatiques'),
('Instrumentation','Mesures et capteurs'),
('Automatisme','Automates et supervision'),
('Bâtiment','Installations bâtiment'),
('Sécurité','Equipements sécurité'),
('Informatique','Infrastructure informatique');


```