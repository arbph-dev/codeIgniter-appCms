# WorkbenchDefinition

## Objectif

Le **Workbench** est l'environnement de travail standard de Zealot.

Il fournit une interface permettant de consulter, créer, modifier et analyser des données en s'appuyant sur les composants du CMS, les API métier et les ressources du système.

Le Workbench constitue l'interface de référence aussi bien pour l'administration que pour les futures interfaces utilisateur.

---

# Principes

Un Workbench :

* possède son propre cycle de vie ;
* orchestre les composants graphiques ;
* dialogue avec le backend via les API ;
* publie et consomme des événements ;
* reste indépendant des composants métier.

Il ne contient aucune logique métier.

---

# Cycle de vie

```
constructor()

↓

init()

↓

renderStructure()

↓

bootstrap()

↓

chargement des données

↓

initialisation des composants

↓

interaction utilisateur

↓

destroy()
```

---

# Architecture

```
Workbench
│
├── Header
├── Toolbar
├── Navigation
├── Workspace
├── Inspector
├── StatusBar
└── SystemUI
```

Le Workbench pilote uniquement l'interface.

Les données proviennent des API du backend.

---

# SystemUI

Les éléments d'interface réutilisables sont regroupés sous la famille **SystemUI**.

Ils constituent une bibliothèque de composants graphiques indépendants pouvant être utilisés dans tous les Workbench.

Exemples :

```
TabsSystem
TreeViewSystem
ListViewSystem
GridViewSystem
TableViewSystem
```

Ces composants sont totalement génériques.

Ils manipulent des données mais ne connaissent jamais le domaine métier.

Exemples d'utilisation :

* sections d'un article ;
* catégories du CMS ;
* hiérarchie d'organisations ;
* liste de pompes ;
* liste de compresseurs ;
* anomalies de maintenance ;
* résultats de recherche.

---

# Composants métier

Les composants CMS restent spécialisés.

Exemples :

```
Apex
Mermaid
Leaflet
Three
CodeVal
Callout
```

Ils sont initialisés par le Workbench via son registre de composants.

---

# Communication

Le Workbench communique au travers du bus d'événements.

Exemples :

```
cms:article:loaded

cms:section:rendered

cms:part:selected

wb:refresh
```

Chaque composant reste découplé des autres.

---

# Templates

Les interfaces sont construites à partir de :

* templates JavaScript ;
* utilitaires DOM (`domHelper`) ;
* composants SystemUI.

L'objectif est de limiter la manipulation directe du DOM et de favoriser des composants réutilisables.

---

# Backend

Le Workbench ne dialogue jamais directement avec les modèles.

Les échanges passent par les contrôleurs et les API REST.

```
Workbench

↓

Feature JS

↓

API REST

↓

Controller

↓

Service

↓

Models
```

---

# Connecteurs

Les Workbench pourront exploiter des connecteurs vers des systèmes externes.

Ces connecteurs resteront transparents pour l'interface.

Exemples futurs :

* INSEE
* INPI
* OMDb
* JsonPlaceholder
* services internes

Leur implémentation (HTTP, CURL, authentification, cache, etc.) sera encapsulée dans une couche dédiée afin que le Workbench manipule uniquement des ressources métier.

---

# Position dans l'architecture

```
Application
│
├── Runtime
├── Workbench
├── SystemUI
├── Features
├── Components
├── Connectors
├── Resources
└── Backend API
```

Le Workbench devient ainsi le point de convergence entre les composants graphiques, les ressources métier et les services du système.

---

# Vision

Le Workbench n'est pas un écran dédié au CMS.

Il constitue une plateforme générique capable de construire des interfaces adaptées à différents domaines :

* édition d'articles ;
* administration du CMS ;
* consultation de référentiels ;
* supervision technique ;
* diagnostic d'équipements ;
* exploration de connaissances ;
* analyse métier.

Cette architecture permet de faire évoluer progressivement Zealot vers une plateforme de gestion de connaissances et d'assistance technique, sans remettre en cause les fondations existantes.

