# grandeurs physiques


## Note

- unite_defaut_id
Evolution : supprimer **unite_defaut_id** et laisser ce choix à une future table : unites_preferences
supprimer 
  - unite_defaut_id BIGINT UNSIGNED NOT NULL
  - CONSTRAINT fk_grandeurs_physiques__unites ...
  - CREATE INDEX idx_grandeurs_physiques__unite ...

- symbole :
  - remplacer **symbole** par **notation** VARCHAR(16) NULL COMMENT 'Notation scientifique',
  - limité à 16 caractères, voir notation VARCHAR(32)


- est_calculable : boolean
pourrait être remplacé une table de stratégies de production

- alias VARCHAR(255) ; a voir

## table : grandeurs_physiques
- id
- dimension_id
- unite_defaut_id *voir note
- nom
- description

### Index
- PK(id)
- FK(dimension_id)
- FK(unite_defaut_id)
- UNIQUE(nom)

## Seeder
Quelques grandeurs.
- Longueur
- Hauteur
- Largeur
- Diamètre
- Température
- Température entrée
- Température sortie
- Pression
- Débit
- Puissance électrique
- Puissance thermique
- Consommation
- Tension
- Intensité


---


# Synthèse

---

# Objectif

La table `grandeurs_physiques` constitue le référentiel des propriétés physiques manipulées par le CMS.

Une grandeur physique est indépendante :
- des équipements ;
- des clients ;
- des modules métier ;
- des unités d'affichage.

Elle représente un concept physique stable (Longueur, Température, Pression, Débit, Énergie, etc.).

---

# Décisions retenues

## D-001 – Référentiel indépendant

Le référentiel est indépendant des modules métier (GMAO, GTB, BIM, Énergétique, IoT...).

---

## D-002 – Une grandeur est indépendante de son unité

Le champ `unite_defaut_id` a été supprimé.

Une grandeur peut être exprimée dans plusieurs unités.

Le choix de l'unité appartient au contexte d'utilisation et sera traité ultérieurement par le référentiel des préférences d'affichage.

---

## D-003 – Notation scientifique

Le champ :

```
symbole
```

est remplacé par :

```
notation
```

Cette terminologie couvre les notations scientifiques simples ou complexes.

Exemples :

|Grandeur|Notation|
|---|---|
|Longueur|L|
|Température|T|
|Différence de température|ΔT|
|Débit|Q|
|Pression|P|
|Facteur de puissance|cos φ|

---

## D-004 – Utilisation des codes fonctionnels

Tous les référentiels utilisent un champ `code`.

Les codes sont :
- uniques ;
- stables ;
- indépendants de la langue.
    

Ils sont utilisés par :
- les seeders ;
- les API ;
- les services ;
- les scripts SQL.
    

---

## D-005 – Référentiel minimal

La première version ne contient que les grandeurs physiques les plus courantes.

Le référentiel pourra être enrichi sans modification du modèle.

---

# Évolutions envisagées

## E-001 – Préférences d'unités

Créer une table :

```
unites_preferences
```

afin de définir l'unité d'affichage selon le contexte :
- SI ;
- Technique ;
- Client ;
- Utilisateur.
    

---

## E-002 – Modes de production

Remplacer le booléen :

```
est_calculable
```

par une stratégie plus expressive.

Exemples :
- Mesurée
- Calculée
- Mesurée ou calculée
- Estimée
   

---

## E-003 – Alias

Ajouter un champ :

```
alias
```

afin de gérer les synonymes métier.

Exemples :
- Débit
- Flow
- Débit volumique
- Débit d'air

---

## E-004 – Bibliothèque scientifique

Étudier l'intégration d'une bibliothèque permettant :

- les conversions complexes ;
    
- l'analyse dimensionnelle ;
    
- les constantes physiques.
    

Cette évolution reste optionnelle.

---

## E-005 – Grandeurs dérivées

Le référentiel pourra accueillir ultérieurement :

- Vitesse
    
- Accélération
    
- Couple
    
- Résistance électrique
    
- Fréquence
    
- Densité
    
- Viscosité
    
- Conductivité
    
- Rendement
    
- Facteur de puissance
    

sans évolution du schéma relationnel.

---

## E-006 – Validation métier

Ajouter un service chargé de vérifier automatiquement :

- la cohérence des dimensions ;
    
- la compatibilité des unités ;
    
- les conversions possibles.
    

---

# Architecture retenue

Le référentiel métrologique est organisé selon la hiérarchie suivante :

```
Dimensions
        │
        ▼
Unités
        │
        ▼
Grandeurs physiques
        │
        ▼
Caractéristiques
        │
        ▼
Valeurs
```

Chaque niveau possède une responsabilité unique.


