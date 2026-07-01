

# Structure du contenu

Le contenu se répartit dans des **articles** de différentes **categories**.
Les **catgories** ont une structure hiérachique.

Les **articles** des **categories** sont composés de une à plusieurs **sections**.

Les **sections** sont composées de **parts**.
Une part est assimilable à un paragraphe , elle incluera un composant et une zone aside


## Fonctionnalités
L'application doit permettre de présenter le contenu et de le gérér en proposant les interfaces d'administration.


## Modules 
Les modules principaux seront :
- categories
- articles
- sections
- parts

## Composants
Les composants sont réalisés su rla base de composant javascript, des composant sélementaires pourront se combiner
Une évolution vers des composants PHP et Javascript est envisaée


# Architecture
Code Igniter propose ,une architecture Model View Controller, et permet d'employer des services

## solution retenue
Pour chaque module on défini
- une migration
- un model
- des routes
- un controleur
- des vues

Un service permettra de factoriser le code des controllers des différents modules

Des classes seront nécessaires pour la gestion des modules et composants, elle seront réparties dans uen librairie


# Librairies

## Classes
[ApiDefinition](ARCHITECTURE/ApiDefinition.md)

[ApplicationDefinition](ARCHITECTURE/ApplicationDefinition.md)

[ComponentDefinition](ARCHITECTURE/ComponentDefinition.md)

[ComponentRegistry](ARCHITECTURE/ComponentRegistry.md)

[CompositeComponentDefinition](ARCHITECTURE/CompositeComponentDefinition.md)

### DescriptorDefinition
DescriptorDefinition

[Documentation](ARCHITECTURE/DescriptorDefinition.md)

[Implémentation](/refactoring/app/Libraries/Components/DescriptorDefinition.php)

---

[EntityDefinition](ARCHITECTURE/EntityDefinition.md)

[EventDefinition](ARCHITECTURE/EventDefinition.md)

[FeatureDefinition](ARCHITECTURE/FeatureDefinition.md)

[FieldDefinition](ARCHITECTURE/FieldDefinition.md)

[RelationDefinition](ARCHITECTURE/RelationDefinition.md)

[RouteDefinition](ARCHITECTURE/RouteDefinition.md)

[SecurityDefinition](ARCHITECTURE/SecurityDefinition.md)

[ServiceDefinition](ARCHITECTURE/ServiceDefinition.md)

[StoreDefinition](ARCHITECTURE/StoreDefinition.md)

[StoreRegistry](ARCHITECTURE/StoreRegistry.md)

[ViewDefinition](ARCHITECTURE/ViewDefinition.md)

[ViewRegistry](ARCHITECTURE/ViewRegistry.md)
