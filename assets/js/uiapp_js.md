- **DOMAINE** [WebUI](/WebUI/README.md) - voir pour notes , évolutions et tâches
- **DEV** : [WebUI/uiapp.js](/WebUI/uiapp.js)
- **PATH** : `/assets/js/uiapp.js`

# [`/public/assets/js/uiapp.js`](/WebUI/uiapp.js)

Script et point d'entrée de l'application

La version pour les travaux : [WebUI/uiapp.js](/WebUI/uiapp.js) est a mettre a jour depuis disque local : OUI /NON
- [ ] mettre a jour

Affiche panel user , le formulaire est déjà monté par AuthPanelBase._mountRegisterForm.
```js
  bus.subscribe('board:register', () => showAuthBoard('user'))
```

## Fonctions

offset readpage 
show/hide boards
- Modifier readPage() pour ignorer les panels auth :
- ajout function getAuthBoards()
- ajout function hideAuthBoards()
- ajout function showAuthBoard(role)
- ajout function initAuthBoards() 
