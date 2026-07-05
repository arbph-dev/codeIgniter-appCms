### Produits 
- id : autoincrement 
- Catégorie produits : logiciels 
- Plateforme : Nintendo 2DS
- Classification PEGI : 3 ans et plus
- Date de sortie : 19/11/2008
- EAN : 5390102492625
- Editeur : Innelec
- Genre : Jeux vidéo 
- Desgination : 1000 bornes (jeu) (NDS) 
- image 
### CatProd 
- id : autoincrement - nom : logiciels_et_jeux 
### Vendeur 
- id : autoincrement 
- marchand : leclerc
- lien : https://www.e.leclerc/ 
- type : pro, user 

### ProduitVendeur 
 - id
 - Produit id
 - vendeur id
 - refvendeurproduit 
 - prix
 - etat
### PrixVendeurProduit 
table pour mise a jour des prix produit
- id 
- refvendeurproduit
- date
- prix 
### Annonces
- id : autoincrement
- user : userid , id de l'user qui vend un produit
- Produit id - Prix : decimal - image 
### Offres 
- id : autoincrement
- annonceid id de l'annonce
- userbuy id , id de l'user qui fera la proposition pour une annonce
- offer : decimal


### synthèse

| table                | champs |     |      |       |      |     |
| -------------------- | ------ | --- | ---- | ----- | ---- | --- |
| conditionnement      | id     | nom | ucid | qty   |      |     |
| uniteconditionnement | id     | nom |      |       |      |     |
| magasin              | id     | nom | cp   | ville | long | lat |
| marques              | id     | nom | grp  | pic   |      |     |

---
### conditionnement
"I:\SE\mymarket\conditionnements.csv"

| id  | nom                      | ucid | qty  |
| --- | ------------------------ | ---- | ---- |
| 1   | Sac de 10 kg             | 1    | 10   |
| 2   | Sac de 15 kg             | 1    | 15   |
| 3   | Sac de 18 kg             | 1    | 18   |
| 4   | Bouteille 0,5 L          | 2    | 0,5  |
| 5   | Bouteille 0,75 L         | 2    | 0,75 |
| 6   | Bouteille 1 L            | 2    | 1    |
| 7   | Bouteille 1,35 L         | 2    | 1,35 |
| 8   | Bouteille 1,5 L          | 2    | 1,5  |
| 9   | Paquet de 1kg            | 1    | 1    |
| 10  | Barquette pesée          | 1    | -1   |
| 11  | Filet de 1 kg            | 1    | 1    |
| 12  | Filet de 2 kg            | 1    | 2    |
| 13  | Pot de 1 kg              | 1    | 1    |
| 14  | Carton de 6 bt de 0,75 L | 2    | 4,5  |
| 15  | Brique de 1 L            | 2    | 1    |
| 16  | Pack de 6 bt de 1,5 L    | 2    | 9    |
| 17  | Pack de 6 bt de 1 L      | 2    | 6    |
| 18  | Portion                  | 1    | -1   |
| 19  | barquette de 180 g       | 1    | 0,18 |

---

un produit à un conditionnement
	conditionnement lié par **ucid** et **qty** indique la quantité dans l'Unité de Conditionnement (UC)

on a **conditionnement** 
- id : 5 
- nom : bouteille de 0.75 L
- ucid = 2 , implique unité de conditionnement :  L
- qty indique le nombre d'unité, ici 0.75

---
### unité de Conditionnement
"I:\SE\mymarket\unitecondi.csv"
id , nom

| id  | nom   |
| --- | ----- |
| 1   | kg    |
| 2   | L     |
| 3   | pièce |
| 4   | lot   |
| 5   | m     |
| 6   | m2    |
| 7   | m3    |

---
### magasin
sera géré par 
- organisations entreprises établissements
- adresse

"I:\SE\mymarket\magasins.csv"
id , nom , cp , ville , long , lat  


| id  | nom                  | cp    | ville        | long | lat  |
| --- | -------------------- | ----- | ------------ | ---- | ---- |
| 1   | Intermarché Pendreff | 29120 | Plomeur      | 47.5 | -3.5 |
| 2   | Lidl                 | 29120 | Pont l'abbée | 47.5 | -3.5 |
| 3   | Leclerc              | 29120 | Pont l'abbée | 47.5 | -3.5 |

---
# marques
sera géré par 
- organisations entreprises établissements
- INPI si non déterminée => grp = org = null

"I:\SE\mymarket\marques.csv"
id , nom , grp , pic

| id  | nom             | grp               | pic     |
| --- | --------------- | ----------------- | ------- |
| 1   | 7up             | PepsiCo           | 7up.png |
| 2   | A&W Food        | Yum               |         |
| 3   | After Eight     | Nestlé            |         |
| 4   | Agis Industries | Agis Industries   |         |
| 5   | Agrexco         | Agrexco           |         |
| 6   | Agrofresh       |                   |         |
| 7   | Ahava           |                   |         |
| 8   | Air Fresh       | Reckitt Benckiser |         |
| 9   | Air Wick        | Reckitt Benckiser |         |
2 images seulement
"I:\VAE\OLD\ATRIER\DEV_INFO\php\PHP_MVC_SE\pic\tmp\7up.png"
"I:\VAE\OLD\ATRIER\DEV_INFO\php\PHP_MVC_SE\pic\tmp\1664.jpg"

---

## Rayon
id , nom , pid (parent id) pour hiérarchie

| id  | nom        | pid  |
| --- | ---------- | ---- |
| 1   | Multimédia | null |
| 2   | DVD        | 1    |
|     |            |      |
