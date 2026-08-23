## 1. Patterns de création (Creational Patterns)

Ces patterns concernent la manière dont les objets sont créés.

- **Singleton** : Garantit qu'une classe n'a qu'une seule instance et fournit un point d'accès global à cette instance.
- **Factory Method** : Définit une interface pour créer un objet, mais laisse les sous-classes décider de la classe à instancier.
- **Abstract Factory** : Fournit une interface pour créer des familles d'objets liés sans spécifier leurs classes concrètes.
- **Builder** : Sépare la construction d'un objet complexe de sa représentation, permettant de construire des objets étape par étape.
- **Prototype** : Crée de nouveaux objets en copiant des objets existants (clonage).

---

## 2. Patterns structurels (Structural Patterns)

Ces patterns concernent la composition des classes ou des objets pour former des structures plus grandes.

- **Adapter (Wrapper)** : Permet à des interfaces incompatibles de travailler ensemble.
- **Bridge** : Sépare l'abstraction d'une classe de son implémentation pour qu'elles puissent évoluer indépendamment.
- **Composite** : Compose des objets en structures arborescentes pour représenter des hiérarchies partie-tout.
- **Decorator** : Ajoute dynamiquement des responsabilités à un objet sans modifier sa structure.
- **Facade** : Fournit une interface simplifiée à un ensemble complexe de classes ou d'API.
- **Flyweight** : Réduit la consommation mémoire en partageant des objets similaires.
- **Proxy** : Fournit un substitut ou un représentant pour contrôler l'accès à un autre objet.

---

## 3. Patterns comportementaux (Behavioral Patterns)

Ces patterns concernent la communication entre objets et la gestion des responsabilités.

- **Chain of Responsibility** : Permet à plusieurs objets de traiter une requête sans connaître le destinataire final.
- **Command** : Encapsule une requête sous forme d'objet, permettant de paramétrer les clients avec différentes requêtes.
- **Interpreter** : Donne une représentation grammaticale pour un langage et un interprète pour ce langage.
- **Iterator** : Fournit un moyen d'accéder séquentiellement aux éléments d'un objet agrégé sans exposer sa représentation interne.
- **Mediator** : Définit un objet qui encapsule la manière dont un ensemble d'objets interagit.
- **Memento** : Capture et externalise l'état interne d'un objet sans violer l'encapsulation, pour pouvoir le restaurer plus tard.
- **Observer** : Définit une dépendance un-à-plusieurs entre objets, de sorte que lorsqu'un objet change d'état, tous ses dépendants sont notifiés.
- **State** : Permet à un objet de modifier son comportement lorsque son état interne change.
- **Strategy** : Définit une famille d'algorithmes, encapsule chacun d'eux et les rend interchangeables.
- **Template Method** : Définit le squelette d'un algorithme dans une méthode, en déléguant certaines étapes aux sous-classes.
- **Visitor** : Permet de définir de nouvelles opérations sur des objets sans changer leurs classes.

---

## 4. Patterns d'architecture et autres

- **MVC (Model-View-Controller)** : Sépare les données (modèle), l'interface utilisateur (vue) et la logique métier (contrôleur).
- **MVVM (Model-View-ViewModel)** : Variante de MVC utilisée notamment dans les interfaces riches.
- **Event Bus / Event-driven architecture** : Facilite la communication asynchrone entre composants via des événements.
- **Dependency Injection** : Permet d'injecter les dépendances d'un objet plutôt que de les créer lui-même.

---

## En résumé

|Catégorie|Exemples de patterns courants|
|---|---|
|Création|Singleton, Factory Method, Abstract Factory, Builder, Prototype|
|Structure|Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy|
|Comportement|Observer, Strategy, Command, Iterator, Mediator, State, Visitor|
|Architecture & autres|MVC, MVVM, Event Bus, Dependency Injection|

---

