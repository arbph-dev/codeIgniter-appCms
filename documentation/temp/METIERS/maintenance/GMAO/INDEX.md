# 📑 Index GMAO - Gestion de Maintenance Assistée par Ordinateur

**Localisation:** `documentation/temp/METIERS/maintenance/GMAO/`

Ce dossier contient la documentation complète du système GMAO pour la gestion de la maintenance, des équipements et des interventions.

---

## 📋 Table des Matières

### 🏢 Gestion Organisationnelle

| Document | Description |
|----------|-------------|
| [**entreprises.md**](entreprises.md) | Définition et structure des entreprises parentes |
| [**etablissements.md**](etablissements.md) | Sites d'exploitation, SIRET et localisation des équipements |
| [**fournisseur.md**](fournisseur.md) | Gestion des fournisseurs et prestataires |
| [**manufact.md**](manufact.md) | Référence des constructeurs/fabricants d'équipements |

---

### 🔧 Gestion des Équipements

| Document | Description |
|----------|-------------|
| [**equipement.md**](equipement.md) | **Table principale** - Tous les équipements, hiérarchie, état, criticité |
| [**typeeqp.md**](typeeqp.md) | Classification des types d'équipements |
| [**equipementcaracteristique.md**](equipementcaracteristique.md) | Caractéristiques associées aux équipements |
| [**equipementreglementaire.md**](equipementreglementaire.md) | Conformités réglementaires et obligations |
| [**caracteristique.md**](caracteristique.md) | Définition des caractéristiques génériques |

---

### 📦 Gestion des Articles (Pièces & Stocks)

| Document | Description |
|----------|-------------|
| [**article.md**](article.md) | Articles de stock, modèles, références constructeur |
| [**articletype.md**](articletype.md) | Classification des types d'articles |
| [**articlecaracteristique.md**](articlecaracteristique.md) | Caractéristiques des articles de stock |
| [**articleprix.md**](articleprix.md) | Tarification et gestion des prix d'articles |
| [**articlefournisseur.md**](articlefournisseur.md) | Liens articles-fournisseurs et références |

---

### 🔧 Gestion des Interventions

| Document | Description |
|----------|-------------|
| [**intervention.md**](intervention.md) | **Table principale** - Maintenance, réparations, historique d'interventions |
| [**interventiontype.md**](interventiontype.md) | Types d'interventions (préventif, curatif, etc.) |
| [**interventionarticle.md**](interventionarticle.md) | Articles consommés lors d'une intervention |

---

### 💰 Gestion Comptable & Financière

| Document | Description |
|----------|-------------|
| [**immobilisation.md**](immobilisation.md) | **Actifs durables** - Amortissement comptable, plan financier |
| [**comptespcg.md**](comptespcg.md) | Plan comptable général (PCG) - comptes liés à la maintenance |
| [**planinvestissement.md**](planinvestissement.md) | **CAPEX** - Plan d'investissement, remplacement d'équipements |

---

### 📊 Gestion des Ressources & Planification

| Document | Description |
|----------|-------------|
| [**planmaintenance.md**](planmaintenance.md) | Calendrier et planning de maintenance préventive |
| [**compteur.md**](compteur.md) | Compteurs d'usure, heures de fonctionnement |
| [**obligationreglementaire.md**](obligationreglementaire.md) | Obligations légales et conformités |

---

### 🔐 Sécurité & Documentation

| Document | Description |
|----------|-------------|
| [**cnssec.md**](cnssec.md) | Consignes de sécurité associées aux équipements |
| [**document.md**](document.md) | Gestion des documents techniques (manuels, notices) |
| [**documentobjet.md**](documentobjet.md) | Association documents-équipements |

---

## 🔗 Relation Entités - Vue d'Ensemble

```
ORGANISATIONS
    ├── Entreprises (entreprises.md)
    └── Établissements (etablissements.md)
        ├── Équipements (equipement.md)
        │   ├── Type (typeeqp.md)
        │   ├── Caractéristiques (equipementcaracteristique.md)
        │   ├── Immobilisations (immobilisation.md)
        │   ├── Consignes sécurité (cnssec.md)
        │   ├── Obligations réglementaires (equipementreglementaire.md)
        │   └── Documents (documentobjet.md)
        │
        ├── Articles/Pièces (article.md)
        │   ├── Types (articletype.md)
        │   ├── Caractéristiques (articlecaracteristique.md)
        │   ├── Tarification (articleprix.md)
        │   └── Fournisseurs (articlefournisseur.md)
        │
        └── Interventions (intervention.md)
            ├── Types (interventiontype.md)
            ├── Articles utilisés (interventionarticle.md)
            └── Plan de maintenance (planmaintenance.md)

COMPTABILITÉ
    ├── Comptes PCG (comptespcg.md)
    ├── Immobilisations (immobilisation.md)
    └── Plan d'investissement (planinvestissement.md)

RESSOURCES
    ├── Fournisseurs (fournisseur.md)
    ├── Fabricants (manufact.md)
    ├── Compteurs (compteur.md)
    └── Documents (document.md)
```

---

## 🎯 Points Clés du Système

### Hiérarchie d'Équipements
- **Structure parent/enfant** permettant de modéliser des ensembles complexes
- Exemple: Groupe électrogène → Moteur, Alternateur, Armoire

### Traçabilité Maintenance
- **Historique complet** des interventions par équipement
- **Coûts détaillés**: Main-d'œuvre (MO), Matériel, Prestataires
- **Planning préventif** basé sur des plans de maintenance

### Gestion Financière
- **CAPEX ready**: Criticité, obsolescence, valeur de remplacement
- **Amortissement comptable** linéaire des immobilisations
- **Lien PCG**: Comptes de charges (6811 dotations) et d'amortissements (28xx)

### Conformité & Sécurité
- **Consignes de sécurité** par équipement
- **Obligations réglementaires** (éléments à vérifier régulièrement)
- **Gestion des documents techniques** (manuels, notices)

---

## 📊 Statistiques du Dossier

- **Total fichiers:** 27 fichiers .md
- **Entités principales:** 15+ tables de base de données
- **Domaines couverts:** Équipements, Articles, Interventions, Comptabilité, Sécurité
- **État:** Documentation en cours de finalisation

---

## 🚀 Pour Commencer

1. **Compréhension générale:** Lire `equipement.md` et `intervention.md`
2. **Configuration initiale:** Parcourir `entreprises.md` et `etablissements.md`
3. **Opérations courantes:** Consulter `planmaintenance.md` et `interventionarticle.md`
4. **Aspect financier:** Étudier `immobilisation.md` et `planinvestissement.md`

---

## 📝 Légende

- 🟢 **Table principale** = Entité centrale du système
- 📌 **Référence** = Donnée de base, petit volume
- 🔗 **Relation** = Table de liaison ou de contexte

---

**Dernière mise à jour:** 17 juin 2026  
**Chemin complet:** `arbph-dev/codeIgniter-appCms/documentation/temp/METIERS/maintenance/GMAO/`
