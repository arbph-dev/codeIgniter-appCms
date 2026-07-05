
## Evolution

- article
liers les caractèrisituqes aux type
a rapprocher des produits

- caracteristique
a definir comme des grandeurs ?


### organisations
à lier avec organisation / entreprise mais surtout etablissements
Un client peut posséder plusieurs etablissements, le simmobilisations sont propres aux établissmeents

- clients
lien clients organisations

- fournisseur / manufact
a rapprocher des organisations 
on utilise les codes ape/naf soit on crée une table pivot
[fournisseur](/documentation/METIERS/MAINTENANCE/fournisseur.md)
[manufact](/documentation/METIERS/MAINTENANCE/manufact.md)









images

## Stock
	suivi achats :



### article 
liers les **caracteristique** aux **articletype**

[article](/documentation/METIERS/MAINTENANCE/article.md)
[articlecaracteristique](/documentation/METIERS/MAINTENANCE/articlecaracteristique.md)
[articlefournisseur](/documentation/METIERS/MAINTENANCE/articlefournisseur.md)
[articleprix](/documentation/METIERS/MAINTENANCE/articleprix.md)
[articletype](/documentation/METIERS/MAINTENANCE/articletype.md)



---
## caracteristique 
[caracteristique](/documentation/METIERS/MAINTENANCE/caracteristique.md)
voir grandeurs
liers les caractèrisitques aux types : **articletype** et **typeeqp**


## equipements



### système
[equipement](/documentation/METIERS/MAINTENANCE/equipement.md)
[typeeqp](/documentation/METIERS/MAINTENANCE/typeeqp.md)
[equipementcaracteristique](/documentation/METIERS/MAINTENANCE/equipementcaracteristique.md)
a relier au type
[compteur](/documentation/METIERS/MAINTENANCE/compteur.md)
transformer en mesures, proposer depuis le type et les caracteriques
compteur saisie par maintenance ou production pour indicateurs
[equipementreglementaire](/documentation/METIERS/MAINTENANCE/equipementreglementaire.md)
selon le type et les caracteristiques 
exemple 
SDI un controle annule Q1
Reseau BT , inspection annuelle
PV pour un reservoir sous pression

localisation, hiérachie, etablissment, atelier, ligne


### qualité / documentation
[document](/documentation/METIERS/MAINTENANCE/document.md)
[documentobjet](/documentation/METIERS/MAINTENANCE/documentobjet.md)
Table polymorphe.

### qualité / réglementation
[obligationreglementaire](/documentation/METIERS/MAINTENANCE/obligationreglementaire.md)
lié a [equipementreglementaire](/documentation/METIERS/MAINTENANCE/equipementreglementaire.md)


## Maintenance

Une intervention peut etre préventive ou curative voir **interventiontype**
Pour  une intervention curative on doit gérer le demandeur, l'equipement , les dates de demande et cloture
Pour  une intervention préventive ,le demandeur est la gamme / equipements , les dates sont déteminés depuis la fréquence en mois ou en heure
les intervention préventives sont déclenches meme si les autres sont en retard on dit gérer un délai de prevenance pour des commandes 

Une intervention peut 
consommer plusieurs articles.
mobiliser plusieurs personnes et compétences
etre réalise selon un contrat, un devis 

Les gammes ont des instances que l'on nomme **OT** pour Ordre de Tavail
Les instructions des gammes correspondent sont réalisées dans le cadre d'un **OT**, on les nomment **BT** pour bulletins de travail

[intervention](/documentation/METIERS/MAINTENANCE/intervention.md)
[interventionarticle](/documentation/METIERS/MAINTENANCE/interventionarticle.md)
[interventiontype](/documentation/METIERS/MAINTENANCE/interventiontype.md)
[cnssec](/documentation/METIERS/MAINTENANCE/cnssec.md)





### qualité / traçabilité
[planmaintenance](/documentation/METIERS/MAINTENANCE/planmaintenance.md)
contient les gammes, les gammes sont composés d'instructions et de consignes de sécurités
les **gammesequipements** seront affectes ou proposées selon les **types** et **caracteristique** des equipmeents mais aussi des articles qui les composent et du type d'**etablissement**

une Centrale de Traitment d'Air (CTA) dispose d'un détecteur incendie, il sera vérifié lors du controle du SDI  
Pour cela on aura une gamme pour le SDI avec des instructions qui seront liés a des equipements

La gamme SDI comporterait des instructions.
1. Mettre le SDI en mode essai, prévenir la télésurveillance et l'exploitant
2. controler les déclencheurs manuels, vérifier le libellé pour chaque déclencheurs manuels
3. controler les détecteurs, vérifier le libellé pour chaque détecteurs
4. controler le détecteur dans la CTA, sur le toit avec la bouteille de gaz. vérifier le libellé
5. Redisposer le SDI. Viser le registre de sécurité
6. Faire le rapport à l'exploitant
7. Rédiger le rapport, le transmettre

Un OT contient au minimum un BT, la date de début de l'OT se détermine depuis les **BT**
La date de fin est déduite du dernier BT, lors de la cloture manuelle la date peut être modifié
OT et BT peuvent réquerir une signature et faire l'objet de documentation procès verbal, rapport

- [ ] Séparer le plan en gamme et  instructions , gestion de kit de pièce







## Gestion
- devis
- commande
- facture


### Référentiels
- comptespcg

### Patrimoine
- inventaire comptable,
- suivi des amortissements,
- budget prévisionnel,
- [immobilisation](/documentation/METIERS/MAINTENANCE/immobilisation.md)
a gérer dans une table **etablissements_immobilisations**

### Investissements
- plan pluriannuel d'investissement,
- aide au renouvellement des équipements,
/documentation/METIERS/MAINTENANCE/planinvestissement.md


### contrat
deux catégorie fourni ou souscrit
type : fourniture de materiel et prestations, réglementaire
reconduction, tacite ,echeance ,date anniversiare, durée, préavis