Si vous souhaitez, je peux approfondir un ou plusieurs de ces patterns avec des exemples concrets et leurs cas d'utilisation typiques.

Suivi

Pourrais tu montrer un exemple de bridge en js?

Bien sûr ! Voici un exemple simple et clair du pattern **Bridge** en JavaScript.

---

## Exemple du pattern Bridge en JavaScript

Le pattern Bridge consiste à séparer l'abstraction (interface principale) de son implémentation, afin qu'elles puissent évoluer indépendamment.

### Contexte de l'exemple

Imaginons que nous avons des **formes géométriques** (comme un cercle) qui peuvent être dessinées avec différentes **implémentations de rendu** (par exemple, rendu SVG ou rendu Canvas).

---

### Code

```javascript
// Implémentations de rendu (Implementor)
class SvgRenderer {
  renderCircle(radius, x, y) {
    console.log(`Rendering a circle of radius ${radius} at (${x}, ${y}) using SVG.`);
    // Ici on pourrait générer du code SVG réel
  }
}

class CanvasRenderer {
  renderCircle(radius, x, y) {
    console.log(`Rendering a circle of radius ${radius} at (${x}, ${y}) using Canvas.`);
    // Ici on pourrait dessiner sur un canvas HTML5
  }
}

// Abstraction
class Shape {
  constructor(renderer) {
    this.renderer = renderer; // Composition : la forme utilise un renderer
  }

  draw() {
    throw new Error("Méthode draw() doit être implémentée");
  }
}

// Refined Abstraction
class Circle extends Shape {
  constructor(renderer, radius, x, y) {
    super(renderer);
    this.radius = radius;
    this.x = x;
    this.y = y;
  }

  draw() {
    this.renderer.renderCircle(this.radius, this.x, this.y);
  }
}

// Utilisation

const svgRenderer = new SvgRenderer();
const canvasRenderer = new CanvasRenderer();

const circle1 = new Circle(svgRenderer, 10, 15, 20);
circle1.draw(); // Rendering a circle of radius 10 at (15, 20) using SVG.

const circle2 = new Circle(canvasRenderer, 5, 30, 40);
circle2.draw(); // Rendering a circle of radius 5 at (30, 40) using Canvas.
```

---

## Explications

- La classe `Shape` est l'abstraction qui utilise un `renderer` (implémentation).
- Les classes `SvgRenderer` et `CanvasRenderer` sont les différentes implémentations concrètes.
- La classe `Circle` est une spécialisation de `Shape` qui délègue le rendu à l'implémentation.
- On peut facilement ajouter d'autres formes ou d'autres types de rendu sans modifier les classes existantes.

---

Si vous souhaitez un exemple plus complexe ou adapté à un autre contexte, n'hésitez pas à me le demander !

Suivi

Montres moi factory method toujours en js

Voici un exemple simple et clair du pattern **Factory Method** en JavaScript.

---

## Exemple du pattern Factory Method en JavaScript

Le pattern Factory Method définit une interface pour créer un objet, mais laisse les sous-classes décider de la classe à instancier. Cela permet de déléguer la création d'objets à des sous-classes.

---

### Code

```javascript
// Produit abstrait
class Transport {
  deliver() {
    throw new Error("Méthode deliver() doit être implémentée");
  }
}

// Produits concrets
class Truck extends Transport {
  deliver() {
    console.log("Delivery by truck");
  }
}

class Ship extends Transport {
  deliver() {
    console.log("Delivery by ship");
  }
}

// Créateur abstrait
class Logistics {
  createTransport() {
    throw new Error("Méthode createTransport() doit être implémentée");
  }

  planDelivery() {
    const transport = this.createTransport();
    transport.deliver();
  }
}

// Créateurs concrets
class RoadLogistics extends Logistics {
  createTransport() {
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  createTransport() {
    return new Ship();
  }
}

// Utilisation

const roadLogistics = new RoadLogistics();
roadLogistics.planDelivery(); // Delivery by truck

const seaLogistics = new SeaLogistics();
seaLogistics.planDelivery();  // Delivery by ship
```

