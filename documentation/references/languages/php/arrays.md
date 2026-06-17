# Arrays - Manipulation de Tableaux

## array_column
Extrait une colonne d'un tableau multidimensionnel.

**Utilisation** :
```php
array_column($data['groups']      ?? [], 'name')
array_column($data['permissions'] ?? [], 'name')
```

**Référence** : [W3Schools - array_column](https://www.w3schools.com/php/func_array_column.asp)

---

## array_keys
Récupère les clés d'un tableau.

**Utilisation** :
```php
'permissions' => array_keys($u->getPermissions())
```

**Référence** : [W3Schools - array_keys](https://www.w3schools.com/php/func_array_keys.asp)

---

## array_map
Applique une fonction à chaque élément d'un tableau.

**Utilisation** :
```php
$users = array_values(array_map(function ($u) {
    // traitement
}, $users))
```

**Référence** : [W3Schools - array_map](https://www.w3schools.com/php/func_array_map.asp)

---

## array_values
Réindexe les valeurs d'un tableau (réinitialise les clés numériques).

**Utilisation** :
```php
$users = array_values(array_map(function ($u) {
    // traitement
}, $users))
```

**Référence** : [W3Schools - array_values](https://www.w3schools.com/php/func_array_values.asp)

---

## array_merge
Fusionne un ou plusieurs tableaux.

**Utilisation** :
```php
$ignore = array_merge(['.', '..'], $ignore);
```

**Référence** : [W3Schools - array_merge](https://www.w3schools.com/php/func_array_merge.asp)

---

## array_filter
Filtre les éléments d'un tableau en utilisant une fonction de rappel.

**Utilisation** :
```php
return array_values(array_filter(
    scandir($path),
    function ($item) use ($path, $ignore) {
        return !in_array($item, $ignore, true)
            && is_dir($path . $item);
    }
));
```

**Référence** : [W3Schools - array_filter](https://www.w3schools.com/php/func_array_filter.asp)

---

## Combinaisons courantes

### Filtrer et réindexer
```php
return array_values(array_filter(
    $array,
    function ($item) {
        return $condition;
    }
));
```

### Mapper et réindexer
```php
$users = array_values(array_map(function ($u) {
    return [
        'name' => $u->name,
        'permissions' => array_keys($u->getPermissions())
    ];
}, $users));
```

---

## Opérateurs de coalescence
Utiliser `??` pour fournir une valeur par défaut si la clé n'existe pas ou est `null` :

```php
array_column($data['groups'] ?? [], 'name')
```

**Référence** : [PHP - Null Coalescing Operator](https://www.php.net/manual/en/language.operators.comparison.php#language.operators.comparison.null-coalescing)
