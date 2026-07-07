**`009_objet_caracteristiques` n'est pas une table de mesures, c'est une table de spécifications techniques**.

Je formaliserais donc les décisions suivantes.

---

# D-009-001 — Valeurs de référence constructeur

`objet_caracteristiques` ne contient **jamais** des mesures d'exploitation.

Elle contient uniquement :

- les caractéristiques constructeur ;
- les valeurs de référence ;
- les valeurs calculées à partir des données constructeur.

Exemples :

- Puissance utile : 7,5 kW
- Tension : 400 V
- Intensité : 15,2 A
- Rendement calculé : 91 %
- Temps maximal d'amorçage : 15 min

Les mesures réelles appartiendront à un futur module (`historique_mesures`, `relevés`, `supervision`, etc.).

---

# D-009-002 — Les caractéristiques calculées sont autorisées

C'est une excellente décision.

Prenons ton exemple :

Plaque constructeur :

```
Pu = 7,5 kWU  = 400 VI  = 15 A
```

Le système peut calculer automatiquement :

```
Pa = U × I × √3 × cosφη = Pu / Pa
```

Ces résultats deviennent eux aussi des **caractéristiques de référence**.

Elles ne sont pas des mesures.

Elles enrichissent la connaissance de l'équipement.

Je trouve cette approche très élégante.

---

# D-009-003 — Le rôle devient indispensable

Je proposerais le champ :

```
role VARCHAR(64) NULL
```

Exemples :

|Caractéristique|Rôle|
|---|---|
|Pression|Entrée|
|Pression|Sortie|
|Température|Aller|
|Température|Retour|
|Tension|Alimentation|
|Tension|Commande|
|Débit|Nominal|
|Débit|Maximum|

Ainsi, une même caractéristique peut être utilisée plusieurs fois sur un même équipement, sans créer plusieurs définitions dans le catalogue.

---

# D-009-004 — Une valeur polymorphe

Tu confirmes un point que je pressentais.

Toutes les caractéristiques ne sont pas numériques.

Je proposerais donc une structure inspirée des modèles de métadonnées, avec **une seule colonne renseignée selon le type**.

|Colonne|Usage|
|---|---|
|`valeur_decimal`|Grandeurs physiques|
|`valeur_texte`|IP55, Classe F|
|`valeur_booleen`|Oui / Non|
|`valeur_date`|Date constructeur|

C'est simple à exploiter et cela évite de multiplier les tables.

---

# D-009-005 — `structure_type` / `structure_id`

Je préfère également cette terminologie.

`structure` est plus large qu'`objet`.

On pourra viser :

- équipement ;
- sous-équipement ;
- composant ;
- local ;
- bâtiment ;
- installation ;
- réseau.

Sans changer le modèle.

---

# Une évolution qui me paraît très intéressante

En lisant ton exemple de la pompe, j'ai réalisé qu'il manque peut-être une information.

Prenons :

```
Temps d'amorçage = 15 min
```

Cette valeur n'est pas seulement une référence.

C'est aussi une **limite**.

De même :

```
Température maximale = 80°CPression maximale = 10 barIntensité nominale = 15 AIntensité maximale = 18 A
```

Je me demande si `caracteristiques` ne devrait pas intégrer une **nature** ou un **usage**.

Par exemple :

|Nature|Exemple|
|---|---|
|NOMINALE|Débit nominal|
|MINIMALE|Pression minimale|
|MAXIMALE|Température maximale|
|CONSIGNE|Température de consigne|
|CALCULEE|Rendement|
|CONSTRUCTEUR|Puissance utile|

Je ne créerais pas de table supplémentaire. Un simple `VARCHAR(32)` suffirait.

Cela rendrait le catalogue beaucoup plus expressif et faciliterait, plus tard, les comparaisons avec les mesures.

---

## Une dernière réflexion

Ton exemple de la pompe confirme une intuition que j'avais depuis quelques migrations :

Le module que nous construisons n'est pas seulement un référentiel d'unités ou de formules. Il devient progressivement un **référentiel technique** sur lequel pourront s'appuyer :

- la GMAO ;
- les procédures de maintenance ;
- les campagnes de mesures ;
- les diagnostics ;
- les calculs de performance ;
- les tableaux de bord.

C'est une orientation que je trouve très saine. Chaque table que nous avons conçue (`dimensions`, `unites`, `grandeurs_physiques`, `constantes`, `formules_physiques`, `caracteristiques`) reste générique et réutilisable, tandis que `objet_caracteristiques` fait le lien avec les équipements réels. Cette séparation entre **connaissance technique** et **données d'exploitation** me paraît être l'un des points forts de l'architecture que nous sommes en train de construire.
