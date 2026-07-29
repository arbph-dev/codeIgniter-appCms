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
Github propose une extension VsCode , faire **.** dans un dossier pour l'ouvrir

Dans le menu utiliser terminal

```
find documentation/ -name "*.md" | sort
```

Commandes a voir
```
ls-files
ls-files | cut -d/ -f1 | sort -u
ls-files app/Controllers

grep -R "```mermaid" documentation
grep -R "DescriptorMapper" documentation
grep -R "CmsService" documentation

tree documentation

find documentation


mkdir -p project/audit

ls-files > project/audit/files.txt
ls-files "*.md" > project/audit/docs.txt
ls-files app > project/audit/backend.txt
ls-files public/assets/js > project/audit/frontend.txt
```



Tu disposeras alors de quatre inventaires de base.
