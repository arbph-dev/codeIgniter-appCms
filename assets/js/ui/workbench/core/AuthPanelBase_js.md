[/assets/js/ui/workbench/core/AuthPanelBase.js](/assets/js/ui/workbench/core/AuthPanelBase.js)
[documentation AuthPanelBase.js](/assets/js/ui/workbench/core/AuthPanelBase_js.md)


# [`AuthPanelBase.js`](/assets/js/ui/workbench/core/AuthPanelBase.js)
Base des panels d'authentification. 

Contrat sous-classes :_buildLoading(), _buildGuestForm(error) , _buildRegisterForm(error) NOUVEAU ,  _buildUserBar(user)
- ToolbarAuthPanel doit réimplementer _buildUserBar

AuthPanelBase.js gere le bus états + bindings 

```js
this._onSuccess = ({ user }) => { this._user = user; this._render('user') }

bus.subscribe('auth:success', this._onSuccess)
```
- [`/assets/js/ui/workbench/core/AuthPanelBase.js`](/refactoring/assets/js/ui/workbench/core/AuthPanelBase.js)
- [`AuthPanelBase.js`](/refactoring/assets/js/ui/workbench/core/AuthPanelBase.js)
- /assets/js/ui/workbench/core/AuthPanelBase.js 