---

## Explications

- La classe abstraite `Logistics` définit la méthode `createTransport()` qui est la factory method.
- Les sous-classes `RoadLogistics` et `SeaLogistics` implémentent cette méthode pour créer des objets spécifiques (`Truck` ou `Ship`).
- La méthode `planDelivery()` utilise la factory method pour obtenir un objet `Transport` et appeler sa méthode `deliver()`.
- Cela permet de changer le type d'objet créé sans modifier le code client.

---

Si vous souhaitez un exemple plus avancé ou dans un autre contexte, dites-le-moi !

Suivi

Montre moi le pattern abstract factory en js

Voici un exemple clair et complet du pattern **Abstract Factory** en JavaScript.

---

## Exemple du pattern Abstract Factory en JavaScript

Le pattern **Abstract Factory** fournit une interface pour créer des familles d'objets liés sans spécifier leurs classes concrètes. Cela permet de garantir la cohérence entre les objets créés.

---

### Contexte de l'exemple

Imaginons que nous voulons créer des **interfaces graphiques** pour deux systèmes d'exploitation différents : **Windows** et **MacOS**. Chaque système a ses propres styles pour les boutons et les cases à cocher.

---

### Code

```javascript
// Interfaces des produits abstraits
class Button {
  paint() {
    throw new Error("Méthode paint() doit être implémentée");
  }
}

class Checkbox {
  paint() {
    throw new Error("Méthode paint() doit être implémentée");
  }
}

// Produits concrets Windows
class WindowsButton extends Button {
  paint() {
    console.log("Rendering a button in Windows style.");
  }
}

class WindowsCheckbox extends Checkbox {
  paint() {
    console.log("Rendering a checkbox in Windows style.");
  }
}

// Produits concrets MacOS
class MacOSButton extends Button {
  paint() {
    console.log("Rendering a button in MacOS style.");
  }
}

class MacOSCheckbox extends Checkbox {
  paint() {
    console.log("Rendering a checkbox in MacOS style.");
  }
}

// Interface de la fabrique abstraite
class GUIFactory {
  createButton() {
    throw new Error("Méthode createButton() doit être implémentée");
  }
  createCheckbox() {
    throw new Error("Méthode createCheckbox() doit être implémentée");
  }
}

// Fabrique concrète Windows
class WindowsFactory extends GUIFactory {
  createButton() {
    return new WindowsButton();
  }
  createCheckbox() {
    return new WindowsCheckbox();
  }
}

// Fabrique concrète MacOS
class MacOSFactory extends GUIFactory {
  createButton() {
    return new MacOSButton();
  }
  createCheckbox() {
    return new MacOSCheckbox();
  }
}

// Client qui utilise la fabrique abstraite
class Application {
  constructor(factory) {
    this.factory = factory;
  }

  createUI() {
    this.button = this.factory.createButton();
    this.checkbox = this.factory.createCheckbox();
  }

  paint() {
    this.button.paint();
    this.checkbox.paint();
  }
}

// Utilisation

// Choix dynamique de la fabrique selon le système
function getFactory(osType) {
  if (osType === "Windows") {
    return new WindowsFactory();
  } else if (osType === "MacOS") {
    return new MacOSFactory();
  } else {
    throw new Error("Unsupported OS type");
  }
}

const osType = "MacOS"; // ou "Windows"
const factory = getFactory(osType);

const app = new Application(factory);
app.createUI();
app.paint();

// Output attendu pour MacOS :
// Rendering a button in MacOS style.
// Rendering a checkbox in MacOS style.
```

---

## Explications

