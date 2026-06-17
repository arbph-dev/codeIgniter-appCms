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
- Liens avec les entreprises

### [Formes Juridiques](./formes-juridiques.md)
- Types d'organisations légales
- Classification et caractéristiques
- Données de référence

### [Établissements](./etablissements.md)
- Distinction avec les entreprises
- Structure et SIRET
- Siège social et succursales

### [Adresses](./adresses.md)
- Gestion des adresses
- Lien avec les établissements
- Validation et normalisation

---

## Hiérarchie générale

```
Organisations (table mère)
├── Entreprises (extension)
│   ├── SIREN (identifiant)
│   ├── CodeNAF
│   ├── Forme Juridique
│   └── Établissements (N per SIREN)
│       ├── SIRET (SIREN + NIC)
│       ├── Adresse
│       └── is_siege (flag siège social)
└── Associations (future extension)
```

---

**Modèle d'inspiration** : INSEE (Institut National de la Statistique et des Études Économiques)
