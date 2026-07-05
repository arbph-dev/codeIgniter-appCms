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
