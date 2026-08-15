# tables


un pattern d'architecture cohérent sur toute la base.
- `id`
- `code`
- `label`
- `inverse_code`


Table
- component_types CMS ??
- organisation_types  -  organisations
- parcours_types - personne_parcours
- relation_types - relations
- service_types - services
- type_voies - adresses


## parcours_types

```
DESCRIBE parcours_types;
id  bigint unsigned NO  PRI NULL    auto_increment  
code    varchar(50) NO  UNI NULL        
label   varchar(100)    NO      NULL        
description text    YES     NULL        
created_at  datetime    YES     NULL        
updated_at  datetime    YES     NULL        
```


## relation_types

voici DESCRIBE relation_types;
```tsv
id  bigint unsigned NO  PRI NULL    auto_increment  
code    varchar(100)    NO  UNI NULL        
label   varchar(255)    NO      NULL        
inverse_code    varchar(100)    YES     NULL        
source_type enum('personne','organisation','etablissement') NO  MUL NULL        
target_type enum('personne','organisation','etablissement') NO  MUL NULL        
symetrique  tinyint(1)  NO      0       
description text    YES     NULL        
created_at  datetime    YES     NULL        
updated_at  datetime    YES     NULL        
```


## relations

DESCRIBE relations;

```
id  bigint unsigned NO  PRI NULL    auto_increment  
relation_type_id    bigint unsigned NO  MUL NULL        
source_type enum('personne','organisation') NO  MUL NULL        
source_id   bigint unsigned NO      NULL        
target_type enum('personne','organisation') NO  MUL NULL        
target_id   bigint unsigned NO      NULL        
actif   tinyint(1)  YES     1       
ordre   smallint    YES     0       
date_debut  date    YES     NULL        
date_fin    date    YES     NULL        
commentaire text    YES     NULL        
created_at  datetime    YES     NULL        
updated_at  datetime    YES     NULL        
```
