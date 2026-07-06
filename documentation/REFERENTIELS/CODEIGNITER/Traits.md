
## Trait ApiResponse

**Centralise les réponses JSON** uniformes pour tous les contrôleurs API :

```php
// Succès
apiOk($data, ?$pager, $message)        // 200 + data + pager optionnel
apiCreated($data, $message)            // 201
apiDeleted($message)                   // 200 (pas 204 pour les SPA)

// Erreurs
apiBadRequest($message, $errors)       // 400
apiUnauthorized($message)              // 401
apiForbidden($message)                 // 403
apiNotFound($message)                  // 404
apiValidationError($errors, $message)  // 422
apiError($message)                     // 500
```
