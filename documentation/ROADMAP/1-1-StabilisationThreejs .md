# Phase 1 — Stabilisation du composant Three.js

Nous poursuivons le développement de **Zealot**, un CMS orienté composants interactifs construit avec **CodeIgniter 4**, **Vanilla JavaScript**, **HTML5** et **CSS**, sans framework JavaScript.

Cette discussion ouvre la **phase 1 de la roadmap** : stabiliser le premier composant de seconde génération, **Three.js**.

## État actuel

Le composant fonctionne déjà :

- Renderer PHP
- AdminRenderer
- Bootstrap CMS
- ComponentRegistry
- ComponentFactory
- ResourceRegistry
- ResourceLoader
- Viewer
- CubeResource
- index.js

Les conventions du framework ont été validées durant la discussion précédente et serviront désormais de référence.

Les plus importantes sont :

- communication PHP → JavaScript uniquement via `data-options`
- Renderers sans logique métier
- séparation Viewer / Resource
- Registry + Factory pour chaque niveau du framework
- API homogène des composants (`init`, `refresh`, `resize`, `render`, `animate`, `destroy`)
- composants construits autour d'objets de contexte
- EventBus utilisé uniquement par les composants, jamais par `index.js`
- chemins d'import absolus (`/assets/js/...`)

Three.js est désormais considéré comme le **premier composant de seconde génération** et servira de référence pour le retrofit des autres composants.

---

# Objectif de cette discussion

Ne plus concevoir l'architecture générale.

Elle est considérée comme suffisamment stabilisée.

L'objectif est maintenant de :

- terminer proprement le composant Three.js ;
- améliorer sa robustesse ;
- préparer les futures ressources ;
- documenter uniquement lorsque cela apporte une valeur réelle.

---

# Priorités

Ordre souhaité :

1. terminer le composant actuel ;
2. intégrer progressivement les évolutions déjà identifiées ;
3. préparer le retrofit de Leaflet, Apex, Mermaid, CodeVal et Callout ;
4. ne modifier l'architecture qu'en cas de nécessité clairement justifiée.

---

# Évolutions prévues

Nous reviendrons notamment sur :

- lecture automatique de modèles GLTF/GLB ;
- inspection de structure des modèles ;
- calcul de BoundingBox ;
- caméra automatique ;
- gestion des lumières ;
- Skybox ;
- TerrainGenerator ;
- textures géoréférencées ;
- ResourceLoader évolué ;
- nouvelles Resource ;
- Editor Three.js.

Ces fonctionnalités existent déjà partiellement dans d'anciennes versions du projet et seront réintégrées progressivement en respectant les nouvelles conventions.

---

# Mode de travail

Je souhaite continuer à travailler comme précédemment :

- petites itérations ;
- justification des choix techniques ;
- validation avant chaque évolution importante ;
- recherche de conventions réutilisables lorsque cela apporte un bénéfice au framework.

L'objectif n'est pas seulement de faire fonctionner Three.js, mais d'en faire le composant de référence qui guidera l'évolution de tout le framework Zealot.
