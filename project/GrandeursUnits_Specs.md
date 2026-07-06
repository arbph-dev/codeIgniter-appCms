Voici la version que je considérerais comme une spécification fonctionnelle et technique V1.0, suffisamment générique pour servir de base au développement dans ton CMS/GMAO.

Spécifications du module « Grandeurs physiques, unités et calculs »
1. Objet

Le module a pour objectif de gérer les grandeurs physiques utilisées dans le CMS/GMAO.

Il doit permettre :

de décrire les unités physiques ;
de convertir automatiquement les unités d'une même dimension physique ;
d'associer des caractéristiques physiques à tout objet métier (équipement, composant, capteur, moteur, pompe, etc.) ;
de calculer automatiquement certaines grandeurs à partir d'autres au moyen de formules paramétrables.

Le module est totalement générique et ne dépend d'aucun type d'équipement particulier.

2. Architecture générale

Le module est composé de quatre sous-domaines indépendants :

Référentiel des dimensions physiques
Référentiel des unités
Gestion des caractéristiques physiques
Moteur de calcul des grandeurs

Cette séparation garantit l'extensibilité du système.

3. Dimensions physiques

Une dimension représente une famille de grandeurs compatibles entre elles.

Exemples :

Dimension	Symbole
Longueur	L
Temps	T
Masse	M
Température	Θ
Courant électrique	I
Puissance	P
Énergie	E
Pression	Pr

Une dimension possède une unité de référence.

Exemple :

Dimension	Unité de référence
Longueur	mètre
Température	kelvin
Puissance	watt
4. Table dimensions
Champ	Description
id	PK
nom	Nom de la dimension
symbole	Notation scientifique
unite_reference_id	FK vers unités
5. Table unites

Décrit toutes les unités physiques.

Champs
Champ	Description
id	PK
dimension_id	FK dimensions
nom	Nom complet
symbole	Symbole scientifique
facteur	Coefficient vers l'unité de référence
offset	Décalage éventuel

Exemples :

Nom	Symbole	Facteur	Offset
millimètre	mm	0.001	0
mètre	m	1	0
kilomètre	km	1000	0
°C	°C	1	273.15
kelvin	K	1	0
kW	kW	1000	0

Les conversions simples utilisent uniquement :

valeur_reference = valeur × facteur + offset

Aucune formule spécifique n'est nécessaire.

6. Table grandeurs_physiques

Une grandeur représente une propriété mesurable.

Exemples :

longueur
hauteur
diamètre
température
tension
puissance électrique
débit
pression
Champs
Champ	Description
id	PK
nom	
description	
dimension_id	FK dimensions
unite_defaut_id	FK unités

Plusieurs grandeurs peuvent partager la même dimension.

Exemple :

longueur
largeur
profondeur

appartiennent toutes à la dimension Longueur.

7. Table caracteristiques

Associe une grandeur physique à n'importe quel objet du CMS.

Champs
Champ	Description
id	PK
objet_type	Type générique
objet_id	Identifiant
grandeur_physique_id	FK
role	Rôle métier éventuel
origine	SAISIE, MESURE, CALCUL
valeur	
unite_id	FK unités

Le couple

objet_type
objet_id

permet d'associer des caractéristiques à tout objet métier.

Exemples :

équipement
moteur
pompe
compresseur
capteur
local
réseau
8. Origine des données

Une caractéristique peut provenir :

Code	Description
SAISIE	Valeur saisie par un utilisateur
MESURE	Valeur provenant d'un capteur
CALCUL	Valeur calculée automatiquement
ESTIMATION	Valeur estimée
9. Rôle d'une caractéristique

Le champ role permet de distinguer plusieurs valeurs d'une même grandeur.

Exemples :

aspiration
refoulement
entrée
sortie
primaire
secondaire
nominal
maximal
minimal
10. Constantes physiques
Table constantes_physiques

Permet d'utiliser des constantes dans les calculs.

