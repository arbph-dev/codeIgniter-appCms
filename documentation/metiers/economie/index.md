# Économie - Métiers

Documentation des concepts métier liés à l'économie et aux entreprises.

## Index par catégorie

### [Entreprises](./entreprises.md)
- Structure et modèle de données
- SIREN / SIRET / Établissements
- Relations et héritance (Class Table Inheritance)
- Modèle entité-relation

### [Codes NAF](./codenaf.md)
- Classification des activités économiques
- Structure des codes NAF
- Liens avec les entreprises et établissements

### [Formes Juridiques](./formes-juridiques.md)
- Types d'organisations légales
- Classification et caractéristiques
- Données de référence INSEE

### [Organisations](./organisation.md)
- Table mère pour toutes les organisations
- Concept de Class Table Inheritance
- Structure universelle

### [Établissements](./etablissements.md)
- Distinction avec les entreprises
- Structure et SIRET
- Siège social et succursales

### [Adresses](./adresse.md)
- Gestion des adresses postales
- Lien avec les établissements et organisations
- Validation et normalisation

---

## Hiérarchie générale

```
Organisations (table mère)
├── Entreprises (extension)
│   ├── SIREN (identifiant)
│   ├── CodeNAF (activité)
│   ├── Forme Juridique (cadre légal)
│   └── Établissements (N per SIREN)
│       ├── SIRET (SIREN + NIC)
│       ├── Adresse (localisation)
│       ├── CodeNAF (peut différer)
│       └── is_siege (flag siège social)
└── Associations (future extension)
```

---

## Modèle de données complet

```sql
-- Hiérarchie
organisations (base) 
  └── entreprises (extension 1:1)

-- Références métier
entreprises → codesnaf (N:1)
entreprises → formesjuridiques (N:1)
organisations → adresses (N:1)

-- Détail
établissements (N par entreprise)
  ├── entreprises (N:1)
  ├── adresses (N:1)
  └── codesnaf (N:1, peut différer)
```

---

**Modèle d'inspiration** : INSEE (Institut National de la Statistique et des Études Économiques)
