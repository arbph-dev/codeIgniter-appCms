# TabSystem

> Système d'onglets générique pour Workbenches

~ activate() : tab.initialized = true positionné AVANT l'appel initFn
  (évite double-fetch si l'utilisateur clique rapidement avant la réponse)
  
~ activate() : supporte les initFn async (fire-and-forget sécurisé)

+ render()   : retourne this pour chaînage

+ onTabChange(fn)  callback pur en alternative à busEvent
  Le Workbench l'utilise pour lazy-load les données du tab actif
  sans coupler TabSystem à un namespace bus particulier

+ resetTab(id)     force la re-initialisation au prochain activate()
  utile après un save : le tab "Adresses" se rechargera à la prochaine visite

+ markDirty(id)    indicateur visuel de modifications non enregistrées

+ clearDirty(id)   retire l'indicateur

~ destroy()        nettoie _onTabChangeFn
