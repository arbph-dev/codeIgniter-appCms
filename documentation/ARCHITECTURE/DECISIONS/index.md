# Décisions d'architecture

Les décisions d'architecture (ADR - *Architecture Decision Records*) regroupent les choix techniques validés pour le projet Zealot.

Contrairement aux documents de conception ou de roadmap, une décision décrit un choix **acté**, sa justification et ses conséquences sur l'architecture.

Les comptes-rendus de conception, les recherches et les feuilles de route sont documentés dans les dossiers dédiés (`ROADMAP`, `FLOWS`, `HISTORY`, etc.).

---

# Organisation

## Backend

* [[D001-CmsService]]
* [[D002-Controllers]]
* [D005-ComponentRegistry](/documentation/ARCHITECTURE/DECISIONS/D005-ComponentRegistry.md)
* [D006-ComponentRenderer](/documentation/ARCHITECTURE/DECISIONS/D006-ComponentRenderer.md)
* D007-AdminComponentRenderer *décision similaire à D006
* [D008-Séparation_FrontOffice_Administration](/documentation/ARCHITECTURE/DECISIONS/D008-Séparation_FrontOffice_Administration.md)
## Composants

* [[D010-DescriptorDefinition]]
* [[D011-DescriptorMapper]]
* [[D012-ComponentRenderer]]
* [[D013-ComponentRegistry]]
* [D014-ComponentDefinition](/documentation/ARCHITECTURE/DECISIONS/D014-ComponentDefinition.md)
   - Un composant est décrit par sa ComponentDefinition enregistrée dans le ComponentCatalog. Toutes les couches doivent s'appuyer sur ces définitions.

## Frontend

* [[D020-EventBus]]
* [[D021-Workbench]]

## Documentation

* [[D100-Documentation]]

---

# Format d'une décision

Chaque décision suit la structure suivante :

```text
Identifiant : Dxxx
Date :
Statut :
```

## Statuts

* **Accepted** : décision validée et appliquée.
* **Proposed** : en cours de validation.
* **Rejected** : étudiée puis abandonnée.
* **Superseded** : remplacée par une décision plus récente.

---

# Contenu attendu

Chaque décision doit répondre aux questions suivantes :

* Quel problème devait être résolu ?
* Quelle solution a été retenue ?
* Pourquoi ce choix ?
* Quelles sont les conséquences sur l'architecture ?

Les décisions ne contiennent ni feuille de route, ni tâches de développement, ni notes de séance.

---

# Méthode de travail

Pour chaque évolution importante :

1. Créer une branche Git dédiée.
2. Réaliser l'analyse d'impact.
3. Modifier une seule couche à la fois (backend ou frontend).
4. Valider les tests.
5. Mettre à jour la documentation.
6. Créer ou mettre à jour une décision d'architecture si le changement modifie durablement le projet.

---

# Conventions

Les décisions sont numérotées chronologiquement.

Exemple :

```
D001-CmsService.md
D002-Controllers.md
D003-DescriptorDefinition.md
```

Chaque décision doit rester courte, stable et indépendante des itérations de développement.


les Décisions (Dxxx) deviennent des références stables de l'architecture.

Les roadmaps, audits et documents techniques devront les citer plutôt que de réexpliquer les choix. Cela permettra de conserver une documentation plus concise et d'avoir une source unique de vérité pour les décisions structurantes.
