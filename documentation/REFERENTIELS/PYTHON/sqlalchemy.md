## Sqlalchemy 

Oui, il est possible d'employer les dataclasses avec SQLAlchemy, notamment à partir de la version 2.0 de SQLAlchemy qui propose une intégration native des dataclasses. Cette intégration permet de définir des classes de modèles SQLAlchemy qui sont aussi des dataclasses Python, ce qui simplifie la déclaration des attributs et leur gestion.

Points clés de l'intégration dataclass avec SQLAlchemy :
SQLAlchemy 2.0 permet d'annoter une classe déclarative ORM pour qu'elle soit traitée comme une dataclass.
Cela facilite la création de classes modèles plus concises et lisibles, tout en conservant les fonctionnalités ORM.
L'intégration utilise le module typing.Annotated pour combiner les colonnes SQLAlchemy avec les champs de dataclass.
On peut ainsi bénéficier des avantages des dataclasses (comme la génération automatique de méthodes __init__, __repr__, etc.) tout en utilisant pleinement SQLAlchemy pour la gestion de la base de données.
Exemple simplifié :
from sqlalchemy.orm import registry
from sqlalchemy import Column, Integer, String
from dataclasses import dataclass
from typing import Annotated

mapper_registry = registry()

@mapper_registry.mapped
@dataclass
class User:
    __tablename__ = 'user'
    id: Annotated[int, Column(Integer, primary_key=True)]
    name: Annotated[str, Column(String(50))]
Ici, la classe User est à la fois une dataclass et un modèle SQLAlchemy.

Conclusion
L'utilisation des dataclasses avec SQLAlchemy est non seulement possible mais recommandée pour simplifier la définition des modèles dans les versions récentes de SQLAlchemy (2.0+). Cela combine la puissance de l'ORM avec la simplicité et la clarté des dataclasses Python.

## exemple 

Voici un exemple complet d'utilisation des dataclasses avec SQLAlchemy 2.0, illustrant la définition d'un modèle, la création de la base de données, l'insertion et la requête de données.

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import registry, sessionmaker
from dataclasses import dataclass
from typing import Annotated

# Création du registry pour le mapping
mapper_registry = registry()

# Définition de la classe User comme dataclass et modèle SQLAlchemy
@mapper_registry.mapped
@dataclass
class User:
    __tablename__ = 'users'  # Nom de la table dans la base de données

    # Définition des colonnes avec Annotated pour combiner dataclass et SQLAlchemy
    id: Annotated[int, Column(Integer, primary_key=True)]
    name: Annotated[str, Column(String(50))]
    age: Annotated[int, Column(Integer)]

# Configuration de la base de données SQLite en mémoire
engine = create_engine('sqlite:///:memory:', echo=True)

# Création des tables dans la base
mapper_registry.metadata.create_all(engine)

# Création d'une session pour interagir avec la base
Session = sessionmaker(bind=engine)
session = Session()

# Création d'instances User (dataclasses)
user1 = User(id=1, name='Alice', age=30)
user2 = User(id=2, name='Bob', age=25)

# Ajout des utilisateurs à la session
session.add(user1)
session.add(user2)

# Validation des changements (INSERT dans la base)
session.commit()

# Requête pour récupérer tous les utilisateurs
users = session.query(User).all()

# Affichage des utilisateurs récupérés
for user in users:
    print(user)
