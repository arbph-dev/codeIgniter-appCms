Les migrations sont réalisés avec l'interface phpmyadmin de Mysql. Privilégier le standard sql semble plus pertinent

Code Igniter intégre une gestion des migrations et des seeders tout comme Laravel. Ces deux frameworks permettent d'exploiter des tables existantes

ordre d'import : Les tables sont listées par projet dans l'ordre de création, ordre imposé par les relations

# Tables

| PROJET | NOTES | LIEN |
| --- | --- | --- |
| AUTH | table profils uttilisateurs | [user_profils](/documentation/MIGRATIONS/user_profils.md) |
| CI | table système CI | [users](/documentation/MIGRATIONS/users.md) |
| CMS | articles des catégories | [cmsarticles](/documentation/MIGRATIONS/cmsarticles.md) |
| CMS | catégories pour classer les articles | [cmscategories](/documentation/MIGRATIONS/cmscategories.md) |
| CMS |  | [cmsparts](/documentation/MIGRATIONS/cmsparts.md) |
| CMS |  | [cmssections](/documentation/MIGRATIONS/cmssections.md) |
| CMS |  | [component_types](/documentation/MIGRATIONS/component_types.md) |



# Projet

## AUTH
[user_profils](/documentation/MIGRATIONS/user_profils.md)

## CI
table système CI
[users](/documentation/MIGRATIONS/users.md)

## CMS
ordre d'import : 
1. [component_types](/documentation/MIGRATIONS/component_types.md)
2. [cmscategories](/documentation/MIGRATIONS/cmscategories.md)
3. [cmsarticles](/documentation/MIGRATIONS/cmsarticles.md)
4. [cmssections](/documentation/MIGRATIONS/cmssections.md)
5. [cmsparts](/documentation/MIGRATIONS/cmsparts.md)









