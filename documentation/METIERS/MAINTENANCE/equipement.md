Référence constructeur
Le champ : eqref  est très utile. Mais a renommer manufacturer_ref  ou
constructeur_ref  . Car il ne faut pas le confondre avec : ref interneref fournisseurref stock


Rajouter etbid pour rattacher l'équipement à un SIRET.



etat
En service
En maintenance
Arrêt
Réforme
Stock

garantie_fin

date_installation distincte de : mise_en_service
## obsolescence
gestion de l'obsolescence, on ajoute 2 champs ?
```
obsolescence INTEGER
	0 = inconnue
	1 = produit disponible
	2 = fin de commercialisation
	3 = plus fabriqué
	4 = plus de pièces
```

## Risque
```
criticite INTEGER 
1 = faible
2 = moyenne
3 = importante
4 = critique
```
#### evaluation

| champ             | type    |
| ----------------- | ------- |
| id                | INTEGER |
| eqpid             | INTEGER |
| criticite         | INTEGER |
| probabilite_panne | INTEGER |
| impact_production | INTEGER |
| impact_securite   | INTEGER |

---

## immobilisation comptable
numéro immobilisation comptable
champ imo pointe vers table immobilisation champ imoid

## Coût de maintenance
Calculé à partir des [[Z/METIERS/maintenance/GMAO/intervention|intervention]]


## Valeur de remplacement
Ajouter : replacement_cost REAL

Exemple :
```
Pompe installée en 2015
Valeur d'origine : 3 000 €
Prix actuel : 4 800 €
```


## CAPEX ready
Valeur de remplacement , replacement_cost
Risque , criticite
obsolescence

## Structure a corriger

| nom   | type    | attributs   | note                                    |
| ----- | ------- | ----------- | --------------------------------------- |
| id    | INTEGER | PRIMARY KEY |                                         |
| lbl   | TEXT    |             | nom libellé (unique ?)                  |
| desc  | TEXT    |             | description                             |
| manid | INTEGER |             | constructeur id de table manufact       |
| mdl   | TEXT    |             | modele                                  |
| sn    | TEXT    |             | numéro de série                         |
| mes   | DATE    |             | date de mise en service                 |
| srv   | INTEGER |             | en service 0, no 1 , yes -1 ne sait pas |
| eqref | TEXT    |             | référence constructeur                  |
| ean   | TEXT    |             | ean13                                   |
| imo   | TEXT    |             | numéro immobilisation comptable         |
| typid | INTEGER |             | fk typeeqp                              |
| cnsid | INTEGER |             | fk cnssec                               |
| eqpid | INTEGER |             | pour hiérarchie entre equipement        |




## Table

## Relations

La table `equipement` contient déjà plusieurs relations :

[[Z/METIERS/maintenance/GMAO/manufact|GMAO/manufact]]
1    
|    
n
[[Z/METIERS/maintenance/GMAO/equipement|GMAO/equipement]]
+---- TypeEquipement    
+---- ConsigneSecurite    
+---- Equipement Parent



Equipement
├── Constructeur
	via : manid  -> manufact.id voir entreprise / organisations
	voir [[Z/METIERS/maintenance/GMAO/manufact|GMAO/manufact]]
├── Type équipement
	via : typid  -> typeeqp.id 
	voir [[Z/METIERS/maintenance/GMAO/typeeqp|GMAO/typeeqp]]
├── Consigne sécurité
	via : cnsid  -> cnssec
└── Equipement parent
	via : eqpid  -> equipement



### hiérarchie
Le champ : eqpid permet :
```
Navire 
├── Groupe électrogène 1 
│    ├── Alternateur
│    ├── Moteur 
│    └── Armoire 

└── Groupe électrogène 2
```
ou
```
Usine 
├── Ligne A 
│   ├── Convoyeur
│   ├── Robot 
│   └── Variateur 
│
└── Ligne B
```


## Migration 
```sql
CREATE TABLE equipement (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 etbid BIGINT UNSIGNED NOT NULL,
 imoid BIGINT UNSIGNED NULL,
 lbl VARCHAR(255) NOT NULL,
 `desc` TEXT NULL,
 manid BIGINT UNSIGNED NULL,
 mdl VARCHAR(255) NULL,
 sn VARCHAR(255) NULL,
 mes DATE NULL,
 srv TINYINT DEFAULT 1,
 eqref VARCHAR(255) NULL,
 ean VARCHAR(32) NULL,
 imo VARCHAR(255) NULL,
 typid BIGINT UNSIGNED NOT NULL,
 cnsid BIGINT UNSIGNED NULL,
 eqpid BIGINT UNSIGNED NULL,
 created_at DATETIME NULL,
 updated_at DATETIME NULL,
 KEY idx_sn(sn),
 FOREIGN KEY (etbid) REFERENCES etablissements(id) ON DELETE CASCADE,
 FOREIGN KEY (imoid) REFERENCES immobilisation(id) ON DELETE SET NULL,
 FOREIGN KEY (manid) REFERENCES manufact(id) ON DELETE SET NULL,
 FOREIGN KEY (typid) REFERENCES typeeqp(id),
 FOREIGN KEY (cnsid) REFERENCES cnssec(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE equipement ADD CONSTRAINT fk_eqp_parent
FOREIGN KEY (eqpid) REFERENCES equipement(id) ON DELETE SET NULL;
```

## Seeder :

```sql
INSERT INTO equipement
(etbid,imoid,lbl,manid,mdl,sn,mes,typid,cnsid)
VALUES
(1,1,'TGBT Principal',1,'Prisma','TGBT001','2024-01-15',1,2),
(1,2,'Compresseur Air N°1',9,'MCP-500','COMP001','2024-02-01',2,1),
(1,3,'Automate Principal',8,'FX5U','PLC001','2024-02-10',6,1),
(1,4,'Serveur Supervision',2,'IPC-01','SRV001','2024-03-01',9,1),
(1,NULL,'Circuit éclairage chaufferie',4,NULL,NULL,'2024-01-01',1,1),
(1,NULL,'Réseau prises atelier',4,NULL,NULL,'2024-01-01',1,1),
(2,NULL,'Portail dépôt',2,'PORT-01','PORT001','2024-04-01',7,1),
(2,NULL,'Caméra accès dépôt',2,'CAM-01','CAM001','2024-04-01',8,1);

```