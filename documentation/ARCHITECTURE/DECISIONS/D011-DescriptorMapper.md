# D011-DescriptorMapper

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

Les données du CMS ne possèdent pas le même format que les composants.

# Décision

Le `DescriptorMapper` traduit les données métier du CMS vers un `DescriptorDefinition`.

Il réalise uniquement une normalisation.

Il ne :

* crée aucun composant ;
* ne réalise aucun rendu ;
* ne contient aucune logique métier.

# Conséquences

Le CMS reste indépendant du moteur de rendu.
