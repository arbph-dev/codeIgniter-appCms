Contrat minimal de tous les Panels.

## Règles :

Ce que PanelBase ne fait PAS :
- aucune logique métier
- aucun appel API
- aucun template
- aucune validation
- aucune gestion Dialog

  
### render()
doit être implémenté — retourne l'élément DOM racine

### show()
signature libre dans la sous-classe

### clear()
remet le panel à l'état vide

### destroy() 
libère les ressources ; appelé une seule fois



