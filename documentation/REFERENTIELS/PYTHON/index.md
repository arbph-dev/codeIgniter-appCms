# Syntaxe

## Objet
  
```python
class Compte:  
    def __init__(self, numero, nom, solde=0):  
        self.numero = numero  
        self.nom = nom  
        self.solde = solde  
  
    def afficher(self):  
        print(f"Compte: {self.numero} - {self.nom}, Solde: {self.solde}")

```




# Librairies

### os
- [Manipulation de fichiers](/documentation/REFERENTIELS/PYTHON/FILE/index.md)
- PyQt6
- SQLAlchemy
- Rich
- termcolor

## plugin Canvas Block : 
- [ ] documenterplugin Canvas Block #obsidian/plugin 

### Outil python

> [!note]
>  
> python -m pip install termcolor
> 
> python -m pip install pyyaml
 


> [!warning]
> 
> python -m ensurepip --upgrade
> 
> python -m pip install --upgrade pip
> 
> *Cela garantit que votre gestionnaire de paquets PIP est à jour et fonctionnel.*

# PyQt6

> [!note]
>  
> python -m pip install pyqt6
>
> pip install pyqt6

---

# SQLAlchemy

## Exemples en Python

Python + SQLAlchemy + Rich offre une solution robuste, programmable et extensible pour gérer des bases de données complexes avec un affichage console avancé, adapté aux développeurs et aux systèmes automatisés.

 
a) Modèles SQLAlchemy

```py 
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime

Base = declarative_base()

class Site(Base):
    __tablename__ = 'sites'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    location = Column(String)
    images = relationship("Image", back_populates="site")
    systems = relationship("System", back_populates="site")

class System(Base):
    __tablename__ = 'systems'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    site_id = Column(Integer, ForeignKey('sites.id'))
    site = relationship("Site", back_populates="systems")
    images = relationship("Image", back_populates="system")

class Image(Base):
    __tablename__ = 'images'
    id = Column(Integer, primary_key=True)
    filename = Column(String)
    description = Column(String)
    date_taken = Column(DateTime, default=datetime.utcnow)
    site_id = Column(Integer, ForeignKey('sites.id'))
    system_id = Column(Integer, ForeignKey('systems.id'))
    site = relationship("Site", back_populates="images")
    system = relationship("System", back_populates="images")
``` 

 

b) Création de la base et session

```py 
engine = create_engine('sqlite:///maintenance.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
``` 

c) Ajout de données exemple
```py
site1 = Site(name="Site A", location="Paris")
system1 = System(name="Pompage", site=site1)
image1 = Image(filename="siteA_pompe1.jpg", description="Pompe hydraulique", site=site1, system=system1)

session.add(site1)
session.add(system1)
session.add(image1)
session.commit()
``` 

---

# Rich

## Affichage avec Rich
```py
from rich.console import Console
from rich.table import Table

console = Console()

def display_site_images(site):
    table = Table(title=f"Images for {site.name}")
    table.add_column("Filename")
    table.add_column("Description")
    table.add_column("Date Taken")

    for img in site.images:
        table.add_row(img.filename, img.description, img.date_taken.strftime("%Y-%m-%d %H:%M:%S"))

    console.print(table)
```

### Exemple d'affichage
```py
site = session.query(Site).filter_by(name="Site A").first()
display_site_images(site)
``` 




## Menu Rich

Voici un exemple de gestion simple des interventions dans un menu console Python (à intégrer avec SQLAlchemy et Rich) :
```py
def menu_interventions(session):
    while True:
        print("\nMenu Interventions")
        print("1. Voir toutes les interventions")
        print("2. Ajouter une nouvelle intervention")
        print("3. Modifier une intervention")
        print("4. Supprimer une intervention")
        print("5. Rechercher une intervention")
        print("6. Retour au menu principal")
        choice = input("Choisissez une option : ")

        if choice == '1':
            afficher_interventions(session)
        elif choice == '2':
            ajouter_intervention(session)
        elif choice == '3':
            modifier_intervention(session)
        elif choice == '4':
            supprimer_intervention(session)
        elif choice == '5':
            rechercher_intervention(session)
        elif choice == '6':
            break
        else:
            print("Option invalide, veuillez réessayer.")
```
