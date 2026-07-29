# Shell /SSH

## recherche de fichiers

- recherche de fichiers php dans un dossier

```sh
find app/Controllers/ -name "*.php" | sort
```

## recherche dans les fichiers
- recherche du terme ApexRenderer dans les fichiers de type php et js dans un dossier app/

```sh
grep -rn --include="*.php" --include="*.js" "ApexRenderer" app/
```


# Shell github / terminal

Oui. Le plus simple est de partir directement de Git, car cela ne liste que les fichiers suivis par le dépôt (ce qui évite les fichiers temporaires, vendor/, etc.).

Je te conseille de générer plusieurs listes selon le niveau de détail souhaité.

1. Liste complète du dépôt (recommandé)
git ls-files

Exemple :

app/Config/Routes.php
app/Controllers/CmsController.php
app/Services/CmsService.php
documentation/CmsService.md
...

C'est probablement la commande qui servira de référence pour l'inventaire.

2. Liste classée par répertoire
git ls-files | cut -d/ -f1 | sort -u

Exemple :

app
documentation
project
public
tests
3. Liste d'un répertoire précis

Par exemple :

git ls-files app/Controllers

ou

git ls-files documentation
4. Fichiers Markdown uniquement
git ls-files "*.md"

Très pratique pour faire l'inventaire de la documentation.

5. Tous les diagrammes Mermaid

Si tous les diagrammes sont des blocs Mermaid dans les .md :

grep -R "```mermaid" documentation

Tu obtiendras les documents qui contiennent au moins un diagramme.

6. Rechercher un terme dans toute la documentation

Par exemple :

grep -R "DescriptorMapper" documentation

ou

grep -R "CmsService" documentation

Très utile pour retrouver où un concept est documenté.

7. Arborescence du dépôt

Si tree est installé :

tree -I '.git|vendor|node_modules'

ou uniquement la documentation :

tree documentation

Sinon :

find documentation
Je proposerais même un petit script d'audit

Créer un dossier :

project/audit/

Puis générer automatiquement les listes :

mkdir -p project/audit

git ls-files > project/audit/files.txt

git ls-files "*.md" > project/audit/docs.txt

git ls-files app > project/audit/backend.txt

git ls-files public/assets/js > project/audit/frontend.txt

Tu disposeras alors de quatre inventaires de base.
