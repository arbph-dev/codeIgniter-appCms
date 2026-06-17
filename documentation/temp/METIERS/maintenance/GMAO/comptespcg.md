
Le PCG fournit la logique de classement des biens: 
- comptes de la classe 2 pour les immobilisations corporelles et incorporelles
- comptes d’amortissement en classe 28
- comptes de charges associés.
 
- Dans une GMAO, cela sert à rattacher chaque équipement à un compte comptable, par exemple pour automatiser les exports vers la comptabilité ou la clôture annuelle.

- Le PCG est aussi utile pour distinguer un achat immobilisable d’une simple charge de maintenance.[](https://www.youtube.com/watch?v=RkfI8y590k4)

Exemples précis :

- Une machine-outil peut être rattachée au compte 2183 si l’entreprise retient cette nomenclature pour le matériel industriel; la GMAO peut mémoriser ce compte pour les écritures d’intégration.[](https://www.youtube.com/watch?v=RkfI8y590k4)[](https://www.calebgestion.com/cours_comptabilite/c51_pcg2.htm)
    
- Des travaux lourds sur une installation peuvent être immobilisés au lieu d’être passés en charge, puis amortis sur plusieurs exercices.
    
- Des immobilisations en cours, comme une ligne de production non terminée, passent par le compte 23 avant transfert au compte définitif lors de la mise en service

## Migration 
==cette migration ne sera pas exécutée== voir [[METIERS/economie/Plan Comptable General]]

`comptecomptable`=> comptespcg
 TABLE `comptespcg` 
`numpcg` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
 PRIMARY KEY (`numpcg`),

```sql
CREATE TABLE comptespcg (
 numpcg VARCHAR(20) PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
## table

```
CREATE TABLE comptespcg (
 numpcg VARCHAR(20) PRIMARY KEY,
 lbl VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO comptespcg (numpcg,lbl) VALUES
('205','Logiciels'),
('2154','Matériel industriel'),
('2155','Outillage industriel'),
('2182','Matériel de transport'),
('2183','Matériel informatique'),
('2184','Mobilier'),
('28154','Amortissement matériel industriel'),
('28155','Amortissement outillage'),
('28182','Amortissement matériel transport'),
('28183','Amortissement matériel informatique'),
('28184','Amortissement mobilier');

```