```

### Explications détaillées :

- La classe `User` est décorée avec `@dataclass` et `@mapper_registry.mapped` pour indiquer qu'elle est à la fois une dataclass et un modèle SQLAlchemy.
- Les attributs sont typés avec `Annotated` pour associer chaque champ à une colonne SQLAlchemy.
- La base de données utilisée est SQLite en mémoire pour la simplicité, mais vous pouvez adapter la chaîne de connexion à votre base.
- La session SQLAlchemy permet d'ajouter, valider et interroger les objets.
- L'utilisation des dataclasses permet d'avoir automatiquement un constructeur (`__init__`), une représentation (`__repr__`), et d'autres méthodes utiles sans les écrire manuellement.

Ce modèle est simple mais montre clairement comment combiner dataclasses et SQLAlchemy pour un code propre, moderne et efficace. Si vous souhaitez, je peux aussi vous montrer comment gérer des relations entre tables avec cette approche.

Suivi

Peut on ajouter une relation dynamiquement a une dataclass ? Je veux dire modifier la classe python avec une fonction comme types.methodTypes

Ajouter une relation dynamiquement à une dataclass Python, en particulier une dataclass utilisée avec SQLAlchemy, est une opération avancée mais réalisable. Cela revient à modifier la classe Python à l'exécution, par exemple en ajoutant un attribut ou une méthode, ce qui est possible en Python grâce à la nature dynamique du langage.

### Concepts clés à comprendre

1. **Modification dynamique de classes en Python**  
    Python permet d'ajouter des attributs, méthodes, ou propriétés à une classe ou à une instance à tout moment, y compris après la définition initiale. Pour les méthodes, on utilise souvent `types.MethodType` pour lier une fonction comme méthode d'une instance.
    
2. **Dataclasses et immutabilité**  
    Par défaut, les dataclasses sont des classes Python normales, donc modifiables dynamiquement. Cependant, si vous avez défini `frozen=True`, la classe devient immuable, ce qui complique la modification dynamique.
    
3. **SQLAlchemy et relations dynamiques**  
    SQLAlchemy permet de définir des relations ORM via des attributs de classe (par exemple, `relationship()`). Ces relations sont généralement définies statiquement dans la classe, mais il est possible de les ajouter dynamiquement en modifiant la classe avant ou après son utilisation.
    

---

### Exemple d'ajout dynamique d'une relation à une dataclass SQLAlchemy

Supposons que vous ayez deux dataclasses SQLAlchemy `User` et `Address` et que vous vouliez ajouter dynamiquement une relation `addresses` à `User`.

```python
from sqlalchemy.orm import relationship
import types

# Supposons que User et Address sont déjà définis comme dataclasses SQLAlchemy

def add_dynamic_relationship(cls, rel_name, target_cls, back_populates=None):
    # Création de la relation SQLAlchemy
    rel = relationship(target_cls, back_populates=back_populates)
    # Ajout dynamique de l'attribut relation à la classe
    setattr(cls, rel_name, rel)

# Exemple d'utilisation
add_dynamic_relationship(User, 'addresses', 'Address', back_populates='user')

# Si besoin, ajouter aussi la relation inverse dans Address
add_dynamic_relationship(Address, 'user', 'User', back_populates='addresses')
```

---

### Points importants

- **Avant l'utilisation de la classe** (avant la création des tables ou des sessions), il est préférable d'ajouter les relations dynamiquement pour que SQLAlchemy puisse correctement configurer le mapping.
- **Modification après création des tables** est possible mais peut être source de bugs ou incohérences.
- Les dataclasses ne bloquent pas l'ajout d'attributs dynamiques, sauf si `frozen=True`.
- Pour ajouter des méthodes dynamiquement, on peut utiliser `types.MethodType` pour lier une fonction à une instance ou à une classe.

---

### Conclusion

Oui, il est possible d'ajouter dynamiquement une relation à une dataclass SQLAlchemy en modifiant la classe Python à l'exécution, notamment en utilisant `setattr` pour ajouter un attribut relation. Cela doit être fait avec précaution, idéalement avant que SQLAlchemy ne finalise le mapping ORM.

Si vous souhaitez, je peux vous fournir un exemple complet avec définition des classes, ajout dynamique de relation, et démonstration de requêtes.

Suivi

__tablename__ est une variable définie par sqlalchemy ? Quels sont les autres, relations ?

![](https://siteicon.operacdn.com/icon?url=https://stackoverflow.com)

Sources

### `__tablename__` dans SQLAlchemy

`__tablename__` n'est pas une variable définie par SQLAlchemy en tant que telle, mais une **convention** utilisée dans les classes déclaratives ORM pour indiquer le nom de la table correspondante dans la base de données.

- C’est une **attribut de classe** que vous définissez vous-même dans votre modèle.
- SQLAlchemy utilise cette valeur pour créer ou mapper la table dans la base de données.
- Si vous ne la définissez pas explicitement, SQLAlchemy peut essayer de générer un nom de table automatiquement (selon la configuration), mais il est recommandé de la définir pour plus de clarté.

---

### Autres attributs et relations courants dans SQLAlchemy ORM

Voici une liste des attributs et concepts clés que vous pouvez définir dans une classe modèle SQLAlchemy :

|Attribut / Concept|Description|
|---|---|
|`__tablename__`|Nom de la table dans la base de données.|
|`Column`|Définit une colonne dans la table (ex: `id = Column(Integer, primary_key=True)`).|
|`relationship()`|Définit une relation entre tables (ex: `children = relationship("Child")`).|
|`__table_args__`|Arguments supplémentaires pour la table (ex: contraintes, index, schéma).|
|`__mapper_args__`|Arguments pour configurer le mapping ORM (ex: polymorphisme, ordre de chargement).|
|`primary_key=True`|Indique la clé primaire d’une colonne.|
|`ForeignKey`|Définit une clé étrangère pour une colonne.|
|`back_populates`|Utilisé dans `relationship()` pour définir la relation inverse bidirectionnelle.|
|`cascade`|Définit le comportement de cascade pour les opérations sur les relations (ex: suppression).|
|`lazy`|Contrôle le chargement des relations (ex: `lazy='select'`, `lazy='joined'`).|
|`uselist`|Indique si la relation est une liste ou un seul objet (ex: `uselist=False` pour relation 1-1).|

---

### Exemple simple avec ces attributs

```python
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Parent(Base):
    __tablename__ = 'parents'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    children = relationship("Child", back_populates="parent", cascade="all, delete-orphan")

