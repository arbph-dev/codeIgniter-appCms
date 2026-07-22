REFERENTIELS

Frameworks

Langages

    PHP

        Syntaxe
        POO
        Attributes
        Reflection
        Traits

    Javascript

        ES6
        DOM
        Events
        Modules
        Web Components


---

# Shell

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

