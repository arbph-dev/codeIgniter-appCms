- [`/assets/js/ui/workbench/auth/ToolbarAuthPanel.js`](/assets/js/ui/workbench/auth/ToolbarAuthPanel.js)
- [documentation](/assets/js/ui/workbench/auth/ToolbarAuthPanel_js.md)
- /assets/js/ui/workbench/auth/ToolbarAuthPanel.js

# [`/assets/js/ui/workbench/auth/ToolbarAuthPanel.js`](/assets/js/ui/workbench/auth/ToolbarAuthPanel.js)

ToolbarAuthPanel hérite  de AuthPanelBase

Les events souscrits et les callback sont déjà définis et gérés  par exemple :
- appel de this._render('user') 

```js
	this._buildUserBar(this._user).forEach(el => this._target.appendChild(el))
    this._bindLogout()
```


