# Migration 004 — constantes_physiques

C'est une petite table (une vingtaine de lignes au départ), mais elle jouera un rôle central dans le futur moteur de calcul (π, g, Cp, R, etc.). 



# Une constante physique est... une caractéristique d'une grandeur

Prenons quelques exemples :

|Constante|Grandeur|Unité|
|---|---|---|
|π|Sans dimension|-|
|g|Accélération|m/s²|
|c|Vitesse|m/s|
|Cp eau|Capacité thermique massique|J/(kg·K)|
|R air|Constante des gaz|J/(kg·K)|

Je me suis aperçu que nos constantes auront, elles aussi :

- une grandeur physique ;
- une unité ;
- une valeur.

Autrement dit, nous retrouvons exactement le même triplet que pour une caractéristique.

---

# Je proposerais donc cette structure

```
constantes_physiques

id

code

nom

grandeur_physique_id

unite_id

valeur

notation

description

ordre_affichage

created_at
updated_at
deleted_at
```

Tu remarqueras que cette table est très proche de ce que sera plus tard `objet_caracteristiques`.

Je pense que c'est une bonne chose : cela signifie que notre modèle converge.

---

# Une autre réflexion

Je pense que le nom :

```
constantes_physiques
```

est un peu restrictif.

Certaines constantes ne sont pas physiques.

Par exemple :

- π
- e
- √2

Ce sont des constantes mathématiques.

D'autres sont conventionnelles.

Je proposerais donc :

```
constantes
```

avec un champ :

```
categorie
```

Exemple :

|Catégorie|Exemples|
|---|---|
|MATHEMATIQUE|π, e|
|PHYSIQUE|g, c|
|THERMODYNAMIQUE|Cp, Cv|
|ELECTRICITE|μ0, ε0|
|CHIMIE|R|

Le référentiel devient beaucoup plus riche.


**stocker les constantes dans leur unité de référence**.
Cela évitera toute ambiguïté lors des calculs.

Par exemple :

g = 9.80665 m/s²
Cp eau = 4186 J/(kg·K)
R = 8.314462618 J/(mol·K)

Le moteur de calcul travaillera toujours avec ces valeurs de référence.