- Les classes `Button` et `Checkbox` sont des interfaces abstraites pour les produits.
- Les classes `WindowsButton`, `WindowsCheckbox`, `MacOSButton`, `MacOSCheckbox` sont des implémentations concrètes.
- `GUIFactory` est l'interface abstraite de la fabrique.
- `WindowsFactory` et `MacOSFactory` sont des fabriques concrètes qui créent des produits spécifiques.
- La classe `Application` utilise une fabrique abstraite pour créer des objets sans connaître leur classe concrète.
- Cela permet de changer facilement la famille de produits (Windows ou MacOS) sans modifier le client.

---

#  pattern de structure Facade

## Description

Le **pattern Facade** est un pattern de conception structurel qui consiste à fournir une **interface simplifiée** à un ensemble complexe de classes, bibliothèques ou sous-systèmes. L'objectif est de masquer la complexité interne et de rendre l'utilisation plus simple et plus intuitive pour le client.

Ce pattern est particulièrement utile lorsque vous avez un système complexe avec de nombreuses interactions, et que vous souhaitez offrir une interface unique et facile à utiliser.

---

## Exemple simple en JavaScript

Imaginons un système de gestion de home cinéma avec plusieurs sous-systèmes : lecteur DVD, amplificateur, projecteur, lumière, etc. Le client ne veut pas gérer tous ces composants individuellement, il souhaite juste une interface simple pour "regarder un film".

---

### Code

```javascript
// Sous-systèmes complexes

class DvdPlayer {
  on() { console.log("DVD Player on"); }
  play(movie) { console.log(`Playing "${movie}"`); }
  stop() { console.log("Stopping DVD"); }
  off() { console.log("DVD Player off"); }
}

class Amplifier {
  on() { console.log("Amplifier on"); }
  setVolume(level) { console.log(`Setting volume to ${level}`); }
  off() { console.log("Amplifier off"); }
}

class Projector {
  on() { console.log("Projector on"); }
  wideScreenMode() { console.log("Projector in widescreen mode"); }
  off() { console.log("Projector off"); }
}

class TheaterLights {
  dim(level) { console.log(`Dimming lights to ${level}%`); }
  on() { console.log("Lights on"); }
}

// Facade

class HomeTheaterFacade {
  constructor(dvdPlayer, amplifier, projector, lights) {
    this.dvdPlayer = dvdPlayer;
    this.amplifier = amplifier;
    this.projector = projector;
    this.lights = lights;
  }

  watchMovie(movie) {
    console.log("Get ready to watch a movie...");
    this.lights.dim(10);
    this.projector.on();
    this.projector.wideScreenMode();
    this.amplifier.on();
    this.amplifier.setVolume(5);
    this.dvdPlayer.on();
    this.dvdPlayer.play(movie);
  }

  endMovie() {
    console.log("Shutting movie theater down...");
    this.dvdPlayer.stop();
    this.dvdPlayer.off();
    this.amplifier.off();
    this.projector.off();
    this.lights.on();
  }
}

// Utilisation

const dvdPlayer = new DvdPlayer();
const amplifier = new Amplifier();
const projector = new Projector();
const lights = new TheaterLights();

const homeTheater = new HomeTheaterFacade(dvdPlayer, amplifier, projector, lights);

homeTheater.watchMovie("Inception");
// Output:
// Get ready to watch a movie...
// Dimming lights to 10%
// Projector on
// Projector in widescreen mode
// Amplifier on
// Setting volume to 5
// DVD Player on
// Playing "Inception"

homeTheater.endMovie();
// Output:
// Shutting movie theater down...
// Stopping DVD
// DVD Player off
// Amplifier off
// Projector off
// Lights on
```

---

## Explications

- Les classes `DvdPlayer`, `Amplifier`, `Projector` et `TheaterLights` représentent des sous-systèmes complexes.
- La classe `HomeTheaterFacade` fournit une interface simple (`watchMovie` et `endMovie`) pour contrôler tous ces sous-systèmes.
- Le client utilise uniquement la facade, ce qui simplifie grandement l'interaction avec le système.

