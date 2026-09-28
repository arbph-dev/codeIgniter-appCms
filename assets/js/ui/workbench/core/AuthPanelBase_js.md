- [documentation AuthPanelBase.js](/assets/js/ui/workbench/core/AuthPanelBase_js.md)
- [/assets/js/ui/workbench/core/AuthPanelBase.js](/assets/js/ui/workbench/core/AuthPanelBase.js)
- [AuthPanelBase.js](/assets/js/ui/workbench/core/AuthPanelBase.js)

# [`AuthPanelBase.js`](/assets/js/ui/workbench/core/AuthPanelBase.js)
Base des panels d'authentification. 

Contrat sous-classes :_buildLoading(), _buildGuestForm(error) , _buildRegisterForm(error) NOUVEAU ,  _buildUserBar(user)
- ToolbarAuthPanel doit réimplementer _buildUserBar

AuthPanelBase.js gere le bus états + bindings 

```js
this._onSuccess = ({ user }) => { this._user = user; this._render('user') }

bus.subscribe('auth:success', this._onSuccess)
```



#### [`AuthPanelBase.js`](/refactoring/assets/js/ui/workbench/core/AuthPanelBase.js)
AuthPanelBase.js — ajustements dans _render(), Toolbar = login / retour / user bar
- remplacer le case 'register'
- remplacer le case 'register-pending'
- Nouvelles méthodes
	- _boardBody() reference au Conteneur du board user
	- _mountRegisterForm(error = null)
 	- _mountRegisterPending(message)
 	- _clearBoardBody()
- modifier
	- _bindRegister doit cibler le board root, pas seulement this._target
	- _emitRegister() const root = this._boardBody() ?? this._target
 - Et sur guest / success, nettoyer le board : this._clearBoardBody()
