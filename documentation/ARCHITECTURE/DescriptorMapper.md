# DescriptorMapper

Le **DescriptorMapper** traduit les données métier du CMS en **DescriptorDefinition**.

Le code source :

- [app/Libraries/Components/DescriptorMapper.php](/refactoring/app/Libraries/Components/DescriptorMapper.php)

---

# Responsabilité

Le rôle du DescriptorMapper est uniquement de normaliser les données.

```text
CmsPart

↓

DescriptorMapper

↓

DescriptorDefinition
```

Il ne crée aucun composant.

Il ne réalise aucun rendu.

Il ne contient aucune logique métier.

---

# Principe

Le CMS manipule des données métier.

```text
type_id = 7
config = {...}
```

Le système de composants manipule des Descriptors.

```text
type = "three"
config = {...}
```

Le DescriptorMapper réalise cette traduction.

---

# Cycle d'utilisation

```mermaid
flowchart LR

CmsPart
    --> DescriptorMapper
    --> DescriptorDefinition
    --> ComponentRenderer
```

Le DescriptorMapper constitue la frontière entre le CMS et le système de composants.

---

# Dépendances

- [app/Libraries/Components/DescriptorDefinition.php](/refactoring/app/Libraries/Components/DescriptorDefinition.php)

À vérifier pendant l'audit :

- supprimer la dépendance éventuelle vers `app/Libraries/Cms/DescriptorDefinition.php`.

---

# Utilisateurs

Le DescriptorMapper est utilisé par :

- [app/Services/CmsService.php](/refactoring/app/Services/CmsService.php)

Indirectement, tous les Renderers utilisent les Descriptors produits par le Mapper.

---

# Règles

Le DescriptorMapper :

- traduit les données ;
- normalise la structure ;
- ne crée aucun composant ;
- ne choisit aucun Renderer ;
- ne réalise aucun rendu ;
- ne contient aucune logique métier.
