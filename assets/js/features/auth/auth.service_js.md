# auth.service.js
[/assets/js/features/auth/auth.service.js](/assets/js/features/auth/auth.service.js)

modification
- suppression version me commentée
- ajout fetchRegister ligne 33


#### Exports

| Fonction      | Endpoint                | Auth             |
| ------------- | ----------------------- | ---------------- |
| fetchLogin    | POST /api/auth/login    | Public           |
| fetchRegister | POST /api/auth/register | Public           |
| fetchMe       | GET /api/auth/me        | Bearer optionnel |
| fetchLogout   | POST /api/auth/logout   | Bearer           |
