---

La fonction `isinstance()` est une fonction native (_built-in_) de **Python**. Elle fait partie du cœur du langage depuis ses premières versions (présente dès Python 1.0).

**Origine du nom** Son nom vient de la contraction de deux mots anglais : **"is"** (est) et **"instance"** (une instance / un objet). Elle permet de vérifier si un objet est une instance d'une classe donnée ou d'une sous-classe de celle-ci.

**Fonctionnement de base** Elle prend deux arguments principaux :

- L'objet à tester
- La classe (ou un tuple de classes) de référence

# Exemple
```python
nom = "Alice"

isinstance(nom, str)  # Renvoie True car 'nom' est une chaîne de caractères
isinstance(nom, int)  # Renvoie False
```

**Pourquoi l'utiliser ?** En Python, le typage est dynamique.

`isinstance()` est privilégié par rapport à `type(obj) == Classe` car il prend en compte **l'héritage** (si une classe hérite d'une autre, `isinstance` renverra `True` pour la classe parente).



---


Oui. isinstance() fonctionne exactement de la même manière avec vos propres classes et avec les @dataclass.
Voici comment l'utiliser :
```python
from dataclasses import dataclass

# Classe personnalisée classique
class Vehicule:
    pass

# Dataclass
@dataclass
class Utilisateur:
    nom: str
    age: int


# Instanciation
v = Vehicule()
u = Utilisateur(nom="Alice", age=30)

# Vérifications
print(isinstance(v, Vehicule))  # True
print(isinstance(u, Utilisateur))  # True
```

Point clé avec l'héritage :
Si une classe (ou dataclass) hérite d'une autre, isinstance() renvoie True aussi bien pour la classe enfant que pour la classe parente.
```python
class Voiture(Vehicule):
    pass


ma_voiture = Voiture()

print(isinstance(ma_voiture, Voiture))  # True
print(isinstance(ma_voiture, Vehicule))  # True
```

Veux-tu voir comment l'utiliser avec des types génériques comme Union ou Optional de la bibliothèque typing ?

---


En Python, plusieurs fonctions natives (built-ins) permettent d'inspecter, d'obtenir ou de modifier les propriétés et la structure des objets.
On peut les regrouper selon ce qu'elles permettent de faire.
1. Inspection et vérification
Ces fonctions permettent de vérifier la nature ou le contenu d'un objet.
 * type(obj) : Renvoie le type exact de l'objet (contrairement à isinstance, il ne prend pas en compte l'héritage).
 * issubclass(ClasseEnfant, ClasseParente) : Vérifie si une classe hérite d'une autre.
 * callable(obj) : Renvoie True si l'objet peut être appelé comme une fonction (ex: fonctions, méthodes, classes).
 * dir(obj) : Renvoie la liste de tous les attributs et méthodes accessibles sur l'objet.
 * id(obj) : Renvoie l'identifiant unique de l'objet en mémoire.
2. Lecture et modification des attributs
Ces fonctions permettent de lire, créer, modifier ou supprimer des attributs dynamique sur un objet.
 * getattr(obj, "nom_attribut" [, valeur_par_defaut]) : Récupère la valeur d'un attribut par son nom sous forme de chaîne.
 * setattr(obj, "nom_attribut", valeur) : Crée ou modifie la valeur d'un attribut.
 * hasattr(obj, "nom_attribut") : Vérifie si un attribut existe sur l'objet.
 * delattr(obj, "nom_attribut") : Supprime un attribut de l'objet.
```python
class Personne:
    nom = "Alice"


p = Personne()

# Lecture dynamique
print(getattr(p, "nom"))  # "Alice"

# Modification dynamique
setattr(p, "age", 25)
print(p.age)  # 25

# Verification et suppression
if hasattr(p, "age"):
    delattr(p, "age")
```