Champ	Description
id	PK
nom	
symbole	
valeur	
unite_id	

Exemples :

π
gravité terrestre
chaleur massique de l'eau
constante des gaz parfaits
11. Calculs physiques

Le module distingue clairement :

une conversion d'unité ;
un calcul physique.

Une formule peut calculer une grandeur à partir de plusieurs autres.

Exemple :

Puissance = Tension × Intensité
12. Table calculs_physiques
Champ	Description
id	PK
grandeur_resultat_id	FK
nom	
description	
expression	Expression mathématique
version	
date_debut	
date_fin	
actif	
13. Table calculs_physiques_entrees

Décrit les variables nécessaires au calcul.

Champ	Description
id	PK
calcul_physique_id	FK
grandeur_physique_id	FK
variable	Nom interne
role	Rôle métier

Exemple :

Variable	Grandeur	Rôle
U	Tension	alimentation
I	Intensité	ligne
cosphi	Facteur de puissance	nominal
14. Expressions mathématiques

Les expressions sont stockées sous forme textuelle.

Exemple :

U * I * cosphi

ou

debit * cp * (T2 - T1)

Le moteur remplace automatiquement les variables par les valeurs disponibles.

15. Sécurité

Le moteur ne doit jamais utiliser :

eval()

Les expressions seront interprétées au moyen :

d'un parseur dédié ;
ou d'une bibliothèque d'expressions mathématiques.

Les seules opérations autorisées sont :

+
-
*
/
%
^
()

Les fonctions mathématiques pourront être progressivement ajoutées :

sqrt()

pow()

sin()

cos()

tan()

ln()

log()

exp()

abs()
16. Fonctionnement du moteur

Pour produire une grandeur :

recherche des caractéristiques disponibles ;
conversion éventuelle dans les unités de référence ;
recherche des calculs capables de produire la grandeur ;
vérification des données disponibles ;
exécution de la formule ;
création éventuelle d'une nouvelle caractéristique d'origine CALCUL.
17. Graphe de dépendances

Chaque calcul représente une relation :

Grandeurs d'entrée
        │
        ▼
Formule
        │
        ▼
Grandeur résultat

L'ensemble des calculs constitue un graphe orienté.

Le moteur pourra rechercher automatiquement une chaîne de calculs permettant d'obtenir une grandeur demandée.

Exemple :

Débit
        │
        ▼
Puissance thermique
        │
        ▼
Énergie
        │
        ▼
Coût annuel

Cette architecture permet d'ajouter de nouveaux calculs sans modifier le code PHP.

18. Service PHP

Le module exposera un service unique :

ConversionService

Responsabilités :

convertir une valeur d'une unité vers une autre ;
normaliser les unités ;
résoudre les dépendances entre calculs ;
exécuter les expressions mathématiques ;
retourner le résultat dans l'unité demandée.

Les modèles CodeIgniter restent responsables des accès aux tables (dimensions, unites, grandeurs_physiques, caracteristiques, calculs_physiques, etc.), tandis que ConversionService orchestre les conversions et les calculs.

19. Évolutions prévues

Le modèle est conçu pour accueillir sans modification majeure :

des unités personnalisées par client ;
des bibliothèques de formules métier (CVC, hydraulique, électricité, pneumatique, thermique) ;
des calculs récursifs et chaînés ;
l'intégration de données issues de capteurs IoT ;
le calcul d'indicateurs de performance (rendement, COP, consommation, coût, émissions de CO₂) ;
l'utilisation par d'autres modules du CMS (BIM, maintenance préventive, supervision, énergétique, etc.).
Conclusion

Cette conception sépare clairement le référentiel métrologique (dimensions, unités, grandeurs), le modèle métier (caractéristiques des objets) et le moteur de calcul. Elle offre une base pérenne, extensible et indépendante des domaines techniques spécifiques (électricité, mécanique, hydraulique, thermique), tout en restant cohérente avec l'architecture générique du CMS basé sur CodeIgniter et MySQL.
