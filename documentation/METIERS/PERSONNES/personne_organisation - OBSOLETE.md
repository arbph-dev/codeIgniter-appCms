 
une relation peut se faire entre une personne et une organisation 

```sql
personne_organisation
  id               BIGINT PK
  personne_id      FK → personnes.id
  organisation_id  FK → organisations.id
  role             VARCHAR(60)   -- 'dirigeant', 'salarié', 'adhérent', 'donateur'…
  date_debut       DATE NULL
  date_fin         DATE NULL
```


## Relation

Lien Personne ↔ Organisation , Une table pivot avec le **rôle** du lien : ce design couvre tous les cas. 


### donateur_association

Si on adopte le modèle ci-dessus, `donateur_association` devient un cas particulier de `personne_organisation` avec `role = 'donateur'`. 

Pas besoin d'une table dédiée — ==sauf si vous avez des champs très spécifiques au don== (montant, récurrence, reçu fiscal…). 
Dans ce cas une table `dons` avec FK personne + organisation est plus propre qu'une table pivot nommée.
