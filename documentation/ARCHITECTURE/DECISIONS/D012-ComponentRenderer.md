# D012-ComponentRenderer

**Date** : 2026-07-29

**Statut** : Accepted

# Contexte

Chaque composant possède un mode de rendu spécifique.

# Décision

Le `ComponentRenderer` sélectionne automatiquement le Renderer spécialisé correspondant au type du Descriptor.

Chaque Renderer est responsable d'un seul type de composant.

# Conséquences

* architecture extensible ;
* ajout d'un composant sans modifier les autres ;
* responsabilité unique des Renderers.
