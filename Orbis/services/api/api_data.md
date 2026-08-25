Les datas extraites des api sont mapper selon les besoins



on peut parcourir les dictionnary python 
```py
print(len(thisdict))

for x in thisdict:
    print(x)            # contient la clef
    print(thisdict[x])  # contient la valeur

for x, y in thisdict.items():
    print(x) # contient la clef
    print(y) # contient la valeur
```

on a une requête qui renvoie une réponse structuré en JSON dans une vairable **data**

```py
            q = Prompt.ask("Requête Lucene (siren/)")            
            
            data = client.search_siren(q, nombre=10)
            if data:
                total = data.get("header", {}).get("total", 0)
                console.print(f"Total : {total}")
                for u in data.get("unitesLegales", []):
                    e = extract_unite_legale(u)
                    console.print(f"  {e['siren']} — {e['denomination']} ({e['naf']}) [{e['categorie']}]")
```

Dans la structure JSON : data a deux enfants
- 1 objet header
- 1 tableau unitesLegales

Le json renvoye contient data la variable s'appelle ainsi c'est une coincidence

```json
  "data": {
    "header": {
      "statut": 200,
      "message": "OK",
      "total": 4,
      "debut": 0,
      "nombre": 4
    },
  "unitesLegales": [
```
Le JSON est écrit directement dans un fichier sans traitement ^particulier
```py
                filename = save_response(data, source="insee", endpoint="siren", params={"q": q})
                console.print(f"[dim]Sauvegarde : {filename}[/]")
```py

## Afficher les données
### exploiter les données dans un tableau
On détaille la méthode dans le référentiel python/rich
Ici une fonction **extract_unite_legale** est nécessaire pour mettre en forme les enregistrement de l'API
```py
  table = Table(title=f"INSEE Siren — {q!r}", show_lines=True)
  table.add_column("siren", style="cyan",  width=12)
  table.add_column("denomination", style="white", width=45)
  table.add_column("naf", width=8)
  table.add_column("categorie",  width=8)

  for u in data.get("unitesLegales", []):
      r = extract_unite_legale(u)
      table.add_row(
          f"{r['siren']}",
          r["denomination"],
          r["naf"],
          r["categorie"],
      )
  
  console.print(table)
```

### Mapper les données
Les données JSON sont mappés vers un objet avec la fonction **extract_unite_legale**

Chaque enregistrement ici les unitesLegales ont des champs et des enfants dont les periodesUniteLegale

```json
    "unitesLegales": [
      {
        "siren": "839824711",
        "statutDiffusionUniteLegale": "O",
        "dateCreationUniteLegale": "2018-05-24",
        "sigleUniteLegale": null,
        "sexeUniteLegale": null,
        "prenom1UniteLegale": null,
        "prenom2UniteLegale": null,
        "prenom3UniteLegale": null,
        "prenom4UniteLegale": null,
        "prenomUsuelUniteLegale": null,
        "pseudonymeUniteLegale": null,
        "identifiantAssociationUniteLegale": null,
        "trancheEffectifsUniteLegale": "11",
        "anneeEffectifsUniteLegale": "2023",
        "dateDernierTraitementUniteLegale": "2025-12-06T08:18:55.396",
        "nombrePeriodesUniteLegale": 4,
        "categorieEntreprise": "PME",
        "anneeCategorieEntreprise": "2023",
        "activitePrincipaleNAF25UniteLegale": "96.23Y",
        "periodesUniteLegale": [
          {
```

La fonction **extract_unite_legale** se charge de mapper les données d'un enregistrement unitesLegales


- Une unitesLegales comporte des champs que l'on affiche selon les besoins
- Une unitesLegales comportes des enfants periodesUniteLegale correspondant à des évènements : changement de statu, de code APE

Elle récupère certains champs et lit les données du dernier enregistrement periodesUniteLegale

```py
def extract_unite_legale(u: dict) -> dict:
    """Extrait les champs utiles d'une unité légale INSEE → dict plat."""
    periodes = u.get("periodesUniteLegale", [{}])
    p = periodes[0] if periodes else {}
    return {
        "siren":             u.get("siren"),
        "denomination":      p.get("denominationUniteLegale") or u.get("denominationUniteLegale"),
        "sigle":             p.get("sigleUniteLegale"),
        "naf":               p.get("activitePrincipaleUniteLegale"),
        "categorie":         u.get("categorieEntreprise"),
        "etat":              p.get("etatAdministratifUniteLegale"),
        "forme_juridique":   p.get("categorieJuridiqueUniteLegale"),
        "date_creation":     u.get("dateCreationUniteLegale"),
        "tranche_effectif":  u.get("trancheEffectifsUniteLegale"),
    }
```