3. Modificateurs de comportement d'objets
 * vars(obj) : Renvoie le dictionnaire __dict__ de l'objet (contient tous ses attributs d'instance). Si vous modifiez ce dictionnaire, vous modifiez directement les attributs de l'objet.
 * id() / hash() : hash(obj) renvoie l'empreinte numérique de l'objet (s'il est immuable), utilisée dans les dictionnaires et ensembles.

4. Conversion et instanciation dynamique
 * isinstance vs type : type(nom_classe, bases, dict) avec 3 arguments permet de créer dynamiquement une nouvelle classe à l'exécution.

```python
# Création d'une classe 'Chien' à la volée avec type()
Chien = type("Chien", (), {"aboyer": lambda self: "Ouaf !"})

mon_chien = Chien()
print(mon_chien.aboyer())  # "Ouaf !"

```
---

 * callable(attr) vérifie si un attribut peut être appelé (comme une méthode ou une fonction). Si callable() renvoie True, c'est donc une méthode (ou une fonction), pas une propriété.
 * Une propriété (définie avec @property) contient une valeur calculée ou protégée. Quand tu y accèdes, elle renvoie directement sa valeur : elle n'est donc pas callable.

La méthode standard : getattr() + callable()
Pour distinguer les propriétés/attributs des méthodes dans un objet, on parcourt dir() :
```python
class Exemple:
    def __init__(self):
        self.attribut_simple = 42

    @property
    def ma_propriete(self):
        return "valeur"

    def ma_methode(self):
        return "bonjour"


obj = Exemple()

attributs_et_proprietes = []
methodes = []

for nom in dir(obj):
    if nom.startswith("__"):  # On ignore les méthodes spéciales
        continue

    valeur = getattr(obj, nom)

    if callable(valeur):
        methodes.append(nom)
    else:
        attributs_et_proprietes.append(nom)

print("Méthodes :", methodes)
# Output: ['ma_methode']

print("Attributs / Propriétés :", attributs_et_proprietes)
# Output: ['attribut_simple', 'ma_propriete']
```
Pour cibler uniquement les @property
Si tu veux vraiment séparer une @property d'un attribut classique (comme self.attribut_simple), il faut inspecter la classe elle-même et non l'instance, en utilisant le module inspect :
```python
import inspect

# Inspecte la classe (Exemple) et non l'instance (obj)
proprietes = [
    nom
    for nom, valeur in inspect.getmembers(Exemple)
    if isinstance(valeur, property)
]

print(proprietes)
# Output: ['ma_propriete']
```

----


Le module `inspect` permet de consulter le code source, d'analyser les signatures de fonctions, et de récupérer les membres d'une classe de manière dynamique.

### 1. Lister les membres d'une classe (`inspect.getmembers`)

`inspect.getmembers()` prend une classe en argument et renvoie une liste de tuples `(nom_membre, valeur)`. Vous pouvez utiliser le paramètre `predicate` pour filtrer les résultats (méthodes, attributs, etc.).
```python
import inspect


class Employer:
    def __init__(self, nom: str):
        self.nom = nom

    @property
    def role(self) -> str:
        return "Employé"

    def travailler(self):
        return "En cours..."


# 1. Obtenir TOUS les membres
tous_les_membres = inspect.getmembers(Employer)

# 2. Obtenir uniquement les méthodes de la classe
methodes = inspect.getmembers(Employer, predicate=inspect.isfunction)
print("Méthodes :", [m[0] for m in methodes])
# Output: ['__init__', 'travailler']

# 3. Obtenir uniquement les @property
properties = inspect.getmembers(
    Employer, predicate=lambda m: isinstance(m, property)
)
print("Propriétés :", [p[0] for p in properties])
# Output: ['role']
```

### 2. Examiner la signature d'une méthode (`inspect.signature`)

Pour connaître les paramètres requis par un `__init__` ou n'importe quelle méthode d'une classe, vous utilisez `inspect.signature()`.
```python
sig = inspect.signature(Employer.__init__)

print("Signature :", sig)
# Output: (self, nom: str)

# Parcourir les paramètres
for param in sig.parameters.values():
    print(f"Paramètre: {param.name}, Type: {param.annotation}")
```
### 3. Lire le code source (`inspect.getsource`)

`inspect.getsource()` permet de récupérer directement le code source d'une classe sous forme de chaîne de caractères.

# Affiche l'implémentation exacte de la classe
print(inspect.getsource(Employer))

### Résumé des fonctions clés pour les classes

|Fonction|Rôle principal|
|---|---|
|`inspect.getmembers(cls, predicate=...)`|Liste les attributs, méthodes ou propriétés d'une classe.|
|`inspect.signature(cls.methode)`|Extrait la signature (arguments, types, valeurs par défaut).|
|`inspect.isclass(obj)`|Vérifie si un objet est une classe.|
|`inspect.getsource(cls)`|Renvoie le code source de la classe.|
|`inspect.getmro(cls)`|Renvoie l'ordre de résolution des méthodes (MRO) en cas d'héritage.|

----

Pour aller au-delà de la fonction native `type()` et manipuler dynamiquement des objets ou des classes, trois modules principaux de la bibliothèque standard de Python sont particulièrement utiles :

### 1. Le module `dataclasses` (avec `make_dataclass`)

Si l'objectif est de créer dynamiquement des classes de données sans passer par la syntaxe un peu brute de `type()`, le module nativement intégré `dataclasses` propose la fonction `make_dataclass`.
```python
from dataclasses import make_dataclass

# Création dynamique d'une classe Utilisateur
Utilisateur = make_dataclass(
    "Utilisateur", [("nom", str), ("age", int), ("role", str, "Invité")]
)

# Instanciation
u = Utilisateur(nom="Alice", age=30)
print(u)
# Output: Utilisateur(nom='Alice', age=30, role='Invité')
```

### 2. Le module `types`

Le module `types` fournit des utilitaires pour instancier dynamiquement des composants plus complexes, comme injecter dynamiquement une méthode dans un objet spécifique sans modifier sa classe globale.

- `**types.new_class()**` : Une alternative plus propre et robuste à `type()` pour créer dynamiquement une classe (notamment si vous gérez des métaclasses).
- `**types.MethodType**` : Permet de lier à la volée une fonction à une instance précise d'un objet.
```python
import types


class Chien:

    def __init__(self, nom):
        self.nom = nom


# Fonction autonome
def aboyer(self):
    return f"{self.nom} fait Ouaf !"


médor = Chien("Médor")

# Attachement dynamique de la méthode uniquement à l'instance 'médor'
médor.aboyer = types.MethodType(aboyer, médor)

print(médor.aboyer())  # Output: Médor fait Ouaf !
```

### 3. Le module `collections` (avec `namedtuple`)

Pour créer dynamiquement une structure de classe légère et immuable (basée sur les tuples), `namedtuple` dans le module `collections` permet de générer des types de données à la volée.
```python
from collections import namedtuple

# Création dynamique du type 'Point'
Point = namedtuple("Point", ["x", "y"])

p = Point(x=10, y=20)
print(p.x, p.y)  # Output: 10 20
```

### Résumé des usages

- `**type()**` : Pour la création brute de classes basiques à la volée.
- `**make_dataclass**` : Idéal pour créer dynamiquement des structures de données typées avec une méthode `__repr__` et des égalités déjà gérées.
- `**types.MethodType**` : Utile pour modifier le comportement d'un objet spécifique à l'exécution.
