# D008 - Séparation FrontOffice / Administration
- ComponentRenderer utilise exclusivement ComponentRegistry.
- AdminComponentRenderer utilise exclusivement AdminComponentRegistry.

**Un Renderer métier ne dépend jamais d'un AdminRenderer.**

**Un AdminRenderer ne dépend jamais d'un Renderer métier.**

Les deux chaînes de rendu ne se rencontrent qu'au niveau du DescriptorDefinition.