class Child(Base):
    __tablename__ = 'children'
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('parents.id'))
    name = Column(String)
    parent = relationship("Parent", back_populates="children")
```

---

### En résumé

- `__tablename__` est une convention pour nommer la table SQL.
- Les colonnes sont définies avec `Column`.
- Les relations entre tables sont définies avec `relationship()`.
- Plusieurs autres attributs et options permettent de configurer précisément le comportement des modèles et des relations.



## Approfondissement 


Voici une explication détaillée sur l'utilisation des dataclasses avec SQLAlchemy en Python, ainsi que la manière de transformer un objet dict en deux tables distinctes avec SQLAlchemy.

### 1. Utiliser les dataclasses avec SQLAlchemy
Depuis SQLAlchemy 2.0, il y a une intégration native avec les dataclasses Python. Cela permet de définir des modèles ORM en utilisant la syntaxe des dataclasses, ce qui rend le code plus clair et plus concis.

Exemple simple d'une dataclass avec SQLAlchemy
```python
from dataclasses import dataclass
from sqlalchemy.orm import registry
from sqlalchemy import Column, Integer, String

mapper_registry = registry()

@mapper_registry.mapped
@dataclass
class User:
    __tablename__ = 'user'

    id: int = field(init=False, metadata={"sa": Column(Integer, primary_key=True)})
    name: str = field(metadata={"sa": Column(String(50))})
```
@dataclass permet de générer automatiquement le constructeur, la représentation, etc.

metadata={"sa": Column(...)} permet de définir les colonnes SQLAlchemy dans les champs de la dataclass.

mapper_registry.mapped remplace la déclaration classique de la classe ORM.

### 2. Transformer un dict en deux tables distinctes avec SQLAlchemy
Supposons que vous ayez un dict Python représentant un objet complexe que vous souhaitez répartir dans deux tables liées (par exemple, User et Address).

Exemple de dict
```python
data = {
    "name": "Alice",
    "age": 30,
    "address": {
        "street": "123 Main St",
        "city": "Paris"
    }
}
```

Modèles SQLAlchemy avec dataclasses
```python
from dataclasses import dataclass, field
from sqlalchemy.orm import registry, relationship
from sqlalchemy import Column, Integer, String, ForeignKey

mapper_registry = registry()

