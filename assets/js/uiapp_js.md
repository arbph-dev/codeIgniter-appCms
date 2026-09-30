- **DOMAINE** [WebUI](/WebUI/README.md) - voir pour notes , évolutions et tâches
- **DEV** : [WebUI/uiapp.js](/WebUI/uiapp.js)
- **PATH** : `/assets/js/uiapp.js`

# [`/public/assets/js/uiapp.js`](/WebUI/uiapp.js)

Script et point d'entrée de l'application

La version pour les travaux : [WebUI/uiapp.js](/WebUI/uiapp.js) est a mettre a jour depuis disque local : OUI /NON
- [ ] mettre a jour



## Fonctions
- themeSwitch

- fullscreenSwitch
- switchPanel
- switchSection

- statusWrite

- typeofObj
 
- readPage
- initPagination
- initNavigation
- openMenuPanel
- initMenu
- setPageRef

- openSidebar
- closeSidebar
- initSidebar
- openNav
- closeNav



- getAuthBoards
- hideAuthBoards
- showAuthBoard
- initAuthBoards
- show
- mountUserBoard
- mountAdminBoard
- mountApplication
- noAuth
- boot
- onload





offset readpage 
show/hide boards
- Modifier readPage() pour ignorer les panels auth :
- ajout function getAuthBoards()
- ajout function hideAuthBoards()
- ajout function showAuthBoard(role)
- ajout function initAuthBoards() 


## Helper de rendu
- function badgeGroups(groups)
- function badgePerms(permissions)
- function renderUserCard(user, { title = 'Mon profil' } = {})
	- Carte profil minimale des données endpoint /me { id, username, email, groups, permissions }

#### Montage dans les boards 
fait sentir la nécessité d'un panel user ou workbench
- function mountUserBoard(user) {
- function mountAdminBoard(user) {

####  Branchement bus
- import '/assets/js/features/auth/auth.store.js'
- remplacer initAuthBoards
- Affiche panel user , le formulaire est déjà monté par AuthPanelBase._mountRegisterForm.
```js
  bus.subscribe('board:register', () => showAuthBoard('user'))
```
