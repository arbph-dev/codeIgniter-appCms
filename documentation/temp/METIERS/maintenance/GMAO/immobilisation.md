

```
compteid INTEGER
compteamortid INTEGER
```


## Rôle des immobilisations

Une immobilisation est un actif destiné à rester durablement dans l’entreprise, comme une machine, un véhicule ou un serveur, et elle doit être amortie selon sa durée d’utilisation. Dans une GMAO, cela permet de suivre l’historique technique du bien, ses interventions, ses coûts de maintenance, et de relier ces données à sa valeur comptable. La valeur nette comptable correspond au coût d’entrée diminué des **amortissements** cumulés.

Exemples précis :

- Une presse industrielle achetée 48 000 € HT est enregistrée comme immobilisation, puis amortie sur sa durée d’usage; la GMAO peut stocker sa fiche, son numéro de série, sa localisation atelier et ses maintenances.
    
- Un véhicule d’intervention suit le même principe: achat, mise en service, plan d’**amortissement**, puis sorties ou cession si le véhicule est vendu ou réformé.
    
- Un serveur de production peut être suivi comme immobilisation informatique, avec son affectation à un site, ses contrats de maintenance et son **amortissement** comptable.
    
### Exemple de fiche:
- Bien: compresseur d’atelier.
- Compte PCG: matériel industriel, souvent rattaché à une subdivision du compte 2154 selon le paramétrage de l’entreprise.
- Coût d’acquisition: 12 000 €.
- Durée: 5 ans.
- Dotation annuelle: 2 400 €.

un compresseur 
- acheté **12 000 € HT**
- immobilisé et amorti en **linéaire sur 5 ans**. 
- La dotation annuelle est donc de **2 400 € par an**;
- l’amortissement est une charge calculée qui ne sort pas de trésorerie, et il est comptabilisé en débit du compte 6811 avec une contrepartie au compte 2815x selon la nature du bien.

### Exemple d’amortissement

Hypothèse:
- Prix d’achat: 12 000 € HT.
- Durée d’utilisation: 5 ans.
- Valeur résiduelle: 0 €.
- Méthode: linéaire.

Calcul:
- Dotation annuelle = 12 000 / 5 = **2 400 €**.
- Dotation mensuelle théorique = **200 €** si tu suis un prorata mensuel dans la GMAO ou la compta analytique.

Tableau:

| Année | Valeur brute | Dotation annuelle | Amortissements cumulés | Valeur nette comptable |
| ----- | ------------ | ----------------- | ---------------------- | ---------------------- |
| 1     | 12 000 €     | 2 400 €           | 2 400 €                | 9 600 €                |
| 2     | 12 000 €     | 2 400 €           | 4 800 €                | 7 200 €                |
| 3     | 12 000 €     | 2 400 €           | 7 200 €                | 4 800 €                |
| 4     | 12 000 €     | 2 400 €           | 9 600 €                | 2 400 €                |
| 5     | 12 000 €     | 2 400 €           | 12 000 €               | 0 €                    |
### Écriture comptable

À la clôture de chaque exercice, l’amortissement apparaît comme une dotation aux amortissements en charge, généralement au compte **6811**. 

En face, on crédite le compte d’amortissement cumulé du bien, par exemple **28154** si le compresseur est rangé dans le matériel industriel.

Écriture annuelle:
- Débit 6811: **2 400 €**   
- Crédit 28154: **2 400 €**


Dans le **compte de résultat**, l’amortissement diminue le résultat sans sortie de cash, tandis que les dépenses de maintenance courante restent des charges d’exploitation de type entretien/réparations, souvent en compte **615**. 

Cette distinction est importante en GMAO, car elle sépare ce qui est **capitalisé** de ce qui est **consommé** immédiatement

### budget maintenance

L’amortissement ne passe pas dans le budget de maintenance comme une facture de réparation; il relève du **coût de possession** du matériel. En revanche, dans une GMAO ou un tableau de pilotage, on peut le rapprocher des dépenses de maintenance pour calculer le coût complet du compresseur: amortissement + entretien + pièces + arrêts.

Exemple de budget annuel:
- Amortissement: 2 400 €.
- Entretien préventif: 600 €.
- Pièces et réparations: 900 €.
- Coût total de possession: **3 900 € par an**.

## Migration 
```sql
CREATE TABLE immobilisation (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 num_imo VARCHAR(100) NOT NULL UNIQUE,
 lbl VARCHAR(255) NOT NULL,
 compteid VARCHAR(20) NULL,
 compteamortid VARCHAR(20) NULL,
 valeur_origine DECIMAL(15,2) NULL,
 valeur_residuelle DECIMAL(15,2) NULL,
 FOREIGN KEY (compteid) REFERENCES comptespcg(numpcg),
 FOREIGN KEY (compteamortid) REFERENCES comptespcg(numpcg)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Seeder :

```sql
INSERT INTO immobilisation
(num_imo,lbl,compteid,compteamortid,valeur_origine,valeur_residuelle)
VALUES
('IMO-2024-001','Tableau Général BT','2154','28154',25000,2000),
('IMO-2024-002','Compresseur principal','2154','28154',18000,1500),
('IMO-2024-003','Automate principal','2183','28183',8500,500),
('IMO-2024-004','Serveur supervision','2183','28183',6500,300);

```