@mapper_registry.mapped
@dataclass
class User:
    __tablename__ = 'user'

    id: int = field(init=False, metadata={"sa": Column(Integer, primary_key=True)})
    name: str = field(metadata={"sa": Column(String(50))})
    age: int = field(metadata={"sa": Column(Integer)})
    address: "Address" = field(default=None, repr=False, compare=False)

    __sa_relationships__ = {
        "address": relationship("Address", uselist=False, back_populates="user")
    }

@mapper_registry.mapped
@dataclass
class Address:
    __tablename__ = 'address'

    id: int = field(init=False, metadata={"sa": Column(Integer, primary_key=True)})
    street: str = field(metadata={"sa": Column(String(100))})
    city: str = field(metadata={"sa": Column(String(50))})
    user_id: int = field(metadata={"sa": Column(Integer, ForeignKey('user.id'))})
    user: User = field(default=None, repr=False, compare=False)

    __sa_relationships__ = {
        "user": relationship("User", back_populates="address")
    }
```    
Conversion du dict en objets et insertion en base
```python
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

engine = create_engine('sqlite:///:memory:')
mapper_registry.metadata.create_all(engine)

session = Session(engine)

# Création des objets à partir du dict
address_obj = Address(street=data["address"]["street"], city=data["address"]["city"])
user_obj = User(name=data["name"], age=data["age"], address=address_obj)

# Lier l'adresse à l'utilisateur
address_obj.user = user_obj

# Ajouter en base
session.add(user_obj)
session.commit()
```
Résumé

Utilisez @dataclass avec SQLAlchemy 2.0 pour définir vos modèles ORM de manière concise.

Utilisez metadata={"sa": Column(...)} dans les champs dataclass pour définir les colonnes.

Pour transformer un dict en deux tables liées, créez d'abord les objets dataclass correspondants, puis liez-les via les relations SQLAlchemy.

Ajoutez ensuite l'objet principal à la session et validez la transaction.


#  Relations dans SQLAlchemy
 un aspect fondamental pour modéliser des bases de données relationnelles en Python.

Les relations dans SQLAlchemy : Explication détaillée
SQLAlchemy est un ORM (Object-Relational Mapper) qui permet de représenter les tables de bases de données sous forme de classes Python, et les relations entre ces tables sous forme d’attributs et de liens entre objets. Comprendre les relations est crucial pour modéliser correctement les données et naviguer entre les objets liés.

### 1. Types de relations principales

#### a) One-to-Many (Un-à-plusieurs)
Une entité A peut être liée à plusieurs entités B.
Exemple : Un Auteur peut avoir plusieurs Livres.
Modélisation :

La table "livre" contient une clé étrangère vers la table "auteur".

En Python, la classe Auteur aura un attribut books (liste de livres).

La classe Livre aura un attribut author (référence à un auteur).

Exemple SQLAlchemy :
```python
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Author(Base):
    __tablename__ = 'author'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    books = relationship("Book", back_populates="author")

class Book(Base):
    __tablename__ = 'book'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    author_id = Column(Integer, ForeignKey('author.id'))
    author = relationship("Author", back_populates="books")
```    
relationship() crée une liaison entre les objets Python.

back_populates permet de définir la relation dans les deux sens.

### b) One-to-One (Un-à-un)
Chaque entité A est liée à une seule entité B, et vice versa.
Exemple : Un Utilisateur a un seul Profil.
Modélisation :

La table "profil" contient une clé étrangère unique vers "utilisateur".
En SQLAlchemy, on utilise uselist=False dans la relation.
Exemple :
```python
class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    profile = relationship("Profile", uselist=False, back_populates="user")

class Profile(Base):
    __tablename__ = 'profile'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), unique=True)
    user = relationship("User", back_populates="profile")
```

#### c) Many-to-Many (Plusieurs-à-plusieurs)
Plusieurs entités A peuvent être liées à plusieurs entités B.
Exemple : Un Étudiant peut suivre plusieurs Cours, et un Cours peut avoir plusieurs Étudiants.
Modélisation :

Une table d’association (table intermédiaire) est nécessaire pour stocker les liens.
En SQLAlchemy, on définit cette table d’association explicitement.
Exemple :
```python
from sqlalchemy import Table

