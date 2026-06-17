
- Quel est le montant immobilisé par établissement ?
- Quel matériel arrive en fin d'amortissement ?
- Quels investissements prévoir sur les 3 prochaines années ?
- Quel coût total de possession (TCO) par équipement ?
- Quels équipements représentent le plus de maintenance ?



| champ    | type    |
| -------- | ------- |
| id       | INTEGER |
| eqpid    | INTEGER |
| annee    | INTEGER |
| montant  | REAL    |
| priorite | INTEGER |
| motif    | TEXT    |
| statut   | INTEGER |

---

Exemple :
```
Pompe P-1012027
Montant : 12 000 €
Motif : usure
Priorité : haute
```

## CAPEX


À partir des données de la GMAO :
Equipement : [[METIERS/maintenance/GMAO/equipement]]
Interventions : [[METIERS/maintenance/GMAO/intervention]]
Coût maintenance : calculé depuis les [[METIERS/maintenance/GMAO/intervention]]
Criticité : [[METIERS/maintenance/GMAO/equipement]]
Obsolescence :[[METIERS/maintenance/GMAO/equipement]]
Valeur de remplacement :[[METIERS/maintenance/GMAO/equipement]]
=> Plan investissement


### Exemple :

|équipement|maintenance/an|âge|risque|remplacement|
|---|---|---|---|---|
|Pompe P101|2500€|18 ans|élevé|2027|
|Variateur V201|400€|5 ans|faible|2032|
|GE 500kVA|8000€|22 ans|critique|2028|
### Indicateur 
#### Indice de risque
calculer :

```
Indice de risque = criticité × probabilité × impact
```

#### TCO coût total de possession

Pour un compresseur, le **TCO** se calcule en additionnant le coût d’achat et tous les coûts liés à sa possession pendant sa durée de vie, puis en retranchant éventuellement la valeur de revente. Une formule simple est : **TCO = coût d’acquisition + coûts de maintenance + coûts d’exploitation + coûts indirects - valeur résiduelle**.

##### Méthode de calcul
Pour un compresseur de production, tu peux structurer le TCO ainsi :
- Coût d’achat.
- Installation et mise en service.
- Amortissement comptable.
- Maintenance préventive et corrective.
- Consommation électrique.
- Arrêts de production liés aux pannes.
- Pièces de rechange.
- Coût de fin de vie ou valeur de revente.
    

L’amortissement fait partie du coût de possession, mais il ne correspond pas à une sortie de trésorerie. Il sert à répartir le coût d’acquisition sur la durée d’usage de l’équipement.

## Exemple chiffré

Prenons ton compresseur acheté **12 000 €** et amorti sur **5 ans** :

- Achat: 12 000 €.
    
- Installation: 800 €.
    
- Entretien annuel: 600 €.
    
- Réparations annuelles moyennes: 300 €.
    
- Électricité annuelle: 1 200 €.
    
- Coût d’arrêt estimé: 400 € par an.
    
- Valeur de revente au bout de 5 ans: 1 000 €.
    

Calcul sur 5 ans :

- Maintenance: (600+300)×5=4500€(600+300)×5=4500€.
    
- Électricité: 1200×5=6000€1200×5=6000€.
    
- Arrêts: 400×5=2000€400×5=2000€.
    
- Total brut: 12000+800+4500+6000+2000=25300€12000+800+4500+6000+2000=25300€.
    
- TCO net: 25300−1000=24300€25300−1000=24300€.
    

Donc, dans cet exemple, le compresseur coûte **24 300 €** sur 5 ans, soit **4 860 € par an** en coût global moyen.

## Lecture maintenance

En GMAO, le TCO permet de comparer plusieurs équipements ou plusieurs stratégies de maintenance. Si un compresseur moins cher à l’achat consomme plus d’électricité ou casse plus souvent, son TCO peut être plus élevé qu’un modèle plus cher mais plus fiable.

Tu peux aussi ventiler le TCO en deux blocs :

- **Coûts comptables**: amortissement.
    
- **Coûts opérationnels**: maintenance, énergie, arrêts, pièces, fin de vie.
    

## Formule pratique pour ton fichier

Pour un suivi simple dans une GMAO ou un tableau de pilotage, utilise :

- **TCO annuel = amortissement annuel + maintenance annuelle + énergie annuelle + coût des arrêts + autres coûts - éventuelle valeur résiduelle annualisée**.
    

Pour ton compresseur :

- Amortissement annuel: 2 400 €.
    
- Maintenance: 900 €.
    
- Électricité: 1 200 €.
    
- Arrêts: 400 €.
    
- Total annuel: **4 900 €**, avant prise en compte de la revente.


## Migration 
```sql
CREATE TABLE planinvestissement (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 eqpid BIGINT UNSIGNED NOT NULL,
 annee INT NOT NULL,
 montant DECIMAL(15,2) NOT NULL,
 priorite TINYINT NULL,
 motif TEXT NULL,
 FOREIGN KEY (eqpid) REFERENCES equipement(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql

INSERT INTO planinvestissement
(eqpid,annee,montant,priorite,motif)
VALUES
(2,2027,22000,1,'Remplacement compresseur'),
(4,2028,8000,2,'Renouvellement serveur supervision');

```