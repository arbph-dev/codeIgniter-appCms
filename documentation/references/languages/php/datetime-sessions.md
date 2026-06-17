# Dates et Sessions

## Manipulation de dates

### Avec CodeIgniter (Carbon/DateTime)

#### Méthode toDateString
Retourne la date au format `YYYY-MM-DD`.

```php
'created_at' => $u->created_at->toDateString()
```

#### Méthode setTimezone et toDateTimeString
Convertit le timezone et retourne la date et heure complètes.

```php
'created_at' => $u->created_at->setTimezone('Europe/Paris')->toDateTimeString()
```

Cela retourne un format comme : `2026-06-17 22:44:45`

---

## Sessions

### session_id
Obtient ou définit l'ID de la session courante.

```php
$id = session_id();
```

**Utilisation** :
```php
// Dans un contrôleur CodeIgniter
foreach ($user->identities ?? [] as $identity) {
    // traitement
}
```

---

## Exemple complet : Transformation d'utilisateur

```php
// Dans app/Controllers/Admin.php
public function getUsers()
{
    $users = $this->userModel->findAll();
    
    $users = array_values(array_map(function ($u) {
        return [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'permissions' => array_keys($u->getPermissions()),
            'created_at' => $u->created_at->setTimezone('Europe/Paris')->toDateTimeString(),
            'identities' => $u->identities ?? []
        ];
    }, $users));
    
    return $users;
}
```

---

## Remarques utiles

### Opérateur de coalescence avec foreach
Utiliser `??` pour éviter les erreurs si une propriété n'existe pas :

```php
foreach ($user->identities ?? [] as $identity) {
    // traitement
}
```

### Classe du provider d'authentification
Pour déboguer le provider d'authentification :

```php
// dd(get_class(auth()->getProvider()));
// Résultat : "CodeIgniter\Shield\Models\UserModel"
```

---

**Référence** :
- [PHP - Date and Time Functions](https://www.php.net/manual/en/ref.datetime.php)
- [PHP - Session Handling](https://www.php.net/manual/en/book.session.php)
- [CodeIgniter - DateTime](https://codeigniter.com/user_guide/helpers/date_helper.html)