association_table = Table('association', Base.metadata,
    Column('student_id', Integer, ForeignKey('student.id')),
    Column('course_id', Integer, ForeignKey('course.id'))
)

class Student(Base):
    __tablename__ = 'student'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    courses = relationship("Course", secondary=association_table, back_populates="students")

class Course(Base):
    __tablename__ = 'course'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    students = relationship("Student", secondary=association_table, back_populates="courses")
```
secondary indique la table d’association.

back_populates permet la navigation dans les deux sens.

### 2. Paramètres importants de relationship()
back_populates : définit la relation inverse.

uselist : False pour One-to-One, True (par défaut) pour One-to-Many.

cascade : contrôle le comportement lors de la suppression ou de la mise à jour (ex: "all, delete-orphan").

lazy : contrôle le chargement des relations (ex: "select", "joined", "subquery", "dynamic").

secondary : pour Many-to-Many, indique la table d’association.

3. Exemple complet simple
```python
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

Base = declarative_base()

association_table = Table('association', Base.metadata,
    Column('student_id', Integer, ForeignKey('student.id')),
    Column('course_id', Integer, ForeignKey('course.id'))
)

class Student(Base):
    __tablename__ = 'student'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    courses = relationship("Course", secondary=association_table, back_populates="students")

class Course(Base):
    __tablename__ = 'course'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    students = relationship("Student", secondary=association_table, back_populates="courses")

engine = create_engine('sqlite:///:memory:')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# Création d'objets liés
student1 = Student(name="Alice")
course1 = Course(title="Mathématiques")

student1.courses.append(course1)
session.add(student1)
session.commit()
```

### 4. Conclusion
Les relations SQLAlchemy permettent de modéliser les liens entre tables de manière intuitive.

relationship() est la clé pour naviguer entre objets liés.

Comprendre les types de relations (One-to-Many, One-to-One, Many-to-Many) est essentiel pour structurer vos données.

Les paramètres de relationship() permettent d’ajuster le comportement et la performance.

---



Ce fragment de code est un extrait classique en Python (utilisant la bibliothèque Rich pour l'affichage en console) qui gère la récupération et l'affichage d'une liste paginée d'organisations depuis une API.
​Voici ce que fait chaque section de ce script :
​Information de requêtage : Il affiche dans la console l'endpoint appelé (méthode GET sur /organisation) au format gris/estompé ([dim]).
​Appel API : Il interroge la méthode org_client.list avec les paramètres de filtrage et de pagination (type_id, page, per_page).
​Gestion des réponses vides : Si l'API ne renvoie aucune donnée, il affiche un avertissement en jaune ([yellow]Aucune réponse organisation.[/]) et interrompt l'exécution avec return.
​Extraction des métadonnées : Il récupère la liste des organisations (data) ainsi que l'objet de pagination (pager).
​Affichage du bilan : Il indique combien d'organisations sont affichées sur la page courante et donne l'estimation du total d'organisations disponibles sur le serveur.
​Amélioration suggérée
​Pour rendre le code un peu plus robuste et propre, vous pouvez corriger les points suivants :
​Sensibilité à la casse : Attention à la première ligne où Console.print comporte une majuscule (Console), alors que la suite utilise console.print.
​Utilisation de .get() avec valeur par défaut : Si data n'est pas un dictionnaire (par exemple None), data.get(...) lèvera une erreur AttributeError.
​Voici une version nettoyée et sécurisée :


```python
# Correction du 'c' minuscule si console est l'instance de Rich
console.print("[dim]→ GET /organisation?type=1&page=…[/]")

data = org_client.list(type_id=1, page=page, per_page=per_page)

# Vérification si la réponse est valide et non vide
if not data or not isinstance(data, dict):
    console.print("[yellow]Aucune réponse organisation.[/]")
    return

orgs = data.get("data") or []
pager = data.get("pager") or {}
total_server = pager.get("total", len(orgs))

console.print(
    f"[dim]  {len(orgs)} org(s) sur cette page (total serveur ≈ {total_server})[/]"
)

```


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
