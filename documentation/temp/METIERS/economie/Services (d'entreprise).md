


## services

les services internes de l'entreprise : 
comptabilité, 
drh, 
dsi, 
maintenance.

**Pourquoi pas un simple enum PHP ?** Parce qu'une entreprise peut avoir plusieurs instances du même type (deux agences = deux DSI locales), et qu'un utilisateur pourra vouloir ajouter un type non prévu. 

La table `service_types` joue le rôle d'enum mais reste extensible.
**Le lien avec PERSONNE viendra naturellement :**

```
personnes → personne_organisation → organisations
                                         ↓
                               entreprises → services
personnes → personne_service  ────────────────┘
```

### Structure

| Field           | Type            | Null | Key | Default | Extra          | Notes                                 |
| --------------- | --------------- | ---- | --- | ------- | -------------- | ------------------------------------- |
| id              | bigint unsigned | NO   | PRI | _NULL_  | auto_increment |                                       |
| entreprise_id   | bigint unsigned | NO   | MUL | _NULL_  |                |                                       |
| service_type_id | bigint unsigned | NO   | MUL | _NULL_  |                |                                       |
| nom             | varchar(100)    | YES  |     | _NULL_  |                | override possible : "Compta Bretagne" |
| responsable_id  | bigint unsigned | YES  |     | _NULL_  |                |                                       |
| actif           | tinyint(1)      | NO   |     | 1       |                |                                       |
| created_at      | datetime        | YES  |     | _NULL_  |                |                                       |
| updated_at      | datetime        | YES  |     | _NULL_  |                |                                       |
|                 |                 |      |     |         |                |                                       |

### Relations
[[#entreprises]]
entreprise_id  FK → entreprises.id

[[METIERS/economie/service_types]]
service_type_id FK → service_types.id 

[[METIERS/identité/personne]]
responsable_id FK → personnes.id  (NULL au début, branché quand PERSONNE sera fait) 
  
